import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageType } from '@/components/ChatMessage';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (content: string, type: MessageType) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      addMessage: (content, type) => 
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              content,
              type,
              timestamp: new Date(),
            },
          ],
        })),
      clearMessages: () => set({ messages: [] }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);