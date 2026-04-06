import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { DSLThemeProvider } from '@/Theme/DSLThemeProvider';
import { testThemeConfig, testColors } from './testThemeConfig';

export { testThemeConfig, testColors };

export function renderWithDSLTheme(
  ui: React.ReactElement,
  colorScheme: import('../../src/Theme/types').ColorScheme = 'light',
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <DSLThemeProvider config={testThemeConfig} colorScheme={colorScheme}>
        {children}
      </DSLThemeProvider>
    ),
    ...options,
  });
}
