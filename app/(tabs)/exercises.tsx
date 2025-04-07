import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { ExerciseCard } from '@/components/ExerciseCard';
import { useExerciseStore } from '@/store/exercise-store';
import { useRouter } from 'expo-router';

export default function ExercisesScreen() {
  const { exercises } = useExerciseStore();
  const router = useRouter();
  
  const handleExercisePress = (id: string) => {
    router.push(`/exercises/${id}`);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercises</Text>
        <Text style={styles.subtitle}>
          Practice mindfulness and relaxation techniques
        </Text>
      </View>
      
      <FlatList
        data={exercises}
        renderItem={({ item }) => (
          <ExerciseCard
            id={item.id}
            title={item.title}
            description={item.description}
            duration={item.duration}
            imageUrl={item.imageUrl}
            onPress={handleExercisePress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.textLight,
  },
  list: {
    padding: theme.spacing.lg,
  },
});