import { isSameDay, resetTime } from "@/utils/functions/date-utils";
import { useHomeScreen } from "@/features/home/hooks/use-home-screen";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { useAppliedFilters } from "@/features/filters/contexts/filters-context";
import { IEvent } from "@/shared/types/event";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventCard } from "../components/event-card/event-card";
import { styles } from "./home-view.styles";
import { TimelineScroller } from "../components/timeline-scroller/timeline-scroller";

export default function HomeView() {
  const { flatListRef, headerHeight } = useHomeScreen();

  const { events, status, errorMessage, toggleFavoriteEvent } =
    useContext(EventContext);
  const { appliedCategories, appliedLocations, appliedTags } = useAppliedFilters();

  const containerRef = useRef<View>(null);

  const [height, setHeight] = useState(0);

  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    null,
  );
  const [visibleEventId, setVisibleEventId] = useState<number | null>(null);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 200,
  }).current;

  // Filtrowanie zadań za pomocą wyciągniętych filtrów
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter(event => {
      const matchCategory = appliedCategories.length === 0 || appliedCategories.includes(event.event_type);
      const matchLocation = appliedLocations.length === 0 || appliedLocations.includes(event.location_category);
      const matchTag = appliedTags.length === 0 || event.tags.some(tag => appliedTags.includes(tag));
      
      return matchCategory && matchLocation && matchTag;
    });
  }, [events, appliedCategories, appliedLocations, appliedTags]);

  const renderEventCard = ({ item }: { item: IEvent }) => {
    return (
      <EventCard
        event={item}
        cardHeight={height}
        toggleFavorite={toggleFavoriteEvent}
      />
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    if (!filteredEvents || !flatListRef.current) return;

    const index = filteredEvents.findIndex((e) =>
      isSameDay(e.start_date, date),
    );

    if (index !== -1) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const visibleItem = viewableItems[0];
        const event = visibleItem.item as IEvent;

        if (event) {
          setVisibleEventId(event.id);
          if (event.start_date) {
            const date = new Date(event.start_date);
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
    },
    [],
  );

  const renderTimelineScroller = () => {
    return (
      <TimelineScroller
        events={filteredEvents}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        visibleEventId={visibleEventId}
      />
    );
  };

  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#000000" />
      <ThemedText
        style={[styles.emptyText, { color: "#666666", marginTop: 16 }]}
      >
        Ładowanie wydarzeń...
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: "#d32f2f" }]}>
        Wystąpił błąd podczas ładowania wydarzeń
      </ThemedText>
      <ThemedText
        style={[
          styles.emptyText,
          { color: "#666666", marginTop: 8, fontSize: 14 },
        ]}
      >
        {errorMessage}
      </ThemedText>
    </View>
  );

  const renderEmptyState = () => {
    const message = "Brak dostępnych wydarzeń";

    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={[styles.emptyText, { color: "#666666" }]}>
          {message}
        </ThemedText>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.light.mainBackground },
      ]}
      edges={["top"]}
    >
      {renderTimelineScroller()}
      <View
        ref={containerRef}
        style={styles.eventsContainer}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeight(height);
        }}
      >
        {status === "loading"
          ? renderLoadingState()
          : status === "error"
            ? renderErrorState()
            : filteredEvents?.length === 0
              ? renderEmptyState()
              : filteredEvents && (
                  <FlatList
                    ref={flatListRef}
                    bounces={true}
                    data={filteredEvents}
                    renderItem={renderEventCard}
                    keyExtractor={(item: IEvent) => item.id.toString()}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    snapToInterval={height}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    disableIntervalMomentum={true}
                    viewabilityConfig={viewabilityConfig}
                    onViewableItemsChanged={onViewableItemsChanged}
                  />
                )}
      </View>
    </SafeAreaView>
  );
}
