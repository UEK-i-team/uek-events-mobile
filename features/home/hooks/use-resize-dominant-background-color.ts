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
      // Determine resize mode based on dimensions
      RNImage.getSize(
        imageUrl,
        (width, height) => {
          if (width <= 1.3 * height) {
            setResizeMode("cover");
          } else {
            setResizeMode("contain");
          }
        },
        (error) => {
          // here you have to handle error handling for image size error
        }
      );

      getColors(imageUrl, {
        fallback: theme.light.mainBackground,
        cache: true,
        key: imageUrl,
      })
        .then((colors) => {
          const color =
            (colors as any).background ||
            (colors as any).dominant ||
            (colors as any).primary ||
            theme.light.mainBackground;
          setDominantColor(color);
        })
        .catch((err) => {
          // silently handle color extraction error
        });
    }
  }, [imageUrl]);

  return { dominantColor, resizeMode };
};
