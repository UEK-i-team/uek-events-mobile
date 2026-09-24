import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

import { useTheme } from "@/shared/context/ThemeContext";

import { useAuth } from "../../contexts/auth-context";
import { getStyles } from "./account-section.styles";

export function AccountSection() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { isAuthenticated, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      Alert.alert(
        "Wylogowanie nie powiodło się",
        "Nie udało się zakończyć sesji na tym urządzeniu. Spróbuj ponownie.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Konto</Text>
      <Pressable style={styles.item} onPress={handleLogout} disabled={loggingOut}>
        <View>
          <Text style={styles.itemText}>Wyloguj</Text>
          <Text style={styles.description}>
            Zakończ sesję na tym urządzeniu
          </Text>
        </View>
        {loggingOut ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}
      </Pressable>
    </View>
  );
}
