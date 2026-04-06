import type { ViewBuilder } from './ViewBuilder';

/**
 * Abstract base class for defining reusable view components.
 * Follows SwiftUI's View protocol pattern with a body() method.
 *
 * @example
 * ```ts
 * class ProfileCard extends DSLView<{ name: string; bio: string }> {
 *   body(): ViewBuilder {
 *     return VStack(
 *       Text(this.props.name).font(Font.title).bold(),
 *       Text(this.props.bio).font(Font.footnote).secondary(),
 *     )
 *     .modifier(new CardModifier())
 *     .alignment(Alignment.center);
 *   }
 * }
 *
 * // Usage — returns ViewBuilder, fully chainable:
 * ProfileCard.build({ name: 'John', bio: 'Developer' }).padding(Spacing.lg)
 * ```
 */
export abstract class DSLView<Props extends Record<string, unknown> = Record<string, never>> {
  protected readonly props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  /**
   * Defines the view's content. Override this method to build your view hierarchy.
   */
  abstract body(): ViewBuilder;

  /**
   * Static factory method to create and render a DSLView.
   * Returns a ViewBuilder that can be further modified with chained modifiers.
   *
   * @example
   * ```ts
   * ProfileCard.build({ name: 'John', bio: 'Dev' }).padding(Spacing.lg).shadow()
   * ```
   */
  static build<P extends Record<string, unknown>>(
    this: new (props: P) => DSLView<P>,
    props: P,
  ): ViewBuilder {
    return new this(props).body();
  }
}
