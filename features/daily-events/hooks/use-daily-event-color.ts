import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

import { theme } from "@/shared/constants/theme";

export const useDailyEventColor = (imageUrl: string | null) => {
  const [dominantColor, setDominantColor] = useState<string>(
    theme.light.mainBackground,
  );

  useEffect(() => {
    if (!imageUrl) return;

    let isActive = true;

    getColors(imageUrl, {
      fallback: theme.light.mainBackground,
      cache: true,
      key: imageUrl,
    })
      .then((colors) => {
        if (!isActive) return;

        let color: string | undefined;

        if (colors.platform === "android") {
          color = colors.dominant || colors.average || colors.vibrant;
        } else if (colors.platform === "ios") {
          color = colors.background || colors.primary || colors.detail;
        } else {
          color = (colors as any).dominant || (colors as any).vibrant;
        }

        setDominantColor(color || theme.light.mainBackground);
      })
      .catch(() => {
        // silently keep fallback color
      });

    return () => {
      isActive = false;
    };
  }, [imageUrl]);

  return { dominantColor };
};
