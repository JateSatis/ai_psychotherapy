import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Button } from '@/components/Button';
import { MoodSelector, Mood } from '@/components/MoodSelector';
import { useJournalStore } from '@/store/journal-store';
import { Stack } from 'expo-router';
import { X } from 'lucide-react-native';

export default function NewJournalEntryScreen() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const { addEntry } = useJournalStore();
  const router = useRouter();
  
  const handleSave = () => {
    if (!mood || !content.trim()) {
      return;
    }
    
    addEntry({
      mood,
      content: content.trim(),
      tags,
    });
    
    router.back();
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  const isFormValid = !!mood && content.trim().length > 0;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'New Journal Entry' }} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
            <MoodSelector selectedMood={mood} onSelectMood={setMood} />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Write your thoughts</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind today?"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add tags (optional)</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
              />
              <Button
                title="Add"
                onPress={handleAddTag}
                variant="outline"
                size="small"
                disabled={!tagInput.trim()}
              />
            </View>
            
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(index)}
                      style={styles.removeTagButton}
                    >
                      <X size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.footerButton}
          />
          <Button
            title="Save Entry"
            onPress={handleSave}
            disabled={!isFormValid}
            style={styles.footerButton}
          />
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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  contentInput: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 150,
    fontSize: theme.typography.fontSizes.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.md,
  },
  tag: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: theme.typography.fontSizes.sm,
    marginRight: 4,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fff',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});