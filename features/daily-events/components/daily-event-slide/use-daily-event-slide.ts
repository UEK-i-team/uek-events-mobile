import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { IEvent } from "@/shared/types/event";
import {
  IMAGE_TRANSPARENT_BG,
  NEUTRAL_GRADIENT_BASE,
} from "@/shared/constants/theme";

import { useCountdown } from "../../hooks/use-countdown";
import { useDailyEventColor } from "../../hooks/use-daily-event-color";
import { darkenHexColor, getReadableTextColor } from "../../utils/color-utils";

const FALLBACK_IMAGE =
  "https://bg.uek.krakow.pl//sites/default/files/default_images/szkolenie.jpg";

interface UseDailyEventSlideParams {
  event: IEvent;
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
  onNavigate: () => void;
}

export function useDailyEventSlide({
  event,
  index,
  scrollX,
  itemSize,
  onNavigate,
}: UseDailyEventSlideParams) {
  const router = useRouter();
  const imageUrl = event.image_url || FALLBACK_IMAGE;
  const { dominantColor, hasAlpha } = useDailyEventColor(imageUrl);
  const countdown = useCountdown(event.start_date, event.end_date);

  const gradientBase = hasAlpha ? NEUTRAL_GRADIENT_BASE : dominantColor;
  const gradientStart = gradientBase;
  const gradientMiddle = darkenHexColor(gradientBase, 0.4);
  const gradientEnd = darkenHexColor(gradientBase, 0.7);
  const imageBackground = hasAlpha ? IMAGE_TRANSPARENT_BG : dominantColor;

  const textColor = getReadableTextColor(gradientEnd);
  const isLight = textColor === "#FFFFFF";
  const mutedColor = isLight ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.7)";
  const pillBg = isLight ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.10)";

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * itemSize,
      index * itemSize,
      (index + 1) * itemSize,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [28, 0, 28],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  const handlePress = useCallback(() => {
    onNavigate();
    router.push(`/event/${event.id}`);
  }, [event.id, onNavigate, router]);

  return {
    imageUrl,
    dominantColor,
    imageBackground,
    countdown,
    gradientStart,
    gradientMiddle,
    gradientEnd,
    textColor,
    mutedColor,
    pillBg,
    animatedStyle,
    handlePress,
  };
}
