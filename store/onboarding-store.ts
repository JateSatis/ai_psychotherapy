import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  focusArea: string | null;
  therapyExperience: string | null;
  overwhelmedFrequency: string | null;
  age: number | null;
  gender: string | null;
  
  setFocusArea: (area: string) => void;
  setTherapyExperience: (experience: string) => void;
  setOverwhelmedFrequency: (frequency: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: string) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      focusArea: null,
      therapyExperience: null,
      overwhelmedFrequency: null,
      age: null,
      gender: null,
      
      setFocusArea: (area) => set({ focusArea: area }),
      setTherapyExperience: (experience) => set({ therapyExperience: experience }),
      setOverwhelmedFrequency: (frequency) => set({ overwhelmedFrequency: frequency }),
      setAge: (age) => set({ age }),
      setGender: (gender) => set({ gender }),
      resetOnboarding: () => set({
        focusArea: null,
        therapyExperience: null,
        overwhelmedFrequency: null,
        age: null,
        gender: null,
      }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);