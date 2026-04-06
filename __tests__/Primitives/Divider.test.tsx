import React from 'react';
import { Divider } from '@/Primitives/Divider';
import { renderWithDSLTheme, testColors } from '@tests/Helpers/renderWithDSLTheme';
import { ElementType, ModifierType } from '@/Tokens/ElementType';
import { Color } from '@/Tokens/Color';
import { Spacing, Edge } from '@/Tokens/Layout';

const Colors = testColors;

describe('Divider', () => {
  it('creates a divider element type', () => {
    const builder = Divider();
    expect(builder.elementType).toBe(ElementType.divider);
  });

  it('renders with separator color', () => {
    const { toJSON } = renderWithDSLTheme(
      Divider().testID('divider').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    expect(tree.props.style).toMatchObject({
      backgroundColor: Colors.light.separator,
    });
  });

  it('applies custom foregroundColor', () => {
    const { toJSON } = renderWithDSLTheme(
      Divider().foregroundColor(Color.tint).testID('custom-divider').toElement()
    );
    const tree = toJSON();
    expect(tree.props.style).toMatchObject({
      backgroundColor: Colors.light.tint,
    });
  });

  it('applies testID', () => {
    const { getByTestId } = renderWithDSLTheme(
      Divider().testID('my-divider').toElement()
    );
    expect(getByTestId('my-divider')).toBeTruthy();
  });

  it('applies margin modifiers', () => {
    const builder = Divider().marginVertical('sm');
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.margin,
      value: Spacing.sm,
      edge: Edge.vertical,
    });
  });
});
