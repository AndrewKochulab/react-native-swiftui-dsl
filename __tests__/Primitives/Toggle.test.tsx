import React from 'react';
import { Toggle } from '@primitives';
import { createBinding } from '@binding';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';
import { ElementType, ModifierType } from '@tokens';

describe('Toggle', () => {
  const mockUpdate = jest.fn();
  const binding = createBinding<boolean>(true, mockUpdate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a toggle element type', () => {
    const builder = Toggle(binding);
    expect(builder.elementType).toBe(ElementType.toggle);
  });

  it('stores binding in props', () => {
    const builder = Toggle(binding);
    expect(builder.props.toggleBinding).toBe(binding);
  });

  it('renders without crashing', () => {
    const { toJSON } = renderWithDSLTheme(
      Toggle(binding).testID('toggle').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('stores custom track color', () => {
    const builder = Toggle(binding, { trackColor: 'tint' });
    expect(builder.props.toggleTrackColor).toBe('tint');
  });

  it('stores custom thumb color', () => {
    const builder = Toggle(binding, { thumbColor: 'card' });
    expect(builder.props.toggleThumbColor).toBe('card');
  });

  it('applies disabled modifier', () => {
    const builder = Toggle(binding).disabled();
    expect(builder.modifiers).toContainEqual({ type: ModifierType.disabled, value: true });
  });

  it('applies testID modifier', () => {
    const builder = Toggle(binding).testID('my-toggle');
    expect(builder.modifiers).toContainEqual({ type: ModifierType.testID, value: 'my-toggle' });
  });
});
