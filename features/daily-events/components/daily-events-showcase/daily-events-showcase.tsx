import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { pluralizePolish } from "@/utils/functions/plural-utils";

import { useDailyEventsShowcase } from "./use-daily-events-showcase";
import { DailyEventSlide } from "../daily-event-slide/daily-event-slide";
import { styles } from "./daily-events-showcase.styles";

function PulseBadge() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.08 * pulse.value }],
    opacity: 0.85 + 0.15 * pulse.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LinearGradient
        colors={["#FF6A2A", "#FF2D87"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}
      >
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>NOWE</Text>
      </LinearGradient>
    </Animated.View>
  );
}

export function DailyEventsShowcase() {
  const {
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
  } = useDailyEventsShowcase();

  if (todaysEvents.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GestureDetector gesture={dismissGesture}>
        <Animated.View style={[styles.dragContainer, dragStyle]}>
          <Animated.View style={headerEnterStyle}>
            <SafeAreaView
              edges={["top"]}
              style={styles.header}
              pointerEvents="none"
            >
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Nowe wydarzenia</Text>
                <PulseBadge />
              </View>
              <LinearGradient
                colors={["#FF6A2A", "#FF2D87", "#6A5BFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.accentLine}
              />
              <Text style={styles.headerSubtitle}>
                {`${todaysEvents.length} ${pluralizePolish(todaysEvents.length, {
                  singular: "nowe wydarzenie",
                  few: "nowe wydarzenia",
                  many: "nowych wydarzeń",
                })}`}
              </Text>
            </SafeAreaView>
          </Animated.View>

          <Animated.View style={[styles.carouselWrapper, cardsEnterStyle]}>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={itemSize}
              decelerationRate="fast"
              disableIntervalMomentum
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleMomentumEnd}
              contentContainerStyle={{ paddingHorizontal: sidePadding }}
            >
              {todaysEvents.map((event, index) => (
                <DailyEventSlide
                  key={event.id}
                  event={event}
                  index={index}
                  scrollX={scrollX}
                  itemSize={itemSize}
                  cardWidth={cardWidth}
                  imageHeight={imageHeight}
                  onNavigate={markNavigated}
                />
              ))}
            </Animated.ScrollView>
          </Animated.View>

          <SafeAreaView
            style={styles.footer}
            edges={["bottom"]}
            pointerEvents="box-none"
          >
            {todaysEvents.length > 1 && (
              <View style={styles.dotsContainer}>
                {todaysEvents.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.dot,
                      index === activeIndex
                        ? styles.dotActive
                        : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.skipButtonPressed,
              ]}
              onPress={handleSkip}
              hitSlop={12}
            >
              <Text style={styles.skipText}>Pomiń</Text>
            </Pressable>
          </SafeAreaView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
