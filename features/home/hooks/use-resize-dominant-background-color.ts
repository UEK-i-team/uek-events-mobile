import { useEffect, useState } from "react";
import { Image as RNImage, ImageResizeMode } from "react-native";
import { getColors } from "react-native-image-colors";
import { theme } from "@/shared/constants/theme";
import { ImageContentFit } from "expo-image";

export const useResizeDominantBackgroundColor = (imageUrl: string | null) => {
  const [dominantColor, setDominantColor] = useState<string>(
    theme.light.mainBackground
  );
  const [resizeMode, setResizeMode] = useState<ImageContentFit>("contain");

  useEffect(() => {
    if (imageUrl) {
      // Encode URL spaces and specific characters like parentheses that can cause NSURL to return nil on iOS
      const encodedImageUrl = encodeURI(imageUrl)
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');

      // Determine resize mode based on dimensions
      RNImage.getSize(
        encodedImageUrl,
        (width, height) => {
          if (width <= 1.3 * height) {
            setResizeMode("cover");
          } else {
            setResizeMode("contain");
          }
        },
        (error) => console.warn("Failed to get image size:", error)
      );

      getColors(encodedImageUrl, {
        fallback: theme.light.mainBackground,
        cache: true,
        key: encodedImageUrl,
      })
        .then((colors) => {
          // Prioritize vivid dominant/primary colors over edge-based background colors 
          const color =
            (colors as any).background ||
            (colors as any).dominant ||
            (colors as any).primary ||
            (colors as any).average ||
            theme.light.mainBackground;
          setDominantColor(color);
        })
        .catch((err) => {
          console.warn("Failed to extract color for card:", err);
        });
    }
  }, [imageUrl]);

  return { dominantColor, resizeMode };
};
