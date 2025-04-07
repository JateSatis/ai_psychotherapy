import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  setUser: (user: User) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isOnboarding: true,
      setUser: (user) => set({ user, isAuthenticated: true }),
      completeOnboarding: () => 
        set((state) => ({
          isOnboarding: false,
          user: state.user 
            ? { ...state.user, onboardingCompleted: true } 
            : null
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);