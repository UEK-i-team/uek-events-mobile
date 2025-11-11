import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Event } from '@/types/event';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';

interface EventCardProps {
  event: Event;
  cardHeight: number;
}

// Kolory dla tagów
const TAG_COLORS = [
  { bg: '#E3F2FD', text: '#1976D2' }, // Niebieski
  { bg: '#E8F5E9', text: '#388E3C' }, // Zielony
  { bg: '#FFF3E0', text: '#F57C00' }, // Pomarańczowy
  { bg: '#F3E5F5', text: '#7B1FA2' }, // Fioletowy
  { bg: '#FCE4EC', text: '#C2185B' }, // Różowy
  { bg: '#E0F2F1', text: '#00796B' }, // Turkusowy
];

const TAG_COLORS_DARK = [
  { bg: 'rgba(33, 150, 243, 0.2)', text: '#64B5F6' },
  { bg: 'rgba(76, 175, 80, 0.2)', text: '#81C784' },
  { bg: 'rgba(255, 152, 0, 0.2)', text: '#FFB74D' },
  { bg: 'rgba(156, 39, 176, 0.2)', text: '#BA68C8' },
  { bg: 'rgba(233, 30, 99, 0.2)', text: '#F48FB1' },
  { bg: 'rgba(0, 150, 136, 0.2)', text: '#4DB6AC' },
];

export function EventCard({ event, cardHeight }: EventCardProps) {
  const colorScheme = useColorScheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const cardBackgroundColor = isDark ? '#1E1E1E' : '#FFFFFF';

  const getTagColor = (index: number) => {
    const colors = isDark ? TAG_COLORS_DARK : TAG_COLORS;
    return colors[index % colors.length];
  };

  const handleCardPress = () => {
    router.push(`/event/${event.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    // TODO: Implementacja dodawania do ulubionych
    console.log('Toggle favorite:', event.id);
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: SCREEN_WIDTH,
          height: cardHeight,
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCardPress}
        style={[
          styles.card,
          {
            backgroundColor: cardBackgroundColor,
            width: SCREEN_WIDTH - 32,
            height: cardHeight - 32,
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
            <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]} />
          )}
          
          {/* Etykieta HOT lub Popularne */}
          {(event.isHot || event.isPopular) && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: event.isHot ? '#FF3B30' : '#FF9500',
                },
              ]}>
              <MaterialIcons
                name="local-fire-department"
                size={14}
                color="#FFFFFF"
              />
              <ThemedText style={styles.badgeText}>
                {event.isHot ? 'HOT' : 'Popularne'}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Zawartość karty */}
        <View style={styles.content}>
            {/* Tytuł z ikoną serca */}
            <View style={styles.titleRow}>
              <ThemedText
                type="title"
                style={[
                  styles.title,
                  {
                    color: textColor,
                    flex: 1,
                  },
                ]}>
                {event.title}
              </ThemedText>
              <TouchableOpacity
                style={styles.favoriteButton}
                activeOpacity={0.7}
                onPress={handleFavoritePress}>
                <MaterialIcons
                  name={event.isFavorite ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={event.isFavorite ? '#FF3B30' : (isDark ? '#9BA1A6' : '#687076')}
                />
              </TouchableOpacity>
            </View>

            {/* Opis */}
            <ThemedText
              style={[
                styles.description,
                {
                  color: isDark ? '#CCCCCC' : '#666666',
                },
              ]}>
              {event.description}
            </ThemedText>
            {/* Szczegóły wydarzenia */}
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <MaterialIcons
                  name="calendar-today"
                  size={18}
                  color={isDark ? '#9BA1A6' : '#687076'}
                />
                <ThemedText
                  style={[
                    styles.detailText,
                    {
                      color: isDark ? '#CCCCCC' : '#666666',
                    },
                  ]}>
                  {event.date}
                </ThemedText>
                <MaterialIcons
                  name="access-time"
                  size={18}
                  color={isDark ? '#9BA1A6' : '#687076'}
                />
                <ThemedText
                  style={[
                    styles.detailText,
                    {
                      color: isDark ? '#CCCCCC' : '#666666',
                    },
                  ]}>
                  {event.time}
                </ThemedText>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons
                  name="location-on"
                  size={18}
                  color={isDark ? '#9BA1A6' : '#687076'}
                />
                <ThemedText
                  style={[
                    styles.detailText,
                    {
                      color: isDark ? '#CCCCCC' : '#666666',
                    },
                  ]}>
                  {event.location}
                </ThemedText>
              </View>
            </View>
            {/* Tagi */}
            {event.tags && event.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {event.tags.map((tag, index) => {
                  const tagColor = getTagColor(index);
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
                        {tag}
                      </ThemedText>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Organizator */}
            {event.organizer && (
              <ThemedText
                style={[
                  styles.organizer,
                  {
                    color: isDark ? '#9BA1A6' : '#687076',
                  },
                ]}>
                {event.organizer}
              </ThemedText>
            )}
          </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    flexShrink: 1,
    minHeight: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
    flexGrow: 1,
    flexShrink: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  favoriteButton: {
    padding: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    marginTop: -6,
  },
  details: {
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    lineHeight: 20,
  },
  availabilityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  organizer: {
    fontSize: 14,
    marginTop: 4,
  },
});
