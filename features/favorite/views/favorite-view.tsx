import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { IEvent } from "@/shared/types/event";

import { FavoriteEventCard } from "../components/favorite-event-card/favorite-event-card";
import { styles } from "./favorite-view.styles";

type SortMode = "liked" | "added";

export default function FavoriteView() {
  const { events, status, errorMessage, toggleFavoriteEvent } =
    useContext(EventContext);
  const [sortMode, setSortMode] = useState<SortMode>("liked");

  const favoriteEvents = useMemo(() => {
    const favs = events?.filter((event) => event.isFavorite) || [];
    if (sortMode === "added") {
      return [...favs].sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      );
    }
    return favs;
  }, [events, sortMode]);

  const renderEventCard = ({ item }: { item: IEvent }) => (
    <FavoriteEventCard event={item} onRemove={toggleFavoriteEvent} />
  );

  if (status === "loading") {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.light.mainBackground },
        ]}
        edges={["top"]}
      >
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.light.mainBackground },
        ]}
        edges={["top"]}
      >
        <View style={styles.emptyContainer}>
          <ThemedText style={[styles.emptyTitle, { color: "#d32f2f" }]}>
            Błąd ładowania ulubionych
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>{errorMessage}</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.light.mainBackground },
      ]}
      edges={["top"]}
    >
      {favoriteEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="bookmark-outline"
            size={40}
            color={theme.light.dark_grey}
          />
          <ThemedText style={styles.emptyTitle}>Brak ulubionych</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Wydarzenia, które polubisz, pojawią się tutaj
          </ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[
                styles.tab,
                sortMode === "liked" ? styles.tabActive : styles.tabInactive,
              ]}
              onPress={() => setSortMode("liked")}
              activeOpacity={0.8}
            >
              <Text
                style={
                  sortMode === "liked"
                    ? styles.tabTextActive
                    : styles.tabTextInactive
                }
              >
                Od daty polubienia
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                sortMode === "added" ? styles.tabActive : styles.tabInactive,
              ]}
              onPress={() => setSortMode("added")}
              activeOpacity={0.8}
            >
              <Text
                style={
                  sortMode === "added"
                    ? styles.tabTextActive
                    : styles.tabTextInactive
                }
              >
                Od daty wydarzenia
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={favoriteEvents}
            renderItem={renderEventCard}
            keyExtractor={(item: IEvent) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </SafeAreaView>
  );
}
