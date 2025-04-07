import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Button } from './Button';

interface BreathingExerciseProps {
  onComplete: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  
  const animation = useRef(new Animated.Value(0)).current;
  
  const totalCycles = 3;
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          switch (phase) {
            case 'inhale':
              setPhase('hold');
              return 7; // Hold for 7 seconds
            case 'hold':
              setPhase('exhale');
              return 8; // Exhale for 8 seconds
            case 'exhale':
              if (cyclesCompleted >= totalCycles - 1) {
                setIsActive(false);
                onComplete();
                return 0;
              }
              setPhase('rest');
              return 4; // Rest for 4 seconds
            case 'rest':
              setPhase('inhale');
              setCyclesCompleted((prev) => prev + 1);
              return 4; // Inhale for 4 seconds
            default:
              return prev;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, phase, cyclesCompleted, onComplete]);
  
  useEffect(() => {
    if (!isActive) return;
    
    let toValue = 0;
    let duration = 0;
    
    switch (phase) {
      case 'inhale':
        toValue = 1;
        duration = 4000;
        break;
      case 'hold':
        toValue = 1;
        duration = 7000;
        break;
      case 'exhale':
        toValue = 0;
        duration = 8000;
        break;
      case 'rest':
        toValue = 0;
        duration = 4000;
        break;
    }
    
    Animated.timing(animation, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [phase, isActive, animation]);
  
  const circleSize = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 200],
  });
  
  const getInstructionText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly';
      case 'hold':
        return 'Hold your breath';
      case 'exhale':
        return 'Breathe out slowly';
      case 'rest':
        return 'Rest';
      default:
        return '';
    }
  };
  
  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>4-7-8 Breathing</Text>
      <Text style={styles.subtitle}>
        A relaxing breathing technique to reduce anxiety
      </Text>
      
      <View style={styles.exerciseContainer}>
        <Animated.View
          style={[
            styles.breathCircle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize,
            },
          ]}
        />
        
        {isActive ? (
          <View style={styles.instructionsContainer}>
            <Text style={styles.phaseText}>{getInstructionText()}</Text>
            <Text style={styles.secondsText}>{secondsLeft}</Text>
            <Text style={styles.cycleText}>
              Cycle {cyclesCompleted + 1} of {totalCycles}
            </Text>
          </View>
        ) : (
          <Button
            title="Start Breathing Exercise"
            onPress={handleStart}
            variant="primary"
            size="large"
            style={styles.startButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  exerciseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathCircle: {
    backgroundColor: colors.primary,
    opacity: 0.3,
    position: 'absolute',
  },
  instructionsContainer: {
    alignItems: 'center',
  },
  phaseText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  secondsText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: theme.spacing.md,
  },
  cycleText: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.textLight,
  },
  startButton: {
    marginTop: theme.spacing.xl,
  },
});