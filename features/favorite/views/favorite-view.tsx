import { View } from "react-native";

type SortType = "date-added" | "event-date";

const SORT_OPTIONS = [
  { id: "date-added", label: "Od daty dodania" },
  { id: "event-date", label: "Data wydarzenia" },
];

export const FavoriteView = () => {};

export default function SavedScreen() {
  // const colorScheme = useColorScheme();
  // const isDark = colorScheme === 'dark';
  // const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  // const textColor = isDark ? Colors.dark.text : Colors.light.text;
  // const { favoriteIds, isLoading: favoritesLoading } = useFavorites();
  // const { events, loading: eventsLoading } = useEventsData();
  // const [sortType, setSortType] = useState<SortType>('date-added');

  // const isLoading = favoritesLoading || eventsLoading;

  // // Pobierz eventy które są w ulubionych i posortuj je
  // const savedEvents = useMemo(() => {
  //   const filtered = events.filter((event) => favoriteIds.includes(event.id));

  //   if (sortType === 'date-added') {
  //     // Sortuj według kolejności w favoriteIds (ostatnio dodane na górze)
  //     return filtered.sort((a, b) => {
  //       const indexA = favoriteIds.indexOf(a.id);
  //       const indexB = favoriteIds.indexOf(b.id);
  //       return indexB - indexA; // Odwróć kolejność
  //     });
  //   } else {
  //     // Sortuj według daty wydarzenia (alfabetycznie na razie, można dodać parsing dat)
  //     return filtered.sort((a, b) => a.date.localeCompare(b.date));
  //   }
  // }, [events, favoriteIds, sortType]);

  // // const renderSortButton = ({ item }: { item: typeof SORT_OPTIONS[0] }) => (
  // //   <FilterButton
  // //     filter={item}
  // //     isSelected={sortType === item.id}
  // //     onPress={(id) => setSortType(id as SortType)}
  // //   />
  // // );

  // const renderEventCard = ({ item }: { item: Event }) => (
  //   <SavedEventCard event={item} />
  // );

  // const renderFilterButton = ({ item }: { item: typeof SORT_OPTIONS[0] }) => (
  //   <FilterButton
  //     filter={item}
  //     isSelected={sortType === item.id}
  //     onPress={(id) => setSortType(id as SortType)}
  //   />
  // );

  // const renderEmptyState = () => (
  //   <View style={styles.emptyContainer}>
  //     <MaterialIcons
  //       name="bookmark-border"
  //       size={80}
  //       color={isDark ? '#555555' : '#7EAAFF'}
  //     />
  //     <ThemedText style={[styles.emptyTitle, { color: textColor }]}>
  //       Brak zapisanych wydarzeń
  //     </ThemedText>
  //     <ThemedText style={[styles.emptyDescription, { color: isDark ? '#999999' : '#666666' }]}>
  //       Wydarzenia które dodasz do ulubionych pojawią się tutaj
  //     </ThemedText>
  //   </View>
  // );

  // if (isLoading) {
  //   return (
  //     <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
  //       <View style={styles.header}>
  //         <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>
  //           Zapisane
  //         </ThemedText>
  //       </View>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color={isDark ? '#64B5F6' : '#1976D2'} />
  //         <ThemedText style={{ color: isDark ? '#999999' : '#666666', marginTop: 16 }}>
  //           Ładowanie...
  //         </ThemedText>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <View></View>
    // <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
    //   <View style={styles.header}>
    //     <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>
    //       Zapisane
    //     </ThemedText>
    //   </View>

    //   {savedEvents.length > 0 && (
    //     <View
    //       style={[
    //         styles.sortContainer,
    //         {
    //           backgroundColor: backgroundColor,
    //         },
    //       ]}>
    //          <FlatList
    //           data={SORT_OPTIONS}
    //           renderItem={renderFilterButton}
    //           keyExtractor={(item) => item.id}
    //           horizontal
    //           showsHorizontalScrollIndicator={false}
    //           contentContainerStyle={styles.filtersContent}

    //           scrollEnabled={true}
    //           nestedScrollEnabled={true}
    //        />
    //       {/* <FlatList
    //         data={SORT_OPTIONS}
    //         renderItem={renderSortButton}
    //         keyExtractor={(item) => item.id}
    //         horizontal
    //         showsHorizontalScrollIndicator={false}
    //         contentContainerStyle={styles.sortButtons}
    //         nestedScrollEnabled={true}
    //       /> */}
    //     </View>
    //   )}

    //   {savedEvents.length === 0 ? (
    //     renderEmptyState()
    //   ) : (
    //     <FlatList
    //       data={savedEvents}
    //       renderItem={renderEventCard}
    //       keyExtractor={(item) => item.id}
    //       showsVerticalScrollIndicator={false}
    //       contentContainerStyle={styles.listContent}
    //     />
    //   )}
    // </SafeAreaView>
  );
}
