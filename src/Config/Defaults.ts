import type { SpacingToken, DSLThemeConfig } from '../Theme/types';

/**
 * Centralized default values used across the DSL framework.
 * All framework defaults are defined here to avoid magic numbers
 * and scattered hard-coded values throughout the codebase.
 */
export const DSLDefaults = {
  /** Default spacing token used when no value is provided for padding, margin, contentPadding. */
  spacing: 'md' as SpacingToken,

  /** Default edge used when no edge is provided for padding, margin, contentPadding. */
  edge: 'all' as const,

  /** Default flex value when .flex() is called without arguments. */
  flex: 1,

  /** Default keyboard avoiding offset in points. */
  keyboardAvoidingOffset: 100,

  /** Default keyboard should persist taps behavior. */
  keyboardShouldPersistTaps: 'handled' as const,

  /** Default bounces behavior for scroll views. */
  bounces: true,

  /** Default shadow configuration applied by .shadow() with no arguments. */
  shadow: {
    color: 'cardShadow',
    offset: { width: 0, height: 2 },
    opacity: 1,
    radius: 8,
    elevation: 3,
  },

  /** TextInput styling defaults used by DSLRenderer. */
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    labelMarginBottom: 6,
    errorMarginTop: 4,
    wrapperMarginBottom: 12,
  },

  /** Default icon size in points when none is specified. */
  iconSize: 18,

  /** Opacity applied to pressable elements in the pressed state. */
  pressedOpacity: 0.9,

  /** Full opacity for non-pressed state. */
  fullOpacity: 1,

  /** Default button height in points. */
  buttonHeight: 48,

  /** Default button corner radius in points. */
  buttonCornerRadius: 12,

  /** Default button horizontal padding in points. */
  buttonPaddingHorizontal: 16,

  /** Default button icon spacing in points. */
  buttonIconSpacing: 8,

  /** Default button font size token. */
  buttonFontSize: 'body' as const,

  /** Default button outlined border width. */
  buttonBorderWidth: 1.5,

  /** Default image resize mode. */
  imageResizeMode: 'cover' as const,

  /** Default separator/divider color token. */
  dividerColor: 'separator',

  /** Default link color token. */
  linkColor: 'tint',

  /** Default onEndReached threshold for lazy lists. */
  onEndReachedThreshold: 0.5,

  /** Fallback font weight values for optional weight tokens. */
  fontWeightFallbacks: {
    thin: '100',
    ultralight: '200',
    light: '300',
    heavy: '800',
    black: '900',
  } as Record<string, string>,

  /** Default progress bar height in points. */
  progressBarHeight: 4,

  /** Default progress bar corner radius in points. */
  progressBarCornerRadius: 2,
} as const;

/**
 * Default theme configuration used when no DSLThemeProvider is present.
 * Based on iOS Human Interface Guidelines system values.
 */
export const defaultThemeConfig: DSLThemeConfig = {
  colors: {
    light: {
      text: '#000000',
      background: '#FFFFFF',
      tint: '#007AFF',
      card: '#F2F2F7',
      secondaryText: '#8E8E93',
      separator: '#C6C6C8',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      inputBackground: '#F2F2F7',
      buttonText: '#FFFFFF',
      cardShadow: 'rgba(0,0,0,0.1)',
    },
    dark: {
      text: '#FFFFFF',
      background: '#000000',
      tint: '#0A84FF',
      card: '#1C1C1E',
      secondaryText: '#8E8E93',
      separator: '#38383A',
      error: '#FF453A',
      success: '#30D158',
      warning: '#FF9F0A',
      inputBackground: '#1C1C1E',
      buttonText: '#FFFFFF',
      cardShadow: 'rgba(0,0,0,0.3)',
    },
  },
  fonts: {
    size: {
      micro: 10,
      small: 11,
      caption: 12,
      footnote: 13,
      body: 17,
      subtitle: 20,
      title2: 22,
      title: 28,
      header: 34,
      hero: 40,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 16,
      normal: 22,
      relaxed: 28,
      loose: 34,
    },
  },
  layout: {
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    borderRadius: { sm: 4, md: 8, lg: 16 },
  },
};
