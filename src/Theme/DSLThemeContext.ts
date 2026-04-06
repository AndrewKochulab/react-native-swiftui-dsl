import { createContext, useContext } from 'react';
import type { DSLThemeConfig, ColorScheme } from './types';
import { defaultThemeConfig } from '@/Config/Defaults';
import { ColorScheme as ColorSchemeValue } from '@/Tokens/Interaction';

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
