import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { ChatMessage } from '@/components/ChatMessage';
import { useChatStore, Message } from '@/store/chat-store';
import { Send } from 'lucide-react-native';

// Mock AI responses
const mockResponses = [
  "I understand how you're feeling. Would you like to talk more about what's causing these emotions?",
  "That sounds challenging. How have you been coping with this situation?",
  "I'm here to listen. What do you think would help you feel better right now?",
  "It's completely normal to feel that way. Have you tried any relaxation techniques that helped in the past?",
  "Thank you for sharing that with me. Would it help to explore some strategies for managing these feelings?",
  "I appreciate your openness. Let's think about some small steps you could take to address this.",
  "That's a common experience. Many people feel similarly in these situations.",
  "I'm sorry you're going through this. What kind of support would be most helpful right now?",
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const flatListRef = useRef<FlatList>(null);
  
  const handleSend = async () => {
    if (!message.trim()) return;
    
    // Add user message
    addMessage(message, 'user');
    setMessage('');
    
    // Simulate AI thinking
    setLoading(true);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      addMessage(randomResponse, 'assistant');
      setLoading(false);
      
      // Scroll to bottom again after response
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };
  
  // Add welcome message if chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      addMessage("Hi there! I'm your AI companion. How are you feeling today?", 'assistant');
    }
  }, []);
  
  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <ChatMessage
        message={item.content}
        type={item.type}
        timestamp={new Date(item.timestamp)}
      />
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim() || isLoading}
          >
            <Send size={20} color={!message.trim() ? colors.inactive : '#fff'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.small,
  },
  loadingText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    maxHeight: 100,
    fontSize: theme.typography.fontSizes.md,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.inactive,
  },
});