import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../contexts/auth-context";

export function useEndSession() {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const endSession = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      Alert.alert(
        "Nie udało się zakończyć sesji",
        "Nie udało się zakończyć sesji na tym urządzeniu. Spróbuj ponownie.",
      );
    } finally {
      setLoggingOut(false);
    }
  }, [logout]);

  return { loggingOut, endSession };
}
