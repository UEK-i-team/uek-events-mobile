import { useFavorites } from "@/features/saved/contexts";
import { useViewedEvents } from "@/features/viewed";
import { ThemedText } from "@/shared/components/themed-text";
import { Colors } from "@/shared/constants/theme";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Event } from "@/shared/types/event";
import {
  eventCategoryTranslations,
  eventLocationTranslations,
  eventTagTranslations,
  eventTypeTranslations,
} from "@/shared/types/event-enums";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

interface EventCardProps {
  event: Event;
  cardHeight: number;
}

// Paleta kolorów do generowania tła kart
const COLOR_PALETTE = [
  "#E8F5E9", // Green
  "#E3F2FD", // Blue
  "#FFF3E0", // Orange
  "#F3E5F5", // Purple
  "#FCE4EC", // Pink
  "#E0F2F1", // Teal
  "#E1F5FE", // Light Blue
  "#F1F8E9", // Light Green
  "#FFF8E1", // Amber
  "#F3E5F5", // Deep Purple
  "#E8EAF6", // Indigo
  "#ECEFF1", // Blue Grey
];

// Funkcja do konwersji hex na RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Funkcja do konwersji RGB na hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

// Funkcja do rozjaśnienia koloru (dla light mode)
const lightenColor = (hex: string, factor: number = 0.85): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);
  
  return rgbToHex(r, g, b);
};

// Funkcja do przyciemnienia koloru (dla dark mode)
const darkenColor = (hex: string, factor: number = 0.7): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.round(rgb.r * (1 - factor));
  const g = Math.round(rgb.g * (1 - factor));
  const b = Math.round(rgb.b * (1 - factor));
  
  return rgbToHex(r, g, b);
};

// Funkcja do obliczenia luminancji koloru
const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Funkcja do uzyskania odpowiedniego koloru tekstu
const getContrastTextColor = (bgHex: string, isDark: boolean): string => {
  const luminance = getLuminance(bgHex);
  
  if (isDark) {
    return luminance > 0.15 ? "#1A1A1A" : "#E8E8E8";
  } else {
    return luminance > 0.5 ? "#1A1A1A" : "#E8E8E8";
  }
};

// Funkcja generująca hash z stringa
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Funkcja generująca kolor na podstawie ID wydarzenia
const generateColorFromId = (id: string): string => {
  const hash = hashString(id);
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
};

// Dynamiczny import react-native-image-colors z obsługą błędu
let getColors: typeof import("react-native-image-colors").getColors | null = null;
try {
  getColors = require("react-native-image-colors").getColors;
} catch (e) {
  // Moduł natywny niedostępny (np. Expo Go)
  console.log("react-native-image-colors not available, using fallback colors");
}

const TAG_COLORS = [
  { bg: "#E3F2FD", text: "#1976D2" },
  { bg: "#E8F5E9", text: "#388E3C" },
  { bg: "#FFF3E0", text: "#F57C00" },
  { bg: "#F3E5F5", text: "#7B1FA2" },
  { bg: "#FCE4EC", text: "#C2185B" },
  { bg: "#E0F2F1", text: "#00796B" },
];

const TAG_COLORS_DARK = [
  { bg: "rgba(33, 150, 243, 0.2)", text: "#64B5F6" },
  { bg: "rgba(76, 175, 80, 0.2)", text: "#81C784" },
  { bg: "rgba(255, 152, 0, 0.2)", text: "#FFB74D" },
  { bg: "rgba(156, 39, 176, 0.2)", text: "#BA68C8" },
  { bg: "rgba(233, 30, 99, 0.2)", text: "#F48FB1" },
  { bg: "rgba(0, 150, 136, 0.2)", text: "#4DB6AC" },
];

export function EventCard({ event, cardHeight }: EventCardProps) {
  const colorScheme = useColorScheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isViewed } = useViewedEvents();
  const isDark = colorScheme === "dark";

  const viewed = isViewed(event.id);

  // State dla dominującego koloru z obrazu
  const [extractedColor, setExtractedColor] = useState<string | null>(null);

  // Ekstrakcja dominującego koloru z obrazu (jeśli moduł natywny dostępny)
  useEffect(() => {
    const extractColors = async () => {
      if (!event.image || !getColors) {
        setExtractedColor(null);
        return;
      }

      try {
        const colors = await getColors(event.image, {
          fallback: "#FFFFFF",
          cache: true,
          key: event.id,
        });

        if (colors.platform === "android") {
          setExtractedColor(colors.dominant || colors.vibrant || null);
        } else if (colors.platform === "ios") {
          setExtractedColor(colors.primary || colors.background || null);
        } else {
          setExtractedColor(colors.dominant || colors.vibrant || null);
        }
      } catch (error) {
        console.warn("Failed to extract colors from image:", error);
        setExtractedColor(null);
      }
    };

    extractColors();
  }, [event.image, event.id]);

  // Użyj wyekstrahowanego koloru, dominantColor z backendu lub wygeneruj z ID
  const baseColor = extractedColor || (event as any).dominantColor || generateColorFromId(event.id);

  // Oblicz kolor tła na podstawie bazowego koloru
  const cardBackgroundColor = isDark
    ? darkenColor(baseColor, 0.75)
    : lightenColor(baseColor, 0.5);

  // Kolor tekstu bazujący na tle
  const textColor = getContrastTextColor(cardBackgroundColor, isDark);
  const secondaryTextColor = getContrastTextColor(cardBackgroundColor, isDark);
  const iconColor = getContrastTextColor(cardBackgroundColor, isDark);

  const getTagColor = (index: number) => {
    const colors = isDark ? TAG_COLORS_DARK : TAG_COLORS;
    return colors[index % colors.length];
  };

  const handleCardPress = () => {
    router.push(`/event/${event.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(event.id);
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: SCREEN_WIDTH,
          height: cardHeight,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCardPress}
        style={[
          styles.card,
          {
            backgroundColor: cardBackgroundColor,
            width: SCREEN_WIDTH - 32, // Przywrócona oryginalna szerokość
            height: cardHeight - 32,
          },
        ]}
      >
        {/* Obraz wydarzenia */}
        <View style={styles.imageContainer}>
          {event.image ? (
            <Image
              source={{ uri: event.image }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" },
              ]}
            />
          )}

          {/* Badge zobaczonego wydarzenia */}
          {viewed && (
            <View style={styles.viewedBadge}>
              <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
            </View>
          )}

          {/* Etykieta HOT lub Popularne - ZAKOMENTOWANE */}
          {/* {(event.isHot || event.isPopular) && (
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
          )} */}
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
              ]}
            >
              {event.title}
            </ThemedText>
            <TouchableOpacity
              style={styles.favoriteButton}
              activeOpacity={0.7}
              onPress={handleFavoritePress}
            >
              <MaterialIcons
                name={isFavorite(event.id) ? "favorite" : "favorite-border"}
                size={24}
                color={isFavorite(event.id) ? "#FF3B30" : iconColor}
              />
            </TouchableOpacity>
          </View>

          {/* Opis */}
          <ThemedText
            style={[
              styles.description,
              {
                color: secondaryTextColor,
              },
            ]}
          >
            {event.description}
          </ThemedText>
          {/* Szczegóły wydarzenia */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="calendar-today"
                size={18}
                color={iconColor}
              />
              <ThemedText
                style={[
                  styles.detailText,
                  {
                    color: secondaryTextColor,
                  },
                ]}
              >
                {event.date}
              </ThemedText>
              <MaterialIcons name="access-time" size={18} color={iconColor} />
              <ThemedText
                style={[
                  styles.detailText,
                  {
                    color: secondaryTextColor,
                  },
                ]}
              >
                {event.time}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={18} color={iconColor} />
              <ThemedText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.detailText,
                  {
                    color: secondaryTextColor,
                    flex: 1,
                    maxWidth: "90%",
                  },
                ]}
              >
                {event.location}
              </ThemedText>
            </View>
          </View>
          {/* Etykiety: Typ, Kategoria, Lokalizacja */}
          <View style={styles.tagsContainer}>
            {event.eventType && event.eventCategory && (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: getTagColor(0).bg,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.tagText,
                    {
                      color: getTagColor(0).text,
                    },
                  ]}
                >
                  {eventCategoryTranslations[event.eventCategory]} -{" "}
                  {eventTypeTranslations[event.eventType]}
                </ThemedText>
              </View>
            )}
            {event.eventLocation && (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: getTagColor(2).bg,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.tagText,
                    {
                      color: getTagColor(2).text,
                    },
                  ]}
                >
                  {eventLocationTranslations[event.eventLocation]}
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
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.tagText,
                        {
                          color: tagColor.text,
                        },
                      ]}
                    >
                      {eventTagTranslations[tag]}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          )}

          {/* Organizator */}
          {event.organizer && (
            <ThemedText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.organizer,
                {
                  color: iconColor,
                },
              ]}
            >
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
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  card: {
    borderRadius: 16,
    // Cień usunięty
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 3,
    overflow: "hidden",
    flexDirection: "column",
  },
  imageContainer: {
    width: "100%",
    position: "relative",
    flexShrink: 1,
    minHeight: 120,
    // paddingHorizontal: 12, // Odstęp aby widać boki karty
    // paddingTop: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12, // Zaokrąglenie obrazu
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12, // Zaokrąglenie placeholder (tak jak obraz)
  },
  viewedBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
    flexGrow: 1,
    flexShrink: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  favoriteButton: {
    padding: 8,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
    width: "100%",
  },
  detailText: {
    fontSize: 15,
    lineHeight: 20,
  },
  availabilityBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
  },
  organizer: {
    fontSize: 14,
    marginTop: 4,
    width: "100%",
  },
});
