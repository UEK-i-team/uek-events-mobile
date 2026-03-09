import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface SvgIconProps {
  Icon: React.ComponentType<SvgProps> | any;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function SvgIcon({ Icon, size = 24, color, style }: SvgIconProps) {
  // Sprawdź czy Icon jest komponentem React
  if (!Icon || (typeof Icon !== 'function' && typeof Icon !== 'object')) {
    console.warn('SvgIcon: Icon must be a React component. Got:', typeof Icon, Icon);
    return null;
  }

  // Jeśli Icon jest liczbą (asset ID), to znaczy że transformer nie zadziałał
  if (typeof Icon === 'number') {
    console.error('SvgIcon: SVG was imported as asset ID instead of component. Please restart Metro bundler with --reset-cache');
    return null;
  }

  const IconComponent = Icon as React.ComponentType<SvgProps>;
  
  return (
    <IconComponent
      width={size}
      height={size}
      fill={color}
      color={color}
      style={style}
    />
  );
}

