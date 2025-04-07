import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Card } from './Card';

interface ExerciseCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  imageUrl: string;
  onPress: (id: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  title,
  description,
  duration,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(id)} activeOpacity={0.7}>
      <Card style={styles.card} variant="elevated">
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.durationContainer}>
              <Text style={styles.duration}>{duration}</Text>
            </View>
          </View>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image} 
            resizeMode="cover"
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  durationContainer: {
    backgroundColor: colors.secondary,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  duration: {
    fontSize: theme.typography.fontSizes.xs,
    color: colors.text,
    fontWeight: '500',
  },
  image: {
    width: 100,
    height: '100%',
  },
});