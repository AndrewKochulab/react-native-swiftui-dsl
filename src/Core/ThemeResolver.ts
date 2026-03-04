import { DSLColors, DSLColorConfig, ColorScheme, normalizeColors } from '../Theme/types';

export type ColorValue = string;

export function resolveColor(
  value: ColorValue,
  theme: ColorScheme,
  colors: DSLColorConfig,
): string {
  const normalized = normalizeColors(colors);
  if (value in normalized.light) {
    return normalized[theme][value];
  }
  return value;
}

export function isColorToken(
  value: string,
  colors: DSLColors,
): boolean {
  return value in colors;
}
