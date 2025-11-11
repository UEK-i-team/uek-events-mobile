import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/shared/components/parallax-scroll-view';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';

export default function ProfileScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profil</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Ustawienia</ThemedText>
        <ThemedView style={styles.settingItem}>
          <IconSymbol name="gear" size={24} color="#808080" />
          <ThemedText style={styles.settingText}>Ogólne</ThemedText>
        </ThemedView>
        <ThemedView style={styles.settingItem}>
          <IconSymbol name="bell" size={24} color="#808080" />
          <ThemedText style={styles.settingText}>Powiadomienia</ThemedText>
        </ThemedView>
        <ThemedView style={styles.settingItem}>
          <IconSymbol name="lock" size={24} color="#808080" />
          <ThemedText style={styles.settingText}>Prywatność</ThemedText>
        </ThemedView>
        <ThemedView style={styles.settingItem}>
          <IconSymbol name="questionmark.circle" size={24} color="#808080" />
          <ThemedText style={styles.settingText}>Pomoc</ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginTop: 20,
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  settingText: {
    fontSize: 16,
  },
});

