import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';

interface EventImageContainerProps {
  imageUrl: string;
  width?: number; // Make optional if sometimes missing
  height?: number;
  extractedColor?: string;
  cornerRadius?: number;
  customWidth?: number;
  // Gdy true, obrazek wypełnia rodzica zamiast liczyć własne wymiary z proporcji.
  fill?: boolean;
}

export const EventImageContainer: React.FC<EventImageContainerProps> = ({
  imageUrl,
  width = 1,
  height = 1,
  extractedColor,
  cornerRadius = 16,
  customWidth,
  fill = false,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  // (screenWidth - padding) / columns
  const columnWidth = customWidth ?? (screenWidth - 48) / 2;

  const calculatedHeight = useMemo(() => {
    const safeAspectWidth = width > 0 ? width : 1;
    const safeAspectHeight = height > 0 ? height : 1;
    
    const aspectRatio = safeAspectWidth / safeAspectHeight;
    let heightFromRatio = columnWidth / Math.max(aspectRatio, 0.1);

    const maxHeight = columnWidth * 1.5;
    const minHeight = columnWidth * 0.5;
    
    if (heightFromRatio > maxHeight) return maxHeight;
    if (heightFromRatio < minHeight) return minHeight;
    
    return heightFromRatio;
  }, [width, height, columnWidth]);

  return (
    <View
      style={[
        styles.container,
        fill
          ? { width: '100%', height: '100%' }
          : { width: columnWidth, height: calculatedHeight },
        {
          backgroundColor: extractedColor || '#E1DDD9',
          borderRadius: cornerRadius,
        },
      ]}
    >
      <Image
        source={imageUrl}
        placeholder={extractedColor || '#E1DDD9'}
        contentFit="contain"
        transition={300}
        style={[styles.image, { borderRadius: cornerRadius }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
