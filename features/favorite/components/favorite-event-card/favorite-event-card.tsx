import CalendarIcon from "@/assets/icons/calendar.svg";
import ClockIcon from "@/assets/icons/schedule.svg";
import { IEvent } from "@/shared/types/event";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./favorite-event-card.styles";
import { formatEventDate, formatEventTime } from "@/utils/functions/date-utils";



const TAG_COLORS = [
  "#B4DEFF",
  "#FAE5FF",
  "#C3F1EC",
  "#FFF3E0",
  "#E8F5E9",
  "#FCE4EC",
];



interface FavoriteEventCardProps {
  event: IEvent;
  onRemove: (id: string, isFavorite: boolean) => void;
}

export function FavoriteEventCard({ event, onRemove }: FavoriteEventCardProps) {
  const router = useRouter();
  const allTags = [event.event_category, ...event.tags].filter(Boolean);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/event/${event.id}`)}
    >
      <View style={styles.topPartContainer}>
        <Image
          source={{ uri: event.image_url }}
          style={styles.image}
          contentFit="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>

          <View style={styles.dateRow}>
            <View style={styles.dateSection}>
              <CalendarIcon
                width={18}
                height={18}
                fill="#111111"
                color="#111111"
              />
              <Text style={styles.dateText}>
                {formatEventDate(event.start_date)}
              </Text>
            </View>
            <View style={styles.dateSection}>
              <ClockIcon
                width={18}
                height={18}
                fill="#111111"
                color="#111111"
              />
              <Text style={styles.dateText}>
                {formatEventTime(event.start_date)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tagsRow}>
        {allTags.map((tag, index) => (
          <View
            key={tag}
            style={[
              styles.tag,
              { backgroundColor: TAG_COLORS[index % TAG_COLORS.length] },
            ]}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={(e) => {
          e.stopPropagation();
          onRemove(event.id, false);
        }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={24} color="#111111" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
