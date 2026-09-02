import { Ionicons } from "@expo/vector-icons";
import { useHomeScreen } from "@/features/home/hooks/use-home-screen";
import { OfflineNoDataPlaceholder } from "@/shared/components/offline-no-data-placeholder/offline-no-data-placeholder";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { useTheme } from "@/shared/context/ThemeContext";
import { IEvent } from "@/shared/types/event";
import { useAppliedFilters, useFilters } from "@/features/filters/contexts";
import { eventTagTranslations } from "@/shared/types/event-enums";
import React, { useCallback, useContext, useMemo, useEffect } from "react";
import { ActivityIndicator, FlatList, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // 1. IMPORT HOOKA NAWIGACJI
import { EventCard } from "../components/event-card/event-card";
import { styles } from "./home-view.styles";
import { TimelineScroller } from "../components/timeline-scroller/timeline-scroller";
import { safeParseDate } from "@/utils/functions/event-utils";

export default function HomeView() {
  const navigation = useNavigation(); // 2. INICJALIZACJA NAWIGACJI
  const { events: allEvents, status, errorMessage, toggleFavoriteEvent } =
    useContext(EventContext);
  const { colors } = useTheme();
  const { appliedCategories, appliedLocations, appliedTags } = useAppliedFilters();
  const { clearFilters } = useFilters();

  const events = useMemo(() => {
    if (!allEvents) return allEvents;

    return allEvents.filter((event) => {
      const eventType = event.event_type_raw || event.event_type;
      if (
        appliedCategories.length > 0 &&
        !appliedCategories.includes(eventType as any)
      ) {
        return false;
      }

      const locationCategory = event.location_category_raw || event.location_category;
      if (
        appliedLocations.length > 0 &&
        !appliedLocations.includes(locationCategory as any)
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
    initialScrollIndex,
    nearestFutureEventIndex,
    handleDateSelect,
    viewabilityConfig,
    onViewableItemsChanged,
  } = useHomeScreen({ events });

 // 3. OBSŁUGA PONOWNEGO KLIKNIĘCIA W TAB "HOME"
 useEffect(() => {
   const unsubscribe = navigation.addListener("tabPress" as any, () => {
     // 1. Pobieramy dzisiejsze wydarzenie (lub pierwsze nadchodzące)
     const targetIndex = nearestFutureEventIndex >= 0 ? nearestFutureEventIndex : 0;
     const targetEvent = events?.[targetIndex];

     // 2. Pobieramy właściwą datę z dzisiejszego wydarzenia
     if (targetEvent?.start_date) {
       const todayEventDate = safeParseDate(targetEvent.start_date);
       if (todayEventDate) {
         handleDateSelect(todayEventDate);
       }
     } else {
       handleDateSelect(new Date());
     }

     // 3. Przewijamy listę wydarzeń na odpowiednią pozycję
     if (events && events.length > 0 && flatListRef.current) {
       flatListRef.current.scrollToIndex({
         index: targetIndex,
         animated: true,
       });
     }
   });

   return unsubscribe;
 }, [navigation, handleDateSelect, events, nearestFutureEventIndex, flatListRef]);

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
          <HomeLoadingState colors={colors} />
        ) : status === "offline_no_data" ? (
          <OfflineNoDataPlaceholder
            title="Brak danych offline"
            subtitle="Włącz internet, a wydarzenia pojawią się automatycznie."
          />
        ) : status === "error" ? (
          <HomeErrorState message={errorMessage ?? null} colors={colors} />
        ) : events?.length === 0 ? (
          <HomeEmptyState
            isFiltered={allEvents ? allEvents.length > 0 : false}
            colors={colors}
            onClearFilters={clearFilters}
          />
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
            initialScrollIndex={initialScrollIndex}
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

const HomeLoadingState = ({ colors }: { colors: { primary: string; textSecondary: string } }) => (
  <View style={styles.emptyContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <ThemedText style={[styles.emptyText, { color: colors.textSecondary, marginTop: 16 }]}>
      Ładowanie wydarzeń...
    </ThemedText>
  </View>
);

const HomeErrorState = ({
  message,
  colors,
}: {
  message: string | null;
  colors: { red_regular: string; textSecondary: string };
}) => (
  <View style={styles.emptyContainer}>
    <ThemedText style={[styles.emptyText, { color: colors.red_regular }]}>
      Wystąpił błąd podczas ładowania wydarzeń
    </ThemedText>
    <ThemedText
      style={[styles.emptyText, { color: colors.textSecondary, marginTop: 8, fontSize: 14 }]}
    >
      {message}
    </ThemedText>
  </View>
);

const HomeEmptyState = ({
  isFiltered,
  colors,
  onClearFilters,
}: {
  isFiltered?: boolean;
  colors: { textMuted: string; textSecondary: string; primary: string };
  onClearFilters?: () => void;
}) => (
  <View style={styles.emptyContainer}>
    <ThemedText
      adjustsFontSizeToFit
      numberOfLines={1}
      style={{ fontSize: 120, lineHeight: 150, marginBottom: 24, fontWeight: "bold", color: colors.textMuted, textAlign: "center" }}
    >
      :(
    </ThemedText>
    <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
      {isFiltered
        ? "Nie znaleziono żadnych wydarzeń z wybranymi filtrami"
        : "Brak dostępnych wydarzeń"}
    </ThemedText>
    {isFiltered && onClearFilters && (
      <TouchableOpacity onPress={onClearFilters}>
        <ThemedText style={[styles.emptyText, { color: colors.primary, marginTop: 12, fontWeight: "bold" }]}>
          Wyczyść filtry
        </ThemedText>
      </TouchableOpacity>
    )}
  </View>
);
