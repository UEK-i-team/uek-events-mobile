import { EXAMPLE_EVENTS } from '@/features/home/constants/events';
import { useFavorites } from '@/features/saved/contexts';
import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Event } from '@/shared/types/event';
import {
  eventCategoryTranslations,
  eventTagTranslations,
  eventTypeTranslations
} from '@/shared/types/event-enums';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Kolory dla tagów
const TAG_COLORS = [
  { bg: '#E3F2FD', text: '#1976D2' },
  { bg: '#E8F5E9', text: '#388E3C' },
  { bg: '#FFF3E0', text: '#F57C00' },
  { bg: '#F3E5F5', text: '#7B1FA2' },
  { bg: '#FCE4EC', text: '#C2185B' },
  { bg: '#E0F2F1', text: '#00796B' },
];

const TAG_COLORS_DARK = [
  { bg: 'rgba(33, 150, 243, 0.2)', text: '#64B5F6' },
  { bg: 'rgba(76, 175, 80, 0.2)', text: '#81C784' },
  { bg: 'rgba(255, 152, 0, 0.2)', text: '#FFB74D' },
  { bg: 'rgba(156, 39, 176, 0.2)', text: '#BA68C8' },
  { bg: 'rgba(233, 30, 99, 0.2)', text: '#F48FB1' },
  { bg: 'rgba(0, 150, 136, 0.2)', text: '#4DB6AC' },
];

export default function EventDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const cardBackgroundColor = isDark ? '#1E1E1E' : '#FFFFFF';

  // Użyj lazy initialization dla state - wydarzenie zostanie znalezione tylko raz przy mount
  const [event] = useState<Event | undefined>(() => 
    EXAMPLE_EVENTS.find((e) => e.id === params.id)
  );

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ThemedText>Nie znaleziono wydarzenia</ThemedText>
      </View>
    );
  }

  const getTagColor = (index: number) => {
    const colors = isDark ? TAG_COLORS_DARK : TAG_COLORS;
    return colors[index % colors.length];
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      const shareMessage = `${event.title}\n\n${event.description}\n\n📅 ${event.date} o ${event.time}\n📍 ${event.location}${event.organizer ? `\n\n👥 Organizator: ${event.organizer}` : ''}`;
      
      const result = await Share.share(
        {
          message: shareMessage,
          title: event.title,
          ...(Platform.OS === 'ios' && event.image ? { url: event.image } : {}),
        },
        {
          dialogTitle: 'Udostępnij wydarzenie',
          ...(Platform.OS === 'android' && { subject: event.title }),
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Udostępniono przez konkretną aplikację (iOS)
          console.log('Udostępniono przez:', result.activityType);
        } else {
          // Udostępniono
          console.log('Wydarzenie zostało udostępnione');
        }
      } else if (result.action === Share.dismissedAction) {
        // Anulowano udostępnianie
        console.log('Anulowano udostępnianie');
      }
    } catch (error) {
      console.error('Błąd podczas udostępniania:', error);
    }
  };

  const handleToggleFavorite = () => {
    if (event) {
      toggleFavorite(event.id);
    }
  };

  const handleRegister = async () => {
    if (!event?.originalLink) {
      Alert.alert(
        'Brak linku',
        'Link do szczegółów wydarzenia nie jest dostępny.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(event.originalLink);
      
      if (supported) {
        await Linking.openURL(event.originalLink);
      } else {
        Alert.alert(
          'Błąd',
          `Nie można otworzyć linku: ${event.originalLink}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Błąd podczas otwierania linku:', error);
      Alert.alert(
        'Błąd',
        'Wystąpił problem podczas otwierania linku do wydarzenia.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Obraz wydarzenia z nałożonymi ikonami */}
        <View style={styles.imageWrapper}>
          {event.image ? (
            <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' },
              ]}
            />
          )}
          
          {/* Header nałożony na zdjęcie */}
          <View style={[styles.headerOverlay, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
              activeOpacity={0.7}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.headerButton}
                activeOpacity={0.7}>
                <MaterialIcons name="share" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={styles.headerButton}
                activeOpacity={0.7}>
                <MaterialIcons
                  name={event && isFavorite(event.id) ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={event && isFavorite(event.id) ? '#FF3B30' : '#FFFFFF'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Zawartość */}
        <View style={[styles.content, { backgroundColor: cardBackgroundColor }]}>
          {/* Tytuł */}
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            {event.title}
          </ThemedText>

          {/* Opis */}
          <ThemedText style={[styles.description, { color: isDark ? '#CCCCCC' : '#666666' }]}>
            {event.description}
          </ThemedText>

          {/* Etykiety: Typ, Kategoria, Lokalizacja */}
          <View style={styles.tagsContainer}>
            {event.eventType && event.eventCategory && (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: getTagColor(0).bg,
                  },
                ]}>
                <ThemedText
                  style={[
                    styles.tagText,
                    {
                      color: getTagColor(0).text,
                    },
                  ]}>
                  {eventCategoryTranslations[event.eventCategory]} - {eventTypeTranslations[event.eventType]}
                </ThemedText>
              </View>
            )}
          </View>
          {/* Tagi */}
          {event.tags && event.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {event.tags.map((tag, index) => {
                const tagColor = getTagColor(index + 3); // Offset, żeby nie kolidować z etykietami
                return (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: tagColor.bg,
                      },
                    ]}>
                    <ThemedText
                      style={[
                        styles.tagText,
                        {
                          color: tagColor.text,
                        },
                      ]}>
                      {eventTagTranslations[tag]}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          )}

          {/* Data i godzina */}
          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={isDark ? '#9BA1A6' : '#687076'}
              />
              <ThemedText style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                {event.date}
              </ThemedText>
              <MaterialIcons
                name="access-time"
                size={20}
                color={isDark ? '#9BA1A6' : '#687076'}
                style={styles.timeIcon}
              />
              <ThemedText style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                {event.time}
              </ThemedText>
            </View>
          </View>

          {/* Lokalizacja */}
          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="location-on"
                size={20}
                color={isDark ? '#9BA1A6' : '#687076'}
              />
              <ThemedText style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#666666', flex: 1 }]}>
                {event.location}
              </ThemedText>
            </View>
          </View>

          {/* Wstęp / Zapisy */}
          {(event.entranceFee || event.requiresRegistration) && (
            <View style={styles.detailSection}>
              <View style={styles.detailRow}>
                <MaterialIcons
                  name="people"
                  size={20}
                  color={isDark ? '#9BA1A6' : '#687076'}
                />
                <ThemedText style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                  {event.entranceFee}
                  {event.requiresRegistration &&
                    ` / Wymagane zapisy${event.registeredCount ? ` (${event.registeredCount})` : ''}`}
                </ThemedText>
              </View>
            </View>
          )}
          {/* W skrócie */}
          {event.summary && event.summary.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="info"
                  size={24}
                  color={isDark ? '#64B5F6' : '#1976D2'}
                />
                <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                  W skrócie:
                </ThemedText>
              </View>
              <View style={styles.summaryList}>
                {event.summary.map((item, index) => (
                  <View key={index} style={styles.summaryItem}>
                    <View style={[styles.bullet, { backgroundColor: isDark ? '#64B5F6' : '#1976D2' }]} />
                    <ThemedText
                      style={[styles.summaryText, { color: isDark ? '#CCCCCC' : '#666666', flex: 1 }]}>
                      {item}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Organizator */}
          {event.organizer && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="person"
                  size={24}
                  color={isDark ? '#64B5F6' : '#1976D2'}
                />
                <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                  Organizator
                </ThemedText>
              </View>
              <ThemedText style={[styles.organizerText, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                {event.organizerDetails || event.organizer}
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Przycisk rejestracji */}
      <View style={[styles.bottomBar, { backgroundColor, borderTopColor: isDark ? '#2A2A2A' : '#E0E0E0' }]}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          activeOpacity={0.8}>
          <ThemedText style={styles.registerButtonText}>
            Zobacz szczegóły wydarzenia
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingBottom: 100,
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    marginTop: -4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeIcon: {
    marginLeft: 12,
  },
  detailText: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryList: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
  organizerText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  registerButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

