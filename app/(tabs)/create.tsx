import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePosts } from '../../hooks/usePosts';
import { useRouter } from 'expo-router';

export default function CreateScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const { savePost } = usePosts();
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!text && !image) return Alert.alert("แจ้งเตือน", "กรุณาใส่ข้อความหรือรูปภาพ");
    
    await savePost({
      id: Date.now().toString(),
      text,
      image: image || undefined,
      likes: 0,
      isLiked: false,
      createdAt: Date.now(),
    });

    setText('');
    setImage(null);
    router.push('/'); // กลับไปหน้าหลัก
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="วันนี้คุณคิดอะไรอยู่..."
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
      />
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={{ color: '#0095f6' }}>แนบรูปภาพ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>โพสต์</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  input: { fontSize: 18, marginBottom: 20 },
  imagePreview: { width: '100%', height: 300, borderRadius: 12, marginBottom: 15 },
  imageButton: { marginBottom: 30 },
  postButton: { backgroundColor: 'black', padding: 15, borderRadius: 10, alignItems: 'center' },
  postButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

