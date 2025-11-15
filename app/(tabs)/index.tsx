import { EventCard } from '@/features/home/components/event-card';
import { FilterButton } from '@/features/home/components/filter-button';
import { HomeHeader } from '@/features/home/components/home-header';
import { FILTER_OPTIONS } from '@/features/home/constants/events';
import { useEventsData, useFilteredEvents } from '@/features/home/hooks';
import { useHomeScreen } from '@/features/home/hooks/use-home-screen';
import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Event } from '@/shared/types/event';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
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
  
  const containerRef = useRef<View>(null);

  // Filtruj wydarzenia według wybranego filtru
  const filteredEvents = useFilteredEvents(events, selectedFilter);

  const [height, setHeight] = useState(0);


  const renderFilterButton = ({ item }: { item: typeof FILTER_OPTIONS[0] }) => (
    <FilterButton
      filter={item}
      isSelected={selectedFilter === item.id}
      onPress={handleFilterPress}
    />
  );


  const renderEventCard = ({ item }: { item: Event }) => (
    <EventCard event={item} cardHeight={height} />
  );

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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: isDark ? '#999999' : '#666666' }]}>
        Brak wydarzeń spełniających wybrane kryteria
      </ThemedText>
    </View>
  );
  
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
        ) : filteredEvents.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            ref={flatListRef}
            bounces={true}
            data={filteredEvents}
            renderItem={renderEventCard}
            keyExtractor={item => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={height}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true}
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
});
