export type Theme = "light" | "dark";

export const theme = {
  light: {
    primary: "#FF6A2A",
    mainBackground: "#E1DDD9",
    ligth_grey: "#F4F3F2",
    dark_grey: "#111111",
    textMuted: "#666666",
    mainBackgroundDarker: '#D9D9D9',
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
"kariera": "#111111",
"warsztaty": "#111111",
"biznes": "#5FAFA2",            // Jasny turkusowy
"technologia": "#8CA2D6",       // Przyjemny niebieski
"nauka": "#9CC2A6",             // Żółty
"prawo": "#C97B88",
"finanse": "#88C9FC",             // Różowy
"rozwój osobisty": "#F4CA55",             // żółty
"it": "#E760BF",

};

const SUB_TAGS_PALETTE = [
"#ffbec6",
"#ffa299",
"#ff896a",
"#FFA13D", // Jasny kremowy pomarańcz
"#bc5490",
"#fe535e",
"#8CA2D6", // Przygaszony błękitny / lawendowy (lewy telefon)
"#D98336", // Stonowany, ciepły rudy/ochra (środkowy telefon)
"#7FA699", // Matowy, skandynawski morski (prawy telefon)
"#B5A4CB", // Przybrudzony jasny fiolet
"#CFA896"  // Ciepły, ziemisty beż/pastel
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
