import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { FiltersBottomSheet } from '@/components/filters-bottom-sheet';
import { FiltersProvider, useFilters } from '@/contexts/filters-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { isOpen, closeFilters } = useFilters();
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen 
          name="event/[id]" 
          options={{ 
            headerShown: false,
            animation: 'default',
            presentation: 'card',
            gestureEnabled: true,
            freezeOnBlur: false,
          }} 
        />
      </Stack>
      <FiltersBottomSheet isOpen={isOpen} onClose={closeFilters} />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <FiltersProvider>
          <AppContent />
          <StatusBar style="auto" />
        </FiltersProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
