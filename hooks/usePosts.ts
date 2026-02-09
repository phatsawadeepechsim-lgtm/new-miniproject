import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Comment {
  id: string;
  text: string;
  userName: string;
}

export interface Post {
  id: string;
  text: string;
  image?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[]; // บรรทัดนี้สำคัญมาก ห้ามหาย!
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

  const updatePosts = async (updated: Post[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deletePost = async (id: string) => {
    const posts = await getPosts();
    const filtered = posts.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  };

  return { getPosts, savePost, updatePosts, deletePost };
};