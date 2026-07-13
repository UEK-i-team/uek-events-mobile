import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import {
  FlatList,
  Platform,
  useWindowDimensions,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IEvent } from "@/shared/types/event";
import { isSameDay } from "@/utils/functions/date-utils";
import { safeParseDate, findNearestFutureEventIndex } from "@/utils/functions/event-utils";

interface UseHomeScreenProps {
  events: IEvent[] | null | undefined;
}

const HEADER_BASE_HEIGHT = 60;
const FILTERS_HEIGHT = 60;

/**
 * Hook zarządzający logiką strony głównej
 */
export function useHomeScreen({ events }: UseHomeScreenProps) {
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 49 : 5;
  const headerHeight =
    HEADER_BASE_HEIGHT +
    insets.top +
    insets.bottom +
    FILTERS_HEIGHT +
    TAB_BAR_HEIGHT;
  const cardHeight = SCREEN_HEIGHT - headerHeight;

  const [containerHeight, setContainerHeight] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    null,
  );
  const [visibleEventId, setVisibleEventId] = useState<number | null>(null);
  const [hasScrolledInitial, setHasScrolledInitial] = useState(false);

  const nearestFutureEventIndex = useMemo(
    () => findNearestFutureEventIndex(events),
    [events],
  );

  const initialScrollIndex = useMemo(() => {
    if (!events || events.length === 0) return 0;
    if (visibleEventId) {
      const idx = events.findIndex(e => e.id === visibleEventId);
      if (idx !== -1) return idx;
    }
    return nearestFutureEventIndex;
  }, [events, visibleEventId, nearestFutureEventIndex]);

  useEffect(() => {
    if (!events || events.length === 0) {
      setHasScrolledInitial(false);
    }
  }, [events]);

  useEffect(() => {
    if (
      events &&
      events.length > 0 &&
      containerHeight > 0 &&
      !hasScrolledInitial
    ) {
      setHasScrolledInitial(true);

      // Delay slightly to ensure layout has completely stabilized
      // before enforcing the perfectly aligned scroll offset.
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialScrollIndex,
          animated: false,
        });
      }, 150);
    }
  }, [
    events,
    containerHeight,
    hasScrolledInitial,
    initialScrollIndex,
    flatListRef,
  ]);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 200,
  }).current;

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);

      if (!events || !flatListRef.current) return;

      const index = events.findIndex((e) => isSameDay(e.start_date, date));

      if (index !== -1) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    },
    [events],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const visibleItem = viewableItems[0];
        const event = visibleItem.item as IEvent;

        if (event) {
          setVisibleEventId(event.id);
          if (event.start_date) {
            const date = safeParseDate(event.start_date);
            if (date) {
              setSelectedDate((prev) => {
                // Only update if date changed essentially (day level)
                if (!prev || !isSameDay(prev, date)) {
                  return date;
                }
                return prev;
              });
            }
          }
        }
      }
    },
    [],
  );

  return {
    flatListRef,
    cardHeight,
    headerHeight,
    containerHeight,
    setContainerHeight,
    selectedDate,
    visibleEventId,
    initialScrollIndex,
    nearestFutureEventIndex,
    handleDateSelect,
    viewabilityConfig,
    onViewableItemsChanged,
  };
}
