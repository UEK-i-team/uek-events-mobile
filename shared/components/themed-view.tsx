import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, ...rest }: ThemedViewProps) {
  return <View style={[{ backgroundColor: "transparent" }, style]} {...rest} />;
}
