import { createContext, useContext, useState, ReactNode } from "react";

type Post = {
    id : number
    name : string
    text : string
}

type PostContextType = {
    posts : Post[]
    addPost : (text : string, name : string) => void
}

const PostContext = createContext<PostContextType | undefined>(undefined)

export function PostProvider({ children } : {children : ReactNode}) {
    const [posts, setposts] = useState<Post[]>([])

    const addPost = (text : string, name : string) => {
        if (!text.trim() || !name.trim())  return
        setposts([{id : Date.now(), name,  text }, ...posts])
    }

    return (
        <PostContext.Provider value={{ posts, addPost}}>
            {children}
        </PostContext.Provider>
    )
}

export function usePosts() {
    const context = useContext(PostContext)
    if (!context) {
        throw new Error('usePosts ต้องอยู่ภายใน PostProvider')
    }
    return context
}