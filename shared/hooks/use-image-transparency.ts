import { useEffect, useState } from "react";

import { detectImageHasAlpha } from "@/shared/utils/image-transparency";

export function useImageTransparency(url: string | null): { hasAlpha: boolean } {
  const [hasAlpha, setHasAlpha] = useState(false);

  useEffect(() => {
    if (!url) {
      setHasAlpha(false);
      return;
    }

    let isActive = true;

    detectImageHasAlpha(url)
      .then((result) => {
        if (isActive) {
          setHasAlpha(result);
        }
      })
      .catch(() => {
        if (isActive) {
          setHasAlpha(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [url]);

  return { hasAlpha };
}
