import FavoriteIcon from "@/assets/icons/favorite.svg";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

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
            source={{
              uri: "https://bg.uek.krakow.pl//sites/default/files/default_images/szkolenie.jpg",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <RoundedButton
            icon={FavoriteIcon}
            iconColor={event.isFavorite ? "white" : theme.light.dark_grey}
            backgroundColor={event.isFavorite ? "red" : "white"}
            size="medium"
            onPress={handleFavoritePress}
            style={{ position: "absolute", bottom: -30, right: 16 }}
          />
        </View>
        <View style={styles.infoContainer}>
          <DateAndTime dateISO={event.start_date} style={{ marginTop: 22 }} />
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.short_desc}</Text>
          <Location
            locationCategory={event.location_category}
            registrationType={event.registration_type}
            style={{ marginTop: 18 }}
          />
          <Badge
            name={event.event_category}
            color={theme.light.dark_grey}
            style={{ marginTop: 18 }}
          />
          <View style={styles.tagsContainer}>
            {event.tags.map((tag, index) => (
              <Badge
                key={tag}
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
