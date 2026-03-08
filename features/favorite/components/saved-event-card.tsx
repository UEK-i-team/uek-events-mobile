// import { useFavorites } from "@/features/favorite/contexts";
import { ThemedText } from "@/shared/components/themed-text";
import { IEvent } from "@/shared/types/event";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface SavedEventCardProps {
  event: IEvent;
}

export function SavedEventCard({ event }: SavedEventCardProps) {
  const router = useRouter();
  // const { isFavorite, toggleFavorite } = useFavorites();
  //
  const cardBackgroundColor = "#FFFFFF";
  const textColor = "#000000";
  const secondaryTextColor = "#666666";
  const iconColor = "#687076";

  const handleCardPress = () => {
    router.push(`/event/${event.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    // toggleFavorite(event.id);
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
      ]}
    >
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
            style={[styles.imagePlaceholder, { backgroundColor: "#F0F0F0" }]}
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
            ]}
          >
            {event.title}
          </ThemedText>
        </View>

        {/* Szczegóły wydarzenia - data i godzina w jednym rzędzie */}
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={14} color={iconColor} />
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
            ]}
          >
            {event.time}
          </ThemedText>
        </View>
      </View>

      {/* Przycisk ulubione */}
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
    paddingLeft: 8,
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    lineHeight: 18,
  },
  timeIcon: {
    marginLeft: 6,
  },
  favoriteButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
