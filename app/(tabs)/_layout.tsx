import { Stack, Tabs } from "expo-router";


export default function TabLayout(){
  return (
    <Tabs screenOptions={{ headerShown : false }}>
      <Tabs.Screen name="index" options={{title : 'Home' }} />
      <Tabs.Screen name="messages" options={{title : 'Messages' }} />
      <Tabs.Screen name="create" options={{title : 'Create' }} />
      <Tabs.Screen name="notifications" options={{title : 'Notifications' }} />
      <Tabs.Screen name="profile" options={{title : 'Profile' }} />
    </Tabs>
  )
}

