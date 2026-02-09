import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // นำเข้า AsyncStorage

export default function ChatRoom() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  // 1. โหลดข้อความเก่าจากเครื่องตอนเปิดหน้าแชท
  useEffect(() => {
    loadMessages();
  }, [id]);

  const loadMessages = async () => {
    try {
      const savedChat = await AsyncStorage.getItem(`@chat_${id}`);
      if (savedChat) {
        setMessages(JSON.parse(savedChat));
      } else {
        // ถ้าไม่มีข้อความเก่า ให้มีข้อความต้อนรับอันเดียว
        setMessages([{ id: '1', text: 'สวัสดีครับ ยินดีที่ได้รู้จัก!', sender: 'other' }]);
      }
    } catch (e) {
      console.log("Load error", e);
    }
  };

  // 2. ฟังก์ชันส่งข้อความพร้อมบันทึกลงเครื่อง
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage = { id: Date.now().toString(), text: input, sender: 'me' };
    const updatedMessages = [newMessage, ...messages];
    
    setMessages(updatedMessages);
    setInput('');
    
    // บันทึกข้อมูลลง AsyncStorage
    await AsyncStorage.setItem(`@chat_${id}`, JSON.stringify(updatedMessages));
  };

  // 3. ฟังก์ชันลบข้อความพร้อมอัปเดตที่บันทึกไว้
  const deleteMessage = (messageId: string) => {
    Alert.alert("ลบข้อความ", "คุณต้องการลบข้อความนี้ใช่หรือไม่?", [
      { text: "ยกเลิก" },
      { 
        text: "ลบ", 
        style: "destructive", 
        onPress: async () => {
          const filtered = messages.filter(m => m.id !== messageId);
          setMessages(filtered);
          await AsyncStorage.setItem(`@chat_${id}`, JSON.stringify(filtered));
        } 
      }
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><FontAwesome6 name="chevron-left" size={20} /></TouchableOpacity>
        <Text style={styles.headerTitle}>{name || 'Chat'}</Text>
        <View style={{ width: 20 }} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        renderItem={({ item }) => (
          <TouchableOpacity 
            onLongPress={() => deleteMessage(item.id)}
            style={[styles.bubble, item.sender === 'me' ? styles.myMsg : styles.otherMsg]}
          >
            <Text style={{ color: item.sender === 'me' ? 'white' : 'black' }}>{item.text}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 15 }}
      />

      <View style={styles.inputArea}>
        <TextInput value={input} onChangeText={setInput} style={styles.input} placeholder="ส่งข้อความ..." />
        <TouchableOpacity onPress={handleSend}><FontAwesome6 name="paper-plane" size={20} color="#0095f6" /></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 0.5, borderColor: '#eee', paddingTop: 50 },
  headerTitle: { fontWeight: 'bold', fontSize: 18 },
  bubble: { padding: 12, borderRadius: 20, marginVertical: 5, maxWidth: '80%' },
  myMsg: { alignSelf: 'flex-end', backgroundColor: '#0095f6' },
  otherMsg: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
  inputArea: { flexDirection: 'row', padding: 15, borderTopWidth: 0.5, borderColor: '#eee', alignItems: 'center', paddingBottom: 30 },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, height: 40, marginRight: 10 }
});