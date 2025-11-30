import { useAppliedFilters } from '@/features/filters/contexts';
import { CaughtUpCard } from '@/features/home/components/caught-up-card';
import { EventCard } from '@/features/home/components/event-card';
import { FilterButton } from '@/features/home/components/filter-button';
import { HomeHeader } from '@/features/home/components/home-header';
import { FILTER_OPTIONS } from '@/features/home/constants/events';
import { useEventsData, useFilteredEvents, useSortedEvents } from '@/features/home/hooks';
import { useHomeScreen } from '@/features/home/hooks/use-home-screen';
import { useViewedEvents } from '@/features/viewed';
import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Event } from '@/shared/types/event';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, ViewabilityConfig, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;

  const {
    selectedFilter,
    flatListRef,
    cardHeight,
    headerHeight,
    handleFilterPress,
  } = useHomeScreen();

  // Pobierz wydarzenia z repozytorium
  const { events, loading, error } = useEventsData();
  
  // Hook do śledzenia zobaczonych eventów
  const { markAsViewed } = useViewedEvents();
  
  // Hook do sprawdzenia aktywnych filtrów
  const appliedFilters = useAppliedFilters();
  
  const containerRef = useRef<View>(null);

  // Filtruj wydarzenia według wybranego filtru
  const filteredEvents = useFilteredEvents(events, selectedFilter);
  
  // Sortuj wydarzenia (niezobaczone na górze)
  const sortedEvents = useSortedEvents(filteredEvents);
  
  // Sprawdź czy są aktywne jakieś filtry
  const hasActiveFilters = 
    selectedFilter !== null ||
    appliedFilters.appliedCategories.length > 0 ||
    appliedFilters.appliedLocations.length > 0 ||
    appliedFilters.appliedTags.length > 0;

  const [height, setHeight] = useState(0);
  const [isSeparatorVisible, setIsSeparatorVisible] = useState(false);

  // Konfiguracja śledzenia widocznych elementów
  const viewabilityConfig = useRef<ViewabilityConfig>({
    viewAreaCoveragePercentThreshold: 50, // 50% karty musi być widoczne
    minimumViewTime: 500, // 500ms na ekranie = zobaczone
  }).current;

  // Callback gdy elementy stają się widoczne
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    viewableItems.forEach((item) => {
      if (item.isViewable && item.item?.id) {
        // Sprawdź czy to separator "Jesteś na bieżąco"
        if (item.item.isSeparator) {
          setIsSeparatorVisible(true);
        } else {
          // Oznacz normalne eventy jako zobaczone
          markAsViewed(item.item.id);
        }
      }
    });
  }).current;


  const renderFilterButton = ({ item }: { item: typeof FILTER_OPTIONS[0] }) => (
    <FilterButton
      filter={item}
      isSelected={selectedFilter === item.id}
      onPress={handleFilterPress}
    />
  );


  const renderEventCard = ({ item }: { item: Event }) => {
    // Sprawdź czy to separator "Jesteś na bieżąco"
    if (item.isSeparator) {
      return <CaughtUpCard cardHeight={height} isVisible={isSeparatorVisible} />;
    }
    
    return <EventCard event={item} cardHeight={height} />;
  };

  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
      <ThemedText style={[styles.emptyText, { color: isDark ? '#999999' : '#666666', marginTop: 16 }]}>
        Ładowanie wydarzeń...
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: isDark ? '#ff6b6b' : '#d32f2f' }]}>
        Wystąpił błąd podczas ładowania wydarzeń
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: isDark ? '#999999' : '#666666', marginTop: 8, fontSize: 14 }]}>
        {error?.message}
      </ThemedText>
    </View>
  );

  const renderEmptyState = () => {
    // Rozróżnij między brakiem wydarzeń a brakiem wyników filtrowania
    const message = hasActiveFilters && events.length > 0
      ? 'Brak wydarzeń spełniających wybrane kryteria'
      : 'Brak dostępnych wydarzeń';
    
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={[styles.emptyText, { color: isDark ? '#999999' : '#666666' }]}>
          {message}
        </ThemedText>
        {hasActiveFilters && events.length > 0 && (
          <ThemedText style={[styles.emptySubtext, { color: isDark ? '#666666' : '#999999', marginTop: 8 }]}>
            Spróbuj zmienić filtry lub zakres czasowy
          </ThemedText>
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={['top']}>
      <HomeHeader headerHeight={headerHeight} />
      <View
        style={[
          styles.filtersContainer,
          {
            backgroundColor: backgroundColor,
          },
        ]}>
        <FlatList
          data={FILTER_OPTIONS}
          renderItem={renderFilterButton}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>
      <View 
        ref={containerRef}
        style={{flex: 1}}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeight(height)
        }}
      >
        {loading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : sortedEvents.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            ref={flatListRef}
            bounces={true}
            data={sortedEvents}
            renderItem={renderEventCard}
            keyExtractor={item => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={height}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        )}
      </View>
      
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingVertical: 12,
    paddingBottom: 4,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 12,
    height: 60
  },
  eventsContent: {
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
