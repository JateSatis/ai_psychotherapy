import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isOnboarding, isAuthenticated } = useAuthStore();
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate after animations
    const timer = setTimeout(() => {
      if (isOnboarding) {
        router.replace('/onboarding');
      } else if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [isOnboarding, isAuthenticated, router]);
  
  return (
    <LinearGradient
      colors={[colors.background, '#ffffff']}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Brain size={80} color={colors.primary} />
        </View>
        <Text style={styles.title}>🧠 AI Psychotherapy Assistant</Text>
        <Text style={styles.subtitle}>Your AI mental wellness companion</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
  },
});