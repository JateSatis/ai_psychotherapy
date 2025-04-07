import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { JournalEntry } from '@/components/JournalEntry';
import { useJournalStore } from '@/store/journal-store';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function JournalScreen() {
  const { entries } = useJournalStore();
  const router = useRouter();
  
  const handleEntryPress = (id: string) => {
    router.push(`/journal/${id}`);
  };
  
  const handleNewEntry = () => {
    router.push('/journal/new');
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Journal Entries Yet</Text>
      <Text style={styles.emptyText}>
        Start journaling your thoughts and feelings to track your mental wellness journey.
      </Text>
      <Button
        title="Create First Entry"
        onPress={handleNewEntry}
        variant="primary"
        size="large"
        style={styles.createButton}
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleNewEntry}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {entries.length > 0 ? (
        <FlatList
          data={entries}
          renderItem={({ item }) => (
            <JournalEntry
              id={item.id}
              date={new Date(item.date)}
              mood={item.mood}
              content={item.content}
              onPress={handleEntryPress}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  list: {
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  createButton: {
    width: '100%',
  },
});