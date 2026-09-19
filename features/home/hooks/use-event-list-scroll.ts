import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { FlatList, ViewToken, ViewabilityConfig } from "react-native";
import { IEvent } from "@/shared/types/event";
import { isSameDay } from "@/utils/functions/date-utils";
import {
  safeParseDate,
  findNearestFutureEventIndex,
} from "@/utils/functions/event-utils";

interface UseEventListScrollProps {
  events: IEvent[] | null | undefined;
  containerHeight: number;
}

/**
 * Mechanika pionowej, stronicowanej listy eventów: pozycja startowa, programowe
 * przewijanie, śledzenie widocznego eventu oraz pamięć ostatnio oglądanej pozycji.
 *
 * Hook jest świadomie NIEzależny od nawigacji – zachowania związane z focusem/tabem
 * żyją w use-home-tab-behavior.
 */
export function useEventListScroll({
  events,
  containerHeight,
}: UseEventListScrollProps) {
  const flatListRef = useRef<FlatList>(null);
  // Flaga blokująca korektę pozycji z onViewableItemsChanged podczas programowego scrolla.
  const isProgrammaticScrollRef = useRef(false);

  // Ostatnio oglądana pozycja. Trzymana w ref (per-instancja ekranu), NIE w zmiennej
  // modułowej: dzięki temu pamięć przeżywa przełączanie zakładek (ekran nie jest
  // odmontowywany), ale zimny start aplikacji zawsze zaczyna od zera → najbliższy event.
  const lastViewedEventIdRef = useRef<number | null>(null);
  const lastViewedDateRef = useRef<Date | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    null,
  );
  const [visibleEventId, setVisibleEventId] = useState<number | null>(null);
  const [hasScrolledInitial, setHasScrolledInitial] = useState(false);

  const nearestFutureEventIndex = useMemo(
    () => findNearestFutureEventIndex(events),
    [events],
  );

  // Pozycja startowa listy MUSI być stabilna (najbliższy przyszły event).
  // Celowo NIE zależy od visibleEventId — inaczej powstaje pętla:
  // scroll → onViewableItemsChanged ustawia visibleEventId → initialScrollIndex
  // się zmienia → FlatList re-kotwiczy na inny index.
  const initialScrollIndex = useMemo(() => {
    if (!events || events.length === 0) return 0;
    return nearestFutureEventIndex;
  }, [events, nearestFutureEventIndex]);

  // Faktycznie zaznaczona data: wybrana przez użytkownika albo (fallback) data
  // najbliższego przyszłego eventu.
  const actualSelectedDate = useMemo(() => {
    if (selectedDate) return selectedDate;
    if (events && events.length > 0) {
      return safeParseDate(events[nearestFutureEventIndex]?.start_date);
    }
    return null;
  }, [selectedDate, events, nearestFutureEventIndex]);

  useEffect(() => {
    if (!events || events.length === 0) {
      setHasScrolledInitial(false);
    }
  }, [events]);

  // Jeśli po przeładowaniu listy zapamiętany event już nie istnieje,
  // czyścimy zapamiętaną pozycję, żeby oś czasu nie podświetlała nieistniejącego dnia.
  useEffect(() => {
    if (lastViewedEventIdRef.current === null) return;
    if (!events || !events.some((e) => e.id === lastViewedEventIdRef.current)) {
      lastViewedEventIdRef.current = null;
      lastViewedDateRef.current = null;
      setVisibleEventId(null);
      setSelectedDate(null);
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

      // Blokujemy onViewableItemsChanged na czas startowego osiadania listy,
      // żeby przejściowe klatki nie nadpisały visibleEventId/pozycji.
      isProgrammaticScrollRef.current = true;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialScrollIndex,
          animated: false,
        });
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 300);
      }, 150);
    }
  }, [events, containerHeight, hasScrolledInitial, initialScrollIndex]);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 0, // 0ms → reakcja po zatrzymaniu scrolla jest natychmiastowa
  }).current;

  // Jedno źródło prawdy dla programowego scrolla: przewija na konkretny indeks
  // i spójnie ustawia stan (data + widoczny event), blokując przy tym korektę
  // z onViewableItemsChanged na czas trwania animacji.
  const goToEventIndex = useCallback(
    (index: number) => {
      if (!events || !flatListRef.current) return;
      if (index < 0 || index >= events.length) return;

      const event = events[index];
      const date = safeParseDate(event.start_date);

      lastViewedEventIdRef.current = event.id;
      setVisibleEventId(event.id);
      if (date) {
        lastViewedDateRef.current = date;
        setSelectedDate(date);
      }

      isProgrammaticScrollRef.current = true;
      flatListRef.current.scrollToIndex({ index, animated: true });

      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 400);
    },
    [events],
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      // Natychmiast ustawiamy wybraną datę (również gdy danego dnia nie ma eventu)
      setSelectedDate(date);

      if (!events) return;

      const index = events.findIndex((e) => isSameDay(e.start_date, date));
      if (index !== -1) {
        goToEventIndex(index);
      }
    },
    [events, goToEventIndex],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Jeśli trwa automatyczne przewijanie, ignorujemy pośrednie karty.
      if (isProgrammaticScrollRef.current) return;

      if (viewableItems.length > 0) {
        const visibleItem = viewableItems[0];
        const event = visibleItem.item as IEvent;

        if (event) {
          lastViewedEventIdRef.current = event.id;
          setVisibleEventId(event.id);
          if (event.start_date) {
            const date = safeParseDate(event.start_date);
            if (date) {
              lastViewedDateRef.current = date;
              setSelectedDate((prev) => {
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

  const resetViewedPosition = useCallback(() => {
    lastViewedEventIdRef.current = null;
    lastViewedDateRef.current = null;
    setVisibleEventId(null);
    setSelectedDate(null);
  }, []);

  const restoreLastViewedEvent = useCallback(() => {
    if (!events || events.length === 0 || lastViewedEventIdRef.current === null)
      return;

    const index = events.findIndex(
      (event) => event.id === lastViewedEventIdRef.current,
    );
    if (index === -1) return;

    setVisibleEventId(lastViewedEventIdRef.current);
    flatListRef.current?.scrollToIndex({ index, animated: false });
  }, [events]);

  return {
    flatListRef,
    selectedDate,
    actualSelectedDate,
    visibleEventId,
    initialScrollIndex,
    nearestFutureEventIndex,
    viewabilityConfig,
    onViewableItemsChanged,
    goToEventIndex,
    handleDateSelect,
    resetViewedPosition,
    restoreLastViewedEvent,
  };
}
