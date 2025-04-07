import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { MoodSelector, Mood } from '@/components/MoodSelector';
import { useJournalStore } from '@/store/journal-store';
import { useExerciseStore } from '@/store/exercise-store';
import { useRouter } from 'expo-router';
import { Brain, ArrowRight, MessageCircle } from 'lucide-react-native';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { addEntry } = useJournalStore();
  const { exercises } = useExerciseStore();
  const { focusArea } = useOnboardingStore();
  const router = useRouter();
  
  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleSaveMood = () => {
    if (selectedMood) {
      addEntry({
        mood: selectedMood,
        content: `I'm feeling ${selectedMood} today.`,
        tags: [selectedMood],
      });
      setSelectedMood(null);
    }
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Filter exercises based on user's focus area if available
  const recommendedExercises = focusArea 
    ? exercises.filter(e => {
        if (focusArea === 'Anxiety') return e.type === 'breathing';
        if (focusArea === 'Mood') return e.type === 'meditation';
        return true;
      }).slice(0, 2)
    : exercises.slice(0, 2);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>How are you today?</Text>
          </View>
          <View style={styles.logoContainer}>
            <Brain size={28} color={colors.primary} />
          </View>
        </Animated.View>
        
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Card style={styles.moodCard}>
            <Text style={styles.cardTitle}>Track Your Mood</Text>
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />
            {selectedMood && (
              <Button
                title="Save Mood"
                onPress={handleSaveMood}
                variant="primary"
                style={styles.saveButton}
              />
            )}
          </Card>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push('/exercises')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recommendedExercises.map((exercise) => (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseContent}>
                <View>
                  <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
                </View>
                <Button
                  title="Start"
                  onPress={() => router.push(`/exercises/${exercise.id}`)}
                  variant="outline"
                  size="small"
                />
              </View>
            </Card>
          ))}
          
          <Card style={styles.chatCard}>
            <View style={styles.chatCardContent}>
              <View>
                <Text style={styles.chatCardTitle}>Talk to AI Assistant</Text>
                <Text style={styles.chatCardText}>
                  Share your thoughts and get support
                </Text>
              </View>
              <Button
                title="Chat Now"
                onPress={() => router.push('/chat')}
                variant="primary"
                size="small"
                style={styles.chatButton}
              />
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
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
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
  },
  name: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.textLight,
    marginTop: 4,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  moodCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  saveButton: {
    marginTop: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.primary,
  },
  exerciseCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  exerciseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  exerciseDuration: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textLight,
  },
  chatCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: colors.primary,
  },
  chatCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatCardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  chatCardText: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatButton: {
    backgroundColor: '#fff',
  },
});