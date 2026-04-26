import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExternalLink } from "@/shared/components/external-link/external-link";
import { IconSymbol } from "@/shared/components/icon-symbol/icon-symbol";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import * as Clipboard from "expo-clipboard";
import { useContext } from "react";
import { NotificationContext } from "@/features/notifications/contexts/notification-context";

const EMAIL = "kontakt@uekeventuje.pl";

export default function InfoScreen() {
  const notificationContext = useContext(NotificationContext);

  const copyEmail = async () => {
    await Clipboard.setStringAsync(EMAIL);
    notificationContext?.showNotification("success", "Skopiowano do schowka!");
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
              CEL APLIKACJI
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
              href="https://docs.google.com/document/d/1a5hBbEeb7S7NytOmOBCKH1SiwleBu7JNx-4U6JYfE48/edit?usp=sharing"
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
              href="https://docs.google.com/document/d/1xXgFqgD8j96Mu1_4y1BC2MKSPQDcXLYnTZknXu1etNY/edit?usp=sharing"
              style={styles.link}
            >
              <ThemedText style={[styles.linkText, { color: "#000000" }]}>
                Regulamin
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color="#687076" />
          </View>

          <View style={styles.linkItem}>
            <Pressable style={styles.link} onPress={copyEmail}>
              <ThemedText style={[styles.linkText, { color: "#000000" }]}>
                Kontakt: - {EMAIL}
              </ThemedText>
              <View>
                <ThemedText
                  style={[styles.subLinkText, { color: "#4b4b4bff" }]}
                >
                  Kliknij aby skopiować
                </ThemedText>
              </View>
            </Pressable>
            <IconSymbol name="envelope" size={20} color="#000000" />
          </View>
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
  subLinkText: {
    fontSize: 12,
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
