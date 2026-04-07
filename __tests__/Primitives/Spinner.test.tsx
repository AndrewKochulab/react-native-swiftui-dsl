import React from 'react';
import { Spinner } from '@primitives';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';
import { SpinnerSize, ElementType, ModifierType, Spacing, Edge } from '@tokens';

describe('Spinner', () => {
  it('creates a spinner element type', () => {
    const builder = Spinner();
    expect(builder.elementType).toBe(ElementType.spinner);
  });

  it('defaults to large size', () => {
    const builder = Spinner();
    expect(builder.props.spinnerSize).toBe(SpinnerSize.large);
  });

  it('accepts small size', () => {
    const builder = Spinner(SpinnerSize.small);
    expect(builder.props.spinnerSize).toBe(SpinnerSize.small);
  });

  it('renders without crashing', () => {
    const { toJSON } = renderWithDSLTheme(Spinner().toElement());
    expect(toJSON()).toBeTruthy();
  });

  it('applies testID', () => {
    const builder = Spinner().testID('loading');
    expect(builder.modifiers).toContainEqual({ type: ModifierType.testID, value: 'loading' });
  });

  it('applies padding modifier', () => {
    const builder = Spinner().padding(Spacing.lg);
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.padding,
      value: Spacing.lg,
      edge: Edge.all,
    });
  });
});
