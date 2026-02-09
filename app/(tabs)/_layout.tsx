import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'black', headerTitleStyle: { fontWeight: 'bold' } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color }) => <FontAwesome6 name="house" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="create"  // ต้องตรงกับชื่อไฟล์ create.tsx
        options={{
          title: 'สร้างโพสต์',
          tabBarIcon: ({ color }) => <FontAwesome6 name="plus-square" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'แชท',
          tabBarIcon: ({ color }) => <FontAwesome6 name="comment-dots" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'การแจ้งเตือน',
          tabBarIcon: ({ color }) => <FontAwesome6 name="heart" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'โปรไฟล์',
          tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

