import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  variant = 'default'
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.card, styles.elevated];
      case 'outlined':
        return [styles.card, styles.outlined];
      default:
        return styles.card;
    }
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  elevated: {
    ...theme.shadows.medium,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});