import React from 'react';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';
import { Icon, Button } from '@primitives';
import { DSLRenderer, _setIconComponent } from '@core';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
}));

describe('DSLRenderer fallback (no @expo/vector-icons)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let originalComponent: any;

  beforeAll(() => {
    // Save the original FontAwesome component
    originalComponent = require('@expo/vector-icons/FontAwesome').default;
  });

  afterEach(() => {
    // Restore after each test
    _setIconComponent(originalComponent);
  });

  it('renders icon as text fallback when FontAwesome is unavailable', () => {
    _setIconComponent(null);
    const builder = Icon('star');
    const { getByText } = renderWithDSLTheme(
      React.createElement(DSLRenderer, { builder }),
    );
    expect(getByText('star')).toBeTruthy();
  });

  it('renders button icon as text fallback when FontAwesome is unavailable', () => {
    _setIconComponent(null);
    const builder = Button('Click', jest.fn(), { icon: 'check' });
    const { getByText } = renderWithDSLTheme(
      React.createElement(DSLRenderer, { builder }),
    );
    expect(getByText('check')).toBeTruthy();
    expect(getByText('Click')).toBeTruthy();
  });
});
