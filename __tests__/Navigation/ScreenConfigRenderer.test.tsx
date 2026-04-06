import React from 'react';
import { Text as RNText } from 'react-native';
import { render } from '@testing-library/react-native';
import { ScreenConfigRenderer } from '@/Navigation/ScreenConfigRenderer';

// Mock expo-router Stack
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ options }: { options: Record<string, unknown> }) => null,
  },
}));

describe('ScreenConfigRenderer', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ScreenConfigRenderer options={{ title: 'Test' }}>
        <RNText>Content</RNText>
      </ScreenConfigRenderer>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders with empty options', () => {
    const { getByText } = render(
      <ScreenConfigRenderer options={{}}>
        <RNText>No Options</RNText>
      </ScreenConfigRenderer>
    );
    expect(getByText('No Options')).toBeTruthy();
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <ScreenConfigRenderer options={{ title: 'Multi' }}>
        <RNText>First</RNText>
        <RNText>Second</RNText>
      </ScreenConfigRenderer>
    );
    expect(getByText('First')).toBeTruthy();
    expect(getByText('Second')).toBeTruthy();
  });
});
