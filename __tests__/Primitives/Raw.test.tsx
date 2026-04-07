import React from 'react';
import { View as RNView, Text as RNText } from 'react-native';
import { Raw } from '@primitives';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';
import { Spacing } from '@tokens';

describe('Raw', () => {
  it('creates a raw element type', () => {
    const el = React.createElement(RNText, null, 'Hello');
    const builder = Raw(el);
    expect(builder.elementType).toBe('raw');
  });

  it('stores raw element in props', () => {
    const el = React.createElement(RNText, null, 'Hello');
    const builder = Raw(el);
    expect(builder.props.rawElement).toBe(el);
  });

  it('renders the raw React element', () => {
    const el = React.createElement(RNText, { testID: 'raw-text' }, 'Raw Content');
    const { getByText } = renderWithDSLTheme(Raw(el).toElement());
    expect(getByText('Raw Content')).toBeTruthy();
  });

  it('wraps in View when style modifiers present', () => {
    const el = React.createElement(RNText, null, 'Styled');
    const { toJSON } = renderWithDSLTheme(
      Raw(el).padding(Spacing.sm).toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('passes through without wrapper when no modifiers', () => {
    const el = React.createElement(RNText, { testID: 'pass-through' }, 'Direct');
    const { getByTestId } = renderWithDSLTheme(Raw(el).toElement());
    expect(getByTestId('pass-through')).toBeTruthy();
  });
});
