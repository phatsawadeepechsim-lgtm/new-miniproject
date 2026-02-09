import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePosts, Post } from '../../hooks/usePosts';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

export default function CreateScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const { savePost } = usePosts();
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!text && !image) return;
    const newPost: Post = {
      id: Date.now().toString(),
      text,
      image: image || undefined,
      likes: 0,
      isLiked: false,
      comments: [],
      createdAt: Date.now(),
    };
    await savePost(newPost);
    setText('');
    setImage(null);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text>ยกเลิก</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>โพสต์ใหม่</Text>
        <TouchableOpacity onPress={handlePost} disabled={!text && !image}>
          <Text style={[styles.postBtnText, { opacity: (text || image) ? 1 : 0.5 }]}>โพสต์</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.inputArea}>
        <TextInput 
          placeholder="มีอะไรใหม่..." 
          multiline 
          value={text} 
          onChangeText={setText} 
          style={styles.textInput} 
        />
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <TouchableOpacity onPress={pickImage} style={styles.imageBtn}>
          <FontAwesome6 name="image" size={24} color="#ccc" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderColor: '#eee' },
  headerTitle: { fontWeight: 'bold', fontSize: 16 },
  postBtnText: { color: '#0095f6', fontWeight: 'bold' },
  inputArea: { flex: 1, padding: 15 },
  textInput: { fontSize: 18, minHeight: 100, textAlignVertical: 'top' },
  previewImage: { width: '100%', height: 300, borderRadius: 10, marginVertical: 10 },
  imageBtn: { marginTop: 20 }
});