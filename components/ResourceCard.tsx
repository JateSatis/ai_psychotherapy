import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Card } from './Card';
import { ExternalLink } from 'lucide-react-native';

interface ResourceCardProps {
  title: string;
  description: string;
  url: string;
  type: 'emergency' | 'support' | 'information';
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  url,
  type,
}) => {
  const handlePress = async () => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'emergency':
        return '#e57373'; // Soft red
      case 'support':
        return colors.primary;
      case 'information':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={styles.card} variant="outlined">
        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor() }]} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Visit resource</Text>
            <ExternalLink size={16} color={colors.primary} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 0,
  },
  typeIndicator: {
    width: 6,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.primary,
    marginRight: theme.spacing.xs,
  },
});