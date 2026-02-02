import { Stack } from "expo-router";
import { PostProvider } from "./context/PostContext";

export default function RootLayout() {
  return (
    <PostProvider>
      <Stack screenOptions={{ headerShown : false}} />
    </PostProvider>
  )
}