import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  useWindowDimensions,
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
  isMultiDayEvent,
} from "@/utils/functions/date-utils";

export interface EventDetailsViewProps {
  eventId: string;
}

export const EventDetailsView = ({ eventId }: EventDetailsViewProps) => {
  const router = useRouter();
  const { getEventById, toggleFavoriteEvent } = useContext(EventContext);
  const { colors, isDarkMode } = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
 
  const isTablet = SCREEN_WIDTH >= 768;
  const event = getEventById(Number(eventId));

  if (!event) {
    return <Text>Event not found</Text>;
  }

  const eventHasPassed = isEventPassed(event.end_date, event.start_date);
  const isMultiDay = isMultiDayEvent(event.start_date, event.end_date);

  const startDateFormatted = formatEventDateWithMonth(event.start_date);
  const startTimeFormatted = formatEventTime(event.start_date);
  const endDateFormatted = formatEventDateWithMonth(event.end_date);
  const endTimeFormatted = formatEventTime(event.end_date);

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
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && { paddingBottom: 160 } // Zwiększamy odstęp na dole, aby scroll nie zasłaniał przycisku
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <View
            style={[
              styles.imageWrapper,
              isTablet && { height: 320 }, // Powiększone zdjęcie na tablecie (320px)
              eventHasPassed && styles.passedImage
            ]}
          >
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
          {eventHasPassed ? (
            <View style={styles.passedEventMarker}>
              <Text style={styles.passedText}>Wydarzenie zakończone</Text>
            </View>
          ) : isMultiDay ? (
            <View style={styles.multiDayEventMarker}>
              <Text style={styles.passedText}>Wydarzenie wielodniowe</Text>
            </View>
          ) : null}
          <View style={styles.positionButtons}>
            <RoundedButton
              icon={ShareIcon}
              backgroundColor={colors.primary}
              onPress={onShare}
            />
            <RoundedButton
              icon={event.isFavorite ? HeartFilledIcon : HeartOutlineIcon}
              iconColor={event.isFavorite ? colors.red_regular : colors.dark_grey}
              backgroundColor={event.isFavorite ? colors.red_light : colors.red_ultra_light}
              size="medium"
              onPress={() => toggleFavoriteEvent(event.id, !event.isFavorite)}
              style={{
                borderColor: event.isFavorite ? colors.red_regular : "#CBC8C4",
                borderWidth: event.isFavorite ? 1 : 0.5,
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
        <View style={[styles.detailsContainer, isTablet && { maxWidth: 850, alignSelf: "center", width: "100%" }]}>
          <Text style={[styles.title, { color: colors.textPrimary }, isTablet && { fontSize: 32, marginTop: 24 }]}>
            {event.title}
          </Text>
          <Text style={[styles.shortDesc, { color: colors.textPrimary }, isTablet && { fontSize: 18, lineHeight: 26 }]}>
            {event.short_desc}
          </Text>
          {isMultiDay ? (
            <View style={styles.dateAndTimeColumnContainer}>
              <InfoRow
                icon={CalendarIcon}
                label="Rozpoczęcie"
                text={`${startDateFormatted}, ${startTimeFormatted}`}
              />
              <InfoRow
                icon={ScheduleIcon}
                label="Zakończenie"
                text={`${endDateFormatted}, ${endTimeFormatted}`}
              />
            </View>
          ) : (
            <View style={styles.dateAndTimeRowContainer}>
              <InfoRow icon={CalendarIcon} text={startDateFormatted} />
              <InfoRow icon={ScheduleIcon} text={startTimeFormatted} />
            </View>
          )}
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
                <Text style={[styles.bulletText, { color: colors.textPrimary }, isTablet && { fontSize: 18, lineHeight: 24 }]}>
                  {topic}
                </Text>
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

      <View style={[styles.stickyBottomContainer, isTablet && { bottom: 56, paddingHorizontal: 32 }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }, isTablet && { height: 60 }]}
          activeOpacity={0.8}
          onPress={() => Linking.openURL(event.origin_url)}
        >
          <Text style={[styles.actionButtonText, { color: colors.dark_grey }, isTablet && { fontSize: 20 }]}>
            Zobacz szczegóły wydarzenia
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
