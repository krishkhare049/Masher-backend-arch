import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { useAppTheme } from '../ThemeContext';

export default function AppText({ style, ...props }: TextProps) {
  const { fontFamily, fontSize, colors } = useAppTheme();

  const styleObj = (Array.isArray(style) ? Object.assign({}, ...style) : style) as TextStyle;

  const hasExplicitFontFamily = styleObj?.fontFamily;
  const hasExplicitFontSize = styleObj?.fontSize;
  const hasExplicitColor = styleObj?.color;

  const finalStyle: StyleProp<TextStyle> = [
    {
      ...(hasExplicitFontFamily ? {} : fontFamily ? { fontFamily } : {}),
      ...(hasExplicitFontSize ? {} : { fontSize }),
      ...(hasExplicitColor ? {} : { color: colors.text }), // ✅ use colors.text only if not set
    },
    style,
  ];

  return (
    <Text
      {...props}
      style={finalStyle}
    />
  );
}
