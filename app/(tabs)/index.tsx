import { EventCard } from '@/components/event-card';
import { FilterButton } from '@/components/filter-button';
import { HomeHeader } from '@/components/home-header';
import { EXAMPLE_EVENTS, FILTER_OPTIONS } from '@/constants/events';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHomeScreen } from '@/hooks/use-home-screen';
import { Event } from '@/types/event';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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

  const renderFilterButton = ({ item }: { item: typeof FILTER_OPTIONS[0] }) => (
    <FilterButton
      filter={item}
      isSelected={selectedFilter === item.id}
      onPress={handleFilterPress}
    />
  );


  const renderEventCard = ({ item }: { item: Event }) => (
    <EventCard event={item} cardHeight={cardHeight} />
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

      <FlatList
        bounces={true}
        data={EXAMPLE_EVENTS}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={cardHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{flex: 1}}
        disableIntervalMomentum={true}
      />
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
  },
  eventsContent: {
    paddingTop: 0,
  },
});
