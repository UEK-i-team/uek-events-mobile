import FavoriteIcon from "@/assets/icons/favorite.svg";
import { getColors } from "react-native-image-colors";
import FavoriteIconFilled from "@/assets/icons/heart-icon-filled.svg";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";

import { RoundedButton } from "@/shared/components/rounded-button/rounded-button";
import { IEvent } from "@/shared/types/event";
import { useRouter } from "expo-router";

import { theme } from "@/shared/constants/theme";
import { Badge } from "../badge/badge";
import { DateAndTime } from "../date-and-time/date-and-time";
import { Location } from "../location/location";
import { styles } from "./event-card.styles";

interface EventCardProps {
  event: IEvent;
  cardHeight: number;
  toggleFavorite: (eventId: string, isFavorite: boolean) => void;
}

const TAG_COLORS = ["#B4DEFF", "#FAE5FF", "#C3F2EC"];

export function EventCard({
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
  const [dominantColor, setDominantColor] = useState<string>(theme.light.mainBackground);
  const [resizeMode, setResizeMode] = useState<"contain" | "cover">("contain");

  const isSmallScreen =
    SCREEN_HEIGHT < 800 ||
    (SCREEN_HEIGHT < 900 && fontScale > 1.15) ||
    fontScale > 1.3;
  const isVerySmallScreen =
    SCREEN_HEIGHT < 750 ||
    (SCREEN_HEIGHT < 850 && fontScale > 1.3) ||
    fontScale > 1.4;

  // Extract date and image url
  const imageUrl = event.image_url || "https://bg.uek.krakow.pl//sites/default/files/default_images/szkolenie.jpg";

  useEffect(() => {
    if (imageUrl) {
      // Determine resize mode based on dimensions
      Image.getSize(
        imageUrl,
        (width, height) => {
          if (width <= height) {
            setResizeMode("cover");
          } else {
            setResizeMode("contain");
          }
        },
        (error) => console.warn("Failed to get image size:", error)
      );

      getColors(imageUrl, {
        fallback: theme.light.mainBackground,
        cache: true,
        key: imageUrl,
      })
        .then((colors) => {
          const color =
            (colors as any).background ||
            (colors as any).primary ||
            (colors as any).dominant ||
            theme.light.mainBackground;
          setDominantColor(color);
        })
        .catch((err) => {
          console.warn("Failed to extract color for card:", err);
        });
    }
  }, [imageUrl]);

  const handleCardPress = () => {
    router.push(`/event/${event.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(event.id, !event.isFavorite);
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
            width: SCREEN_WIDTH - 28,
            height: cardHeight - 32,
          },
        ]}
      >
        <View
          style={[styles.imageContainer, isVerySmallScreen && { height: 180 },{ backgroundColor: dominantColor }]}
        >
          <Image
            source={{
              uri: imageUrl,
            }}
            style={styles.image}
            contentFit={resizeMode}
            cachePolicy="disk"
            transition={200}
          />
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
              bottom: -30,
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
            key={event.event_category}
            name={event.event_category}
            color={theme.light.dark_grey}
            style={{ marginTop: 18 }}
          />
          <View style={styles.tagsContainer}>
            {event.tags.map((tag, index) => (
              <Badge
                key={tag + index}
                name={tag}
                color={TAG_COLORS[index] || TAG_COLORS[0]}
                textColor={theme.light.dark_grey}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
