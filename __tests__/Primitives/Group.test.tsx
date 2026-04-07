import React from 'react';
import { Group } from '@conditionals';
import { Text } from '@primitives';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';

describe('Group', () => {
  it('creates a fragment element type', () => {
    const builder = Group(Text('A'), Text('B'));
    expect(builder.elementType).toBe('fragment');
  });

  it('stores children', () => {
    const builder = Group(Text('A'), Text('B'), Text('C'));
    expect(builder.children).toHaveLength(3);
  });

  it('renders all children', () => {
    const { getByText } = renderWithDSLTheme(
      Group(Text('First'), Text('Second')).toElement()
    );
    expect(getByText('First')).toBeTruthy();
    expect(getByText('Second')).toBeTruthy();
  });

  it('accepts zero children', () => {
    const builder = Group();
    expect(builder.elementType).toBe('fragment');
    expect(builder.children).toHaveLength(0);
  });

  it('accepts null children', () => {
    const builder = Group(Text('A'), null, Text('B'));
    expect(builder.children).toHaveLength(3);
  });

  it('renders nested groups', () => {
    const { getByText } = renderWithDSLTheme(
      Group(
        Group(Text('Inner')),
        Text('Outer'),
      ).toElement()
    );
    expect(getByText('Inner')).toBeTruthy();
    expect(getByText('Outer')).toBeTruthy();
  });
});
