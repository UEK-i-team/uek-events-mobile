import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/shared/context/ThemeContext";

import { useAuth } from "../../contexts/auth-context";
import { useOtpLogin } from "../../hooks/use-otp-login";
import { EmailStep } from "../email-step/email-step";
import { OtpStep } from "../otp-step/otp-step";
import { getStyles } from "./auth-gate.styles";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { status, authSessionService, logout } = useAuth();
  const otpLogin = useOtpLogin({ authSessionService });
  const leftLoginFormRef = useRef(false);
  const [retrying, setRetrying] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleRetryRestore = async () => {
    setRetrying(true);
    try {
      await authSessionService.restore();
    } finally {
      setRetrying(false);
    }
  };

  const handleEndSession = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      Alert.alert(
        "Nie udało się zakończyć sesji",
        "Spróbuj ponownie za chwilę.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" || status === "unverified") {
      leftLoginFormRef.current = true;
      return;
    }

    if (status === "unauthenticated" && leftLoginFormRef.current) {
      otpLogin.clearFlow();
      leftLoginFormRef.current = false;
    }
  }, [status, otpLogin.clearFlow]);

  if (status === "initializing") {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  if (status === "unverified") {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.retryContent}>
          <Text style={styles.retryTitle}>Nie udało się połączyć</Text>
          <Text style={styles.retryMessage}>
            Sprawdź połączenie z internetem i spróbuj ponownie. Twoja sesja
            logowania została zachowana.
          </Text>
          <Pressable
            style={[styles.retryButton, retrying && styles.retryButtonDisabled]}
            onPress={() => void handleRetryRestore()}
            disabled={retrying || loggingOut}
          >
            {retrying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.retryButtonText}>Spróbuj ponownie</Text>
            )}
          </Pressable>
          <Pressable
            style={[
              styles.secondaryButton,
              loggingOut && styles.secondaryButtonDisabled,
            ]}
            onPress={() => void handleEndSession()}
            disabled={retrying || loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator color={colors.textSecondary} />
            ) : (
              <Text style={styles.secondaryButtonText}>Zaloguj się na nowo</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {otpLogin.step === "email" ? (
        <EmailStep
          email={otpLogin.email}
          loading={otpLogin.loading}
          error={otpLogin.error}
          infoMessage={otpLogin.infoMessage}
          onEmailChange={otpLogin.setEmail}
          onSubmit={otpLogin.submitEmail}
        />
      ) : (
        <OtpStep
          email={otpLogin.email}
          loading={otpLogin.loading}
          error={otpLogin.error}
          infoMessage={otpLogin.infoMessage}
          resendCooldown={otpLogin.resendCooldown}
          onSubmit={otpLogin.submitCode}
          onResend={otpLogin.resendCode}
          onBack={otpLogin.goBackToEmail}
        />
      )}
    </SafeAreaView>
  );
}
