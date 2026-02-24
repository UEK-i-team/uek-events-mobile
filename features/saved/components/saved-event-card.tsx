import { useFavorites } from '@/features/saved/contexts';
import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Event } from '@/shared/types/event';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface SavedEventCardProps {
  event: Event;
}

// Mapowanie kolorów dla trybu ciemnego
const CARD_COLORS_MAP: Record<string, string> = {
  '#E8F5E9': '#1B2E21', // Green
  '#E3F2FD': '#1A2633', // Blue
  '#FFF3E0': '#332415', // Orange
  '#F3E5F5': '#2A1A33', // Purple
  '#FCE4EC': '#331A21', // Pink
  '#E0F2F1': '#1A2C33', // Light Blue
};

const CARD_TEXT_COLORS_MAP: Record<string, string> = {
  '#1976D2': '#64B5F6', // Green
  '#388E3C': '#81C784', // Blue
  '#F57C00': '#FFB74D', // Orange
  '#7B1FA2': '#BA68C8', // Purple
  '#C2185B': '#F48FB1', // Pink
  '#00796B': '#4DB6AC', // Light Blue
};
export function SavedEventCard({ event }: SavedEventCardProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isDark = colorScheme === 'dark';

  // Użyj koloru z eventu lub domyślnego
  const baseColor = event.cardColor || '#FFFFFF';
  const cardBackgroundColor = isDark
    ? (event.cardColor ? (CARD_COLORS_MAP[event.cardColor] || '#1E1E1E') : '#1E1E1E')
    : baseColor;

  // Dostosuj kolory tekstu do tła
  const textColor = isDark
    ? (event.cardColor ? (CARD_TEXT_COLORS_MAP[event.cardColor] || Colors.dark.text) : Colors.dark.text)
    : '#1a1a1a';
  const secondaryTextColor = isDark ? '#CCCCCC' : '#4a4a4a';
  const iconColor = isDark ? '#9BA1A6' : '#666666';

  const handleCardPress = () => {
    router.push(`/event/${event.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(event.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleCardPress}
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
        },
      ]}>
      {/* Obraz wydarzenia */}
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image
            source={{ uri: event.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' },
            ]}
          />
        )}
      </View>

      {/* Zawartość karty */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText
            numberOfLines={2}
            style={[
              styles.title,
              {
                color: textColor,
              },
            ]}>
            {event.title}
          </ThemedText>
        </View>

        {/* Szczegóły wydarzenia - data i godzina w jednym rzędzie */}
        <View style={styles.detailRow}>
          <MaterialIcons
            name="calendar-today"
            size={14}
            color={iconColor}
          />
          <ThemedText
            style={[
              styles.detailText,
              {
                color: secondaryTextColor,
              },
            ]}>
            {event.date}
          </ThemedText>
          <MaterialIcons
            name="access-time"
            size={14}
            color={iconColor}
            style={styles.timeIcon}
          />
          <ThemedText
            style={[
              styles.detailText,
              {
                color: secondaryTextColor,
              },
            ]}>
            {event.time}
          </ThemedText>
        </View>
      </View>

      {/* Przycisk ulubione */}
      <TouchableOpacity
        style={styles.favoriteButton}
        activeOpacity={0.7}
        onPress={handleFavoritePress}>
        <MaterialIcons
          name={isFavorite(event.id) ? 'favorite' : 'favorite-border'}
          size={24}
          color={isFavorite(event.id) ? '#FF3B30' : iconColor}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    // Bez cienia/tła
    overflow: 'hidden',
    paddingLeft: 8, // Lekki odstęp od lewej
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center', // Wyśrodkowanie wertykalnie
    alignItems: 'center',
    paddingVertical: 8, // Taki sam padding jak paddingLeft w karcie
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // Zaokrąglenie obrazu
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center', // Wyśrodkowanie zawartości wertykalnie
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    lineHeight: 18,
  },
  timeIcon: {
    marginLeft: 6, // Odstęp między datą a ikoną godziny
  },
  favoriteButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

