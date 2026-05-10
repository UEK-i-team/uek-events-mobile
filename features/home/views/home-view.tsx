import { useHomeScreen } from "@/features/home/hooks/use-home-screen";
import { OfflineNoDataPlaceholder } from "@/shared/components/offline-no-data-placeholder/offline-no-data-placeholder";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { IEvent } from "@/shared/types/event";
import React, { useCallback, useContext } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventCard } from "../components/event-card/event-card";
import { styles } from "./home-view.styles";
import { TimelineScroller } from "../components/timeline-scroller/timeline-scroller";
import { safeParseDate } from "@/utils/functions/event-utils";

export default function HomeView() {
  const { events, status, errorMessage, toggleFavoriteEvent } =
    useContext(EventContext);

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

  const renderEventCard = useCallback(
    ({ item }: { item: IEvent }) => {
      return (
        <EventCard
          event={item}
          cardHeight={containerHeight}
          toggleFavorite={toggleFavoriteEvent}
        />
      );
    },
    [containerHeight, toggleFavoriteEvent],
  );

  const actualSelectedDate =
    selectedDate ||
    (events && events.length > 0
      ? safeParseDate(events[nearestFutureEventIndex]?.start_date)
      : null);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.light.mainBackground },
      ]}
      edges={["top"]}
    >
      <TimelineScroller
        events={events}
        selectedDate={actualSelectedDate}
        onDateSelect={handleDateSelect}
        visibleEventId={visibleEventId}
      />
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
          <HomeErrorState message={errorMessage} />
        ) : events?.length === 0 ? (
          <HomeEmptyState />
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

const HomeEmptyState = () => (
  <View style={styles.emptyContainer}>
    <ThemedText style={[styles.emptyText, { color: "#666666" }]}>
      Brak dostępnych wydarzeń
    </ThemedText>
  </View>
);
