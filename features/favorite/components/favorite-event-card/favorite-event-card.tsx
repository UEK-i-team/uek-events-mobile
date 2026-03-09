import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

import { IEvent } from "@/shared/types/event";
import { styles } from "./favorite-event-card.styles";

interface FavoriteEventCardProps {
  event: IEvent;
  onRemove: (id: string, isFavorite: boolean) => void;
}

export function FavoriteEventCard({ event, onRemove }: FavoriteEventCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/event/${event.id}`)}
    >
      <Image
        source={{
          uri: "https://bg.uek.krakow.pl//sites/default/files/default_images/szkolenie.jpg",
        }}
        style={styles.image}
      />

      <Text style={styles.title} numberOfLines={2}>
        {event.title}
      </Text>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={(e) => {
          e.stopPropagation();
          onRemove(event.id, false);
        }}
      >
        <Ionicons name="heart" size={24} color="#D32F2F" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
