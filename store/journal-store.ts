import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mood } from '@/components/MoodSelector';

export interface JournalEntry {
  id: string;
  date: Date;
  mood: Mood;
  content: string;
  tags: string[];
}

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  updateEntry: (id: string, entry: Partial<Omit<JournalEntry, 'id'>>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => 
        set((state) => ({
          entries: [
            {
              id: Date.now().toString(),
              date: new Date(),
              ...entry,
            },
            ...state.entries,
          ],
        })),
      updateEntry: (id, updatedEntry) => 
        set((state) => ({
          entries: state.entries.map((entry) => 
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          ),
        })),
      deleteEntry: (id) => 
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
      getEntryById: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);