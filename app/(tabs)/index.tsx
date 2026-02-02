import { View, Text } from "react-native";
import {FontAwesome6} from '@expo/vector-icons';
import { usePosts } from "../context/PostContext";

export default function Home() {
    const {posts} = usePosts()

    return (
        <View>
           {posts.map((posts) => (
            <Text key={posts.id}>
                {posts.text}
            </Text>
           ))}
        </View>
    )
}
