import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// 1. เพิ่ม Interface ตรงนี้เพื่อแก้ตัวแดง
interface NotificationItem {
  id: string;
  user: string;
  action: string;
  type: 'reply' | 'mention' | 'like';
}

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  
  // 2. กำหนด Type ให้ State (ตอนนี้เป็นค่าว่าง [] หน้าจอจะโล่งตามที่คุณต้องการ)
  const [data, setData] = useState<NotificationItem[]>([]); 

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>ยังไม่มีการแจ้งเตือนในขณะนี้</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.filterRow}>
        {['ทั้งหมด', 'การตอบกลับ', 'การกล่าวถึง'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={[styles.filterChip, activeTab === tab && styles.activeChip]}
          >
            <Text style={activeTab === tab ? styles.activeText : styles.inactiveText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={activeTab === 'ทั้งหมด' ? data : []} 
        ListEmptyComponent={renderEmpty}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notifItem}>
             <Text style={{ fontWeight: 'bold' }}>{item.user}</Text>
             <Text> {item.action}</Text>
          </View>
        )}
      />
    </View>
  );

  
}

// ต่อท้ายไฟล์ notifications.tsx
const styles = StyleSheet.create({
  filterRow: { flexDirection: 'row', padding: 15 },
  filterChip: { 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#eee', 
    marginRight: 10 
  },
  activeChip: { backgroundColor: 'black' },
  activeText: { color: 'white', fontWeight: 'bold' },
  inactiveText: { color: 'black' },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#999', fontSize: 16 },
  notifItem: { padding: 20, borderBottomWidth: 0.5, borderColor: '#eee' }
});
