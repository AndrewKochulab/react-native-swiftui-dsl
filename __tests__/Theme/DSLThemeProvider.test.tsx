import React from 'react';
import { render } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';
import { DSLThemeProvider, useDSLTheme } from '@theme';
import { normalizeColors } from '@core';
import { testThemeConfig, testColors } from '@tests/Helpers/testThemeConfig';

function ThemeConsumer() {
  const { config, colorScheme } = useDSLTheme();
  const colors = normalizeColors(config.colors);
  return (
    <RNText testID="consumer">
      {colorScheme}:{colors.light.tint}
    </RNText>
  );
}

describe('DSLThemeProvider', () => {
  it('provides theme config to children', () => {
    const { getByTestId } = render(
      <DSLThemeProvider config={testThemeConfig} colorScheme="light">
        <ThemeConsumer />
      </DSLThemeProvider>
    );
    const text = getByTestId('consumer');
    expect(text.props.children).toContain('light');
    expect(text.props.children).toContain(testColors.light.tint);
  });

  it('provides dark color scheme', () => {
    const { getByTestId } = render(
      <DSLThemeProvider config={testThemeConfig} colorScheme="dark">
        <ThemeConsumer />
      </DSLThemeProvider>
    );
    const text = getByTestId('consumer');
    expect(text.props.children).toContain('dark');
  });

  it('renders children', () => {
    const { getByText } = render(
      <DSLThemeProvider config={testThemeConfig} colorScheme="light">
        <RNText>Hello World</RNText>
      </DSLThemeProvider>
    );
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <DSLThemeProvider config={testThemeConfig} colorScheme="light">
        <RNText>First</RNText>
        <RNText>Second</RNText>
      </DSLThemeProvider>
    );
    expect(getByText('First')).toBeTruthy();
    expect(getByText('Second')).toBeTruthy();
  });
});
