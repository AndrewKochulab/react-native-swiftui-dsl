import React from 'react';
import { ScrollStack } from '@/Primitives/ScrollStack';
import { Text } from '@/Primitives/Text';
import { DSLDefaults } from '@/Config/Defaults';
import { renderWithDSLTheme, testThemeConfig } from '@tests/Helpers/renderWithDSLTheme';
import { ElementType, ModifierType } from '@/Tokens/ElementType';
import { Edge } from '@/Tokens/Layout';

const Layout = testThemeConfig.layout;

describe('ScrollStack', () => {
  it('creates a scroll element type', () => {
    const builder = ScrollStack(Text('Hello'));
    expect(builder.elementType).toBe(ElementType.scroll);
  });

  it('renders children', () => {
    const { getByText } = renderWithDSLTheme(
      ScrollStack(Text('Scrollable Content')).toElement()
    );
    expect(getByText('Scrollable Content')).toBeTruthy();
  });

  it('applies hideScrollIndicator modifier', () => {
    const builder = ScrollStack(Text('X')).hideScrollIndicator();
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.hideScrollIndicator,
      value: true,
    });
  });

  it('applies contentPaddingBottom modifier', () => {
    const builder = ScrollStack(Text('X')).contentPaddingBottom(Layout.spacing.xl);
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.scrollContentPadding,
      value: Layout.spacing.xl,
      edge: Edge.bottom,
    });
  });

  it('applies contentPadding with default values', () => {
    const builder = ScrollStack(Text('X')).contentPadding();
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.scrollContentPadding,
      value: DSLDefaults.spacing,
      edge: DSLDefaults.edge,
    });
  });

  it('applies flex modifier', () => {
    const builder = ScrollStack(Text('X')).flex(DSLDefaults.flex);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.flex, value: DSLDefaults.flex });
  });

  it('chains flex, contentPaddingBottom, and hideScrollIndicator', () => {
    const builder = ScrollStack(Text('X'))
      .flex(DSLDefaults.flex)
      .contentPaddingBottom(Layout.spacing.xl)
      .hideScrollIndicator();

    expect(builder.modifiers).toHaveLength(3);
    expect(builder.elementType).toBe(ElementType.scroll);
  });
});
