import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.emptyContainer}>
        <FontAwesome6 name="bell" size={50} color="#eee" />
        <Text style={styles.emptyText}>ยังไม่มีการแจ้งเตือนในขณะนี้</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 15, color: '#999', fontSize: 16 }
});