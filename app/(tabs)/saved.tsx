import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterButton } from '@/features/home/components/filter-button';
import { EXAMPLE_EVENTS } from '@/features/home/constants/events';
import { SavedEventCard } from '@/features/saved/components';
import { useFavorites } from '@/features/saved/contexts';
import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Event } from '@/shared/types/event';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type SortType = 'date-added' | 'event-date';

const SORT_OPTIONS = [
  { id: 'date-added', label: 'Od daty dodania' },
  { id: 'event-date', label: 'Data wydarzenia' },
];

export default function SavedScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const { favoriteIds, isLoading } = useFavorites();
  const [sortType, setSortType] = useState<SortType>('date-added');

  // Pobierz eventy które są w ulubionych i posortuj je
  const savedEvents = useMemo(() => {
    const filtered = EXAMPLE_EVENTS.filter((event) => favoriteIds.includes(event.id));
    
    if (sortType === 'date-added') {
      // Sortuj według kolejności w favoriteIds (ostatnio dodane na górze)
      return filtered.sort((a, b) => {
        const indexA = favoriteIds.indexOf(a.id);
        const indexB = favoriteIds.indexOf(b.id);
        return indexB - indexA; // Odwróć kolejność
      });
    } else {
      // Sortuj według daty wydarzenia (alfabetycznie na razie, można dodać parsing dat)
      return filtered.sort((a, b) => a.date.localeCompare(b.date));
    }
  }, [favoriteIds, sortType]);

  // const renderSortButton = ({ item }: { item: typeof SORT_OPTIONS[0] }) => (
  //   <FilterButton
  //     filter={item}
  //     isSelected={sortType === item.id}
  //     onPress={(id) => setSortType(id as SortType)}
  //   />
  // );

  const renderEventCard = ({ item }: { item: Event }) => (
    <SavedEventCard event={item} />
  );

  const renderFilterButton = ({ item }: { item: typeof SORT_OPTIONS[0] }) => (
    <FilterButton
      filter={item}
      isSelected={sortType === item.id}
      onPress={(id) => setSortType(id as SortType)}
    />
  );


  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="bookmark-border"
        size={80}
        color={isDark ? '#555555' : '#7EAAFF'}
      />
      <ThemedText style={[styles.emptyTitle, { color: textColor }]}>
        Brak zapisanych wydarzeń
      </ThemedText>
      <ThemedText style={[styles.emptyDescription, { color: isDark ? '#999999' : '#666666' }]}>
        Wydarzenia które dodasz do ulubionych pojawią się tutaj
      </ThemedText>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>
            Zapisane
          </ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: isDark ? '#999999' : '#666666' }}>
            Ładowanie...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>
          Zapisane
        </ThemedText>
      </View>
      
      {savedEvents.length > 0 && (
        <View
          style={[
            styles.sortContainer,
            {
              backgroundColor: backgroundColor,
            },
          ]}>
             <FlatList
              data={SORT_OPTIONS}
              renderItem={renderFilterButton}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContent}

              scrollEnabled={true}
              nestedScrollEnabled={true}
           />
          {/* <FlatList
            data={SORT_OPTIONS}
            renderItem={renderSortButton}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortButtons}
            nestedScrollEnabled={true}
          /> */}
        </View>
      )}

      {savedEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={savedEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 0,
  },
  sortContainer: {
    paddingVertical: 12,
    paddingBottom: 4,
  },
  sortButtons: {
    paddingHorizontal: 16,
    gap: 12,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -80,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
});

