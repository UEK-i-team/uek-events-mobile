import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useEndSession } from "@/features/auth";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./schedule-view.styles";
import { TimelineScroller } from "@/features/home/components/timeline-scroller/timeline-scroller";
import { ClassCard } from "../components/class-card/class-card";
import { BreakDivider } from "../components/break-divider/break-divider";
import { IEvent } from "@/shared/types/event";
import { format, isToday, isTomorrow } from "date-fns";
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
import { resolveDaySwipe } from "../utils/day-swipe";
import { findAdjacentClassDay, getClassDayStarts } from "../utils/class-days";

const DAY_SLIDE_DURATION = 180;
// Dragging toward a side without any classes left only gives in a little.
const NO_CLASS_DAY_RESISTANCE = 0.25;

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
  const { width: screenWidth } = useWindowDimensions();
  const dayOffsetX = useSharedValue(0);
  const incomingDirectionRef = useRef(0);

  const selectedDayKey = format(selectedDate, "yyyy-MM-dd");
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });

    const direction = incomingDirectionRef.current;
    if (direction === 0) return;
    incomingDirectionRef.current = 0;
    dayOffsetX.value = withSequence(
      withTiming(direction * screenWidth, { duration: 0 }),
      withTiming(0, { duration: DAY_SLIDE_DURATION }),
    );
    // Only a day change runs the slide-in; a new screen width alone must not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayKey]);

  // Swiping jumps over free days, so the gesture needs the class days around
  // the selected one on the UI thread and the latest ones on the JS thread.
  const classDayStarts = useMemo(() => getClassDayStarts(scheduleEvents), [scheduleEvents]);
  const classDayStartsRef = useRef(classDayStarts);
  const selectedDateRef = useRef(selectedDate);
  const hasPreviousClassDay = useSharedValue(false);
  const hasNextClassDay = useSharedValue(false);
  useEffect(() => {
    classDayStartsRef.current = classDayStarts;
    selectedDateRef.current = selectedDate;
    hasPreviousClassDay.value = findAdjacentClassDay(classDayStarts, selectedDate, -1) !== null;
    hasNextClassDay.value = findAdjacentClassDay(classDayStarts, selectedDate, 1) !== null;
  }, [classDayStarts, selectedDate, hasPreviousClassDay, hasNextClassDay]);

  const scrollGesture = useMemo(() => Gesture.Native(), []);
  const daySwipeGesture = useMemo(() => {
    const snapBack = () => {
      "worklet";
      dayOffsetX.value = withTiming(0, { duration: DAY_SLIDE_DURATION });
    };

    const changeDay = (direction: -1 | 1) => {
      const target = findAdjacentClassDay(classDayStartsRef.current, selectedDateRef.current, direction);
      if (!target) {
        snapBack();
        return;
      }
      incomingDirectionRef.current = direction;
      setSelectedDate(target);
    };

    return Gesture.Pan()
      .activeOffsetX([-15, 15])
      .failOffsetY([-10, 10])
      .simultaneousWithExternalGesture(scrollGesture)
      .onUpdate((event) => {
        const canMove = event.translationX < 0 ? hasNextClassDay.value : hasPreviousClassDay.value;
        dayOffsetX.value = canMove ? event.translationX : event.translationX * NO_CLASS_DAY_RESISTANCE;
      })
      .onEnd((event, success) => {
        const direction = success ? resolveDaySwipe(event.translationX, event.velocityX) : 0;
        const canMove =
          (direction === 1 && hasNextClassDay.value) || (direction === -1 && hasPreviousClassDay.value);
        if (direction === 0 || !canMove) {
          snapBack();
          return;
        }
        // The current day leaves on the side the finger went; the new one comes from the other.
        dayOffsetX.value = withTiming(-direction * screenWidth, { duration: DAY_SLIDE_DURATION }, (finished) => {
          if (finished) runOnJS(changeDay)(direction);
        });
      });
  }, [dayOffsetX, hasNextClassDay, hasPreviousClassDay, screenWidth, scrollGesture]);

  const daySlideStyle = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(dayOffsetX.value), [0, screenWidth], [1, 0.3], Extrapolation.CLAMP),
    transform: [{ translateX: dayOffsetX.value }],
  }));

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

      {/* The pan listens on a static view: measured on the sliding one, the
          finger position would shift together with the content. */}
      <GestureDetector gesture={daySwipeGesture}>
        <View style={styles.listWrapper}>
          <Animated.View style={[styles.listWrapper, daySlideStyle]}>
            <GestureDetector gesture={scrollGesture}>
              <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.listContent}
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
          </Animated.View>
        </View>
      </GestureDetector>

      {groupWizard}

      <ClassDetailsSheet ref={classDetailsRef} />
    </SafeAreaView>
  );
};
