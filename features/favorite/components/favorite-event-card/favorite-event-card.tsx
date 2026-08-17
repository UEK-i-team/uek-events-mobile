import CalendarIcon from "@/assets/icons/calendar.svg";
import ClockIcon from "@/assets/icons/schedule.svg";
import { IEvent } from "@/shared/types/event";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { styles } from "./favorite-event-card.styles";
import { formatEventDate, formatEventTime, isEventPassed } from "@/utils/functions/date-utils";
import { getTagColor } from "@/shared/constants/theme";
import { useTheme } from "@/shared/context/ThemeContext";

interface FavoriteEventCardProps {
  event: IEvent;
  onRemove: (id: number, isFavorite: boolean) => void;
}

export function FavoriteEventCard({ event, onRemove }: FavoriteEventCardProps) {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isTablet = SCREEN_WIDTH >= 768;
  const eventHasPassed = isEventPassed(event.end_date, event.start_date);
  const maxTags = isTablet ? 6 : 2;
  const allTags = event.tags || [];
  const visibleTags = allTags.slice(0, maxTags);
  const remainingTagsCount = allTags.length - maxTags;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.mainBackgroundLighter }]}
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
          <Text
            style={[styles.title, { color: colors.textPrimary, paddingRight: 24 }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {event.title}
          </Text>

          <View style={styles.dateRow}>
            <View style={styles.dateSection}>
              <CalendarIcon
                width={18}
                height={18}
                fill={colors.textSecondary}
                color={colors.textSecondary}
              />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {formatEventDate(event.start_date)}
              </Text>
            </View>
            <View style={styles.dateSection}>
              <ClockIcon
                width={18}
                height={18}
                fill={colors.textSecondary}
                color={colors.textSecondary}
              />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
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
              {
                backgroundColor: "#111111",
              },
            ]}
          >
            <Text style={[styles.tagText, { color: "#F4F3F2" }]}>
              {event.event_type}
            </Text>
          </View>
        )}

        {visibleTags.map((tag) => {
          const tagBgColor = getTagColor(tag, eventHasPassed);
          return (
            <View
              key={tag}
              style={[
                styles.tag,
                {
                  backgroundColor: tagBgColor,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: "#111111" }]}>{tag}</Text>
            </View>
          );
        })}

{remainingTagsCount > 0 && (
  <View style={[styles.remainingBadge, { backgroundColor: 'transparent' }]}>
    <Text style={[styles.remainingText, { color: colors.textPrimary }]}>
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
        <Ionicons name="close" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
