/**
 * Responsive system types for the SwiftUI-inspired DSL.
 * Supports breakpoint-based layout adaptation for phones, tablets, and custom devices.
 */

import type { ViewBuilder } from '@/Core/ViewBuilder';

// Re-export from canonical Token sources
export type { BreakpointDefinition, CustomBreakpoint } from '@/Tokens/Layout';
export type { SizeClassToken, OrientationToken as Orientation } from '@/Tokens/Interaction';

// --- Responsive context ---

export interface ResponsiveContext {
  sizeClass: import('../Tokens/Interaction').SizeClassToken;
  orientation: import('../Tokens/Interaction').OrientationToken;
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
