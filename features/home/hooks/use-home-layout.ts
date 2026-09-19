import { useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_BASE_HEIGHT = 60;
const FILTERS_HEIGHT = 60;

/**
 * Matematyka layoutu strony głównej: wysokość nagłówka, wysokość karty (pełny ekran
 * minus nagłówek/taby) oraz zmierzona wysokość kontenera listy.
 */
export function useHomeLayout() {
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const [containerHeight, setContainerHeight] = useState(0);

  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 49 : 5;
  const headerHeight =
    HEADER_BASE_HEIGHT +
    insets.top +
    insets.bottom +
    FILTERS_HEIGHT +
    TAB_BAR_HEIGHT;
  const cardHeight = SCREEN_HEIGHT - headerHeight;

  return {
    headerHeight,
    cardHeight,
    containerHeight,
    setContainerHeight,
  };
}
