import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Smile, Frown, Meh, Heart, ThumbsDown } from 'lucide-react-native';

export type Mood = 'great' | 'good' | 'okay' | 'bad' | 'awful';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
}) => {
  const moods: { value: Mood; icon: React.ReactNode; label: string }[] = [
    {
      value: 'great',
      icon: <Heart size={24} color={selectedMood === 'great' ? '#fff' : colors.primary} />,
      label: 'Great',
    },
    {
      value: 'good',
      icon: <Smile size={24} color={selectedMood === 'good' ? '#fff' : colors.primary} />,
      label: 'Good',
    },
    {
      value: 'okay',
      icon: <Meh size={24} color={selectedMood === 'okay' ? '#fff' : colors.primary} />,
      label: 'Okay',
    },
    {
      value: 'bad',
      icon: <Frown size={24} color={selectedMood === 'bad' ? '#fff' : colors.primary} />,
      label: 'Bad',
    },
    {
      value: 'awful',
      icon: <ThumbsDown size={24} color={selectedMood === 'awful' ? '#fff' : colors.primary} />,
      label: 'Awful',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.moodContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodButton,
              selectedMood === mood.value && styles.selectedMoodButton,
            ]}
            onPress={() => onSelectMood(mood.value)}
            activeOpacity={0.7}
          >
            {mood.icon}
            <Text
              style={[
                styles.moodLabel,
                selectedMood === mood.value && styles.selectedMoodLabel,
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    width: 64,
    height: 80,
  },
  selectedMoodButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  moodLabel: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.xs,
    color: colors.text,
  },
  selectedMoodLabel: {
    color: '#fff',
  },
});