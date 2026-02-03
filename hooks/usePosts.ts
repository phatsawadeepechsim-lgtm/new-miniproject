import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Post {
  id: string;
  text: string;
  image?: string;
  likes: number;
  isLiked: boolean;
  createdAt: number;
}

const STORAGE_KEY = '@threads_data';

export const usePosts = () => {
  const getPosts = async (): Promise<Post[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };

  const savePost = async (newPost: Post) => {
    const posts = await getPosts();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newPost, ...posts]));
  };

  const updatePosts = async (updatedPosts: Post[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  };

  // เพิ่มฟังก์ชันลบโพสต์ตรงนี้ครับ
  const deletePost = async (id: string) => {
    const posts = await getPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPosts));
    return filteredPosts; 
  };

  return { getPosts, savePost, updatePosts, deletePost }; // ต้องส่งออกไปให้หน้าอื่นใช้ด้วย
};