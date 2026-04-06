import React from 'react';
import { DSLThemeConfig, ColorScheme } from './types';
import { DSLThemeContext } from './DSLThemeContext';
import { ResponsiveProvider } from '@/Responsive/ResponsiveProvider';

interface Props {
  config: DSLThemeConfig;
  colorScheme: ColorScheme;
  children: React.ReactNode;
}

/**
 * Provides theme configuration and responsive context to all DSL components.
 * Wraps both DSLThemeContext and ResponsiveProvider.
 *
 * @example
 * ```tsx
 * <DSLThemeProvider config={myTheme} colorScheme={ColorScheme.light}>
 *   <DSLRenderer builder={buildScreen()} />
 * </DSLThemeProvider>
 * ```
 */
export function DSLThemeProvider({ config, colorScheme, children }: Props) {
  return (
    <DSLThemeContext.Provider value={{ config, colorScheme }}>
      <ResponsiveProvider
        breakpoints={config.responsive?.breakpoints}
        customBreakpoints={config.responsive?.customBreakpoints}
      >
        {children}
      </ResponsiveProvider>
    </DSLThemeContext.Provider>
  );
}
