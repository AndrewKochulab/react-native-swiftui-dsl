import { useState, useEffect, useMemo } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import type { SizeClassToken, Orientation, ResponsiveContext } from './types';
import type { BreakpointDefinition, CustomBreakpoint } from '@/Theme/types';
import { DSLDefaults } from '@/Config/Defaults';
import { SizeClass, Orientation as OrientationToken } from '@/Tokens/Interaction';

/**
 * Determines the current size class based on screen width and breakpoint definitions.
 */
export function determineSizeClass(
  width: number,
  breakpoints: BreakpointDefinition,
): SizeClassToken {
  if (width >= breakpoints.large.min) return SizeClass.large;
  if (width >= breakpoints.regular.min) return SizeClass.regular;
  return SizeClass.compact;
}

/**
 * Determines the current orientation based on width and height.
 */
export function determineOrientation(width: number, height: number): Orientation {
  return width > height ? OrientationToken.landscape : OrientationToken.portrait;
}

/**
 * Resolves the full breakpoint definition by merging overrides with defaults.
 */
export function resolveBreakpoints(
  overrides?: Partial<BreakpointDefinition>,
): BreakpointDefinition {
  const defaults = DSLDefaults.responsive.breakpoints;
  if (!overrides) return defaults;
  return {
    compact: overrides.compact ?? defaults.compact,
    regular: overrides.regular ?? defaults.regular,
    large: overrides.large ?? defaults.large,
  };
}

/**
 * Checks if the current width matches a custom breakpoint.
 */
export function matchesCustomBreakpoint(
  width: number,
  breakpoint: CustomBreakpoint,
): boolean {
  return width >= breakpoint.minWidth && width <= breakpoint.maxWidth;
}

/**
 * Returns the names of all matching custom breakpoints for the current width.
 */
export function getMatchingCustomBreakpoints(
  width: number,
  customBreakpoints?: CustomBreakpoint[],
): string[] {
  if (!customBreakpoints) return [];
  return customBreakpoints
    .filter(bp => matchesCustomBreakpoint(width, bp))
    .map(bp => bp.name);
}

/**
 * React hook that provides the current responsive context.
 * Listens for dimension changes and updates the context accordingly.
 *
 * @param breakpointOverrides - Optional partial breakpoint definitions to override defaults
 * @param customBreakpoints - Optional custom breakpoints for project-specific size classes
 */
export function useResponsive(
  breakpointOverrides?: Partial<BreakpointDefinition>,
  customBreakpoints?: CustomBreakpoint[],
): ResponsiveContext {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };
    const subscription = Dimensions.addEventListener('change', handler);
    return () => subscription.remove();
  }, []);

  return useMemo(() => {
    const breakpoints = resolveBreakpoints(breakpointOverrides);
    const { width, height, scale } = dimensions;
    const orientation = determineOrientation(width, height);
    const sizeClass = determineSizeClass(width, breakpoints);

    return { sizeClass, orientation, width, height, scale };
  }, [dimensions, breakpointOverrides, customBreakpoints]);
}
