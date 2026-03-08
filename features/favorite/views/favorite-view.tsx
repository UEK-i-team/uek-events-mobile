import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/shared/components";
import { theme } from "@/shared/constants/theme";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { IEvent } from "@/shared/types/event";

import { FavoriteEventCard } from "../components/favorite-event-card/favorite-event-card";
import { styles } from "./favorite-view.styles";

export default function FavoriteView() {
  const { events, status, errorMessage, toggleFavoriteEvent } =
    useContext(EventContext);

  const favoriteEvents = events?.filter((event) => event.isFavorite) || [];

  const renderEventCard = ({ item }: { item: IEvent }) => (
    <FavoriteEventCard event={item} onRemove={toggleFavoriteEvent} />
  );

  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#000000" />
      <ThemedText
        style={[styles.emptyText, { color: "#666666", marginTop: 16 }]}
      >
        Ładowanie ulubionych...
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: "#d32f2f" }]}>
        Wystąpił błąd podczas ładowania ulubionych wydarzeń
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={80} color="#999999" />
      <ThemedText style={styles.emptyTitle}>Brak ulubionych</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Wydarzenia, które polubisz, pojawią się tutaj
      </ThemedText>
    </View>
  );

  if (status === "loading") {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.light.mainBackground },
        ]}
      >
        <SafeAreaView edges={["top"]} />
        {renderLoadingState()}
      </View>
    );
  }

  if (status === "error") {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.light.mainBackground },
        ]}
      >
        <SafeAreaView edges={["top"]} />
        {renderErrorState()}
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.light.mainBackground },
      ]}
    >
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Twoje Ulubione</Text>
        </View>

        {favoriteEvents.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={favoriteEvents}
            renderItem={renderEventCard}
            keyExtractor={(item: IEvent) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
