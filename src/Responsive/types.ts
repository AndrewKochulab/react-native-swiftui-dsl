/**
 * Responsive system types for the SwiftUI-inspired DSL.
 * Supports breakpoint-based layout adaptation for phones, tablets, and custom devices.
 */

import type { ViewBuilder } from '@core';

// Re-export from canonical Token sources
export type {
  BreakpointDefinition, CustomBreakpoint, SizeClassToken, OrientationToken as Orientation,
} from '@tokens';

// --- Responsive context ---

export interface ResponsiveContext {
  sizeClass: import('@tokens').SizeClassToken;
  orientation: import('@tokens').OrientationToken;
  width: number;
  height: number;
  scale: number;
}

// --- Modifier types ---

export type ResponsiveModifierFn = (builder: ViewBuilder) => ViewBuilder;

export interface ResponsiveConfig {
  compact?: ResponsiveModifierFn;
  regular?: ResponsiveModifierFn;
  large?: ResponsiveModifierFn;
  custom?: Record<string, ResponsiveModifierFn>;
}
