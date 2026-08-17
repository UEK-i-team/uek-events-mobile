export type ThemeType = "light" | "dark" | "system";
export type Theme = ThemeType;

export interface AppThemeColors {
  primary: string;
  mainBackground: string;
  mainBackgroundDarker: string;
  mainBackgroundLighter: string;
  surface: string;
  light_grey: string;
  ligth_grey: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  icon: string;
  dark_grey: string;
  backgroundDeep: string;
  red_light: string;
  red_ultra_light: string;
  red_regular: string;
}

export interface AppTheme {
  colors: AppThemeColors;
  isDark: boolean;
}

export const lightThemeColors: AppThemeColors = {
  primary: "#FF6A2A",
  mainBackground: "#F6F6F6",
  mainBackgroundDarker: "#D9D9D9",
  mainBackgroundLighter: "#E9E8E8",
  surface: "#F6F6F6",
  light_grey: "#F4F3F2",
  ligth_grey: "#F4F3F2",
  textPrimary: "#111111",
  textSecondary: "#666666",
  textMuted: "#666666",
  border: "#111111",
  icon: "#111111",
  dark_grey: "#111111",
  backgroundDeep: "#D9D9D9",
  red_light: "#FFE7E7",
  red_ultra_light: "#FFF9F9",
  red_regular: "#FF5252",
};

export const darkThemeColors: AppThemeColors = {
  primary: "#FF6A2A",
  mainBackground: "#302E2E",
  mainBackgroundDarker: "#000000",
  mainBackgroundLighter: "#3A3838",
  surface: "#302E2E",
  light_grey: "#5C5A5A",
  ligth_grey: "#5C5A5A",
  textPrimary: "#FFFFFF",
  textSecondary: "#E9E9E9",
  textMuted: "#AAAAAA",
  border: "#5C5A5A",
  icon: "#E9E9E9",
  dark_grey: "#111111",
  backgroundDeep: "#000000",
  red_light: "#F4F3F2",
  red_ultra_light: "#FFFAFA",
  red_regular: "#FF5252",
};

export const theme = {
  light: lightThemeColors,
  dark: darkThemeColors,
};

// To delete soon
export const Colors = {
light: {
text: "#000000",
background: "#FFFFFF",
icon: "#687076",
tint: "#0a7ea4",
tabIconDefault: "#687076",
tabIconSelected: "#0a7ea4",
},
dark: {
text: "#000000",
background: "#FFFFFF",
icon: "#687076",
tint: "#0a7ea4",
tabIconDefault: "#687076",
tabIconSelected: "#0a7ea4",
},
};

export const Fonts = {
default: {
fontSize: 16,
lineHeight: 24,
},
title: {
fontSize: 32,
fontWeight: "bold" as const,
lineHeight: 32,
},
subtitle: {
fontSize: 20,
fontWeight: "bold" as const,
},
};

const MAIN_CATEGORIES_MAP: Record<string, string> = {
"biznes": "#9BD9F2",
"technologia": "#DAB1E3",
"nauka": "#A0D9AF",
"finanse": "#88C9FC",
"rozwój osobisty": "#FBD057",
"it": "#CAAEE8",
"badania naukowe": "#CCD9A0",
"marketing": "#CFA896"

};

const SUB_TAGS_PALETTE = [
"#5FAFA2",
"#ffa299",
"#ff896a",
"#FFA13D",
"#bc5490",
"#C99EA5",
"#8CA2D6", //stonowany niebieski, można uzyć do jakiegos finansowego
"#D98336", // Stonowany, ciepły rudy/ochra
"#7FA699", // Matowy, skandynawski morski
"#B5A4CB", // Przybrudzony jasny fiolet
];

export function getTagColor(tagName: string, eventHasPassed?: boolean): string {
  if (eventHasPassed) return "#BDBDBD";

  const normalized = (tagName || "").toLowerCase().trim();

  if (MAIN_CATEGORIES_MAP[normalized]) {
    return MAIN_CATEGORIES_MAP[normalized];
  }


  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }

  const paletteIndex = Math.abs(hash % SUB_TAGS_PALETTE.length);
  return SUB_TAGS_PALETTE[paletteIndex];
}
