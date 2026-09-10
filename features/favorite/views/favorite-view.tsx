import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { OfflineNoDataPlaceholder } from "@/shared/components/offline-no-data-placeholder/offline-no-data-placeholder";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { useTheme } from "@/shared/context/ThemeContext";
import { IEvent } from "@/shared/types/event";
import { safeParseDate } from "@/utils/functions/event-utils";

import { useDependencies } from "@/shared/di/DependencyProvider";

import { FavoriteEventCard } from "../components/favorite-event-card/favorite-event-card";
import { styles } from "./favorite-view.styles";
import { theme } from "@/shared/constants/theme";

type SortMode = "liked" | "event_date";

export default function FavoriteView() {
  const { events, status, errorMessage, toggleFavoriteEvent } =
    useContext(EventContext);
  const [sortMode, setSortMode] = useState<SortMode>("liked");
  const { isDarkMode, colors } = useTheme();
  const { favoriteEventsRepository } = useDependencies();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    favoriteEventsRepository.getFavoriteEvents().then((ids) => {
      setFavoriteIds(ids || []);
    });
  }, [favoriteEventsRepository, events]);

  const favoriteEvents = useMemo(() => {
    const favs = events?.filter((event) => event.isFavorite) || [];
    
    if (sortMode === "liked") {
      return [...favs].sort((a, b) => {
        const indexA = favoriteIds.indexOf(a.id);
        const indexB = favoriteIds.indexOf(b.id);
        const validIndexA = indexA === -1 ? -1 : indexA;
        const validIndexB = indexB === -1 ? -1 : indexB;
        return validIndexB - validIndexA;
      });
    }
    
    // event_date
    return [...favs].sort(
      (a, b) => {
        const timeA = safeParseDate(a.start_date)?.getTime() || 0;
        const timeB = safeParseDate(b.start_date)?.getTime() || 0;
        return timeA - timeB;
      }
    );
  }, [events, sortMode, favoriteIds]);

  const renderEventCard = ({ item }: { item: IEvent }) => (
    <FavoriteEventCard event={item} onRemove={toggleFavoriteEvent} />
  );

  if (status === "loading") {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.mainBackground },
        ]}
        edges={["top"]}
      >
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.mainBackground },
        ]}
        edges={["top"]}
      >
        <View style={styles.emptyContainer}>
          <ThemedText style={[styles.emptyTitle, { color: colors.red_regular }]}>
            Błąd ładowania ulubionych
          </ThemedText>
          <ThemedText style={[styles.emptySubtext, { color: colors.textSecondary }]}>{errorMessage}</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "offline_no_data") {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.mainBackground },
        ]}
        edges={["top"]}
      >
        <OfflineNoDataPlaceholder
          title="Brak danych offline"
          subtitle="Włącz internet, a wydarzenia pojawią się automatycznie."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
          { backgroundColor: colors.mainBackground },
      ]}
      edges={["top"]}
    >
      {favoriteEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="bookmark-outline"
            size={40}
            color={isDarkMode ? colors.textPrimary : colors.dark_grey}
          />
          <ThemedText style={[styles.emptyTitle, { color: colors.textPrimary }]}>Brak ulubionych</ThemedText>
          <ThemedText style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Wydarzenia, które polubisz, pojawią się tutaj
          </ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[
                styles.tab,
                {
                  flex: 1,
                  minWidth: 0,
                  backgroundColor: colors.light_grey,
                  borderColor: sortMode === "liked" ? colors.primary : (isDarkMode ? "transparent" : "rgba(0,0,0,0.13)"),
                  borderWidth: sortMode === "liked" ? 2 : 1,
                },
              ]}
              onPress={() => setSortMode("liked")}
              activeOpacity={0.8}
            >
              <Text
                style={
                  [
                    sortMode === "liked"
                      ? styles.tabTextActive
                      : styles.tabTextInactive,
                    { color: sortMode === "liked" ? colors.primary : colors.textPrimary },
                  ]
                }
                numberOfLines={1}
                ellipsizeMode="tail"
                maxFontSizeMultiplier={1.2}
              >
                Od daty polubienia
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                {
                  flex: 1,
                  minWidth: 0,
                  backgroundColor: colors.light_grey,
                  borderColor: sortMode === "event_date" ? colors.primary : (isDarkMode ? "transparent" : "rgba(0,0,0,0.13)"),
                  borderWidth: sortMode === "event_date" ? 2 : 1,
                },
              ]}
              onPress={() => setSortMode("event_date")}
              activeOpacity={0.8}
            >
              <Text
                style={
                  [
                    sortMode === "event_date"
                      ? styles.tabTextActive
                      : styles.tabTextInactive,
                    { color: sortMode === "event_date" ? colors.primary : colors.textPrimary },
                  ]
                }
                numberOfLines={1}
                ellipsizeMode="tail"
                maxFontSizeMultiplier={1.2}
              >
                Od daty wydarzenia
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={favoriteEvents}
            renderItem={renderEventCard}
            keyExtractor={(item: IEvent) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </SafeAreaView>
  );
}
