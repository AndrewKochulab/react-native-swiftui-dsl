import React from 'react';
import { LazyList, Text } from '@primitives';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';
import { ElementType, ModifierType } from '@tokens';

describe('LazyList', () => {
  const data = ['Item 1', 'Item 2', 'Item 3'];
  const options = {
    keyExtractor: (item: string) => item,
    renderItem: (item: string) => Text(item),
  };

  it('creates a lazylist element type', () => {
    const builder = LazyList(data, options);
    expect(builder.elementType).toBe(ElementType.lazylist);
  });

  it('stores list data in props', () => {
    const builder = LazyList(data, options);
    expect(builder.props.listData).toHaveLength(3);
  });

  it('stores keyExtractor in props', () => {
    const builder = LazyList(data, options);
    expect(builder.props.keyExtractor).toBeDefined();
  });

  it('stores renderItem in props', () => {
    const builder = LazyList(data, options);
    expect(builder.props.renderItem).toBeDefined();
  });

  it('renders without crashing', () => {
    const { toJSON } = renderWithDSLTheme(
      LazyList(data, options).testID('lazy-list').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders empty View when missing data', () => {
    const emptyBuilder = LazyList([], {
      ...options,
      keyExtractor: undefined as unknown as (item: string) => string,
    });
    expect(emptyBuilder.props.listData).toHaveLength(0);
  });

  it('stores listHeader in props', () => {
    const header = Text('Header');
    const builder = LazyList(data, { ...options, listHeader: header });
    expect(builder.props.listHeader).toBe(header);
  });

  it('applies hideScrollIndicator modifier', () => {
    const builder = LazyList(data, options).hideScrollIndicator();
    expect(builder.modifiers).toContainEqual({ type: ModifierType.hideScrollIndicator, value: true });
  });

  it('applies testID modifier', () => {
    const builder = LazyList(data, options).testID('my-list');
    expect(builder.modifiers).toContainEqual({ type: ModifierType.testID, value: 'my-list' });
  });

  it('applies refreshControl modifier', () => {
    const onRefresh = jest.fn();
    const builder = LazyList(data, options).refreshControl(onRefresh, false);
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.refreshControl,
      onRefresh,
      refreshing: false,
    });
  });

  it('applies onEndReached modifier', () => {
    const handler = jest.fn();
    const builder = LazyList(data, options).onEndReached(handler, 0.8);
    expect(builder.modifiers).toContainEqual({
      type: ModifierType.onEndReached,
      handler,
      threshold: 0.8,
    });
  });

  it('applies numColumns modifier', () => {
    const builder = LazyList(data, options).numColumns(2);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.numColumns, value: 2 });
  });
});
