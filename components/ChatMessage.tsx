import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';

export type MessageType = 'user' | 'assistant';

interface ChatMessageProps {
  message: string;
  type: MessageType;
  timestamp: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  type,
  timestamp,
}) => {
  const isUser = type === 'user';
  
  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.message, isUser ? styles.userMessage : styles.assistantMessage]}>
          {message}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formattedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  assistantBubble: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  message: {
    fontSize: theme.typography.fontSizes.md,
  },
  userMessage: {
    color: '#fff',
  },
  assistantMessage: {
    color: colors.text,
  },
  timestamp: {
    fontSize: theme.typography.fontSizes.xs,
    color: colors.textLight,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});