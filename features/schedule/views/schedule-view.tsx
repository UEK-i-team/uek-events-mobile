import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./schedule-view.styles";
import { TimelineScroller } from "@/features/home/components/timeline-scroller/timeline-scroller";
import { ClassCard } from "../components/class-card/class-card";
import { BreakDivider } from "../components/break-divider/break-divider";
import { IEvent } from "@/shared/types/event";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export const ScheduleView = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  // Create a mock date for "Poniedziałek, 24 gru" as requested in the design
  // We'll use the current year, month 11 (December), day 24
  const mockSelectedDate = new Date(new Date().getFullYear(), 11, 24);
  const [selectedDate, setSelectedDate] = useState<Date>(mockSelectedDate);

  // Format date like "Poniedziałek, 24 gru"
  const formattedDate = format(selectedDate, "EEEE, d MMM", { locale: pl });
  // capitalize first letter
  const capitalizedFormattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const mockEvents: IEvent[] = [
    {
      id: 1,
      update_date: new Date().toISOString(),
      start_date: mockSelectedDate.toISOString(),
      end_date: mockSelectedDate.toISOString(),
      title: "Mock",
      short_desc: "",
      topics: [],
      event_type: "",
      location_category: "",
      location: "",
      organisators_category: "",
      organisators: "",
      tags: [],
      image_url: "",
      origin_url: "",
      registration_type: "",
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TimelineScroller
        events={mockEvents}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        visibleEventId={null}
      />
      
      <Text style={styles.headerText}>{capitalizedFormattedDate}</Text>

      <ScrollView contentContainerStyle={styles.listContent}>
        <ClassCard
          timeRange="8:00-9:30"
          room="Sala F 615"
          title="Oszustwa podatkowe"
          type="Wykład"
          professor="Prof. UEK Mariusz Grabowski"
          borderColor="#00D2D3" // Cyan
          roomDotColor="#00D2D3"
        />
        <BreakDivider durationText="Przerwa 15 min" />
        <ClassCard
          timeRange="9:45-11:15"
          room="Sala B 015"
          title="Analiza gospodarcza i marketing rynkowy"
          type="Ćwiczenia"
          professor="Prof. UEK Mariusz Grabowski"
          borderColor="#FDCB6E" // Yellow
          roomDotColor="#FDCB6E"
        />
        <BreakDivider durationText="Przerwa 2 h" />
      </ScrollView>
    </SafeAreaView>
  );
};
