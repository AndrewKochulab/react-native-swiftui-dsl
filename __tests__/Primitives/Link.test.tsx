import React from 'react';
import { Linking } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { Link } from '@primitives';
import { renderWithDSLTheme, testColors } from '@tests/Helpers/renderWithDSLTheme';
import { Font } from '@tokens';

const Colors = testColors;

jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);

describe('Link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a link element type', () => {
    const builder = Link('Visit', 'https://example.com');
    expect(builder.elementType).toBe('link');
  });

  it('stores text and URL in props', () => {
    const builder = Link('Visit', 'https://example.com');
    expect(builder.props.text).toBe('Visit');
    expect(builder.props.linkURL).toBe('https://example.com');
  });

  it('renders text content', () => {
    const { getByText } = renderWithDSLTheme(
      Link('Click Here', 'https://example.com').toElement()
    );
    expect(getByText('Click Here')).toBeTruthy();
  });

  it('calls Linking.openURL on press', () => {
    const { getByText } = renderWithDSLTheme(
      Link('Open', 'https://example.com').toElement()
    );
    fireEvent.press(getByText('Open'));
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('applies testID', () => {
    const { getByTestId } = renderWithDSLTheme(
      Link('Link', 'https://example.com').testID('my-link').toElement()
    );
    expect(getByTestId('my-link')).toBeTruthy();
  });

  it('applies font modifiers', () => {
    const builder = Link('Link', 'https://example.com').font(Font.caption).bold();
    expect(builder.modifiers).toHaveLength(2);
  });
});
