/**
 * Platform detection constants and utilities.
 * Provides strongly-typed platform branching without raw string comparisons.
 */

import { Platform } from 'react-native';
import { DSLPlatform } from '@tokens';

/** Static platform detection flags. */
export const PlatformInfo = {
  /** True when running on iOS. */
  isIOS: Platform.OS === DSLPlatform.ios,

  /** True when running on Android. */
  isAndroid: Platform.OS === DSLPlatform.android,

  /** True when running on web (react-native-web). */
  isWeb: Platform.OS === ('web' as string),

  /** The platform OS string. */
  os: Platform.OS,

  /** The platform version. */
  version: Platform.Version,
} as const;

/**
 * Type-safe platform branching.
 * Returns the value matching the current platform.
 *
 * @example
 * ```ts
 * const fontSize = platformSelect({ ios: 17, android: 16, default: 15 });
 * const behavior = platformSelect({ ios: KeyboardBehavior.padding, default: undefined });
 * ```
 */
export function platformSelect<T>(options: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T {
  if (PlatformInfo.isIOS && options.ios !== undefined) return options.ios;
  if (PlatformInfo.isAndroid && options.android !== undefined) return options.android;
  if (PlatformInfo.isWeb && options.web !== undefined) return options.web;
  return options.default;
}
