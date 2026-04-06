import type { SpacingToken, FontWeightToken, FontSizeToken, DSLThemeConfig } from '@/Theme/types';
import type { EasingPreset, TransitionEffect } from '@/Animation/types';
import { Color } from '@/Tokens/Color';
import { Font, Weight } from '@/Tokens/Font';
import { Spacing, Edge } from '@/Tokens/Layout';
import { Easing as EasingToken, Transition, AnimationType } from '@/Tokens/Animation';
import { ButtonVariant, ModalAnimation, ImageResize, SpinnerSize, KeyboardPersistTaps } from '@/Tokens/Component';
import { TextDecoration } from '@/Tokens/Style';

/**
 * Centralized default values used across the DSL framework.
 * All framework defaults are defined here to avoid magic numbers
 * and scattered hard-coded values throughout the codebase.
 *
 * Every value is parameterizable — projects can override via DSLThemeConfig.components
 * or by passing explicit parameters to component functions and modifiers.
 */
export const DSLDefaults = {
  /** Default spacing token used when no value is provided for padding, margin, contentPadding. */
  spacing: Spacing.md as SpacingToken,

  /** Default edge used when no edge is provided for padding, margin, contentPadding. */
  edge: Edge.all,

  /** Default flex value when .flex() is called without arguments. */
  flex: 1,

  /** Default keyboard avoiding offset in points. */
  keyboardAvoidingOffset: 100,

  /** Default keyboard should persist taps behavior. */
  keyboardShouldPersistTaps: KeyboardPersistTaps.handled,

  /** Default bounces behavior for scroll views. */
  bounces: true,

  /** Default shadow configuration applied by .shadow() with no arguments. */
  shadow: {
    color: Color.cardShadow,
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
    labelFontSize: Font.caption as FontSizeToken,
    labelFontWeight: Weight.semibold as FontWeightToken,
    errorFontSize: Font.caption as FontSizeToken,
    placeholderColor: Color.secondaryText,
  },

  /** Icon defaults. */
  icon: {
    defaultSize: 18,
  },

  /** Interaction defaults. */
  interaction: {
    pressedOpacity: 0.9,
    fullOpacity: 1,
  },

  /** Button styling defaults. */
  button: {
    height: 48,
    cornerRadius: 12,
    paddingHorizontal: 16,
    iconSpacing: 8,
    fontSize: Font.body as FontSizeToken,
    fontWeight: Weight.semibold as FontWeightToken,
    borderWidth: 1.5,
    defaultStyle: ButtonVariant.filled,
  },

  /** Image defaults. */
  image: {
    resizeMode: ImageResize.cover,
  },

  /** Divider defaults. */
  divider: {
    color: Color.separator,
  },

  /** Link defaults. */
  link: {
    color: Color.tint,
    fontSize: Font.body as FontSizeToken,
    textDecoration: TextDecoration.underline,
  },

  /** Modal defaults. */
  modal: {
    animationType: ModalAnimation.slide,
    transparent: false,
  },

  /** Spinner defaults. */
  spinner: {
    defaultSize: SpinnerSize.large,
  },

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

  /** Progress bar defaults. */
  progressBar: {
    height: 4,
    cornerRadius: 2,
  },

  /** Animation system defaults. */
  animation: {
    defaultDuration: 300,
    defaultEasing: EasingToken.easeInOut as EasingPreset,
    defaultDelay: 0,
    spring: {
      damping: 10,
      stiffness: 100,
      mass: 1,
      velocity: 0,
    },
    quick: {
      duration: 150,
      easing: EasingToken.easeOut as EasingPreset,
    },
    gentle: {
      duration: 500,
      easing: EasingToken.easeInOut as EasingPreset,
    },
    defaultTransitionEffect: Transition.opacity as TransitionEffect,
    scaleRange: { from: 0.97, to: 1 },
    slideDistance: 100,
    moveDistance: 50,
  },

  /** Gesture system defaults. */
  gesture: {
    swipeThreshold: 50,
    swipeVelocityThreshold: 300,
    panMinDistance: 10,
  },

  /** Responsive system defaults. */
  responsive: {
    breakpoints: {
      compact: { min: 0, max: 599 },
      regular: { min: 600, max: 1023 },
      large: { min: 1024, max: Infinity },
    },
  },
} as const;

/**
 * Default theme configuration used when no DSLThemeProvider is present.
 * Based on iOS Human Interface Guidelines system values.
 *
 * Projects override this by providing their own config to DSLThemeProvider.
 * These are the ACTUAL color/size values — the ground truth that tokens resolve to.
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
