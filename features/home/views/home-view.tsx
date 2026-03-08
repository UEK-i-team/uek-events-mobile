import { useHomeScreen } from "@/features/home/hooks/use-home-screen";
import { ThemedText } from "@/shared/components";
import { theme } from "@/shared/constants/theme";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { IEvent } from "@/shared/types/event";
import React, { useContext, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  ViewabilityConfig,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventCard } from "../components/event-card/event-card";
import { styles } from "./home-view.styles";

export default function HomeView() {
  const { flatListRef, headerHeight } = useHomeScreen();

  const { events, status, errorMessage, toggleFavoriteEvent } =
    useContext(EventContext);

  const containerRef = useRef<View>(null);

  const [height, setHeight] = useState(0);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 200,
  }).current;

  const renderEventCard = ({ item }: { item: IEvent }) => {
    return (
      <EventCard
        event={item}
        cardHeight={height}
        toggleFavorite={toggleFavoriteEvent}
      />
    );
  };

  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#000000" />
      <ThemedText
        style={[styles.emptyText, { color: "#666666", marginTop: 16 }]}
      >
        Ładowanie wydarzeń...
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: "#d32f2f" }]}>
        Wystąpił błąd podczas ładowania wydarzeń
      </ThemedText>
      <ThemedText
        style={[
          styles.emptyText,
          { color: "#666666", marginTop: 8, fontSize: 14 },
        ]}
      >
        {errorMessage}
      </ThemedText>
    </View>
  );

  const renderEmptyState = () => {
    const message = "Brak dostępnych wydarzeń";

    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={[styles.emptyText, { color: "#666666" }]}>
          {message}
        </ThemedText>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.light.mainBackground },
      ]}
      edges={["top"]}
    >
      <View style={styles.calendarMock}></View>
      <View
        ref={containerRef}
        style={styles.eventsContainer}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeight(height);
        }}
      >
        {status === "loading"
          ? renderLoadingState()
          : status === "error"
            ? renderErrorState()
            : events?.length === 0
              ? renderEmptyState()
              : events && (
                  <FlatList
                    ref={flatListRef}
                    bounces={true}
                    data={events}
                    renderItem={renderEventCard}
                    keyExtractor={(item: IEvent) => item.id}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    snapToInterval={height}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    disableIntervalMomentum={true}
                    viewabilityConfig={viewabilityConfig}
                  />
                )}
      </View>
    </SafeAreaView>
  );
}
