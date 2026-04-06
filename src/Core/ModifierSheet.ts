import type { ViewModifierFn } from './ViewModifier';

/**
 * Groups related modifier functions together, similar to React Native's StyleSheet.create().
 * Returns a frozen object of named modifier functions for type safety and immutability.
 *
 * @example
 * ```ts
 * const modifiers = createModifiers({
 *   card: v => v.padding(Spacing.lg).background(Color.card).cornerRadius(Radius.md),
 *   title: v => v.font(Font.title).bold(),
 *   caption: v => v.font(Font.caption).secondary(),
 *   avatar: v => v.frame({ width: 80, height: 80 }).cornerRadius(Radius.lg),
 * });
 *
 * Text('Hello').apply(modifiers.title)
 * VStack(...).apply(modifiers.card)
 * ```
 */
export function createModifiers<K extends string>(
  definitions: Record<K, ViewModifierFn>,
): Readonly<Record<K, ViewModifierFn>> {
  return Object.freeze({ ...definitions });
}
