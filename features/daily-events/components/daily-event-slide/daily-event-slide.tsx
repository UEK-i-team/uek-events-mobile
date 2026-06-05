import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";

import { IEvent } from "@/shared/types/event";
import {
  formatEventTime,
  formatEventDateWithMonth,
} from "@/utils/functions/date-utils";

import { formatCountdown } from "../../hooks/use-countdown";
import { useDailyEventSlide } from "./use-daily-event-slide";
import { styles } from "./daily-event-slide.styles";

interface DailyEventSlideProps {
  event: IEvent;
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
  cardWidth: number;
  imageHeight: number;
  onNavigate: () => void;
}

export const DailyEventSlide = React.memo(function DailyEventSlide({
  event,
  index,
  scrollX,
  itemSize,
  cardWidth,
  imageHeight,
  onNavigate,
}: DailyEventSlideProps) {
  const {
    imageUrl,
    dominantColor,
    countdown,
    gradientStart,
    gradientMiddle,
    gradientEnd,
    textColor,
    mutedColor,
    pillBg,
    animatedStyle,
    handlePress,
  } = useDailyEventSlide({ event, index, scrollX, itemSize, onNavigate });

  return (
    <View style={[styles.itemContainer, { width: itemSize }]}>
      <Animated.View
        style={[styles.card, { width: cardWidth }, animatedStyle]}
      >
        <LinearGradient
          colors={[gradientStart, gradientMiddle, gradientEnd]}
          locations={[0, 0.55, 1]}
          style={styles.background}
        />

        <Pressable style={styles.content} onPress={handlePress}>
          <View
            style={[
              styles.imageWrapper,
              { height: imageHeight, backgroundColor: dominantColor },
            ]}
          >
            <Image
              source={imageUrl}
              placeholder={dominantColor}
              contentFit="contain"
              transition={300}
              style={styles.image}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.metaRow}>
              <View style={[styles.metaPill, { backgroundColor: pillBg }]}>
                <Text style={[styles.metaText, { color: textColor }]}>
                  {formatEventDateWithMonth(event.start_date)}
                </Text>
              </View>
              <View style={[styles.metaPill, { backgroundColor: pillBg }]}>
                <Text style={[styles.metaText, { color: textColor }]}>
                  {formatEventTime(event.start_date)}
                </Text>
              </View>
            </View>

            {countdown.isValid && (
              <View style={[styles.countdownBar, { backgroundColor: pillBg }]}>
                <Text style={[styles.countdownLabel, { color: mutedColor }]}>
                  {countdown.isPast ? "Status" : "Rozpocznie się za"}
                </Text>
                <Text style={[styles.countdownValue, { color: textColor }]}>
                  {countdown.isPast ? "Trwa" : formatCountdown(countdown)}
                </Text>
              </View>
            )}

            <Text
              style={[styles.title, { color: textColor }]}
              numberOfLines={3}
              maxFontSizeMultiplier={1.2}
            >
              {event.title}
            </Text>

            {!!event.short_desc && (
              <Text
                style={[styles.description, { color: mutedColor }]}
                numberOfLines={2}
                maxFontSizeMultiplier={1.2}
              >
                {event.short_desc}
              </Text>
            )}

            <View style={styles.detailRow}>
              <Text style={[styles.detailText, { color: mutedColor }]}>
                {[event.location_category, event.registration_type]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </View>

            {event.tags?.length > 0 && (
              <View style={styles.tagsContainer}>
                {event.tags.slice(0, 3).map((tag, tagIndex) => (
                  <View
                    key={tag + tagIndex}
                    style={[styles.tag, { backgroundColor: pillBg }]}
                  >
                    <Text style={[styles.tagText, { color: textColor }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
});
