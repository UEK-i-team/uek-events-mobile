import CalendarIcon from "@/assets/icons/calendar.svg";
import ClockIcon from "@/assets/icons/schedule.svg";
import { IEvent } from "@/shared/types/event";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./favorite-event-card.styles";
import { formatEventDate, formatEventTime, isEventPassed } from "@/utils/functions/date-utils";
import { theme, getTagColor } from "@/shared/constants/theme";

const MAX_VISIBLE_TAGS = 2;
const PASSED_TAG_COLOR = "#BDBDBD";

interface FavoriteEventCardProps {
  event: IEvent;
  onRemove: (id: number, isFavorite: boolean) => void;
}

export function FavoriteEventCard({ event, onRemove }: FavoriteEventCardProps) {
  const router = useRouter();

  const eventHasPassed = isEventPassed(event.end_date, event.start_date);

  const visibleTags = (event.tags || []).slice(0, MAX_VISIBLE_TAGS);
  const remainingTagsCount = (event.tags || []).length - MAX_VISIBLE_TAGS;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/event/${event.id}`)}
    >
      <View style={styles.topPartContainer}>
        <View style={[styles.imageWrapper, eventHasPassed && styles.passedImage]}>
          <Image
            source={{ uri: event.image_url }}
            style={styles.image}
            contentFit="cover"
          />
          {eventHasPassed && (
            <>
              <View style={styles.passedOverlayGray} />
              <View style={styles.passedOverlayDark} />
            </>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
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
        {event.event_type && (
          <View
            style={[
              styles.tag,
              { backgroundColor: theme.light.dark_grey },
            ]}
          >
            <Text style={[styles.tagText, { color: theme.light.ligth_grey }]}>
              {event.event_type}
            </Text>
          </View>
        )}


        {visibleTags.map((tag) => (
          <View
            key={tag}
            style={[
              styles.tag,
              {
                backgroundColor: eventHasPassed
                  ? PASSED_TAG_COLOR
                  : getTagColor(tag)
              },
            ]}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}

        {remainingTagsCount > 0 && (
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingText}>
              +{remainingTagsCount}
            </Text>
          </View>
        )}
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
