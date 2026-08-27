import { useEffect, useState } from "react";
import { Image as RNImage } from "react-native";
import { getColors } from "react-native-image-colors";
import { ImageContentFit } from "expo-image";

import {
  IMAGE_TRANSPARENT_BG,
  theme,
} from "@/shared/constants/theme";
import { useImageTransparency } from "@/shared/hooks/use-image-transparency";

export const useResizeDominantBackgroundColor = (imageUrl: string | null) => {
  const [dominantColor, setDominantColor] = useState<string>(
    theme.light.mainBackground,
  );
  const [resizeMode, setResizeMode] = useState<ImageContentFit>("contain");
  const { hasAlpha } = useImageTransparency(imageUrl);

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
        () => {
          // silently handle image size error
        },
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
        .catch(() => {
          // silently handle color extraction error
        });
    }
  }, [imageUrl]);

  const backgroundColor = hasAlpha ? IMAGE_TRANSPARENT_BG : dominantColor;

  return { dominantColor, backgroundColor, resizeMode };
};
