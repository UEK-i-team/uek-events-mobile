import { useRef } from "react";
import { FlatList, Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface UseHomeScreenReturn {
  flatListRef: React.RefObject<FlatList<any> | null>;
  cardHeight: number;
  headerHeight: number;
}

const HEADER_BASE_HEIGHT = 60;
const FILTERS_HEIGHT = 60;

/**
 * Hook zarządzający logiką strony głównej
 */
export function useHomeScreen(): UseHomeScreenReturn {
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 49 : 5;
  const headerHeight =
    HEADER_BASE_HEIGHT +
    insets.top +
    insets.bottom +
    FILTERS_HEIGHT +
    TAB_BAR_HEIGHT;
  // const cardHeight = SCREEN_HEIGHT - headerHeight - FILTERS_HEIGHT - 10;
  const cardHeight = SCREEN_HEIGHT - headerHeight;

  return {
    flatListRef,
    cardHeight,
    headerHeight,
  };
}
