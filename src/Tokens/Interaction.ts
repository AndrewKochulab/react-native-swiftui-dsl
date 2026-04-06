/**
 * Interaction and platform token constants.
 */

export enum SwipeDirection {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}
export type SwipeDirectionToken = `${SwipeDirection}`;

export enum SizeClass {
  compact = 'compact',
  regular = 'regular',
  large = 'large',
}
export type SizeClassToken = `${SizeClass}`;

export enum Orientation {
  portrait = 'portrait',
  landscape = 'landscape',
}
export type OrientationToken = `${Orientation}`;

export enum ColorScheme {
  light = 'light',
  dark = 'dark',
}
export type ColorSchemeToken = `${ColorScheme}`;

export enum DSLPlatform {
  ios = 'ios',
  android = 'android',
}
export type DSLPlatformToken = `${DSLPlatform}`;
