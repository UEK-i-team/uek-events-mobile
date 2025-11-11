import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

// This screen is not used anymore since filters opens a bottom sheet
// But we keep it to avoid routing errors
export default function FiltersScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Filtry</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

