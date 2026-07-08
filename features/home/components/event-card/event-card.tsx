import FavoriteIcon from "@/assets/icons/favorite.svg";
import FavoriteIconFilled from "@/assets/icons/heart-icon-filled.svg";
import { useRouter } from "expo-router";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { useResizeDominantBackgroundColor } from "../../hooks/use-resize-dominant-background-color";
import { RoundedButton } from "@/shared/components/rounded-button/rounded-button";
import { IEvent } from "@/shared/types/event";
import { getTagColor } from "@/shared/constants/theme";
import { isEventPassed, isMultiDayEvent } from "@/utils/functions/date-utils";
import { Badge } from "../badge/badge";
import { DateAndTime } from "../date-and-time/date-and-time";
import { Location } from "../location/location";
import { styles } from "./event-card.styles";
import { EventImageContainer } from "@/shared/components/event-image-container/event-image-container";
import { useTheme } from "@/shared/context/ThemeContext";


interface EventCardProps {
  event: IEvent;
  cardHeight: number;
  toggleFavorite: (eventId: number, isFavorite: boolean) => void;
}

const MAX_VISIBLE_TAGS = 4;

export const EventCard = React.memo(function EventCard({
  event,
  cardHeight,
  toggleFavorite,
}: EventCardProps) {
  const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    fontScale,
  } = useWindowDimensions();
  const router = useRouter();
  const { colors } = useTheme();

  // Extract date and image url
  const imageUrl =
    event.image_url ||
    "https://bg.uek.krakow.pl//sites/default/files/default_images/szkolenie.jpg";

  const { dominantColor, resizeMode } =
    useResizeDominantBackgroundColor(imageUrl);

  const isSmallScreen =
    SCREEN_HEIGHT < 800 ||
    (SCREEN_HEIGHT < 900 && fontScale > 1.15) ||
    fontScale > 1.3;
  const isVerySmallScreen =
    SCREEN_HEIGHT < 750 ||
    (SCREEN_HEIGHT < 850 && fontScale > 1.3) ||
    fontScale > 1.4;

  const handleCardPress = () => {
    router.push(`/event/${event.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(event.id, !event.isFavorite);
  };

  const eventHasPassed = isEventPassed(event.end_date, event.start_date);
  const isMultiDay = isMultiDayEvent(event.start_date, event.end_date);
  let imageHeight = 0;

  if(isVerySmallScreen){
    imageHeight = 180;
  } else if(cardHeight > 560){
    imageHeight = Math.max(160, Math.min(220, cardHeight * 0.40));
  } else {
    imageHeight = Math.max(160, Math.min(220, cardHeight * 0.32));
  }

  const imageWidth = SCREEN_WIDTH - 32;

  const visibleTags = (event.tags || []).slice(0, MAX_VISIBLE_TAGS);
  const remainingTagsCount = (event.tags || []).length - MAX_VISIBLE_TAGS;

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
            width: SCREEN_WIDTH,
            height: cardHeight,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <View style={[styles.image, eventHasPassed && styles.passedImage]}>
            <EventImageContainer
              imageUrl={imageUrl}
              width={imageWidth}
              height={imageHeight}
              extractedColor={dominantColor}
              customWidth={imageWidth}
              cornerRadius={30}
            />
            {eventHasPassed && (
              <>
                <View style={styles.passedOverlayGray} />
                <View style={styles.passedOverlayDark} />
              </>
            )}
          </View>
          {eventHasPassed ? (
            <View style={styles.passedEventMarker}>
              <Text style={styles.passedText}>Wydarzenie zakończone</Text>
            </View>
          ) : isMultiDay ? (
            <View style={styles.multiDayEventMarker}>
              <Text style={styles.passedText}>Wydarzenie wielodniowe</Text>
            </View>
          ) : null}

    <RoundedButton
         icon={event.isFavorite ? FavoriteIconFilled : FavoriteIcon}
         iconColor={
             event.isFavorite ? colors.red_regular : colors.dark_grey
             }
         backgroundColor={event.isFavorite ? colors.red_light : "white"}
         size="medium"
         onPress={handleFavoritePress}
            style={{
          position: "absolute",
         bottom: -16,
         right: 16,
         borderColor: event.isFavorite ? colors.red_regular : "#E1DDD9",
         borderWidth: 1,
         borderStyle: "solid",
  }}
/>
        </View>
        <View style={styles.infoContainer}>
          <DateAndTime dateISO={event.start_date} style={{ marginTop: 22 }} />
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
              isSmallScreen && { fontSize: 24, marginTop: 4 },
            ]}
            maxFontSizeMultiplier={1.2}
          >
            {event.title}
          </Text>
          {!isVerySmallScreen && (
            <Text
              style={[
                styles.description,
                { color: colors.textPrimary },
                isSmallScreen && { fontSize: 16, marginTop: 4 },
              ]}
              numberOfLines={isVerySmallScreen ? 1 : 2}
              maxFontSizeMultiplier={1.2}
            >
              {event.short_desc}
            </Text>
          )}
          <Location
            locationCategory={event.location_category}
            registrationType={event.registration_type}
            style={{ marginTop: 18 }}
          />
          <View style={styles.tagsContainer}>
            {event.event_type && (
              <Badge
                key={event.event_type}
                name={event.event_type}
                color="#111111"
                textColor="#F4F3F2"
              />
            )}

            {visibleTags.map((tag, index) => (
              <Badge
                key={tag + index}
                name={tag}
                color={getTagColor(tag, eventHasPassed)}
                textColor="#111111"
              />
            ))}
            {remainingTagsCount > 0 && (
              <Badge
                key="remaining-count-badge"
                name={`+${remainingTagsCount}`}
                color="#EAEAEA"
                textColor="#111111"
                style={{ borderWidth: 1, borderColor: "#111111" }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

