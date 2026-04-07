import React from 'react';
import { Icon } from '@primitives';
import { DSLDefaults } from '@config';
import { renderWithDSLTheme, testColors } from '@tests/Helpers/renderWithDSLTheme';
import { ElementType, ModifierType, Spacing, Edge } from '@tokens';

const Colors = testColors;

describe('Icon', () => {
  it('creates an icon element type', () => {
    const builder = Icon('star');
    expect(builder.elementType).toBe(ElementType.icon);
  });

  it('stores icon name in props', () => {
    const builder = Icon('heart');
    expect(builder.props.iconName).toBe('heart');
  });

  it('stores custom size in props', () => {
    const builder = Icon('star', { size: 24 });
    expect(builder.props.iconSize).toBe(24);
  });

  it('stores custom color in props', () => {
    const builder = Icon('star', { color: 'error' });
    expect(builder.props.iconColor).toBe('error');
  });

  it('renders without crashing', () => {
    const { toJSON } = renderWithDSLTheme(Icon('star').toElement());
    expect(toJSON()).toBeTruthy();
  });

  it('applies padding modifier', () => {
    const builder = Icon('star').padding(Spacing.sm);
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.padding,
      value: Spacing.sm,
      edge: Edge.all,
    });
  });

  it('applies onTap modifier', () => {
    const handler = jest.fn();
    const builder = Icon('star').onTap(handler);
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.onTap,
      handler,
    });
  });

  it('applies testID', () => {
    const builder = Icon('star').testID('my-icon');
    expect(builder.modifiers).toContainEqual({ type: ModifierType.testID, value: 'my-icon' });
  });
});
