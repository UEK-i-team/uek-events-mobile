import {
  formatMonthPL,
  isSameDay,
  resetTime,
} from "@/utils/functions/date-utils";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { IEvent } from "@/shared/types/event";
import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  useColorScheme,
  useWindowDimensions,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { styles } from "./timeline-scroller.styles";
import { useTheme } from "@/shared/context/ThemeContext";

const getCurrentDate = () => new Date();

export interface DateItem {
  date: Date;
  events: IEvent[]; // Added to determine the number of dots
}

interface TimelineScrollerProps {
  events: IEvent[] | null;
  selectedDate: Date | null | undefined;
  onDateSelect: (date: Date) => void;
  visibleEventId: number | null; // Added to highlight the active dot
}

interface DayProps {
  setSelectedDate: (date: Date) => void;
  item: DateItem;
  isDaySelected: boolean;
  itemWidth: number;
  visibleEventId: number | null;
  isDark: boolean;
  colors: any;
}

const getDotConfig = (events: IEvent[], visibleId: number | null) => {
  if (events.length <= 3) {
    // Show one dot per event
    return events.map((e) => ({
      key: e.id,
      isActive: e.id === visibleId,
      type: "single" as const,
    }));
  } else {
    // Show max 3 dots for grouped events
    const visibleIndex = events.findIndex((e) => e.id === visibleId);

    // If visibleId is not found in this day's events, all dots are inactive
    if (visibleIndex === -1) {
      return [
        { key: "first", isActive: false, type: "grouped" as const },
        { key: "middle", isActive: false, type: "grouped" as const },
        { key: "last", isActive: false, type: "grouped" as const },
      ];
    }

    const isFirst = visibleIndex === 0;
    const isLast = visibleIndex === events.length - 1;
    const isMiddle = !isFirst && !isLast;

    return [
      { key: "first", isActive: isFirst, type: "grouped" as const },
      { key: "middle", isActive: isMiddle, type: "grouped" as const },
      { key: "last", isActive: isLast, type: "grouped" as const },
    ];
  }
};

const Day = memo(function Day({
  setSelectedDate,
  item,
  isDaySelected,
  itemWidth,
  visibleEventId,
  isDark,
  colors
}: DayProps) {
  const dayNumber = item.date.getDate();
  const hasEvents = item.events.length > 0;

  const handlePress = useCallback(() => {
    setSelectedDate(item.date);
  }, [setSelectedDate, item.date]);

  if (!hasEvents) {
    // Small greyed out version for dates with no events
    return (
      <View style={[styles.dayContainer, { width: itemWidth }]}>
        <View style={styles.dateBoxEmpty}>
          <ThemedText
            style={[
              isDark ? styles.dayTextEmptyDark : styles.dayTextEmptyLight, 
              { color: isDark ? colors.textPrimary : colors.textSecondary }
            ]}
          >
            {dayNumber}
          </ThemedText>
        </View>
      </View>
    );
  }

  const dotConfig = getDotConfig(item.events, visibleEventId);

  return (
    <Pressable
      style={[styles.dayContainer, { width: itemWidth }]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.dateBox,
          isDaySelected
            ? [styles.dateBoxActive, { backgroundColor: colors.primary }]
            : [isDark ? styles.dateBoxInactiveDark : styles.dateBoxInactiveLight],
        ]}
      >
        <ThemedText
          style={[
            styles.dayText,
            isDaySelected
              ? { color: colors.dark_grey }
              : { color: colors.dark_grey },
          ]}
        >
          {dayNumber}
        </ThemedText>
      </View>
      <View style={styles.dotsContainer}>
        {dotConfig.map((dot) => (
          <View
            key={dot.key}
            style={[
              styles.dot,
              dot.isActive
                ? [styles.dotActive, { backgroundColor: colors.primary }]
                : { backgroundColor: colors.textSecondary },
              dot.isActive && styles.dotActiveWide,
            ]}
          />
        ))}
      </View>
    </Pressable>
  );
});

export function TimelineScroller({
  events,
  selectedDate,
  onDateSelect,
  visibleEventId,
}: TimelineScrollerProps) {
  const { fontScale, width: windowWidth } = useWindowDimensions();
  const { isDarkMode, colors } = useTheme();
  const scrollRef = useRef<FlatList>(null);

  // State to track the currently most visible month in the scroll view
  const [visibleMonthDate, setVisibleMonthDate] = useState<Date | null>(
    selectedDate || null,
  );

  const ITEM_WIDTH_PX = useMemo(
    () =>
      STYLE_VALUES.ITEM_WIDTH_BASE * fontScale + STYLE_VALUES.ITEM_WIDTH_OFFSET,
    [fontScale],
  );

  const datesDays = useMemo(() => {
    if (!events) return [];

    const eventsByDate = new Map<number, IEvent[]>();

    // Group events by their reset timestamp (O(N) lookup later)
    events.forEach((event) => {
      const time = resetTime(event.start_date).getTime();

      if (!eventsByDate.has(time)) {
        eventsByDate.set(time, []);
      }
      eventsByDate.get(time)?.push(event);
    });

    const todayTime = resetTime(getCurrentDate()).getTime();

    if (eventsByDate.size === 0) {
      // No events at all, just return today
      return [
        {
          date: new Date(todayTime),
          events: [],
        } as DateItem,
      ];
    }

    const sortedTimes = Array.from(eventsByDate.keys()).sort((a, b) => a - b);

    // Start date is earliest event or today
    const earliestEventTime = sortedTimes[0];
    const startTime = Math.min(earliestEventTime, todayTime);

    // End date is furthest event or today
    const latestEventTime = sortedTimes[sortedTimes.length - 1];
    let endTime = Math.max(latestEventTime, todayTime);

    // Safety cap: Never generate more than 365 days between start and end
    // Approximate milliseconds for 365 days
    const maxTimeDifference = 365 * 24 * 60 * 60 * 1000;
    if (endTime - startTime > maxTimeDifference) {
      endTime = startTime + maxTimeDifference;
    }

    const continuousDays: DateItem[] = [];

    // Iterate through dates safely avoiding DayLight Savings shifts using native setDate
    let currentDate = new Date(startTime);

    while (currentDate.getTime() <= endTime) {
      const timeKey = currentDate.getTime();

      continuousDays.push({
        date: new Date(timeKey),
        events: eventsByDate.get(timeKey) || [],
      } as DateItem);

      // Advance by one day
      currentDate.setDate(currentDate.getDate() + 1);
      // Ensure no fractional hour bleed
      currentDate = resetTime(currentDate);
    }

    return continuousDays;
  }, [events]);

  const currentDateIndex = useMemo(() => {
    if (!selectedDate) {
      return datesDays.findIndex((d) => isSameDay(d.date, getCurrentDate()));
    }
    return datesDays.findIndex((d) => isSameDay(d.date, selectedDate));
  }, [selectedDate, datesDays]);

  const activeDate = datesDays[currentDateIndex]?.date;

  useEffect(() => {
    if (activeDate) {
      setVisibleMonthDate((prev) => {
        if (
          !prev ||
          prev.getMonth() !== activeDate.getMonth() ||
          prev.getFullYear() !== activeDate.getFullYear()
        ) {
          return new Date(activeDate);
        }
        return prev;
      });
    }
  }, [activeDate]);

  const hasScrolledInitial = useRef(false);

  // Auto-scroll when the active date changes (from scrolling the list)
  useEffect(() => {
    if (currentDateIndex >= 0 && scrollRef.current && datesDays.length > 0) {
      try {
        scrollRef.current.scrollToIndex({
          index: currentDateIndex,
          animated: hasScrolledInitial.current,
          viewPosition: 0.5,
        });
        hasScrolledInitial.current = true;
      } catch {
        // ignore
      }
    }
  }, [currentDateIndex, datesDays, scrollRef]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!datesDays || datesDays.length === 0) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const centerContentX = offsetX + windowWidth / 2 - 12;

    let index = Math.floor(centerContentX / ITEM_WIDTH_PX);
    if (index < 0) index = 0;
    if (index >= datesDays.length) index = datesDays.length - 1;

    const centerDate = datesDays[index]?.date;
    if (centerDate) {
      if (
        !visibleMonthDate ||
        centerDate.getMonth() !== visibleMonthDate.getMonth() ||
        centerDate.getFullYear() !== visibleMonthDate.getFullYear()
      ) {
        setVisibleMonthDate(new Date(centerDate));
      }
    }
  };

  const uniqueMonths = useMemo(() => {
    const months: {
      id: string;
      date: Date;
      label: string;
      startIndex: number;
      numDays: number;
    }[] = [];
    const seen = new Set<string>();

    if (!datesDays) return months;

    datesDays.forEach((d, index) => {
      const id = `${d.date.getFullYear()}-${d.date.getMonth()}`;
      if (!seen.has(id)) {
        seen.add(id);
        months.push({
          id,
          date: d.date,
          label: formatMonthPL(d.date),
          startIndex: index,
          numDays: 1,
        });
      } else {
        months[months.length - 1].numDays += 1;
      }
    });
    return months;
  }, [datesDays]);

  const activeMonthIndex = useMemo(() => {
    if (!visibleMonthDate) return 0;
    const id = `${visibleMonthDate.getFullYear()}-${visibleMonthDate.getMonth()}`;
    const idx = uniqueMonths.findIndex((m) => m.id === id);
    return Math.max(0, idx);
  }, [visibleMonthDate, uniqueMonths]);

  const scrollX = useRef(new Animated.Value(0)).current;

  if (!datesDays || !datesDays.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.monthStripWrapper}>
        <Animated.View
          style={[
            styles.monthStripAnimated,
            { transform: [{ translateX: Animated.multiply(scrollX, -1) }] },
          ]}
        >
          {uniqueMonths.map((m, index) => {
            const isMain = index === activeMonthIndex;
            const X_start = m.startIndex * ITEM_WIDTH_PX;
            const width = m.numDays * ITEM_WIDTH_PX;
            const maxTranslate = Math.max(0, width - 120); // Allow text up to 120px to stick before scrolling off

            const stickyTranslateX =
              maxTranslate > 0
                ? scrollX.interpolate({
                    inputRange: [X_start, X_start + maxTranslate],
                    outputRange: [0, maxTranslate],
                    extrapolate: "clamp",
                  })
                : 0;

            return (
              <View key={m.id} style={[styles.monthItem, { width }]}>
                <Animated.View
                  style={{ transform: [{ translateX: stickyTranslateX }] }}
                >
                  <ThemedText
                    style={[
                      styles.monthTextSide,
                      isMain && styles.monthTextActive,
                      { color: colors.textPrimary }
                    ]}
                  >
                    {m.label}
                  </ThemedText>
                </Animated.View>
              </View>
            );
          })}
        </Animated.View>
      </View>
      <Animated.FlatList
        ref={scrollRef as any} // Cast to avoid TS issues with Animated component wrapper
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true, listener: handleScroll },
        )}
        scrollEventThrottle={16}
        data={datesDays}
        horizontal
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 700));
          wait.then(() => {
            scrollRef.current?.scrollToIndex({
              index: info.index,
              animated: hasScrolledInitial.current,
              viewPosition: 0.5,
            });
          });
        }}
        getItemLayout={(data, index) => {
          return {
            length: ITEM_WIDTH_PX,
            offset: ITEM_WIDTH_PX * index,
            index,
          };
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isDaySelected = selectedDate
            ? isSameDay(item.date, selectedDate)
            : false;

          return (
            <Day
              item={item}
              setSelectedDate={onDateSelect}
              isDaySelected={isDaySelected}
              itemWidth={ITEM_WIDTH_PX}
              visibleEventId={visibleEventId}
              isDark={isDarkMode}
              colors={colors}
            />
          );
        }}
        keyExtractor={(item) => item.date.toISOString()}
        initialScrollIndex={currentDateIndex >= 0 ? currentDateIndex : 0}
      />
    </View>
  );
}

const STYLE_VALUES = {
  ITEM_WIDTH_BASE: 56, // Adjusted to fit the new design (48 width + 8 total margin horizontally approx)
  ITEM_WIDTH_OFFSET: 4,
};
