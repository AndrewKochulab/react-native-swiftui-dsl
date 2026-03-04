import React from 'react';
import { Platform } from 'react-native';
import { Text } from '../../src/Primitives/Text';
import { ScrollStack } from '../../src/Primitives/ScrollStack';
import { renderWithDSLTheme } from '../Helpers/renderWithDSLTheme';

describe('DSLRenderer - ScrollStack', () => {
  it('renders ScrollStack with horizontal direction', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('H')).horizontal().testID('h-scroll').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    expect(tree.props.horizontal).toBe(true);
  });

  it('renders ScrollStack with keyboardAvoiding', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('K')).keyboardAvoiding(80).toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    // KeyboardAvoidingView wraps the scroll
    expect(tree.type).toBe('View');
  });

  it('renders ScrollStack with keyboardPersistTaps', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('T')).keyboardShouldPersistTaps('handled').testID('kpt').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    expect(tree.props.keyboardShouldPersistTaps).toBe('handled');
  });

  it('renders ScrollStack with bounces false', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('B')).bounces(false).testID('bounce').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    expect(tree.props.bounces).toBe(false);
  });

  it('renders ScrollStack with contentPadding vertical', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('CP')).contentPadding('md', 'vertical').testID('cp').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    expect(tree.props.contentContainerStyle).toBeDefined();
  });

  it('renders ScrollStack with contentPadding horizontal', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('CP')).contentPadding(16, 'horizontal').testID('cph').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders ScrollStack with contentPadding top', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('CP')).contentPadding(8, 'top').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders ScrollStack with contentPadding left', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('CP')).contentPadding(8, 'left').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders ScrollStack with contentPadding right', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('CP')).contentPadding(8, 'right').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders ScrollStack with refreshControl', () => {
    const onRefresh = jest.fn();
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('R')).refreshControl(onRefresh, false).testID('rc').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    expect(tree.props.refreshControl).toBeTruthy();
  });

  it('renders ScrollStack with hideScrollIndicator', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('H')).hideScrollIndicator().testID('hsi').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    expect(tree.props.showsVerticalScrollIndicator).toBe(false);
    expect(tree.props.showsHorizontalScrollIndicator).toBe(false);
  });

  it('renders ScrollStack with scrollDirection', () => {
    const { toJSON } = renderWithDSLTheme(
      ScrollStack(Text('S')).horizontal().testID('sd').toElement()
    );
    const tree = toJSON();
    expect(tree.props.horizontal).toBe(true);
  });

  it('renders ScrollStack with keyboardAvoiding on android (no padding behavior)', () => {
    const originalOS = Platform.OS;
    Platform.OS = 'android' as typeof Platform.OS;
    try {
      const { toJSON } = renderWithDSLTheme(
        ScrollStack(Text('A')).keyboardAvoiding(80).toElement()
      );
      const tree = toJSON();
      expect(tree).toBeTruthy();
    } finally {
      Platform.OS = originalOS;
    }
  });
});
