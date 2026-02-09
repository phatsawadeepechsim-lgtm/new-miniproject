import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePosts, Post } from '../../hooks/usePosts';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [name, setName] = useState('User Name');
  const [username, setUsername] = useState('username');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const { getPosts, deletePost } = usePosts();

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const n = await AsyncStorage.getItem('@user_name');
        const un = await AsyncStorage.getItem('@user_id');
        const img = await AsyncStorage.getItem('@user_image');
        if (n) setName(n);
        if (un) setUsername(un);
        if (img) setProfileImage(img);
        const allPosts = await getPosts();
        setPosts(allPosts);
      };
      load();
    }, [])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await AsyncStorage.setItem('@user_image', result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    await AsyncStorage.setItem('@user_name', name);
    await AsyncStorage.setItem('@user_id', username);
    setIsEdit(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.profileRow}>
              <View>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.userText}>@{username}</Text>
              </View>
              <TouchableOpacity onPress={pickImage}>
                {profileImage ? <Image source={{ uri: profileImage }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder} />}
              </TouchableOpacity>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statText}>{posts.length} โพสต์</Text>
              <Text style={styles.statText}>1.2k ผู้ติดตาม</Text>
              <Text style={styles.statText}>150 กำลังติดตาม</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEdit(true)}>
              <Text style={{ fontWeight: '600' }}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16 }}>{item.text}</Text>
              <TouchableOpacity onPress={() => deletePost(item.id).then(setPosts)}>
                <FontAwesome6 name="trash-can" size={16} color="#ff3b30" />
              </TouchableOpacity>
            </View>
            {item.image && <Image source={{ uri: item.image }} style={styles.postImg} />}
          </View>
        )}
      />

      <Modal visible={isEdit} animationType="slide">
        <View style={styles.modal}>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="ชื่อ" />
          <TextInput value={username} onChangeText={setUsername} style={styles.input} placeholder="ชื่อผู้ใช้" />
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}><Text style={{ color: 'white' }}>บันทึก</Text></TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  headerContainer: { padding: 20 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameText: { fontSize: 24, fontWeight: 'bold' },
  userText: { color: '#666', fontSize: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee' },
  statRow: { flexDirection: 'row', marginTop: 15 },
  statText: { marginRight: 20, color: '#333' },
  editBtn: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  postCard: { padding: 20, borderBottomWidth: 0.5, borderColor: '#eee' },
  postImg: { width: '100%', height: 200, borderRadius: 10, marginTop: 10 },
  modal: { flex: 1, padding: 40, justifyContent: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 30, fontSize: 18 },
  saveBtn: { backgroundColor: 'black', padding: 15, borderRadius: 10, alignItems: 'center' }
});