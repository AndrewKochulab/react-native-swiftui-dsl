/**
 * Type-safe font size token constants.
 *
 * ```ts
 * Text('Hello').font(Font.title)
 * ```
 */
export enum Font {
  micro = 'micro',
  small = 'small',
  caption = 'caption',
  footnote = 'footnote',
  body = 'body',
  subtitle = 'subtitle',
  title2 = 'title2',
  title = 'title',
  header = 'header',
  hero = 'hero',
}

export type FontSizeToken = `${Font}`;

/**
 * Type-safe font weight token constants.
 *
 * ```ts
 * Text('Hello').fontWeight(Weight.bold)
 * ```
 */
export enum Weight {
  regular = 'regular',
  medium = 'medium',
  semibold = 'semibold',
  bold = 'bold',
  thin = 'thin',
  ultralight = 'ultralight',
  light = 'light',
  heavy = 'heavy',
  black = 'black',
}

export type FontWeightToken = `${Weight}`;

/** The four weights that every theme must define. */
export type RequiredFontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';

/** Additional weights that themes may optionally define. */
export type OptionalFontWeightToken = 'thin' | 'ultralight' | 'light' | 'heavy' | 'black';
