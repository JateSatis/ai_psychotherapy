import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Card } from './Card';
import { ChevronRight } from 'lucide-react-native';
import { Mood } from './MoodSelector';

interface JournalEntryProps {
  id: string;
  date: Date;
  mood: Mood;
  content: string;
  onPress: (id: string) => void;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({
  id,
  date,
  mood,
  content,
  onPress,
}) => {
  const formattedDate = date.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const getMoodEmoji = (mood: Mood) => {
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

  const truncateContent = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity onPress={() => onPress(id)} activeOpacity={0.7}>
      <Card style={styles.card} variant="elevated">
        <View style={styles.header}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.mood}>{getMoodEmoji(mood)}</Text>
        </View>
        <Text style={styles.content}>{truncateContent(content)}</Text>
        <View style={styles.footer}>
          <Text style={styles.readMore}>Read more</Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
  },
  mood: {
    fontSize: theme.typography.fontSizes.md,
  },
  content: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMore: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.primary,
    marginRight: theme.spacing.xs,
  },
});