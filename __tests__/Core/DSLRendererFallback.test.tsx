import React from 'react';
import { renderWithDSLTheme } from '../Helpers/renderWithDSLTheme';
import { Icon } from '../../src/Primitives/Icon';
import { Button } from '../../src/Primitives/Button';
import { DSLRenderer, _setIconComponent } from '../../src/Core/DSLRenderer';

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
