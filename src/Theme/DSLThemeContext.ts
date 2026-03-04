import { createContext, useContext } from 'react';
import { DSLThemeConfig, ColorScheme } from './types';
import { defaultThemeConfig } from '../Config/Defaults';

export interface DSLThemeContextValue {
  config: DSLThemeConfig;
  colorScheme: ColorScheme;
}

export const DSLThemeContext = createContext<DSLThemeContextValue | null>(null);

export function useDSLTheme(): DSLThemeContextValue {
  const ctx = useContext(DSLThemeContext);
  if (!ctx) {
    return { config: defaultThemeConfig, colorScheme: 'light' };
  }
  return ctx;
}
