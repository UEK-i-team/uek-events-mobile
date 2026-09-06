import { IEvent } from "@/shared/types/event";
import { useHomeLayout } from "./use-home-layout";
import { useEventListScroll } from "./use-event-list-scroll";
import { useHomeTabBehavior } from "./use-home-tab-behavior";

interface UseHomeScreenProps {
  events: IEvent[] | null | undefined;
}

/**
 * Orkiestrator strony głównej – składa trzy wyspecjalizowane hooki:
 * - useHomeLayout: matematyka layoutu + wysokość kontenera listy,
 * - useEventListScroll: mechanika listy i pamięć pozycji,
 * - useHomeTabBehavior: zachowania nawigacji/focusu (restore, „Wróć do dziś", tabbar).
 *
 * Widok korzysta tylko z tego hooka i pozostaje czysto prezentacyjny.
 */
export function useHomeScreen({ events }: UseHomeScreenProps) {
  const { headerHeight, cardHeight, containerHeight, setContainerHeight } =
    useHomeLayout();

  const scroll = useEventListScroll({ events, containerHeight });

  useHomeTabBehavior({
    events,
    containerHeight,
    actualSelectedDate: scroll.actualSelectedDate,
    nearestFutureEventIndex: scroll.nearestFutureEventIndex,
    goToEventIndex: scroll.goToEventIndex,
    restoreLastViewedEvent: scroll.restoreLastViewedEvent,
  });

  return {
    // layout
    headerHeight,
    cardHeight,
    containerHeight,
    setContainerHeight,
    // lista / pozycja
    flatListRef: scroll.flatListRef,
    selectedDate: scroll.actualSelectedDate,
    visibleEventId: scroll.visibleEventId,
    initialScrollIndex: scroll.initialScrollIndex,
    viewabilityConfig: scroll.viewabilityConfig,
    onViewableItemsChanged: scroll.onViewableItemsChanged,
    handleDateSelect: scroll.handleDateSelect,
  };
}
