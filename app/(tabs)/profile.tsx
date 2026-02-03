import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import { usePosts, Post } from '../../hooks/usePosts';
import { useFocusEffect } from 'expo-router';

export default function ProfileScreen() {
  const [name, setName] = useState('User Name');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const { getPosts } = usePosts();

  useFocusEffect(
    useCallback(() => {
      const loadProfileData = async () => {
        const n = await AsyncStorage.getItem('@user_name');
        const i = await AsyncStorage.getItem('@user_image');
        if (n) setName(n);
        if (i) setProfileImage(i);
        
        const allPosts = await getPosts();
        setPosts(allPosts);
      };
      loadProfileData();
    }, [])
  );

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await AsyncStorage.setItem('@user_image', result.assets[0].uri);
    }
  };

  const saveName = async () => {
    setName(tempName);
    await AsyncStorage.setItem('@user_name', tempName);
    setIsEditing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={styles.profileHeaderContainer}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={{ color: '#666' }}>@username</Text>
              </View>
              <TouchableOpacity onPress={pickProfileImage} style={styles.avatarWrapper}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <FontAwesome6 name="user" size={30} color="#ccc" />
                  </View>
                )}
                <FontAwesome6 name="circle-plus" size={20} color="#0095f6" style={styles.plusIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={() => { setTempName(name); setIsEditing(true); }}>
              <Text style={{ fontWeight: 'bold' }}>Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.tabTitle}>
              <Text style={{ fontWeight: 'bold' }}>Threads</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={{ fontSize: 16 }}>{item.text}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
          </View>
        )}
      />

      <Modal visible={isEditing} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <TextInput style={styles.input} value={tempName} onChangeText={setTempName} autoFocus />
            <TouchableOpacity onPress={saveName}><Text style={styles.saveBtnText}>บันทึกชื่อ</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeaderContainer: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameText: { fontSize: 24, fontWeight: 'bold' },
  avatarWrapper: { position: 'relative' },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  plusIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', borderRadius: 10 },
  editBtn: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginTop: 20, alignItems: 'center' },
  tabTitle: { marginTop: 30, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 10 },
  postCard: { padding: 20, borderBottomWidth: 0.5, borderColor: '#eee' },
  postImage: { width: '100%', height: 200, borderRadius: 10, marginTop: 10 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 15 },
  input: { borderBottomWidth: 1, borderColor: '#eee', marginBottom: 20, fontSize: 18 },
  saveBtnText: { color: '#0095f6', textAlign: 'center', fontWeight: 'bold' }
});