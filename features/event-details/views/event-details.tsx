import { Image, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./event-details.styles";
import { useContext } from "react";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { RoundedButton } from "@/shared/components/rounded-button/rounded-button";
import HeartIcon from "@/assets/icons/heart-icon-filled.svg";
import HeartOutlineIcon from "@/assets/icons/heart-icon-outline.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import ScheduleIcon from "@/assets/icons/schedule.svg";
import { theme } from "@/shared/constants/theme";
import { InfoRow } from "@/features/event-details/components/info-row/info-row";

export interface EventDetailsViewProps {
  eventId: string;
}

export const EventDetailsView = ({ eventId }: EventDetailsViewProps) => {
  const { getEventById } = useContext(EventContext);

  const event = getEventById(eventId);

  if (!event) {
    return <Text>Event not found</Text>;
  }

  const dateObj = new Date(event.start_date);
  const monthsPolish = [
    "Stycznia",
    "Lutego",
    "Marca",
    "Kwietnia",
    "Maja",
    "Czerwca",
    "Lipca",
    "Sierpnia",
    "Września",
    "Października",
    "Listopada",
    "Grudnia",
  ];

  const colorsArray = ["#B4DEFF", "#FAE5FF", "#C3F2EC"];

  const day = dateObj.getDate();
  const month = monthsPolish[dateObj.getMonth()];
  const startDateFormatted = `${day} ${month}`;

  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const startTimeFormatted = `${hours}:${minutes}`;

  console.log(event);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://bg.uek.krakow.pl//sites/default/files/default_images/szkolenie.jpg",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.positionButtons}>
            {/* zmienić ikone na share */}
            <RoundedButton
              icon={HeartIcon}
              backgroundColor={theme.light.primary}
            />
            {/* zmienić grubośc ikony na grubszą */}
            <RoundedButton icon={HeartOutlineIcon} />
          </View>
          <View style={styles.positionBackButton}>
            <RoundedButton
              icon={HeartOutlineIcon}
              backgroundColor={theme.light.mainBackground}
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
            <InfoRow icon={ScheduleIcon} text={event.location} />
          </View>
          <View style={styles.locationRowContainerAndOrganizerRowContainer}>
            <InfoRow icon={ScheduleIcon} text={event.organisators} />
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
                { backgroundColor: theme.light.dark_grey },
              ]}
            >
              <Text
                style={[styles.tagChipText, { color: theme.light.ligth_grey }]}
              >
                {event.event_category}
              </Text>
            </View>
          </View>
          <View style={[styles.tagsContainer, { marginTop: 14 }]}>
            {event.tags.map((tag, index) => (
              <View
                style={[
                  styles.tagChip,
                  { backgroundColor: colorsArray[index % colorsArray.length] },
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
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>
            Zobacz szczegóły wydarzenia
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
