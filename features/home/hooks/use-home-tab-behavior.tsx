import { useEffect, useRef } from "react";
import { useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

import ArrowLeftIcon from "@/assets/icons/arrow-left-200.svg";
import HomeIconFilled from "@/assets/icons/home-icon-filled.svg";
import HomeIconOutline from "@/assets/icons/home-icon-outline.svg";
import { SvgIcon } from "@/shared/components/svg-icon/svg-icon";
import { IEvent } from "@/shared/types/event";
import { isSameDay } from "@/utils/functions/date-utils";
import { safeParseDate } from "@/utils/functions/event-utils";

interface UseHomeTabBehaviorProps {
  events: IEvent[] | null | undefined;
  containerHeight: number;
  actualSelectedDate: Date | null | undefined;
  nearestFutureEventIndex: number;
  goToEventIndex: (index: number) => void;
  restoreLastViewedEvent: () => void;
}

/**
 * Zachowania strony głównej sterowane nawigacją/focusem:
 * - przywracanie ostatniej pozycji po powrocie na ekran (poza pierwszym wejściem),
 * - przycisk „Wróć do dziś" w tabbarze (ikona + label + akcja na tabPress).
 */
export function useHomeTabBehavior({
  events,
  containerHeight,
  actualSelectedDate,
  nearestFutureEventIndex,
  goToEventIndex,
  restoreLastViewedEvent,
}: UseHomeTabBehaviorProps) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const hasEvents = !!events && events.length > 0;
  const homeEventDate = hasEvents
    ? safeParseDate(events![nearestFutureEventIndex]?.start_date)
    : null;
  const firstEventDate = hasEvents
    ? safeParseDate(events![0].start_date)
    : null;

  const isTodaySelected =
    !actualSelectedDate || isSameDay(actualSelectedDate, new Date());
  const isHomeEventDay =
    actualSelectedDate && homeEventDate
      ? isSameDay(actualSelectedDate, homeEventDate)
      : false;
  const isFirstEventDay =
    actualSelectedDate && firstEventDate
      ? isSameDay(actualSelectedDate, firstEventDate)
      : false;

  const showReturnToToday =
    isFocused && !isTodaySelected && !isHomeEventDay && !isFirstEventDay;

  // Przywracanie pozycji po powrocie na ekran. Pierwsze wejście pomijamy —
  // start ma wylądować na najbliższym evencie (robi to efekt initial-scroll).
  const isFirstFocusRef = useRef(true);
  useEffect(() => {
    if (!isFocused || !events || events.length === 0 || containerHeight === 0) {
      return;
    }

    if (isFirstFocusRef.current) {
      isFirstFocusRef.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      restoreLastViewedEvent();
    }, 150);

    return () => clearTimeout(timeout);
  }, [containerHeight, events, isFocused, restoreLastViewedEvent]);

  // Kliknięcie w zakładkę, gdy jesteśmy daleko od dziś → wróć na najbliższy event.
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress" as never, () => {
      if (!showReturnToToday) return;

      const targetIndex =
        nearestFutureEventIndex >= 0 ? nearestFutureEventIndex : 0;
      goToEventIndex(targetIndex);
    });

    return unsubscribe;
  }, [goToEventIndex, navigation, nearestFutureEventIndex, showReturnToToday]);

  // Ikona i label zakładki zależne od tego, czy pokazujemy „Wróć do dziś".
  useEffect(() => {
    navigation.setOptions({
      tabBarLabel: showReturnToToday ? "Wróć do dziś" : "Strona główna",
      tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
        <SvgIcon
          Icon={
            showReturnToToday
              ? ArrowLeftIcon
              : focused
                ? HomeIconFilled
                : HomeIconOutline
          }
          size={24}
          color={color}
        />
      ),
    });
  }, [navigation, showReturnToToday]);

  return { showReturnToToday };
}
