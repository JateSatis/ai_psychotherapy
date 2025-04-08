import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { theme } from "@/constants/theme";
import { ChatMessage } from "@/components/ChatMessage";
import { useChatStore, Message } from "@/store/chat-store";
import { Send } from "lucide-react-native";
import useOpenAI from "@/hooks/useHuggingFace"; // Import the custom hook

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const flatListRef = useRef<FlatList>(null);
  const { getAIResponse } = useOpenAI();

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message
    addMessage(message, "user");
    setMessage("");

    // Simulate AI thinking
    setLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(message);
      addMessage(aiResponse, "assistant");
    } catch (err) {
      addMessage(
        "Sorry, I encountered an error while processing your request.",
        "assistant"
      );
    } finally {
      setLoading(false);

      // Scroll to bottom again after response
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Add welcome message if chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      addMessage(
        "Hi there! I'm your AI companion. How are you feeling today?",
        "assistant"
      );
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
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
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
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim() || isLoading}
          >
            <Send
              size={20}
              color={!message.trim() ? colors.inactive : "#fff"}
            />
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
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: "#fff",
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
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.inactive,
  },
});
