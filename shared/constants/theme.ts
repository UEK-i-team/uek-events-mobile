export type Theme = "light" | "dark";

export const theme = {
  light: {
    primary: "#FF6A2A",
    mainBackground: "#E1DDD9",
    ligth_grey: "#F4F3F2",
    dark_grey: "#111111",
    mainBackgroundDarker: '#D9D9D9'
  },
  dark: {
    primary: "#FF6A2A",
    mainBackground: "#E1DDD9",
    ligth_grey: "#F4F3F2",
    dark_grey: "#111111",
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

export function getTagColor(index: number) {
  const TAG_COLORS = [
    { bg: "#E3F2FD", text: "#1976D2" },
    { bg: "#E8F5E9", text: "#388E3C" },
    { bg: "#FFF3E0", text: "#F57C00" },
    { bg: "#F3E5F5", text: "#7B1FA2" },
    { bg: "#FCE4EC", text: "#C2185B" },
    { bg: "#E0F2F1", text: "#00796B" },
  ];
  return TAG_COLORS[index % TAG_COLORS.length];
}
