import { Ionicons } from "@expo/vector-icons";
import { useHomeScreen } from "@/features/home/hooks/use-home-screen";
import { OfflineNoDataPlaceholder } from "@/shared/components/offline-no-data-placeholder/offline-no-data-placeholder";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { IEvent } from "@/shared/types/event";
import { useAppliedFilters } from "@/features/filters/contexts";
import { eventTagTranslations } from "@/shared/types/event-enums";
import React, { useCallback, useContext, useMemo } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventCard } from "../components/event-card/event-card";
import { styles } from "./home-view.styles";
import { TimelineScroller } from "../components/timeline-scroller/timeline-scroller";
import { useTheme } from "@/shared/context/ThemeContext";

export default function HomeView() {
  const { flatListRef, headerHeight } = useHomeScreen();
  const { colors } = useTheme();

  const { events, status, errorMessage, toggleFavoriteEvent } =
    useContext(EventContext);
  const { appliedCategories, appliedLocations, appliedTags } = useAppliedFilters();

  const events = useMemo(() => {
    if (!allEvents) return allEvents;

    return allEvents.filter((event) => {
      if (
        appliedCategories.length > 0 &&
        !appliedCategories.includes(event.event_type as any)
      ) {
        return false;
      }

      if (
        appliedLocations.length > 0 &&
        !appliedLocations.includes(event.location_category as any) &&
        !(appliedLocations.includes("ON_UEK_CAMPUS" as any) && event.location_category === "CAM")
      ) {
        return false;
      }

      if (appliedTags.length > 0) {
        const hasAnyTag = appliedTags.some((tag) =>
          event.tags?.includes(tag) ||
          event.tags?.includes(eventTagTranslations[tag as keyof typeof eventTagTranslations])
        );
        if (!hasAnyTag) {
          return false;
        }
      }

      return true;
    });
  }, [allEvents, appliedCategories, appliedLocations, appliedTags]);

  const {
    flatListRef,
    containerHeight,
    setContainerHeight,
    selectedDate,
    visibleEventId,
    nearestFutureEventIndex,
    handleDateSelect,
    viewabilityConfig,
    onViewableItemsChanged,
  } = useHomeScreen({ events });

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

    if (!events || !flatListRef.current) return;

    const index = events.findIndex((e) =>
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
        events={events}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        visibleEventId={visibleEventId}
      />
    );
  };

  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <ThemedText
        style={[styles.emptyText, { color: colors.textSecondary, marginTop: 16 }]}
      >
        Ładowanie wydarzeń...
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: colors.red_regular }]}>
        Wystąpił błąd podczas ładowania wydarzeń
      </ThemedText>
      <ThemedText
        style={[
          styles.emptyText,
          { color: colors.textSecondary, marginTop: 8, fontSize: 14 },
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
        <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
          {message}
        </ThemedText>
      </View>
    );
  };

  const renderOfflineNoDataState = () => (
    <OfflineNoDataPlaceholder
      title="Brak danych offline"
      subtitle="Włącz internet, a wydarzenia pojawią się automatycznie."
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.mainBackground },
      ]}
      edges={["top"]}
    >
      {events && events.length > 0 && (
        <TimelineScroller
          events={events}
          selectedDate={actualSelectedDate}
          onDateSelect={handleDateSelect}
          visibleEventId={visibleEventId}
        />
      )}
      <View
        style={styles.eventsContainer}
        onLayout={(event) => {
          setContainerHeight(event.nativeEvent.layout.height);
        }}
      >
        {status === "loading" ? (
          <HomeLoadingState />
        ) : status === "offline_no_data" ? (
          <OfflineNoDataPlaceholder
            title="Brak danych offline"
            subtitle="Włącz internet, a wydarzenia pojawią się automatycznie."
          />
        ) : status === "error" ? (
          <HomeErrorState message={errorMessage ?? null} />
        ) : events?.length === 0 ? (
          <HomeEmptyState isFiltered={allEvents ? allEvents.length > 0 : false} />
        ) : events && containerHeight > 0 ? (
          <FlatList
            ref={flatListRef}
            bounces={true}
            data={events}
            renderItem={renderEventCard}
            keyExtractor={(item: IEvent) => item.id.toString()}
            getItemLayout={(_, index) => ({
              length: containerHeight,
              offset: containerHeight * index,
              index,
            })}
            initialScrollIndex={nearestFutureEventIndex}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: false,
                });
              });
            }}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
            decelerationRate="fast"
            disableIntervalMomentum={true}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const HomeLoadingState = () => (
  <View style={styles.emptyContainer}>
    <ActivityIndicator size="large" color="#000000" />
    <ThemedText style={[styles.emptyText, { color: "#666666", marginTop: 16 }]}>
      Ładowanie wydarzeń...
    </ThemedText>
  </View>
);

const HomeErrorState = ({ message }: { message: string | null }) => (
  <View style={styles.emptyContainer}>
    <ThemedText style={[styles.emptyText, { color: "#d32f2f" }]}>
      Wystąpił błąd podczas ładowania wydarzeń
    </ThemedText>
    <ThemedText
      style={[styles.emptyText, { color: "#666666", marginTop: 8, fontSize: 14 }]}
    >
      {message}
    </ThemedText>
  </View>
);

const HomeEmptyState = ({ isFiltered }: { isFiltered?: boolean }) => (
  <View style={styles.emptyContainer}>
    <ThemedText 
      adjustsFontSizeToFit 
      numberOfLines={1} 
      style={{ fontSize: 120, lineHeight: 130, marginBottom: 24, fontWeight: "bold", color: "#999999", textAlign: "center" }}
    >
      :(
    </ThemedText>
    <ThemedText style={[styles.emptyText, { color: "#666666" }]}>
      {isFiltered 
        ? "Nie znaleziono żadnych wydarzeń z wybranymi filtrami"
        : "Brak dostępnych wydarzeń"}
    </ThemedText>
  </View>
);
