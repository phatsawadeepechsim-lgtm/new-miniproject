import { View, Text, TextInput, Button } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { usePosts } from "../context/PostContext";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Create() {
    const [text, settext] = useState("")
    const [name ,setName] = useState("")
    const {addPost} = usePosts()
    
    
    return (
        <SafeAreaView>
            <View>
                <TextInput
                    placeholder="เขียนโพสต์"
                    value={text}
                    onChangeText={settext}
                />
                <Button
                    title = "Post"
                    onPress = {() => {
                    addPost(text,name)
                    settext("")
                    }}
                />
            </View> 
        </SafeAreaView>
        
        
    )
    
}

