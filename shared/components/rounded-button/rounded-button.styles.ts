import { StyleSheet } from "react-native";

export type RoundedButtonSize = "medium" | "small";

const sizeMap: Record<
  RoundedButtonSize,
  { container: number; icon: number; borderRadius: number }
> = {
  medium: { container: 60, icon: 30, borderRadius: 16 },
  small: { container: 48, icon: 24, borderRadius: 12 },
};

export const getSizeConfig = (size: RoundedButtonSize) => sizeMap[size];

export const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
