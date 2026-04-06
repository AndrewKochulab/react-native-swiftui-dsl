import { DSLColors, DSLColorConfig, ColorScheme } from '@/Theme/types';
import { RNColor } from '@/Tokens/RNStyle';
import { DSLWarnings } from '@/Constants/Messages';
import { isObject, ColorSchemeField } from '@/Tokens/TypeGuards';

/** CSS color format prefixes for raw color detection. */
const CSS_COLOR_PREFIX = {
  hex: '#',
  rgb: 'rgb',
  hsl: 'hsl',
} as const;

export type ColorValue = string;

/**
 * Normalizes a DSLColorConfig into a consistent `{ light, dark }` structure.
 * Accepts either a flat color map or a dual-scheme `{ light, dark }` object.
 */
export function normalizeColors(colors: DSLColorConfig): { light: DSLColors; dark: DSLColors } {
  if (
    ColorSchemeField.light in colors &&
    ColorSchemeField.dark in colors &&
    isObject(colors[ColorSchemeField.light]) &&
    isObject(colors[ColorSchemeField.dark])
  ) {
    return colors as { light: DSLColors; dark: DSLColors };
  }
  return {
    [ColorSchemeField.light]: colors as DSLColors,
    [ColorSchemeField.dark]: colors as DSLColors,
  };
}

// Tracks which unknown color values have been warned about to avoid spam
const warnedColors = new Set<string>();

/**
 * Resolves a color value against the theme.
 * If the value is a known theme token, returns the themed color.
 * If not, returns the raw value (hex, rgb, etc.) with a dev warning for likely typos.
 */
export function resolveColor(
  value: ColorValue,
  theme: ColorScheme,
  colors: DSLColorConfig,
): string {
  const normalized = normalizeColors(colors);
  if (value in normalized.light) {
    return normalized[theme][value];
  }

  // Warn in development if value looks like an unresolved token (no # or rgb prefix)
  if (__DEV__ && !isRawColorValue(value) && !warnedColors.has(value)) {
    warnedColors.add(value);
    // eslint-disable-next-line no-console
    console.warn(
      DSLWarnings.unknownColorToken(value, Object.keys(normalized.light).join(', ')),
    );
  }

  return value;
}

/**
 * Checks if a value looks like a raw CSS color (hex, rgb, rgba, hsl, named color).
 */
function isRawColorValue(value: string): boolean {
  return (
    value.startsWith(CSS_COLOR_PREFIX.hex) ||
    value.startsWith(CSS_COLOR_PREFIX.rgb) ||
    value.startsWith(CSS_COLOR_PREFIX.hsl) ||
    value === RNColor.transparent ||
    value === RNColor.inherit
  );
}

export function isColorToken(
  value: string,
  colors: DSLColors,
): boolean {
  return value in colors;
}
