import FavoriteIcon from "@/assets/icons/favorite.svg";
import FavoriteIconFilled from "@/assets/icons/heart-icon-filled.svg";
import React from "react";
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
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const router = useRouter();

  // const { isViewed } = useViewedEvents();

  // const viewed = isViewed(event.id);

  // const cardBackgroundColor = "#FFFFFF";
  // const textColor = "#000000";
  // const secondaryTextColor = "#666666";
  // const iconColor = "#687076";

  // const getTagColor = (index: number) => {
  //   return TAG_COLORS[index % TAG_COLORS.length];
  // };

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
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.image_url }}
            style={styles.image}
            contentFit="cover"
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
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {event.short_desc}
          </Text>
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
