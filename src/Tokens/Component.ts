/**
 * Component-specific token constants.
 */

export enum ButtonVariant {
  filled = 'filled',
  outlined = 'outlined',
  plain = 'plain',
}
export type ButtonVariantToken = `${ButtonVariant}`;

export enum SpinnerSize {
  small = 'small',
  large = 'large',
}
export type SpinnerSizeToken = `${SpinnerSize}`;

export enum ModalAnimation {
  none = 'none',
  slide = 'slide',
  fade = 'fade',
}
export type ModalAnimationToken = `${ModalAnimation}`;

export enum ImageResize {
  cover = 'cover',
  contain = 'contain',
  stretch = 'stretch',
  center = 'center',
}
export type ImageResizeToken = `${ImageResize}`;

export enum AutoCapitalize {
  none = 'none',
  sentences = 'sentences',
  words = 'words',
  characters = 'characters',
}
export type AutoCapitalizeToken = `${AutoCapitalize}`;

export enum KeyboardBehavior {
  padding = 'padding',
  height = 'height',
  position = 'position',
}
export type KeyboardBehaviorToken = `${KeyboardBehavior}`;

export enum KeyboardPersistTaps {
  always = 'always',
  never = 'never',
  handled = 'handled',
}
export type KeyboardPersistTapsToken = `${KeyboardPersistTaps}`;

export enum ScrollDirection {
  horizontal = 'horizontal',
  vertical = 'vertical',
}
export type ScrollDirectionToken = `${ScrollDirection}`;

export enum AccessibilityRole {
  button = 'button',
  link = 'link',
  progressbar = 'progressbar',
  image = 'image',
  text = 'text',
  none = 'none',
}
export type AccessibilityRoleToken = `${AccessibilityRole}`;
