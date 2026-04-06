import type { ViewBuilder } from './ViewBuilder';

/**
 * A function that applies modifiers to a ViewBuilder and returns it.
 * The simplest way to define reusable modifiers.
 */
export type ViewModifierFn = (view: ViewBuilder) => ViewBuilder;

/**
 * Abstract base class for reusable view modifiers.
 * Follows SwiftUI's ViewModifier protocol pattern.
 *
 * @example
 * ```ts
 * class CardModifier extends ViewModifier {
 *   body(content: ViewBuilder): ViewBuilder {
 *     return content.padding(Spacing.lg).background(Color.card).cornerRadius(Radius.md).shadow();
 *   }
 * }
 *
 * Text('Hello').modifier(new CardModifier())
 * ```
 *
 * Parameterized modifiers:
 * ```ts
 * class PaddedModifier extends ViewModifier {
 *   constructor(private size: SpacingToken = Spacing.md) { super(); }
 *   body(content: ViewBuilder): ViewBuilder {
 *     return content.padding(this.size).background(Color.card);
 *   }
 * }
 * ```
 */
export abstract class ViewModifier {
  abstract body(content: ViewBuilder): ViewBuilder;
}

/**
 * Composes multiple modifiers (class instances or functions) into a single function.
 * Modifiers are applied left-to-right (first modifier applied first).
 *
 * @example
 * ```ts
 * const styled = composeModifiers(
 *   new CardModifier(),
 *   v => v.shadow(),
 *   new PaddedModifier(Spacing.lg),
 * );
 * Text('Hello').modifier(styled)
 * ```
 */
export function composeModifiers(
  ...modifiers: (ViewModifier | ViewModifierFn)[]
): ViewModifierFn {
  return (view: ViewBuilder): ViewBuilder => {
    let result = view;
    for (const mod of modifiers) {
      if (mod instanceof ViewModifier) {
        result = mod.body(result);
      } else {
        result = mod(result);
      }
    }
    return result;
  };
}
