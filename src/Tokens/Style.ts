/**
 * Style-related token constants for layout, text, and visual properties.
 */

export enum TextAlign {
  left = 'left',
  center = 'center',
  right = 'right',
  auto = 'auto',
}
export type TextAlignToken = `${TextAlign}`;

export enum TextDecoration {
  none = 'none',
  underline = 'underline',
  lineThrough = 'line-through',
  underlineLineThrough = 'underline line-through',
}
export type TextDecorationToken = `${TextDecoration}`;

export enum TextTransform {
  none = 'none',
  uppercase = 'uppercase',
  lowercase = 'lowercase',
  capitalize = 'capitalize',
}
export type TextTransformToken = `${TextTransform}`;

export enum FontStyle {
  normal = 'normal',
  italic = 'italic',
}
export type FontStyleToken = `${FontStyle}`;

export enum BorderStyle {
  solid = 'solid',
  dotted = 'dotted',
  dashed = 'dashed',
}
export type BorderStyleToken = `${BorderStyle}`;

export enum Position {
  absolute = 'absolute',
  relative = 'relative',
}
export type PositionToken = `${Position}`;

export enum Overflow {
  hidden = 'hidden',
  visible = 'visible',
  scroll = 'scroll',
}
export type OverflowToken = `${Overflow}`;

export enum Display {
  none = 'none',
  flex = 'flex',
}
export type DisplayToken = `${Display}`;

export enum FlexWrap {
  wrap = 'wrap',
  nowrap = 'nowrap',
}
export type FlexWrapToken = `${FlexWrap}`;

export enum FlexDirection {
  column = 'column',
  row = 'row',
  columnReverse = 'column-reverse',
  rowReverse = 'row-reverse',
}
export type FlexDirectionToken = `${FlexDirection}`;

export enum JustifyContent {
  flexStart = 'flexStart',
  flexEnd = 'flexEnd',
  center = 'center',
  spaceBetween = 'spaceBetween',
  spaceAround = 'spaceAround',
  spaceEvenly = 'spaceEvenly',
}
export type JustifyContentToken = `${JustifyContent}`;

export enum AlignItems {
  flexStart = 'flexStart',
  flexEnd = 'flexEnd',
  center = 'center',
  stretch = 'stretch',
  baseline = 'baseline',
}
export type AlignItemsToken = `${AlignItems}`;

export enum AlignSelf {
  auto = 'auto',
  flexStart = 'flexStart',
  flexEnd = 'flexEnd',
  center = 'center',
  stretch = 'stretch',
  baseline = 'baseline',
}
export type AlignSelfToken = `${AlignSelf}`;

export enum Alignment {
  center = 'center',
  leading = 'leading',
  trailing = 'trailing',
  stretch = 'stretch',
}
export type AlignmentToken = `${Alignment}`;

/** Frame alignment subset (excludes 'stretch'). */
export type FrameAlignmentToken = Alignment.center | Alignment.leading | Alignment.trailing;
