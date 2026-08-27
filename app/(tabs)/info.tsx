import { Pressable, ScrollView, StyleSheet, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import UekLogo from "@/assets/images/uek_logo.svg";
import { ExternalLink } from "@/shared/components/external-link/external-link";
import { IconSymbol } from "@/shared/components/icon-symbol/icon-symbol";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import * as Clipboard from "expo-clipboard";
import { useContext } from "react";
import { NotificationContext } from "@/features/notifications/contexts/notification-context";
import { useTheme } from "@/shared/context/ThemeContext";

const EMAIL = "kontakt@uekeventuje.pl";
const UEK_COLOR = "#803248";

export default function InfoScreen() {
  const notificationContext = useContext(NotificationContext);
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const copyEmail = async () => {
    await Clipboard.setStringAsync(EMAIL);
    notificationContext?.showNotification("success", "Skopiowano do schowka!");
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.mainBackground },
      ]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textPrimary }]}>Ustawienia</ThemedText>
          <View style={styles.linkItem}>
            <ThemedText style={{ color: colors.textPrimary, fontSize: 16 }}>
              Tryb ciemny
            </ThemedText>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: colors.textPrimary }]}
          >
            O aplikacji
          </ThemedText>
          <View style={[styles.creatorsSection]}>
            <ThemedText style={[styles.creatorsTitle, { color: colors.textPrimary }]}>
              CEL APLIKACJI
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: colors.textPrimary }]}>
            Ile razy przegapiliście jakiś event, bo ogłoszenie zaginęło w dziesiątkach maili na poczcie? Nam zdarzało się to regularnie...
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: colors.textPrimary }]}>
            Jednak nie ma takiego problemu, którego nie dałoby się rozwiązać! Jako studenci UEK stworzyliśmy aplikację, która w jednym miejscu zbierze dla Was wszystkie wydarzenia, konkursy i oferty! Teraz już nic nie umknie Waszej uwadze!
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: colors.textPrimary }]}>
              {
                "\nUEK Eventuje to aplikacja stworzona przez studentów, dla studentów, w partnerstwie z Uniwersytetem Ekonomicznym w Krakowie."
              }
            </ThemedText>
          </View>
          <ExternalLink href="https://uek.krakow.pl" style={styles.partnerBadgeLink}>
            <View style={styles.partnerBadge}>
              <View style={styles.partnerBadgeLogo}>
                <UekLogo width={18} height={30} />
              </View>
              <ThemedText style={styles.partnerBadgeText}>
              UEK - Oficjalnym Partnerem
              </ThemedText>
            </View>
          </ExternalLink>
          <View style={styles.linkItem}>
            <ExternalLink
              href="https://eventuje.pl/polityka-prywatnosci"
              style={styles.link}
            >
              <ThemedText style={[styles.linkText, { color: colors.textPrimary }]}>
                Polityka prywatności
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color={colors.textSecondary} />
          </View>

          <View style={styles.linkItem}>
            <ExternalLink
              href="https://eventuje.pl/regulamin"
              style={styles.link}
            >
              <ThemedText style={[styles.linkText, { color: colors.textPrimary }]}>
                Regulamin
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color={colors.textSecondary} />
          </View>

          <View style={styles.linkItem}>
            <Pressable style={styles.link} onPress={copyEmail}>
              <ThemedText style={[styles.linkText, { color: colors.textPrimary }]}>
                Kontakt: - {EMAIL}
              </ThemedText>
              <View>
                <ThemedText style={[styles.subLinkText, { color: colors.textSecondary }]}>
                  Kliknij aby skopiować
                </ThemedText>
              </View>
            </Pressable>
            <IconSymbol name="envelope" size={20} color={colors.textPrimary} />
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
  partnerBadgeLink: {
    alignSelf: "flex-start",
    marginHorizontal: 20,
    marginTop: -22,
    marginBottom: 12
  },
  partnerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: UEK_COLOR,
    backgroundColor: "#FFFFFF",
  },
  partnerBadgeLogo: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  partnerBadgeText: {
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "700",
    color: UEK_COLOR,
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
