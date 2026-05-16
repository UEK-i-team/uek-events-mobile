import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useContext, useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { FiltersBottomSheet } from "@/features/filters/components/filters-bottom-sheet";
import {
  FiltersProvider,
  useFilters,
} from "@/features/filters/contexts/filters-context";
import {
  NotificationProvider,
  NotificationToastContainer,
} from "@/features/notifications";
import { ViewedEventsProvider } from "@/features/viewed";
import {
  NewEventsProvider,
  useDailyEventsGate,
} from "@/features/daily-events";
import { EventContext, EventContextProvider } from "@/shared/context/EventContext/EventContext";
import { DependencyProvider } from "@/shared/di/DependencyProvider";
import { AppThemeColors, theme } from "@/shared/constants/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_MIN_DURATION_MS = 600;
const SPLASH_MAX_DURATION_MS = 2500;

function SplashController() {
  const { status } = useContext(EventContext);
  const startRef = useRef(Date.now());
  const hiddenRef = useRef(false);

  useEffect(() => {
    const hide = () => {
      if (hiddenRef.current) return;
      hiddenRef.current = true;
      SplashScreen.hideAsync().catch(() => {});
    };

    const isReady =
      status === "success" ||
      status === "error" ||
      status === "offline_no_data";

    if (isReady) {
      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(0, SPLASH_MIN_DURATION_MS - elapsed);
      const timer = setTimeout(hide, wait);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(hide, SPLASH_MAX_DURATION_MS);
    return () => clearTimeout(timer);
  }, [status]);

  return null;
}
import { ThemeProvider as AppThemeProvider, useTheme } from "@/shared/context/ThemeContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  useDailyEventsGate();
  const { isOpen, closeFilters } = useFilters();
  const { isDarkMode, colors } = useTheme();
  
  const router = useRouter();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      const eventId =
        lastNotificationResponse.notification.request.content.data.eventId;
      if (eventId) {
        router.push(`/event/${eventId}`);
      }
    }
  }, [lastNotificationResponse, router]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{
            headerShown: false,
            animation: "default",
            presentation: "card",
            gestureEnabled: true,
            freezeOnBlur: false,
          }}
        />
        <Stack.Screen
          name="daily-events"
          options={{
            headerShown: false,
            presentation: "card",
            gestureEnabled: false,
            animation: "fade_from_bottom",
          }}
        />
      </Stack>
      <FiltersBottomSheet isOpen={isOpen} onClose={closeFilters} />
      <NotificationToastContainer />
      <SplashController />
    </>
  );
}

function ThemedApp() {
  const { isDarkMode, colors } = useTheme();
  
  return (
    <ViewedEventsProvider>
      <FiltersProvider>
        <BottomSheetModalProvider>
          <AppContent />
          <StatusBar
            style={isDarkMode ? "light" : "dark"}
            backgroundColor={colors.mainBackground}
          />
        </BottomSheetModalProvider>
      </FiltersProvider>
    </ViewedEventsProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DependencyProvider>
        <NotificationProvider>
          <EventContextProvider>
            <ThemeProvider value={DefaultTheme}>
              <AppThemeProvider>
                <ThemedApp />
              </AppThemeProvider>
            </ThemeProvider>
          </EventContextProvider>
        </NotificationProvider>
      </DependencyProvider>
    </GestureHandlerRootView>
  );
}
