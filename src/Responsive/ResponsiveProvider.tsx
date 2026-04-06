import React from 'react';
import { ResponsiveCtx } from './ResponsiveContext';
import { useResponsive } from './useResponsive';
import type { BreakpointDefinition, CustomBreakpoint } from '@/Tokens/Layout';

interface Props {
  breakpoints?: Partial<BreakpointDefinition>;
  customBreakpoints?: CustomBreakpoint[];
  children: React.ReactNode;
}

/**
 * Provides responsive context (size class, orientation, dimensions) to child components.
 * Can be used independently or nested inside DSLThemeProvider.
 *
 * @example
 * ```tsx
 * <ResponsiveProvider breakpoints={{ compact: { min: 0, max: 430 } }}>
 *   {children}
 * </ResponsiveProvider>
 * ```
 */
export function ResponsiveProvider({ breakpoints, customBreakpoints, children }: Props) {
  const responsive = useResponsive(breakpoints, customBreakpoints);

  return (
    <ResponsiveCtx.Provider value={responsive}>
      {children}
    </ResponsiveCtx.Provider>
  );
}
