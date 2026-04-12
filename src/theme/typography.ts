// Typography tokens — Reportify Design System
import { TextStyle } from 'react-native';

export const FontSize = {
  title: 28,
  subtitle: 18,
  body: 14,
  small: 13,
  caption: 12,
  label: 11,
  micro: 10,
} as const;

export const FontWeight: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
};

export const LineHeight = {
  title: 34,
  subtitle: 24,
  body: 22,
  small: 20,
  caption: 18,
  label: 14,
  micro: 14,
} as const;

export const LetterSpacing = {
  label: 0.07 * 11, // em to px approx
  tight: -0.3,
  normal: 0,
} as const;

// Pre-composed text styles for convenience
export const TextStyles = {
  title: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.medium,
    lineHeight: LineHeight.title,
  } as TextStyle,
  subtitle: {
    fontSize: FontSize.subtitle,
    fontWeight: FontWeight.medium,
    lineHeight: LineHeight.subtitle,
  } as TextStyle,
  body: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.body,
  } as TextStyle,
  small: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.small,
  } as TextStyle,
  caption: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.caption,
  } as TextStyle,
  label: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    lineHeight: LineHeight.label,
    letterSpacing: 0.77,
    textTransform: 'uppercase',
  } as TextStyle,
  micro: {
    fontSize: FontSize.micro,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.micro,
  } as TextStyle,
} as const;
