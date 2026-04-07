import React from 'react';
import { ZStack, Text } from '@primitives';
import { renderWithDSLTheme, testColors } from '@tests/Helpers/renderWithDSLTheme';
import { Color } from '@tokens';

const Colors = testColors;

describe('ZStack', () => {
  it('creates a zstack element type', () => {
    const builder = ZStack(Text('Overlay'));
    expect(builder.elementType).toBe('zstack');
  });

  it('renders children', () => {
    const { getByText } = renderWithDSLTheme(
      ZStack(Text('Bottom'), Text('Top')).toElement()
    );
    expect(getByText('Bottom')).toBeTruthy();
    expect(getByText('Top')).toBeTruthy();
  });

  it('applies background modifier', () => {
    const { toJSON } = renderWithDSLTheme(
      ZStack(Text('X')).background(Color.card).testID('zs').toElement()
    );
    const tree = toJSON();
    expect(tree.props.style).toMatchObject({
      backgroundColor: Colors.light.card,
    });
  });

  it('applies flex modifier', () => {
    const { toJSON } = renderWithDSLTheme(
      ZStack(Text('X')).flex(1).testID('zs-flex').toElement()
    );
    const tree = toJSON();
    expect(tree.props.style).toMatchObject({ flex: 1 });
  });

  it('applies testID', () => {
    const { getByTestId } = renderWithDSLTheme(
      ZStack(Text('X')).testID('my-zstack').toElement()
    );
    expect(getByTestId('my-zstack')).toBeTruthy();
  });
});
