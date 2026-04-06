/**
 * Centralized warning and error messages used throughout the DSL framework.
 * Projects can reference these for consistent messaging.
 */

export const DSLWarnings = {
  /** Blur modifier requires external library. */
  blurRequiresLibrary:
    'react-native-swiftui-dsl: .blur() requires @react-native-community/blur for actual blur rendering. ' +
    'Without it, this modifier has no visual effect.',

  /** Pinch/rotation gestures require external library. */
  gestureHandlerRequired:
    'react-native-swiftui-dsl: Pinch and rotation gestures require react-native-gesture-handler. ' +
    'Install it for full gesture support. These gestures will be ignored.',

  /** Unknown color token detected. */
  unknownColorToken: (token: string, available: string) =>
    `react-native-swiftui-dsl: Color "${token}" is not a known theme token. ` +
    `If this is a custom token, add it to your theme colors. ` +
    `Available tokens: ${available}`,
} as const;

export const DSLErrors = {
  /** Logger output failed. */
  logOutputFailed: (error: unknown) =>
    `react-native-swiftui-dsl: Log output failed: ${error}`,
} as const;
