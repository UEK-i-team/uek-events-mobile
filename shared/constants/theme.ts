export type Theme = "light" | "dark";

export const theme = {
  light: {
    primary: "#FF6A2A",
    mainBackground: "#E1DDD9",
    ligth_grey: "#F4F3F2",
    dark_grey: "#111111",
    textMuted: "#666666",
    mainBackgroundDarker: '#D9D9D9',
    mainBackgroundLighter: '#E9E8E8',
    red_light: '#FFE7E7',
    red_regular: '#FF5252'
  },
  dark: {
    primary: "#FF6A2A",
    mainBackground: "#E1DDD9",
    ligth_grey: "#F4F3F2",
    dark_grey: "#111111",
    textMuted: "#666666",
  },
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
