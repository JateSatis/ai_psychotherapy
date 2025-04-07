import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { ResourceCard } from '@/components/ResourceCard';
import { resources } from '@/constants/resources';

export default function ResourcesScreen() {
  const emergencyResources = resources.filter((r) => r.type === 'emergency');
  const supportResources = resources.filter((r) => r.type === 'support');
  const infoResources = resources.filter((r) => r.type === 'information');
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={[
          { title: 'Emergency Resources', data: emergencyResources },
          { title: 'Support Resources', data: supportResources },
          { title: 'Information Resources', data: infoResources },
        ]}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.data.map((resource) => (
              <ResourceCard
                key={resource.id}
                title={resource.title}
                description={resource.description}
                url={resource.url}
                type={resource.type}
              />
            ))}
          </View>
        )}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Resources</Text>
            <Text style={styles.subtitle}>
              Find help and support when you need it
            </Text>
          </View>
        }
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
    marginBottom: theme.spacing.md,
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
});