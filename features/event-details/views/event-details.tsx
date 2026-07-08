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
import { InfoRow } from "@/features/event-details/components/info-row/info-row";
import { useTheme } from "@/shared/context/ThemeContext";
import { getTagColor } from "@/shared/constants/theme";
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
  const { colors, isDarkMode } = useTheme();

  const event = getEventById(Number(eventId));

  if (!event) {
    return <Text>Event not found</Text>;
  }

  const eventHasPassed = isEventPassed(event.end_date, event.start_date);

  const startDateFormatted = formatEventDateWithMonth(event.start_date);
  const startTimeFormatted = formatEventTime(event.start_date);

  const onShare = async () => {
    try {
      const formattedDate = formatShareEventDate(event.start_date);
      const formattedTime = formatEventTime(event.start_date);
      const categoryText = event.event_type ? `**${event.event_type.toLowerCase()}**` : 'wydarzenie';
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.mainBackground }]} edges={["top", "left", "right"]}>
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
              backgroundColor={colors.primary}
              onPress={onShare}
            />
            <RoundedButton
              icon={event.isFavorite ? HeartFilledIcon : HeartOutlineIcon}
              iconColor={event.isFavorite ? colors.red_regular : "#111111"}
              backgroundColor={event.isFavorite ? colors.red_light : "white"}
              size="medium"
              onPress={() => toggleFavoriteEvent(event.id, !event.isFavorite)}
              style={{
                borderColor: event.isFavorite ? colors.red_regular : "#E1DDD9",
                borderWidth: 1,
              }}
            />
          </View>
          <View style={styles.positionBackButton}>
            <RoundedButton
              icon={ArrowBackIcon}
              size={"small"}
              iconColor={isDarkMode ? colors.textPrimary : colors.dark_grey}
              backgroundColor={colors.surface}
              onPress={() => router.back()}
            />
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{event.title}</Text>
          <Text style={[styles.shortDesc, { color: colors.textPrimary }]}>{event.short_desc}</Text>
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

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Tematy</Text>

          <View style={styles.bulletListContainer}>
            {event.topics.map((topic, index) => (
              <View style={styles.bulletListItem} key={index}>
                <View style={[styles.bulletPoint, { backgroundColor: colors.textPrimary }]} />
                <Text style={[styles.bulletText, { color: colors.textPrimary }]}>{topic}</Text>
              </View>
            ))}
          </View>

           <View style={styles.tagsContainer}>
            {event.event_type && (
              <View style={[styles.tagChip, { backgroundColor: "#111111" }]}>
                <Text style={[styles.tagChipText, { color: "#F4F3F2" }]}>
                  {event.event_type}
                </Text>
              </View>
            )}

            {event.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tagChip,
                  {
                    backgroundColor: getTagColor(tag, eventHasPassed),
                  },
                ]}
              >
                <Text style={[styles.tagChipText, { color: "#111111" }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.stickyBottomContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={() => Linking.openURL(event.origin_url)}
        >
          <Text style={[styles.actionButtonText, { color: colors.dark_grey }]}>
            Zobacz szczegóły wydarzenia
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
