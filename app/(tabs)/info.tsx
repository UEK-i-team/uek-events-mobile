import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExternalLink } from "@/shared/components/external-link/external-link";
import { IconSymbol } from "@/shared/components/icon-symbol/icon-symbol";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "@/shared/constants/theme";

export default function InfoScreen() {
  const handleDeleteHalfEvents = async () => {
    try {
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      const stored = await AsyncStorage.getItem("@uek_events_viewed");

      if (stored) {
        const viewedData = JSON.parse(stored);
        if (viewedData.length > 0) {
          const halfLength = Math.floor(viewedData.length / 2);
          const halfViewed = viewedData.slice(0, halfLength);
          await AsyncStorage.setItem(
            "@uek_events_viewed",
            JSON.stringify(halfViewed),
          );
        }
      }

      Alert.alert("Sukces", "Usunięto połowę eventów z cache i viewed events.");
    } catch (error) {
      console.error("Błąd podczas usuwania połowy eventów:", error);
      Alert.alert("Błąd", "Wystąpił problem podczas usuwania połowy eventów.");
    }
  };

  const handleClearMemory = () => {
    Alert.alert(
      "Wyczyść wszystkie dane aplikacji",
      "Czy na pewno chcesz usunąć wszystkie lokalne dane aplikacji?\n\nZostaną usunięte:\n• Historia zobaczonych wydarzeń\n• Zapisane ulubione wydarzenia\n• Cache wydarzeń\n\nTa operacja nie może być cofnięta.",
      [
        {
          text: "Anuluj",
          style: "cancel",
        },
        {
          text: "Wyczyść wszystko",
          style: "destructive",
          onPress: async () => {
            try {
              // await Promise.all([clearViewed(), clearFavorites()]);
              Alert.alert(
                "Sukces",
                "Wszystkie lokalne dane aplikacji zostały wyczyszczone.",
              );
            } catch (error) {
              console.error("Błąd podczas czyszczenia danych:", error);
              Alert.alert(
                "Błąd",
                "Wystąpił problem podczas czyszczenia danych.",
              );
            }
          },
        },
      ],
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: "#000000" }]}
          >
            O aplikacji
          </ThemedText>
          <View style={[styles.creatorsSection]}>
            <ThemedText style={[styles.creatorsTitle, { color: "#000000" }]}>
              CEL APLIKACJI ORAZ TWÓRCY:
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: "#000000" }]}>
              Ile razy przegapiłeś ważny event, bo ogłoszenie zaginęło w
              mailach? My też mieliśmy dość. Dlatego stworzyliśmy aplikację,
              która zbiera wszystkie wydarzenia, konkursy i oferty w jednym
              miejscu.
            </ThemedText>
            <ThemedText
              style={[styles.creatorsText, { color: "#000000" }]}
            ></ThemedText>
            <ThemedText style={[styles.creatorsText, { color: "#000000" }]}>
              {
                "Jesteśmy studentami UEK, którzy mają dokładnie ten sam problem i chcemy go rozwiązać. \n\nAplikacja stwrzona \nprzez studentów, dla studentów. 🚀"
              }
            </ThemedText>
          </View>
          <View style={styles.linkItem}>
            <ExternalLink
              href="https://docs.google.com/document/d/1ZtBS_iP8tRmzVGzpZCT3o02OfTYsusL32y1VqHeC4U4/edit?usp=sharing"
              style={styles.link}
            >
              <ThemedText style={[styles.linkText, { color: "#000000" }]}>
                Polityka prywatności
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color="#687076" />
          </View>

          <View style={styles.linkItem}>
            <ExternalLink
              href="https://docs.google.com/document/d/1bdcU4efTBGvGav-XYkDxs_IsBnk9bA7qfA32pncD71w/edit?usp=sharing"
              style={styles.link}
            >
              <ThemedText style={[styles.linkText, { color: "#000000" }]}>
                Regulamin
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color="#687076" />
          </View>

          <View style={styles.linkItem}>
            <ExternalLink
              href="https://forms.gle/6mnxYAN183NdLESm7"
              style={styles.link}
            >
              <ThemedText style={[styles.linkText, { color: "#000000" }]}>
                Formularz kontaktowy
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color="#687076" />
          </View>
        </View>

        {/* Sekcja zarządzania danymi */}
        <View style={styles.section}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: "#000000" }]}
          >
            Zarządzanie danymi
          </ThemedText>

          {/* TYMCZASOWY PRZYCISK - Usuń połowę eventów */}
          <TouchableOpacity
            onPress={handleDeleteHalfEvents}
            style={[
              styles.clearButton,
              {
                borderColor: "#FFE0B2",
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.clearButtonContent}>
              <MaterialIcons
                name="remove-circle-outline"
                size={24}
                color="#F57C00"
              />
              <View style={styles.clearButtonTextContainer}>
                <ThemedText
                  style={[styles.clearButtonTitle, { color: "#F57C00" }]}
                >
                  [TEST] Usuń połowę eventów
                </ThemedText>
                <ThemedText
                  style={[styles.clearButtonDescription, { color: "#666666" }]}
                >
                  Usuń 50% cache i viewed events
                </ThemedText>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#F57C00" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearMemory}
            style={[
              styles.clearButton,
              {
                borderColor: "#FFCDD2",
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.clearButtonContent}>
              <MaterialIcons name="delete-outline" size={24} color="#D32F2F" />
              <View style={styles.clearButtonTextContainer}>
                <ThemedText
                  style={[styles.clearButtonTitle, { color: "#D32F2F" }]}
                >
                  Wyczyść wszystkie dane
                </ThemedText>
                <ThemedText
                  style={[styles.clearButtonDescription, { color: "#666666" }]}
                >
                  Usuń historię, ulubione i cache
                </ThemedText>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 20,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
  },
  link: {
    flex: 1,
  },
  linkText: {
    fontSize: 16,
  },
  creatorsSection: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 12,
  },
  creatorsTitle: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 12,
  },
  creatorsText: {
    fontSize: 15,
    lineHeight: 22,
  },
  clearButton: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clearButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  clearButtonTextContainer: {
    flex: 1,
  },
  clearButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  clearButtonDescription: {
    fontSize: 13,
  },
});
