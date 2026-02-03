import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { usePosts, Post } from '../../hooks/usePosts';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileName, setProfileName] = useState('User Name');
  // ดึงฟังก์ชันมาจาก hook (เช็กว่าใน usePosts.ts มี export updatePosts ด้วยนะ)
  const { getPosts, deletePost, updatePosts } = usePosts();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const savedName = await AsyncStorage.getItem('@user_name');
        if (savedName) setProfileName(savedName);
        
        const data = await getPosts();
        setPosts(data);
      };
      loadData();
    }, [])
  );

  const onLike = async (id: string) => {
    const newPosts = posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    });
    setPosts(newPosts);
    await updatePosts(newPosts); // ตรงนี้จะไม่ error ถ้าใน usePosts.ts มีฟังก์ชันนี้
  };

  const handleDelete = (id: string) => {
    Alert.alert("ลบโพสต์", "คุณแน่ใจหรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      { text: "ลบ", style: "destructive", onPress: async () => {
          const updated = await deletePost(id);
          setPosts(updated);
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.avatarMini} />
                <Text style={styles.profileNameText}>{profileName}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <FontAwesome6 name="trash-can" size={18} color="#ccc" />
              </TouchableOpacity>
            </View>

            <Text style={styles.postText}>{item.text}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
            
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => onLike(item.id)} style={styles.footerBtn}>
                <FontAwesome6 name="heart" size={20} color={item.isLiked ? "#ff3b30" : "black"} solid={item.isLiked} />
                <Text style={styles.footerText}>{item.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.footerBtn} onPress={() => Alert.alert("Comment", "ระบบคอมเมนต์กำลังมา...")}>
                <FontAwesome6 name="comment" size={20} />
                <Text style={styles.footerText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.footerBtn}>
                <FontAwesome6 name="paper-plane" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderBottomWidth: 0.5, borderColor: '#eee' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  avatarMini: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#eee', marginRight: 10 },
  profileNameText: { fontWeight: 'bold', fontSize: 16 },
  postText: { fontSize: 16, marginBottom: 10 },
  postImage: { width: '100%', height: 300, borderRadius: 10, marginBottom: 10 },
  footer: { flexDirection: 'row', marginTop: 10 },
  footerBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  footerText: { marginLeft: 5, color: '#666' }
});