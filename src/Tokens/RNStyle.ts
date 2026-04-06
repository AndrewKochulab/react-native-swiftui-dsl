/**
 * React Native CSS style value constants.
 */

export enum RNAlign {
  center = 'center',
  flexStart = 'flex-start',
  flexEnd = 'flex-end',
  stretch = 'stretch',
  baseline = 'baseline',
  spaceBetween = 'space-between',
  spaceAround = 'space-around',
  spaceEvenly = 'space-evenly',
  auto = 'auto',
}

export enum RNDisplay {
  none = 'none',
  flex = 'flex',
}

export enum RNColor {
  transparent = 'transparent',
  inherit = 'inherit',
}

export enum RNTransform {
  translateX = 'translateX',
  translateY = 'translateY',
}

export enum RNTextAlignVertical {
  top = 'top',
  center = 'center',
  bottom = 'bottom',
  auto = 'auto',
}

export enum RNPointerEvents {
  boxNone = 'box-none',
  none = 'none',
  boxOnly = 'box-only',
  auto = 'auto',
}

export enum ApplyEdgePrefix {
  padding = 'padding',
  margin = 'margin',
}
export type ApplyEdgePrefixToken = `${ApplyEdgePrefix}`;

/**
 * React element key constants used internally by the DSL renderer.
 */
export enum RNKey {
  icon = 'icon',
  text = 'text',
  label = 'label',
  input = 'input',
  error = 'error',
}
