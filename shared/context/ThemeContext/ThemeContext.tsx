import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useColorScheme as useReactNativeColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppThemeColors, ThemeType, theme } from "../../constants/theme";

const THEME_STORAGE_KEY = "@app_theme_preference";

interface ThemeContextProps {
  themeType: ThemeType;
  isDarkMode: boolean;
  colors: AppThemeColors;
  setTheme: (type: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useReactNativeColorScheme();
  
  // Default strictly to "system", then load from AsyncStorage
  const [themeType, setThemeType] = useState<ThemeType>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
          setThemeType(storedTheme);
        }
      } catch (e) {
        console.error("Failed to load theme preference", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const handleSetTheme = async (type: ThemeType) => {
    setThemeType(type);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, type);
    } catch (e) {
      console.error("Failed to save theme preference", e);
    }
  };

  const toggleTheme = () => {
    handleSetTheme(isDarkMode ? "light" : "dark");
  };

  const isDarkMode = themeType === "system" ? systemColorScheme === "dark" : themeType === "dark";
  const colors = isDarkMode ? theme.dark : theme.light;

  if (!isLoaded) return null; // Wait for initial theme to load

  return (
    <ThemeContext.Provider value={{ themeType, isDarkMode, colors, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
