/**
 * Theme configuration types.
 *
 * All token types are DERIVED from Token enums — single source of truth.
 * This file contains ONLY type definitions — no runtime logic.
 */

import type { SpacingToken, BorderRadiusToken, EdgeToken, BreakpointRange, BreakpointDefinition, CustomBreakpoint } from '@/Tokens/Layout';
import type { FontSizeToken, FontWeightToken, RequiredFontWeightToken, OptionalFontWeightToken } from '@/Tokens/Font';
import type { ColorSchemeToken } from '@/Tokens/Interaction';
import type { ButtonVariantToken, ModalAnimationToken, SpinnerSizeToken } from '@/Tokens/Component';
import type { TextDecorationToken } from '@/Tokens/Style';

// Re-export token types so existing imports from './Theme/types' continue working
export type { SpacingToken, BorderRadiusToken, BreakpointRange, BreakpointDefinition, CustomBreakpoint };
export type { FontSizeToken, FontWeightToken, RequiredFontWeightToken, OptionalFontWeightToken };
export type { ColorSchemeToken as ColorScheme };
export type { ButtonVariantToken, ModalAnimationToken, SpinnerSizeToken, TextDecorationToken };

// --- Font config ---

export interface DSLFonts {
  size: Record<FontSizeToken, number>;
  weight: Record<RequiredFontWeightToken, string> & Partial<Record<OptionalFontWeightToken, string>>;
  lineHeight: Record<string, number>;
}

// --- Layout config ---

export interface DSLLayout {
  spacing: Record<SpacingToken, number>;
  borderRadius: Record<BorderRadiusToken, number>;
}

// --- Color config ---

export interface DSLColors {
  [key: string]: string;
}

export type DSLColorConfig = { light: DSLColors; dark: DSLColors } | DSLColors;

// --- Responsive theme configuration ---

export interface ResponsiveThemeConfig {
  breakpoints?: Partial<BreakpointDefinition>;
  customBreakpoints?: CustomBreakpoint[];
}

// --- Component-level theme overrides ---

export interface DSLComponentConfig {
  input?: {
    borderRadius?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    minHeight?: number;
    labelMarginBottom?: number;
    errorMarginTop?: number;
    wrapperMarginBottom?: number;
    labelFontSize?: FontSizeToken;
    labelFontWeight?: FontWeightToken;
    errorFontSize?: FontSizeToken;
    placeholderColor?: string;
  };
  button?: {
    height?: number;
    cornerRadius?: number;
    paddingHorizontal?: number;
    iconSpacing?: number;
    borderWidth?: number;
    fontWeight?: FontWeightToken;
    fontSize?: FontSizeToken;
    defaultStyle?: ButtonVariantToken;
  };
  icon?: {
    defaultSize?: number;
  };
  divider?: {
    color?: string;
  };
  link?: {
    color?: string;
    fontSize?: FontSizeToken;
    textDecoration?: TextDecorationToken;
  };
  modal?: {
    animationType?: ModalAnimationToken;
    transparent?: boolean;
  };
  progressBar?: {
    height?: number;
    cornerRadius?: number;
  };
  spinner?: {
    defaultSize?: SpinnerSizeToken;
  };
  interaction?: {
    pressedOpacity?: number;
  };
}

// --- Main theme config ---

export interface DSLThemeConfig {
  colors: DSLColorConfig;
  fonts: DSLFonts;
  layout: DSLLayout;
  responsive?: ResponsiveThemeConfig;
  components?: DSLComponentConfig;
}
