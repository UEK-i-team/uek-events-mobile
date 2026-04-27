import FavoriteIcon from "@/assets/icons/favorite.svg";
import FavoriteIconFilled from "@/assets/icons/heart-icon-filled.svg";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { useResizeDominantBackgroundColor } from "../../hooks/use-resize-dominant-background-color";
import { RoundedButton } from "@/shared/components/rounded-button/rounded-button";
import { IEvent } from "@/shared/types/event";


import { theme } from "@/shared/constants/theme";
import { isEventPassed } from "@/utils/functions/date-utils";
import { Badge } from "../badge/badge";
import { DateAndTime } from "../date-and-time/date-and-time";
import { Location } from "../location/location";
import { styles } from "./event-card.styles";

import { RoundedButton } from "@/shared/components/rounded-button/rounded-button";
import { EventImageContainer } from "@/shared/components/event-image-container/event-image-container";
import { theme } from "@/shared/constants/theme";
import { IEvent } from "@/shared/types/event";

interface EventCardProps {
  event: IEvent;
  cardHeight: number;
  toggleFavorite: (eventId: number, isFavorite: boolean) => void;
}

const TAG_COLORS = ["#B4DEFF", "#FAE5FF", "#C3F2EC"];
const TAG_COLORS_PAST_EVENTS = ["#BDBDBD"];

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


  const eventHasPassed = isEventPassed(event.end_date);
  let imageHeight = 0;

  if(isVerySmallScreen){
    imageHeight = 180;
  } else if(cardHeight > 560){
    imageHeight = Math.max(160, Math.min(220, cardHeight * 0.40));
  } else {
    imageHeight = Math.max(160, Math.min(220, cardHeight * 0.32));
  }



  const eventHasPassed = isEventPassed(event.end_date);
  let imageHeight = 0;

  if(isVerySmallScreen){
    imageHeight = 180;
  } else if(cardHeight > 560){
    imageHeight = Math.max(160, Math.min(220, cardHeight * 0.40));
  } else {
    imageHeight = Math.max(160, Math.min(220, cardHeight * 0.32));
  }

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
          },
        ]}
      >
        <View style={{ position: 'relative' }}>
          <EventImageContainer
            imageUrl={imageUrl}
            width={SCREEN_WIDTH - 28}
            height={imageHeight}
            extractedColor={dominantColor}
            customWidth={SCREEN_WIDTH - 28}
            cornerRadius={16}
          />
        <View
          style={[styles.imageContainer, { height: imageHeight }]}
        >
          
          <View>
            <Image
              source={{ uri: event.image_url }}
              style={[styles.image, eventHasPassed && styles.passedImage]}
              contentFit="cover"
              cachePolicy="disk"
              transition={200}
            />
            {eventHasPassed && (
              // <View
              //   style={styles.passedOverlay}
              // />
              <>
                <View style={styles.passedOverlayGray} />
                <View style={styles.passedOverlayDark} />
              </>
            )}
          </View>
          {eventHasPassed && (
            <View style={styles.passedEventMarker}>
              <Text style={styles.passedText}>Wydarzenie zakończone</Text>
            </View>
          )}
        
          <RoundedButton
            icon={event.isFavorite ? FavoriteIconFilled : FavoriteIcon}
            iconColor={
              event.isFavorite ? theme.light.red_regular : theme.light.dark_grey
            }
            backgroundColor={event.isFavorite ? theme.light.red_light : "white"}
            size="medium"
            onPress={handleFavoritePress}
            style={{
              position: "absolute",
              bottom: -16,
              right: 16,
              borderColor: event.isFavorite
                ? theme.light.red_regular
                : theme.light.mainBackground,
              borderWidth: 1,
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          <DateAndTime dateISO={event.start_date} style={{ marginTop: 22 }} />
          <Text
            style={[
              styles.title,
              isSmallScreen && { fontSize: 24, marginTop: 4 },
            ]}
            maxFontSizeMultiplier={1.2}
          >
            {event.title}
          </Text>
          {/* Ukrywamy opis lub zmniejszamy ilość linii na bardzo małych oknach */}
          {!isVerySmallScreen && (
            <Text
              style={[
                styles.description,
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
          <Badge
            key={event.event_type}
            name={event.event_type}
            color={theme.light.dark_grey}
            style={{ marginTop: 18 }}
          />
          <View style={styles.tagsContainer}>
            {event.tags.map((tag, index) => (
              <Badge
                key={tag + index}
                name={tag}
                color={eventHasPassed ? TAG_COLORS_PAST_EVENTS[0] : (TAG_COLORS[index % TAG_COLORS.length] || TAG_COLORS[0])}
                textColor={theme.light.dark_grey}
                
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});
