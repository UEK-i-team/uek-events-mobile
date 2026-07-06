import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme as useReactNativeColorScheme } from "react-native";

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
  const [themeType, setThemeType] = useState<ThemeType>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
          setThemeType(storedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference", error);
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
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };

  const isDarkMode =
    themeType === "system" ? systemColorScheme === "dark" : themeType === "dark";
  const colors = isDarkMode ? theme.dark : theme.light;

  const toggleTheme = () => {
    handleSetTheme(isDarkMode ? "light" : "dark");
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        themeType,
        isDarkMode,
        colors,
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
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