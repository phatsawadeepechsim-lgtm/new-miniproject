import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { usePosts, Post } from '../../hooks/usePosts';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileName, setProfileName] = useState('User Name');
  const { getPosts, deletePost, updatePosts } = usePosts();
  const router = useRouter();

  // โหลดข้อมูลทุกครั้งที่หน้าจอนี้ถูกเปิด (Focus)
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        // 1. ดึงชื่อโปรไฟล์ที่บันทึกไว้
        const storedName = await AsyncStorage.getItem('@user_name');
        if (storedName) setProfileName(storedName);

        // 2. ดึงโพสต์ทั้งหมด
        const data = await getPosts();
        setPosts(data);
      };
      loadData();
    }, [])
  );

  // ฟังก์ชันกด Like
  const handleLike = async (id: string) => {
    const updated = posts.map((p) => {
      if (p.id === id) {
        const newIsLiked = !p.isLiked;
        return {
          ...p,
          isLiked: newIsLiked,
          likes: newIsLiked ? p.likes + 1 : p.likes - 1,
        };
      }
      return p;
    });
    setPosts(updated);
    await updatePosts(updated);
  };

  // ฟังก์ชันลบโพสต์
  const handleDelete = (id: string) => {
    Alert.alert("ลบโพสต์", "คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?", [
      { text: "ยกเลิก", style: "cancel" },
      { 
        text: "ลบ", 
        style: "destructive", 
        onPress: async () => {
          const remainingPosts = await deletePost(id);
          setPosts(remainingPosts);
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* ส่วนหัว: แสดงรูปวงกลมจำลองและชื่อโปรไฟล์ */}
            <View style={styles.headerRow}>
              <View style={styles.userInfo}>
                <View style={styles.avatarCircle} />
                <Text style={styles.userNameText}>{profileName}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <FontAwesome6 name="trash-can" size={16} color="#ccc" />
              </TouchableOpacity>
            </View>

            {/* ส่วนเนื้อหาโพสต์ */}
            <Text style={styles.postText}>{item.text}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}

            {/* ส่วนปุ่ม Action ด้านล่าง */}
            <View style={styles.footer}>
              {/* ปุ่ม Like */}
              <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionBtn}>
                <FontAwesome6 
                  name="heart" 
                  size={20} 
                  color={item.isLiked ? "#ff3b30" : "black"} 
                  solid={item.isLiked} 
                />
                <Text style={styles.actionText}>{item.likes}</Text>
              </TouchableOpacity>

              {/* ปุ่ม Comment - กดแล้วไปหน้ารายละเอียดโพสต์ */}
              <TouchableOpacity 
                onPress={() => router.push(`/chat/${item.id}`)} 
                style={styles.actionBtn}
              >
                <FontAwesome6 name="comment" size={20} color="black" />
                <Text style={styles.actionText}>
                  {item.comments ? item.comments.length : 0}
                </Text>
              </TouchableOpacity>

              {/* ปุ่ม Share (ไอคอนเฉยๆ) */}
              <TouchableOpacity style={styles.actionBtn}>
                <FontAwesome6 name="paper-plane" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: '#999' }}>ยังไม่มีโพสต์ใหม่ในขณะนี้</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  card: { padding: 15, borderBottomWidth: 0.5, borderColor: '#eee' },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#f0f0f0', 
    marginRight: 10 
  },
  userNameText: { fontWeight: 'bold', fontSize: 16 },
  postText: { fontSize: 16, color: '#333', marginBottom: 10, lineHeight: 22 },
  postImage: { 
    width: '100%', 
    height: 300, 
    borderRadius: 12, 
    marginBottom: 10,
    backgroundColor: '#f9f9f9'
  },
  footer: { flexDirection: 'row', marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 25 },
  actionText: { marginLeft: 6, color: '#666', fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 50 }
});