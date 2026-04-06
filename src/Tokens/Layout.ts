/**
 * Type-safe spacing token constants.
 *
 * ```ts
 * VStack(...).padding(Spacing.lg)
 * ```
 */
export enum Spacing {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export type SpacingToken = `${Spacing}`;

/**
 * Type-safe border radius token constants.
 *
 * ```ts
 * VStack(...).cornerRadius(Radius.lg)
 * ```
 */
export enum Radius {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

export type BorderRadiusToken = `${Radius}`;

/**
 * Type-safe edge constants for padding and margin.
 *
 * ```ts
 * Text('Hello').padding(Spacing.lg, Edge.horizontal)
 * ```
 */
export enum Edge {
  all = 'all',
  horizontal = 'horizontal',
  vertical = 'vertical',
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}

export type EdgeToken = `${Edge}`;

// --- Breakpoint types ---

export interface BreakpointRange {
  min: number;
  max: number;
}

export interface BreakpointDefinition {
  compact: BreakpointRange;
  regular: BreakpointRange;
  large: BreakpointRange;
}

export interface CustomBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
}
