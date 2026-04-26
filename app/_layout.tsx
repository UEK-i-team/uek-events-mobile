import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
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
import { EventContextProvider } from "@/shared/context/EventContext/EventContext";
import { DependencyProvider } from "@/shared/di/DependencyProvider";
import { theme } from "@/shared/constants/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const { isOpen, closeFilters } = useFilters();
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
      </Stack>
      <FiltersBottomSheet isOpen={isOpen} onClose={closeFilters} />
      <NotificationToastContainer />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DependencyProvider>
        <NotificationProvider>
          <EventContextProvider>
            <ThemeProvider value={DefaultTheme}>
              <ViewedEventsProvider>
                <FiltersProvider>
                  <BottomSheetModalProvider>
                    <AppContent />
                    <StatusBar
                      style="dark"
                      backgroundColor={theme.light.mainBackground}
                    />
                  </BottomSheetModalProvider>
                </FiltersProvider>
              </ViewedEventsProvider>
            </ThemeProvider>
          </EventContextProvider>
        </NotificationProvider>
      </DependencyProvider>
    </GestureHandlerRootView>
  );
}
