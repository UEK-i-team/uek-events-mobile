import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { styles } from "./event-details.styles";
import { useContext } from "react";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { RoundedButton } from "@/shared/components/rounded-button/rounded-button";
import HeartOutlineIcon from "@/assets/icons/heart-icon-outline.svg";
import HeartFilledIcon from "@/assets/icons/heart-icon-filled.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import ScheduleIcon from "@/assets/icons/schedule.svg";
import ArrowBackIcon from "@/assets/icons/arrow-left-300.svg";
import ShareIcon from "@/assets/icons/share-300.svg";
import LocationIcon from "@/assets/icons/location.svg";
import PersonIcon from "@/assets/icons/person-200.svg";
import { theme } from "@/shared/constants/theme";
import { InfoRow } from "@/features/event-details/components/info-row/info-row";
import {
  formatEventTime,
  formatShareEventDate,
  formatEventDateWithMonth,
  isEventPassed,
} from "@/utils/functions/date-utils";

export interface EventDetailsViewProps {
  eventId: string;
}

export const EventDetailsView = ({ eventId }: EventDetailsViewProps) => {
  const router = useRouter();
  const { getEventById, toggleFavoriteEvent } = useContext(EventContext);

  const event = getEventById(Number(eventId));

  if (!event) {
    return <Text>Event not found</Text>;
  }

  const colorsArray = ["#B4DEFF", "#FAE5FF", "#C3F2EC"];
  const passedTagColor = "#BDBDBD";
  const eventHasPassed = isEventPassed(event.end_date, event.start_date);

  const startDateFormatted = formatEventDateWithMonth(event.start_date);
  const startTimeFormatted = formatEventTime(event.start_date);

  const onShare = async () => {
    try {
      const formattedDate = formatShareEventDate(event.start_date);
      const formattedTime = formatEventTime(event.start_date);
      const categoryText = event.event_category ? `**${event.event_category.toLowerCase()}**` : 'wydarzenie';
      
      const messageTemplate = `Hej! ${formattedDate} o ${formattedTime} odbędzie się wydarzenie ${categoryText}\n${event.title}\n\n👥 Organizowane przez ${event.organisators}\nTu są szczegóły\n${event.origin_url}\n\n📍 Gdzie: ${event.location}`;

      await Share.share({
        message: messageTemplate,
        url: event.origin_url,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <View style={[styles.imageWrapper, eventHasPassed && styles.passedImage]}>
            <Image
              source={{ uri: event.image_url }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="disk"
              transition={200}
            />
            {eventHasPassed && (
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
          <View style={styles.positionButtons}>
            <RoundedButton
              icon={ShareIcon}
              backgroundColor={theme.light.primary}
              onPress={onShare}
            />
            <RoundedButton
              icon={event.isFavorite ? HeartFilledIcon : HeartOutlineIcon}
              iconColor={
                event.isFavorite
                  ? theme.light.red_regular
                  : theme.light.dark_grey
              }
              backgroundColor={
                event.isFavorite ? theme.light.red_light : "white"
              }
              size="medium"
              onPress={() => toggleFavoriteEvent(event.id, !event.isFavorite)}
              style={
                event.isFavorite
                  ? {
                      borderColor: theme.light.red_regular,
                      borderWidth: 1,
                    }
                  : {
                      borderColor: theme.light.mainBackground,
                      borderWidth: 1,
                    }
              }
            />
          </View>
          <View style={styles.positionBackButton}>
            <RoundedButton
              icon={ArrowBackIcon}
              size={"small"}
              backgroundColor={theme.light.mainBackground}
              onPress={() => router.back()}
            />
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.shortDesc}>{event.short_desc}</Text>
          <View style={styles.dateAndTimeRowContainer}>
            <InfoRow icon={CalendarIcon} text={startDateFormatted} />
            <InfoRow icon={ScheduleIcon} text={startTimeFormatted} />
          </View>
          <View style={styles.locationRowContainerAndOrganizerRowContainer}>
            <InfoRow icon={LocationIcon} text={event.location} />
          </View>
          <View style={styles.locationRowContainerAndOrganizerRowContainer}>
            <InfoRow
              icon={PersonIcon}
              text={event.organisators}
              label="Organizator"
            />
          </View>

          <Text style={styles.sectionTitle}>Tematy</Text>

          <View style={styles.bulletListContainer}>
            {event.topics.map((topic, index) => (
              <View style={styles.bulletListItem} key={index}>
                <View style={styles.bulletPoint} />
                <Text style={styles.bulletText}>{topic}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.tagsContainer, { marginTop: 30 }]}>
            <View
              style={[
                styles.tagChip,
                {
                  backgroundColor: eventHasPassed
                    ? passedTagColor
                    : theme.light.dark_grey,
                },
              ]}
            >
              <Text
                style={[
                  styles.tagChipText,
                  {
                    color: eventHasPassed
                      ? theme.light.dark_grey
                      : theme.light.ligth_grey,
                  },
                ]}
              >
                {event.event_type}
              </Text>
            </View>
          </View>
          <View style={[styles.tagsContainer, { marginTop: 14 }]}>
            {event.tags.map((tag, index) => (
              <View
                style={[
                  styles.tagChip,
                  {
                    backgroundColor: eventHasPassed
                      ? passedTagColor
                      : colorsArray[index % colorsArray.length],
                  },
                ]}
                key={index}
              >
                <Text
                  style={[styles.tagChipText, { color: theme.light.dark_grey }]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.stickyBottomContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => Linking.openURL(event.origin_url)}
        >
          <Text style={styles.actionButtonText}>
            Zobacz szczegóły wydarzenia
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
