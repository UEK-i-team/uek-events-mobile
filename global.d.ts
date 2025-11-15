/// <reference types="expo/types" />

// Deklaracja typów dla zmiennych środowiskowych Expo
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_IS_API_MOCK_ENABLED?: string;
    EXPO_PUBLIC_API_BASE_URL?: string;
    // Dodaj tutaj więcej zmiennych środowiskowych z prefiksem EXPO_PUBLIC_
  }
}

