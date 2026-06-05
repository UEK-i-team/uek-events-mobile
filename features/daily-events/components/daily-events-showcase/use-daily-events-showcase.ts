import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { EventContext } from "@/shared/context/EventContext/EventContext";
import { getEventsStartingToday } from "@/utils/functions/event-utils";

const SIDE_PEEK = 26;
const CARD_SPACING = 16;

export function useDailyEventsShowcase() {
  const router = useRouter();
  const { events } = useContext(EventContext);
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const hasNavigatedRef = useRef(false);
  const scrollX = useSharedValue(0);
  const enter = useSharedValue(0);
  const dragY = useSharedValue(0);

  useEffect(() => {
    enter.value = withDelay(
      60,
      withSpring(1, { damping: 13, stiffness: 130, mass: 0.9 }),
    );
  }, [enter]);

  const headerEnterStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * -24 }],
  }));

  const cardsEnterStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: (1 - enter.value) * 60 },
      { scale: 0.9 + 0.1 * enter.value },
    ],
  }));

  const cardWidth = width - SIDE_PEEK * 2;
  const itemSize = cardWidth + CARD_SPACING;
  const sidePadding = (width - itemSize) / 2;
  const imageHeight = Math.round(Math.min(height * 0.3, 280));

  const todaysEvents = useMemo(
    () => (events ? getEventsStartingToday(events) : []),
    [events],
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / itemSize);
      setActiveIndex((prev) => (index !== prev ? index : prev));
    },
    [itemSize],
  );

  const handleSkip = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }, [router]);

  const dismissGesture = Gesture.Pan()
    .activeOffsetY(14)
    .failOffsetX([-16, 16])
    .onUpdate((event) => {
      dragY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 130 || event.velocityY > 900) {
        dragY.value = withTiming(height, { duration: 240 }, (finished) => {
          if (finished) {
            runOnJS(handleSkip)();
          }
        });
      } else {
        dragY.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const dragStyle = useAnimatedStyle(() => {
    const progress = Math.min(dragY.value / height, 1);
    return {
      transform: [
        { translateY: dragY.value },
        { scale: 1 - progress * 0.06 },
      ],
      opacity: 1 - progress * 0.35,
    };
  });

  const markNavigated = useCallback(() => {
    hasNavigatedRef.current = true;
  }, []);

  return {
    todaysEvents,
    activeIndex,
    cardWidth,
    itemSize,
    sidePadding,
    imageHeight,
    scrollX,
    scrollHandler,
    handleMomentumEnd,
    handleSkip,
    dismissGesture,
    headerEnterStyle,
    cardsEnterStyle,
    dragStyle,
    markNavigated,
  };
}
