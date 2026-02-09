import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

// รายชื่อเพื่อนสมมติ
const CONTACTS = [
  { id: '1', name: 'Gemini AI', last: 'สวัสดีจ้า! มีอะไรให้ช่วยไหม?' },
  { id: '2', name: 'Threads Developer', last: 'โค้ดหน้าแชทเสร็จเรียบร้อยแล้วนะ' },
  { id: '3', name: 'React Native', last: 'ส่งข้อความและลบได้จริงแล้วครับ' }
];

export default function MessagesList() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <FlatList
        data={CONTACTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          /* สำคัญมาก: ตรง href ต้องใช้เครื่องหมาย Backtick ` (อยู่ใต้ปุ่ม Esc) 
             เพื่อให้ TypeScript และ Expo Router เข้าใจตัวแปร ${item.id} ครับ
          */
          <Link href={`/chat/${item.id}?name=${item.name}`} asChild>
            <TouchableOpacity style={styles.row}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.content}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.time}>10:30 AM</Text>
                </View>
                <Text style={styles.lastMsg} numberOfLines={1}>
                  {item.last}
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 20, borderBottomWidth: 0.5, borderColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold' },
  row: { 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center', 
    borderBottomWidth: 0.5, 
    borderColor: '#f0f0f0' 
  },
  avatarPlaceholder: { 
    width: 55, 
    height: 55, 
    borderRadius: 27.5, 
    backgroundColor: '#f5f5f5', 
    marginRight: 15 
  },
  content: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontWeight: 'bold', fontSize: 16 },
  time: { color: '#999', fontSize: 12 },
  lastMsg: { color: '#666', fontSize: 14 }
});