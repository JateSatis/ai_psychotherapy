import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Button } from '@/components/Button';
import { useExerciseStore } from '@/store/exercise-store';
import { Stack } from 'expo-router';
import { BreathingExercise } from '@/components/BreathingExercise';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getExerciseById, addCompletedExercise, isExerciseCompleted } = useExerciseStore();
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  
  const exercise = getExerciseById(id);
  const completed = isExerciseCompleted(id);
  
  if (!exercise) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Exercise not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
        />
      </View>
    );
  }
  
  const handleStart = () => {
    setIsActive(true);
  };
  
  const handleComplete = () => {
    addCompletedExercise(id);
    setIsActive(false);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: exercise.title }} />
      
      {isActive ? (
        <BreathingExercise onComplete={handleComplete} />
      ) : (
        <ScrollView style={styles.scrollView}>
          <Image
            source={{ uri: exercise.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{exercise.title}</Text>
              <View style={styles.durationContainer}>
                <Text style={styles.duration}>{exercise.duration}</Text>
              </View>
            </View>
            
            <Text style={styles.description}>{exercise.description}</Text>
            
            <Text style={styles.contentText}>{exercise.content}</Text>
            
            <Button
              title={completed ? "Do Again" : "Start Exercise"}
              onPress={handleStart}
              variant="primary"
              size="large"
              style={styles.startButton}
            />
            
            {completed && (
              <Text style={styles.completedText}>
                You've completed this exercise before. Great job!
              </Text>
            )}
          </View>
        </ScrollView>
      )}
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
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  durationContainer: {
    backgroundColor: colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  duration: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.text,
    fontWeight: '500',
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  contentText: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  startButton: {
    marginBottom: theme.spacing.md,
  },
  completedText: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.success,
    textAlign: 'center',
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
});