import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFavorites } from '@/features/saved/contexts';
import { useViewedEvents } from '@/features/viewed';
import { ExternalLink } from '@/shared/components/external-link';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { cacheService } from '@/shared/connectors/services';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function InfoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  
  const { clearViewed } = useViewedEvents();
  const { clearFavorites } = useFavorites();

  const handleDeleteHalfEvents = async () => {
    try {
      // Pobierz wszystkie eventy z cache
      const cachedEvents = await cacheService.getEvents();
      
      if (cachedEvents && cachedEvents.length > 0) {
        // Usuń połowę eventów z cache
        const halfLength = Math.floor(cachedEvents.length / 2);
        const halfEvents = cachedEvents.slice(0, halfLength);
        await cacheService.saveEvents(halfEvents);
      }
      
      // Pobierz wszystkie viewed events z AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const stored = await AsyncStorage.getItem('@uek_events_viewed');
      
      if (stored) {
        const viewedData = JSON.parse(stored);
        if (viewedData.length > 0) {
          // Usuń połowę viewed events
          const halfLength = Math.floor(viewedData.length / 2);
          const halfViewed = viewedData.slice(0, halfLength);
          await AsyncStorage.setItem('@uek_events_viewed', JSON.stringify(halfViewed));
        }
      }
      
      Alert.alert('Sukces', 'Usunięto połowę eventów z cache i viewed events.');
    } catch (error) {
      console.error('Błąd podczas usuwania połowy eventów:', error);
      Alert.alert('Błąd', 'Wystąpił problem podczas usuwania połowy eventów.');
    }
  };

  const handleClearMemory = () => {
    Alert.alert(
      'Wyczyść wszystkie dane aplikacji',
      'Czy na pewno chcesz usunąć wszystkie lokalne dane aplikacji?\n\nZostaną usunięte:\n• Historia zobaczonych wydarzeń\n• Zapisane ulubione wydarzenia\n• Cache wydarzeń\n\nTa operacja nie może być cofnięta.',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Wyczyść wszystko',
          style: 'destructive',
          onPress: async () => {
            try {
              // Wyczyść wszystko równolegle
              await Promise.all([
                clearViewed(),
                clearFavorites(),
                cacheService.clearEventsCache(),
              ]);
              Alert.alert('Sukces', 'Wszystkie lokalne dane aplikacji zostały wyczyszczone.');
            } catch (error) {
              console.error('Błąd podczas czyszczenia danych:', error);
              Alert.alert('Błąd', 'Wystąpił problem podczas czyszczenia danych.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            O aplikacji
          </ThemedText>
          <ThemedView style={[
            styles.creatorsSection,
              { backgroundColor: isDark ? 'rgba(33, 150, 243, 0.2)' : '#F9FCFF' }
            ]}>
            <ThemedText style={[styles.creatorsTitle, { color: textColor }]}>
              CEL APLIKACJI ORAZ TWÓRCY:
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: textColor }]}>
              Ile razy przegapiłeś ważny event, bo ogłoszenie zaginęło w mailach? My też mieliśmy dość. Dlatego stworzyliśmy aplikację, która zbiera wszystkie wydarzenia, konkursy i oferty w jednym miejscu.
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: textColor }]}>
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: textColor }]}>
              Jesteśmy Koło Naukowe Informatyki i::team, studenci UEK, którzy rozwiązują problemy z kodem w ręku. Stworzono przez studentów, dla studentów. 🚀
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.linkItem}>
            <ExternalLink href="https://example.com/polityka-prywatnosci" style={styles.link}>
              <ThemedText style={[styles.linkText, { color: textColor }]}>
                Polityka prywatności
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
          </ThemedView>
          
          <ThemedView style={styles.linkItem}>
            <ExternalLink href="https://example.com/regulamin" style={styles.link}>
              <ThemedText style={[styles.linkText, { color: textColor }]}>
                Regulamin
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
          </ThemedView>

          <ThemedView style={styles.linkItem}>
            <ExternalLink href="https://example.com/formualrz_kontaktowy" style={styles.link}>
              <ThemedText style={[styles.linkText, { color: textColor }]}>
                Formularz kontaktowy
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
          </ThemedView>
        </ThemedView>

        {/* Sekcja zarządzania danymi */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Zarządzanie danymi
          </ThemedText>
          
          {/* TYMCZASOWY PRZYCISK - Usuń połowę eventów */}
          <TouchableOpacity
            onPress={handleDeleteHalfEvents}
            style={[
              styles.clearButton,
              {
                borderColor: isDark ? 'rgba(255, 152, 0, 0.3)' : '#FFE0B2',
              }
            ]}
            activeOpacity={0.7}>
            <ThemedView style={styles.clearButtonContent}>
              <MaterialIcons
                name="remove-circle-outline"
                size={24}
                color={isDark ? '#FF9800' : '#F57C00'}
              />
              <ThemedView style={styles.clearButtonTextContainer}>
                <ThemedText style={[styles.clearButtonTitle, { color: isDark ? '#FF9800' : '#F57C00' }]}>
                  [TEST] Usuń połowę eventów
                </ThemedText>
                <ThemedText style={[styles.clearButtonDescription, { color: isDark ? '#999999' : '#666666' }]}>
                  Usuń 50% cache i viewed events
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={isDark ? '#FF9800' : '#F57C00'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearMemory}
            style={[
              styles.clearButton,
              {
                borderColor: isDark ? 'rgba(43, 37, 37, 0.3)' : '#FFCDD2',
              }
            ]}
            activeOpacity={0.7}>
            <ThemedView style={styles.clearButtonContent}>
              <MaterialIcons
                name="delete-outline"
                size={24}
                color={isDark ? '#EF5350' : '#D32F2F'}
              />
              <ThemedView style={styles.clearButtonTextContainer}>
                <ThemedText style={[styles.clearButtonTitle, { color: isDark ? '#EF5350' : '#D32F2F' }]}>
                  Wyczyść wszystkie dane
                </ThemedText>
                <ThemedText style={[styles.clearButtonDescription, { color: isDark ? '#999999' : '#666666' }]}>
                  Usuń historię, ulubione i cache
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={isDark ? '#EF5350' : '#D32F2F'}
            />
          </TouchableOpacity>
        </ThemedView>
        
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '700',
    paddingHorizontal: 20,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  link: {
    flex: 1,
  },
  linkText: {
    fontSize: 16,
  },
  creatorsSection: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 12,
  },
  creatorsTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 12,
  },
  creatorsText: {
    fontSize: 15,
    lineHeight: 22,
  },
  clearButton: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  clearButtonTextContainer: {
    flex: 1,
  },
  clearButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  clearButtonDescription: {
    fontSize: 13,
  },
});

