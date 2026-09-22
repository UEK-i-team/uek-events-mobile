import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./schedule-view.styles";
import { TimelineScroller } from "@/features/home/components/timeline-scroller/timeline-scroller";
import { ClassCard } from "../components/class-card/class-card";
import { BreakDivider } from "../components/break-divider/break-divider";
import { IEvent } from "@/shared/types/event";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { TouchableOpacity } from "react-native";
import { useSchedule } from "../contexts/schedule-context";
import { GroupWizard } from "../components/group-wizard/group-wizard";

const translateEventType = (type: string) => {
  const map: Record<string, string> = {
    'PHYSICAL_EDUCATION': 'Wychowanie fizyczne',
    'LECTURE': 'Wykład',
    'LABORATORY': 'Laboratorium',
    'PROJECT': 'Projekt',
    'SEMINAR': 'Seminarium',
    'EXERCISES': 'Ćwiczenia',
    'WORKSHOP': 'Warsztaty',
    'EXAM': 'Egzamin',
    'OTHER': 'Inne',
  };
  return map[type] || type;
};

export const ScheduleView = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  // Initialize to the current device date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Format date like "Poniedziałek, 24 gru"
  const formattedDate = format(selectedDate, "EEEE, d MMM", { locale: pl });
  // capitalize first letter
  const capitalizedFormattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const { scheduleEvents, getGroupName } = useSchedule();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState(0);

  // Filter and sort events for the selected date
  const dayEvents = scheduleEvents
    .filter(event => {
      const eventDate = new Date(event.start_time);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const handleScrollEndDrag = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const threshold = 50;
    
    // Calculate the maximum normal scroll position. If content is shorter than the screen, it's 0.
    const maxScroll = Math.max(0, contentSize.height - layoutMeasurement.height);

    if (contentOffset.y < -threshold) {
      // Pulled down at the top -> previous day
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setSelectedDate(prevDay);
    } else if (contentOffset.y > maxScroll + threshold) {
      // Pulled up at the bottom -> next day
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
    }
  };

  const handleTouchStart = (e: any) => {
    setTouchStartY(e.nativeEvent.pageY);
  };

  const handleTouchEnd = (e: any) => {
    if (touchStartY === null) return;
    const touchEndY = e.nativeEvent.pageY;
    const distance = touchEndY - touchStartY;
    const threshold = 50;

    // Only apply manual touch swipe if content is not scrollable
    if (!isScrollable) {
      if (distance > threshold) {
        // Pulled down -> previous day
        const prevDay = new Date(selectedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        setSelectedDate(prevDay);
      } else if (distance < -threshold) {
        // Pulled up -> next day
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setSelectedDate(nextDay);
      }
    }
    setTouchStartY(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TimelineScroller
        events={scheduleEvents as any}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        visibleEventId={null}
      />
      
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>{capitalizedFormattedDate}</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.listContent, !isScrollable && { flexGrow: 1 }]}
        onScrollEndDrag={handleScrollEndDrag}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(_, height) => setIsScrollable(height > layoutHeight)}
        scrollEventThrottle={16}
        bounces={true}
        alwaysBounceVertical={true}
      >
        {dayEvents.length === 0 ? (
          <Text style={{ textAlign: "center", color: colors.textSecondary, marginTop: 20 }}>
            Brak zajęć na ten dzień.
          </Text>
        ) : (
          dayEvents.map((event, index) => {
            const nextEvent = dayEvents[index + 1];
            const hasBreak = nextEvent && new Date(nextEvent.start_time).getTime() >= new Date(event.end_time).getTime();
            
            return (
              <React.Fragment key={event.id}>
                <ClassCard
                  timeRange={`${new Date(event.start_time).getHours()}:${new Date(event.start_time).getMinutes().toString().padStart(2, '0')}-${new Date(event.end_time).getHours()}:${new Date(event.end_time).getMinutes().toString().padStart(2, '0')}`}
                  room={event.room?.name || "Sala nieznana"}
                  title={event.course}
                  type={translateEventType(event.type)}
                  professor={event.teacher?.name || "Nieznany prowadzący"}
                  borderColor={event.borderColor || "#00D2D3"}
                  roomDotColor={event.roomDotColor || "#00D2D3"}
                />
                {hasBreak && (
                  <BreakDivider durationText="Przerwa" />
                )}
              </React.Fragment>
            );
          })
        )}
      </ScrollView>

      <GroupWizard 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
      />
    </SafeAreaView>
  );
};
