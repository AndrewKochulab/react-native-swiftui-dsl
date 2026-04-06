/**
 * Type-safe color token constants.
 *
 * ```ts
 * Text('Hello').foregroundColor(Color.tint)
 * VStack(...).background(Color.card)
 * ```
 *
 * Projects extend by adding custom tokens to their theme colors config.
 */
export enum Color {
  text = 'text',
  background = 'background',
  tint = 'tint',
  card = 'card',
  secondaryText = 'secondaryText',
  separator = 'separator',
  error = 'error',
  success = 'success',
  warning = 'warning',
  inputBackground = 'inputBackground',
  buttonText = 'buttonText',
  cardShadow = 'cardShadow',
}

export type ColorToken = `${Color}`;
