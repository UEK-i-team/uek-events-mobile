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
import { useTheme } from "@/shared/context/ThemeContext";
import { getTagColor } from "@/shared/constants/theme";
import { theme, getTagColor } from "@/shared/constants/theme";

const MAX_VISIBLE_TAGS = 2;
const PASSED_TAG_COLOR = "#BDBDBD";



interface FavoriteEventCardProps {
  event: IEvent;
  onRemove: (id: number, isFavorite: boolean) => void;
}

export function FavoriteEventCard({ event, onRemove }: FavoriteEventCardProps) {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();

  const eventHasPassed = isEventPassed(event.end_date, event.start_date);

  const visibleTags = (event.tags || []).slice(0, MAX_VISIBLE_TAGS);
  const remainingTagsCount = (event.tags || []).length - MAX_VISIBLE_TAGS;

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { 
          backgroundColor: colors.light_grey,
          shadowOpacity: isDarkMode ? 0 : 0.1,
          elevation: isDarkMode ? 0 : 3,
        }
      ]}
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
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2} ellipsizeMode="tail">
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
        {allTags.map((tag, index) => {
          const tagColors = getTagColor(index, isDarkMode);
          return (
            <View
              key={tag}
              style={[
                styles.tag,
                { backgroundColor: tagColors.bg },
              ]}
            >
              <Text style={[styles.tagText, { color: tagColors.text }]}>{tag}</Text>
            </View>
          );
          
        {remainingTagsCount > 0 && (
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingText}>
              +{remainingTagsCount}
            </Text>
          </View>
        )}
        })}
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
