import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePosts, Post, Comment } from '../../hooks/usePosts'; 
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getPosts, updatePosts } = usePosts();
  const [post, setPost] = useState<Post | null>(null);
  const [txt, setTxt] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const all = await getPosts();
    const found = all.find(p => p.id === id);
    setPost(found || null);
  };

  const addComment = async () => {
    if (!txt.trim() || !post) return;
    const name = await AsyncStorage.getItem('@user_name') || 'User';
    const newComment: Comment = { id: Date.now().toString(), text: txt, userName: name };
    
    const all = await getPosts();
    const updated = all.map(p => p.id === id ? { ...p, comments: [...(p.comments || []), newComment] } : p);
    await updatePosts(updated);
    setTxt('');
    load();
  };

  const delComment = (cId: string) => {
    Alert.alert("ลบ", "ลบคอมเมนต์นี้?", [
      { text: "ยกเลิก" },
      { text: "ลบ", style: 'destructive', onPress: async () => {
        const all = await getPosts();
        const updated = all.map(p => p.id === id ? { ...p, comments: p.comments.filter(c => c.id !== cId) } : p);
        await updatePosts(updated);
        load();
      }}
    ]);
  };

  if (!post) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Comments</Text></View>
      <View style={styles.mainPost}><Text style={styles.postText}>{post.text}</Text></View>
      
      <FlatList
        data={post.comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cRow}>
            <View style={{flex: 1}}><Text style={{fontWeight: 'bold'}}>{item.userName}</Text><Text>{item.text}</Text></View>
            <TouchableOpacity onPress={() => delComment(item.id)}><FontAwesome6 name="trash-can" size={14} color="#ccc" /></TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.inputPart}>
        <TextInput value={txt} onChangeText={setTxt} placeholder="ตอบกลับ..." style={styles.input} />
        <TouchableOpacity onPress={addComment}><Text style={styles.sendBtn}>ส่ง</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 15, borderBottomWidth: 0.5, borderColor: '#eee', alignItems: 'center' },
  headerTitle: { fontWeight: 'bold' },
  mainPost: { padding: 20, borderBottomWidth: 5, borderColor: '#f9f9f9' },
  postText: { fontSize: 18 },
  cRow: { flexDirection: 'row', padding: 15, borderBottomWidth: 0.5, borderColor: '#eee' },
  inputPart: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, height: 40, marginRight: 10 },
  sendBtn: { color: '#0095f6', fontWeight: 'bold' }
});