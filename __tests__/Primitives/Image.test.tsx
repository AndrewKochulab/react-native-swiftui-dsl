import React from 'react';
import { Image } from '@primitives';
import { DSLDefaults } from '@config';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';
import { ElementType, ModifierType, Radius } from '@tokens';

describe('Image', () => {
  it('creates an image element type', () => {
    const builder = Image({ uri: 'https://example.com/img.png' });
    expect(builder.elementType).toBe(ElementType.image);
  });

  it('renders with URI source', () => {
    const { toJSON } = renderWithDSLTheme(
      Image({ uri: 'https://example.com/img.png' }).testID('img').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies resizeMode', () => {
    const builder = Image({ uri: 'https://example.com/img.png' }, { resizeMode: 'contain' });
    expect(builder.props.resizeMode).toBe('contain');
  });

  it('uses default resizeMode from DSLDefaults', () => {
    const builder = Image({ uri: 'https://example.com/img.png' });
    expect(builder.props.resizeMode).toBeUndefined();
  });

  it('applies frame modifier', () => {
    const builder = Image({ uri: 'https://example.com/img.png' }).frame({ width: 100, height: 100 });
    expect(builder.modifiers).toContainEqual(
      expect.objectContaining({ type: ModifierType.frame, width: 100, height: 100 })
    );
  });

  it('applies cornerRadius modifier', () => {
    const builder = Image({ uri: 'https://example.com/img.png' }).cornerRadius(Radius.md);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.cornerRadius, value: Radius.md });
  });

  it('applies aspectRatio modifier', () => {
    const builder = Image({ uri: 'https://example.com/img.png' }).aspectRatio(1.5);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.aspectRatio, value: 1.5 });
  });

  it('applies testID', () => {
    const { getByTestId } = renderWithDSLTheme(
      Image({ uri: 'https://example.com/img.png' }).testID('my-image').toElement()
    );
    expect(getByTestId('my-image')).toBeTruthy();
  });

  it('stores alt text in props', () => {
    const builder = Image({ uri: 'https://example.com/img.png' }, { alt: 'A photo' });
    expect(builder.props.imageAlt).toBe('A photo');
  });
});
