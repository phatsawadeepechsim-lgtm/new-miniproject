import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  createdAt: number;
}

export const useChat = () => {
  const getMessages = async (chatId: string): Promise<Message[]> => {
    const data = await AsyncStorage.getItem(`@chat_${chatId}`);
    return data ? JSON.parse(data) : [];
  };

  const sendMessage = async (chatId: string, text: string) => {
    const current = await getMessages(chatId);
    const newMessage = { id: Date.now().toString(), text, sender: 'me', createdAt: Date.now() };
    const updated = [newMessage, ...current];
    await AsyncStorage.setItem(`@chat_${chatId}`, JSON.stringify(updated));
    return updated;
  };

  const deleteMessage = async (chatId: string, msgId: string) => {
    const current = await getMessages(chatId);
    const updated = current.filter(m => m.id !== msgId);
    await AsyncStorage.setItem(`@chat_${chatId}`, JSON.stringify(updated));
    return updated;
  };

  return { getMessages, sendMessage, deleteMessage };
};