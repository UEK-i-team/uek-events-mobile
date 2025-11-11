import { FilterId } from '@/types/event';
import { useRef, useState } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UseHomeScreenReturn {
  selectedFilter: FilterId;
  flatListRef: React.RefObject<FlatList<any> | null>;
  cardHeight: number;
  headerHeight: number;
  handleFilterPress: (filterId: string) => void;
}

const HEADER_BASE_HEIGHT = 60;
const FILTERS_HEIGHT = 60;

/**
 * Hook zarządzający logiką strony głównej
 */
export function useHomeScreen(): UseHomeScreenReturn {
  const [selectedFilter, setSelectedFilter] = useState<FilterId>(null);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const headerHeight = HEADER_BASE_HEIGHT + insets.top;
  const cardHeight = SCREEN_HEIGHT - headerHeight - FILTERS_HEIGHT - 10;

  const handleFilterPress = (filterId: string) => {
    if (selectedFilter === filterId) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(filterId as FilterId);
    }
  };

  return {
    selectedFilter,
    flatListRef,
    cardHeight,
    headerHeight,
    handleFilterPress,
  };
}

