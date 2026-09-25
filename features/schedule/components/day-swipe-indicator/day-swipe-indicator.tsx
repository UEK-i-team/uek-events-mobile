import React, { useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/shared/context/ThemeContext";
import { DAY_SWIPE_THRESHOLD } from "../../utils/day-swipe";
import { getStyles, RING_SIZE, RING_STROKE } from "./day-swipe-indicator.styles";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SLIDE_DISTANCE = 24;

interface DaySwipeIndicatorProps {
  /** Signed drag distance: positive toward the previous day, negative toward the next. */
  pull: SharedValue<number>;
  direction: "previous" | "next";
  targetLabel: string;
}

export function DaySwipeIndicator({ pull, direction, targetLabel }: DaySwipeIndicatorProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [isReady, setIsReady] = useState(false);
  const isNext = direction === "next";

  const progress = useDerivedValue(() => {
    const distance = isNext ? -pull.value : pull.value;
    return Math.min(Math.max(distance / DAY_SWIPE_THRESHOLD, 0), 1);
  });

  useAnimatedReaction(
    () => progress.value >= 1,
    (ready, previous) => {
      if (ready === previous) return;
      runOnJS(setIsReady)(ready);
      if (ready) runOnJS(Haptics.selectionAsync)();
    },
  );

  const containerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [isNext ? SLIDE_DISTANCE : -SLIDE_DISTANCE, 0],
          Extrapolation.CLAMP,
        ),
      },
      { scale: interpolate(progress.value, [0, 1], [0.9, 1], Extrapolation.CLAMP) },
    ],
  }));

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress.value),
  }));

  const title = isReady ? "Puść, aby przejść" : isNext ? "Następny dzień" : "Poprzedni dzień";
  const icon = isReady ? "checkmark" : isNext ? "arrow-up" : "arrow-down";

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, isNext ? styles.containerNext : styles.containerPrevious, containerStyle]}
    >
      <View style={styles.pill}>
        <View style={styles.ring}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={colors.border}
              strokeOpacity={0.15}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={colors.primary}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              fill="none"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              animatedProps={ringProps}
            />
          </Svg>
          <Ionicons
            name={icon}
            size={14}
            color={isReady ? colors.primary : colors.textSecondary}
            style={styles.ringIcon}
          />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{targetLabel}</Text>
        </View>
      </View>
    </Animated.View>
  );
}
