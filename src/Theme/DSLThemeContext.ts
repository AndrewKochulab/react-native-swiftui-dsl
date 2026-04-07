import { createContext, useContext } from 'react';
import type { DSLThemeConfig, ColorScheme } from './types';
import { defaultThemeConfig } from '@config';
import { ColorScheme as ColorSchemeValue } from '@tokens';

export interface DSLThemeContextValue {
  config: DSLThemeConfig;
  colorScheme: ColorScheme;
}

export const DSLThemeContext = createContext<DSLThemeContextValue | null>(null);

export function useDSLTheme(): DSLThemeContextValue {
  const ctx = useContext(DSLThemeContext);
  if (!ctx) {
    return { config: defaultThemeConfig, colorScheme: ColorSchemeValue.light };
  }
  return ctx;
}
