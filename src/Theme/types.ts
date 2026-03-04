export type ColorScheme = 'light' | 'dark';

export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BorderRadiusToken = 'sm' | 'md' | 'lg';
export type FontSizeToken =
  | 'micro'
  | 'small'
  | 'caption'
  | 'footnote'
  | 'body'
  | 'subtitle'
  | 'title2'
  | 'title'
  | 'header'
  | 'hero';

export type RequiredFontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';
export type OptionalFontWeightToken = 'thin' | 'ultralight' | 'light' | 'heavy' | 'black';
export type FontWeightToken = RequiredFontWeightToken | OptionalFontWeightToken;

export interface DSLFonts {
  size: Record<FontSizeToken, number>;
  weight: Record<RequiredFontWeightToken, string> & Partial<Record<OptionalFontWeightToken, string>>;
  lineHeight: Record<string, number>;
}

export interface DSLLayout {
  spacing: Record<SpacingToken, number>;
  borderRadius: Record<BorderRadiusToken, number>;
}

export interface DSLColors {
  [key: string]: string;
}

export type DSLColorConfig = { light: DSLColors; dark: DSLColors } | DSLColors;

export function normalizeColors(colors: DSLColorConfig): { light: DSLColors; dark: DSLColors } {
  if ('light' in colors && 'dark' in colors &&
      typeof colors.light === 'object' && typeof colors.dark === 'object') {
    return colors as { light: DSLColors; dark: DSLColors };
  }
  return { light: colors as DSLColors, dark: colors as DSLColors };
}

export interface DSLThemeConfig {
  colors: DSLColorConfig;
  fonts: DSLFonts;
  layout: DSLLayout;
}
