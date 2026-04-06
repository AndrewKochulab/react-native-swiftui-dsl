/**
 * Global registration for react-native-swiftui-dsl.
 *
 * Import this file once in your app entry point to make all DSL exports
 * available globally without individual imports:
 *
 * ```ts
 * // In App.tsx or index.ts (once):
 * import 'react-native-swiftui-dsl/globals';
 *
 * // In any file — no imports needed:
 * VStack(
 *   Text('Hello').font(Font.title).bold(),
 *   Button('Go', () => navigate(), { style: ButtonVariant.filled }),
 * ).padding(Spacing.lg)
 * ```
 */
import * as DSL from './index';

// Assign all exports to globalThis
Object.assign(globalThis, DSL);
