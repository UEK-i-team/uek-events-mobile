import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useEndSession } from "@/features/auth";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./schedule-view.styles";
import { TimelineScroller } from "@/features/home/components/timeline-scroller/timeline-scroller";
import { ClassCard } from "../components/class-card/class-card";
import { BreakDivider } from "../components/break-divider/break-divider";
import { IEvent } from "@/shared/types/event";
import { addDays, format, isToday, isTomorrow } from "date-fns";
import { pl } from "date-fns/locale";
import { TouchableOpacity } from "react-native";
import { useSchedule } from "../contexts/schedule-context";
import { GroupWizard } from "../components/group-wizard/group-wizard";
import {
  ClassDetailsSheet,
  ClassDetailsSheetRef,
} from "../components/class-details-sheet/class-details-sheet";
import { getScheduleClassColor, translateEventType } from "../utils/translate-event-type";
import { ScheduleEmptyState } from "../components/schedule-empty-state/schedule-empty-state";
import { FreeDayState } from "../components/free-day-state/free-day-state";
import { IScheduleEvent } from "@/shared/types/schedule";
import { useScheduleTabBehavior } from "../hooks/use-schedule-tab-behavior";
import { getDaySwipePull, getScrollEdges, resolveDaySwipe, ScrollEdges } from "../utils/day-swipe";
import { DaySwipeIndicator } from "../components/day-swipe-indicator/day-swipe-indicator";

// Like "Poniedziałek, 24 gru"
const formatDayTitle = (date: Date) => {
  const formatted = format(date, "EEEE, d MMM", { locale: pl });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const ScheduleView = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  // Initialize to the current device date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const returnToToday = useCallback(() => setSelectedDate(new Date()), []);
  useScheduleTabBehavior({ selectedDate, onReturnToToday: returnToToday });

  const capitalizedFormattedDate = formatDayTitle(selectedDate);
  const isSelectedToday = isToday(selectedDate);
  const relativeDayLabel = isSelectedToday ? "Dziś" : isTomorrow(selectedDate) ? "Jutro" : null;

  const {
    scheduleEvents,
    isLoading,
    lastUpdatedAt,
    fetchError,
    refreshSchedule,
    selectedGroupIds,
    isCacheHydrated,
  } = useSchedule();
  const { status, authSessionService } = useAuth();
  const { loggingOut, endSession } = useEndSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const classDetailsRef = useRef<ClassDetailsSheetRef>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffset = useSharedValue(0);
  const layoutHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const edgesAtDragStart = useSharedValue<ScrollEdges | null>(null);
  const daySwipePull = useSharedValue(0);

  const selectedDayKey = format(selectedDate, "yyyy-MM-dd");
  useLayoutEffect(() => {
    scrollOffset.value = 0;
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [selectedDayKey, scrollOffset]);

  // Android does not overscroll past the content, so the drag itself is
  // measured instead of the scroll offset.
  const daySwipeGesture = useMemo(() => {
    const changeDay = (direction: number) => setSelectedDate((date) => addDays(date, direction));

    const pan = Gesture.Pan()
      .activeOffsetY([-10, 10])
      .failOffsetX([-20, 20])
      .onBegin(() => {
        edgesAtDragStart.value = getScrollEdges(scrollOffset.value, layoutHeight.value, contentHeight.value);
      })
      .onUpdate((event) => {
        const edgesAtStart = edgesAtDragStart.value;
        daySwipePull.value = edgesAtStart ? getDaySwipePull(event.translationY, edgesAtStart) : 0;
      })
      .onEnd((event) => {
        const edgesAtStart = edgesAtDragStart.value;
        if (!edgesAtStart) return;
        const edgesAtEnd = getScrollEdges(scrollOffset.value, layoutHeight.value, contentHeight.value);
        const direction = resolveDaySwipe(event.translationY, edgesAtStart, edgesAtEnd);
        if (direction === 0) return;
        // Hidden at once so it never shows the label of the day after the new one.
        daySwipePull.value = 0;
        runOnJS(changeDay)(direction);
      })
      .onFinalize(() => {
        edgesAtDragStart.value = null;
        if (daySwipePull.value !== 0) daySwipePull.value = withTiming(0, { duration: 180 });
      });

    return Gesture.Simultaneous(pan, Gesture.Native());
  }, [contentHeight, daySwipePull, edgesAtDragStart, layoutHeight, scrollOffset]);

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

  // Relative to the real current time, not the selected day; a class that is
  // still in progress counts as the nearest one.
  const findNextClass = () => {
    const now = Date.now();
    let next: IScheduleEvent | null = null;

    for (const event of scheduleEvents) {
      if (new Date(event.end_time).getTime() <= now) continue;
      if (!next || new Date(event.start_time).getTime() < new Date(next.start_time).getTime()) {
        next = event;
      }
    }
    return next;
  };

  const isShowingStaleSchedule =
    status === "unverified" ||
    isRestoringSession ||
    (status === "authenticated" && fetchError);
  const isRefreshing = isLoading || isRestoringSession;
  const isRefreshDisabled =
    isRefreshing || loggingOut || (status !== "authenticated" && status !== "unverified");

  const handleRefresh = () => {
    // While unverified this only marks the toast as pending; the schedule is
    // fetched automatically once restore() confirms the session.
    void refreshSchedule({ notifyOnSuccess: true });
    if (status === "unverified") {
      setIsRestoringSession(true);
      void authSessionService.restore().finally(() => setIsRestoringSession(false));
    }
  };

  const staleScheduleMessage = lastUpdatedAt
    ? `Nie udało się odświeżyć planu. Wyświetlasz zapisaną wersję z ${format(lastUpdatedAt, "d MMM, HH:mm", { locale: pl })}.`
    : "Nie udało się odświeżyć planu. Wyświetlasz zapisaną wersję.";

  const groupWizard = (
    <GroupWizard
      visible={isModalVisible}
      onClose={() => setIsModalVisible(false)}
    />
  );

  if (isCacheHydrated && selectedGroupIds.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScheduleEmptyState onConfigure={() => setIsModalVisible(true)} />
        {groupWizard}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TimelineScroller
        events={scheduleEvents as any}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        visibleEventId={null}
        showWeekdays
      />
      
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerText} numberOfLines={1}>
            {capitalizedFormattedDate}
          </Text>
          {relativeDayLabel && (
            <View style={[styles.relativeDayBadge, isSelectedToday && styles.relativeDayBadgeToday]}>
              <Text
                style={[styles.relativeDayBadgeText, isSelectedToday && styles.relativeDayBadgeTextToday]}
              >
                {relativeDayLabel}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.refreshButton, isRefreshDisabled && !isRefreshing && styles.buttonDisabled]}
            onPress={handleRefresh}
            disabled={isRefreshDisabled}
            activeOpacity={0.7}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Odśwież plan"
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={colors.textPrimary} style={styles.refreshSpinner} />
            ) : (
              <Ionicons name="refresh" size={18} color={colors.textPrimary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.groupsButton}
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.8}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`Edytuj grupy, wybrano ${selectedGroupIds.length}`}
          >
            <Ionicons name="people" size={16} color="#FFFFFF" />
            <Text style={styles.groupsButtonCount}>{selectedGroupIds.length}</Text>
            <Ionicons name="chevron-down" size={14} color="#FFFFFF" style={styles.groupsButtonChevron} />
          </TouchableOpacity>
        </View>
      </View>

      {isShowingStaleSchedule && (
        <View style={styles.offlineBanner}>
          <View style={styles.offlineBannerRow}>
            <Ionicons name="cloud-offline-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.offlineBannerText}>{staleScheduleMessage}</Text>
            <TouchableOpacity
              style={styles.offlineBannerButton}
              onPress={handleRefresh}
              disabled={isRefreshing || loggingOut}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.offlineBannerButtonText}>Odśwież</Text>
              )}
            </TouchableOpacity>
          </View>
          {status === "unverified" && (
            <TouchableOpacity
              style={styles.offlineBannerSecondaryButton}
              onPress={() => void endSession()}
              disabled={isRefreshing || loggingOut}
            >
              {loggingOut ? (
                <ActivityIndicator size="small" color={colors.textSecondary} />
              ) : (
                <Text style={styles.offlineBannerSecondaryButtonText}>Zaloguj się na nowo</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.listWrapper}>
        <GestureDetector gesture={daySwipeGesture}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.listContent}
            onScroll={(e) => {
              scrollOffset.value = e.nativeEvent.contentOffset.y;
            }}
            onLayout={(e) => {
              layoutHeight.value = e.nativeEvent.layout.height;
            }}
            onContentSizeChange={(_, height) => {
              contentHeight.value = height;
            }}
            scrollEventThrottle={16}
            bounces={true}
            alwaysBounceVertical={true}
          >
            {dayEvents.length === 0 ? (
              <FreeDayState nextClass={findNextClass()} onJumpToClass={setSelectedDate} />
            ) : (
              dayEvents.map((event, index) => {
                const nextEvent = dayEvents[index + 1];
                const breakMinutes = nextEvent
                  ? Math.round(
                      (new Date(nextEvent.start_time).getTime() - new Date(event.end_time).getTime()) / 60_000,
                    )
                  : 0;
                const classColor = getScheduleClassColor(event.type);
            
                return (
                  <React.Fragment key={event.id}>
                    <ClassCard
                      timeRange={`${new Date(event.start_time).getHours()}:${new Date(event.start_time).getMinutes().toString().padStart(2, '0')}-${new Date(event.end_time).getHours()}:${new Date(event.end_time).getMinutes().toString().padStart(2, '0')}`}
                      room={event.room?.name || "Sala nieznana"}
                      title={event.course}
                      type={translateEventType(event.type)}
                      professor={event.teacher?.name || "Nieznany prowadzący"}
                      borderColor={classColor}
                      roomDotColor={classColor}
                      onPress={() => classDetailsRef.current?.open(event)}
                    />
                    {breakMinutes > 0 && <BreakDivider durationMinutes={breakMinutes} />}
                  </React.Fragment>
                );
              })
            )}
          </ScrollView>
        </GestureDetector>
        <DaySwipeIndicator
          pull={daySwipePull}
          direction="previous"
          targetLabel={formatDayTitle(addDays(selectedDate, -1))}
        />
        <DaySwipeIndicator
          pull={daySwipePull}
          direction="next"
          targetLabel={formatDayTitle(addDays(selectedDate, 1))}
        />
      </View>

      {groupWizard}

      <ClassDetailsSheet ref={classDetailsRef} />
    </SafeAreaView>
  );
};
