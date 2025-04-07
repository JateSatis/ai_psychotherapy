import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'meditation' | 'breathing' | 'mindfulness';
  imageUrl: string;
  content: string;
}

interface ExerciseState {
  exercises: Exercise[];
  completedExercises: string[]; // Array of exercise IDs
  addCompletedExercise: (id: string) => void;
  getExerciseById: (id: string) => Exercise | undefined;
  isExerciseCompleted: (id: string) => boolean;
}

// Sample exercises data
const initialExercises: Exercise[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'Calm your mind with deep breathing exercises',
    duration: '5 min',
    type: 'breathing',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop',
    content: 'This exercise helps reduce anxiety and stress through controlled breathing.',
  },
  {
    id: '2',
    title: 'Body Scan Meditation',
    description: 'Increase awareness of your body and reduce tension',
    duration: '10 min',
    type: 'meditation',
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=200&auto=format&fit=crop',
    content: 'This meditation helps you become aware of sensations throughout your body.',
  },
  {
    id: '3',
    title: 'Mindful Walking',
    description: 'Practice mindfulness while walking',
    duration: '15 min',
    type: 'mindfulness',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=200&auto=format&fit=crop',
    content: 'This exercise helps you stay present by focusing on the sensations of walking.',
  },
  {
    id: '4',
    title: 'Gratitude Meditation',
    description: 'Cultivate gratitude and positive emotions',
    duration: '8 min',
    type: 'meditation',
    imageUrl: 'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?q=80&w=200&auto=format&fit=crop',
    content: "This meditation helps you focus on things you're grateful for in your life.",
  },
  {
    id: '5',
    title: '4-7-8 Breathing',
    description: 'A relaxing breathing pattern to reduce anxiety',
    duration: '3 min',
    type: 'breathing',
    imageUrl: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=200&auto=format&fit=crop',
    content: 'This breathing technique helps calm your nervous system quickly.',
  },
];

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      exercises: initialExercises,
      completedExercises: [],
      addCompletedExercise: (id) => 
        set((state) => ({
          completedExercises: state.completedExercises.includes(id)
            ? state.completedExercises
            : [...state.completedExercises, id],
        })),
      getExerciseById: (id) => {
        return get().exercises.find((exercise) => exercise.id === id);
      },
      isExerciseCompleted: (id) => {
        return get().completedExercises.includes(id);
      },
    }),
    {
      name: 'exercise-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ completedExercises: state.completedExercises }),
    }
  )
);