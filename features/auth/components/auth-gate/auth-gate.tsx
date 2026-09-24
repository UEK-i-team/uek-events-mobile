import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/shared/context/ThemeContext";

import { useAuth } from "../../contexts/auth-context";
import { useEndSession } from "../../hooks/use-end-session";
import { useOtpLogin } from "../../hooks/use-otp-login";
import { EmailStep } from "../email-step/email-step";
import { OtpStep } from "../otp-step/otp-step";
import { getStyles } from "./auth-gate.styles";

interface AuthGateProps {
  children: React.ReactNode;
  /**
   * Render children while the session cannot be confirmed (initializing or
   * offline) because locally stored data can be shown. Never bypasses the
   * login screen once the session is known to be gone.
   */
  allowOfflineAccess?: boolean;
  /** False while the caller is still checking whether offline data exists. */
  isOfflineAccessReady?: boolean;
}

export function AuthGate({
  children,
  allowOfflineAccess = false,
  isOfflineAccessReady = true,
}: AuthGateProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { status, authSessionService } = useAuth();
  const otpLogin = useOtpLogin({ authSessionService });
  const { loggingOut, endSession } = useEndSession();
  const leftLoginFormRef = useRef(false);
  const [retrying, setRetrying] = useState(false);

  const handleRetryRestore = async () => {
    setRetrying(true);
    try {
      await authSessionService.restore();
    } finally {
      setRetrying(false);
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

  const canUseOfflineAccess = allowOfflineAccess && isOfflineAccessReady;

  if (
    canUseOfflineAccess &&
    (status === "initializing" || status === "unverified")
  ) {
    return <>{children}</>;
  }

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
            onPress={() => void endSession()}
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
