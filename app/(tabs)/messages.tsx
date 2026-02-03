import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [msg, setMsg] = useState('');

  if (selectedChat) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <FontAwesome6 name="chevron-left" size={20} />
          </TouchableOpacity>
          <Text style={styles.headerName}>{selectedChat.name}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#999' }}>เริ่มการสนทนากับ {selectedChat.name}</Text>
        </View>
        <View style={styles.inputArea}>
          <TextInput 
            style={styles.chatInput} 
            placeholder="ส่งข้อความ..." 
            value={msg}
            onChangeText={setMsg}
          />
          <TouchableOpacity onPress={() => setMsg('')}>
            <FontAwesome6 name="paper-plane" size={20} color="#0095f6" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={[{ id: '1', name: 'Gemini', lastMsg: 'สวัสดีครับ!' }]}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => setSelectedChat(item)}>
            <View style={styles.avatar} />
            <View>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: '#666' }}>{item.lastMsg}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', padding: 15, borderBottomWidth: 0.5, borderColor: '#eee', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee', marginRight: 15 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 0.5, borderColor: '#eee', paddingTop: 50 },
  headerName: { fontSize: 18, fontWeight: 'bold', marginLeft: 20 },
  inputArea: { flexDirection: 'row', padding: 15, alignItems: 'center', borderTopWidth: 0.5, borderColor: '#eee' },
  chatInput: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10 }
});