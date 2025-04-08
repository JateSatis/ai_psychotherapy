import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Button } from '@/components/Button';
import { useJournalStore } from '@/store/journal-store';
import { Stack } from 'expo-router';
import { Trash2 } from 'lucide-react-native';

export default function JournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntryById, deleteEntry } = useJournalStore();
  const router = useRouter();
  
  const entry = getEntryById(id);
  
  if (!entry) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Entry not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
        />
      </View>
    );
  }
  
  const formattedDate = new Date(entry.date).toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'great':
        return '❤️';
      case 'good':
        return '😊';
      case 'okay':
        return '😐';
      case 'bad':
        return '😔';
      case 'awful':
        return '👎';
      default:
        return '😐';
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEntry(id);
            router.back();
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>    
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.mood}>
            Feeling: {entry.mood} {getMoodEmoji(entry.mood)}
          </Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{entry.content}</Text>
        </View>
        
        {entry.tags && entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Tags:</Text>
            <View style={styles.tagsList}>
              {entry.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  date: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.xs,
  },
  mood: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.textLight,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  content: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.text,
    lineHeight: 24,
  },
  tagsContainer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tagsTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    color: '#fff',
    fontSize: theme.typography.fontSizes.sm,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  notFoundText: {
    fontSize: theme.typography.fontSizes.lg,
    color: colors.text,
    marginBottom: theme.spacing.lg,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginRight: theme.spacing.sm,
  },
  deleteButtonText: {
    color: colors.error,
  },
});