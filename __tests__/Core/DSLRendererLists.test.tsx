import React from 'react';
import { Text } from '../../src/Primitives/Text';
import { VStack } from '../../src/Primitives/Containers';
import { Divider } from '../../src/Primitives/Divider';
import { LazyList } from '../../src/Primitives/LazyList';
import { SectionedList } from '../../src/Primitives/SectionedList';
import { ViewBuilder } from '../../src/Core/ViewBuilder';
import { renderWithDSLTheme } from '../Helpers/renderWithDSLTheme';

const testData = [
  { id: '1', name: 'Alpha' },
  { id: '2', name: 'Beta' },
  { id: '3', name: 'Gamma' },
];

const testSections = [
  { title: 'Group A', data: [{ id: '1', name: 'Alpha' }, { id: '2', name: 'Beta' }] },
  { title: 'Group B', data: [{ id: '3', name: 'Gamma' }] },
];

describe('DSLRenderer - LazyList', () => {
  it('renders LazyList with header and stickyHeader', () => {
    const headerBuilder = Text('Header').font('title').bold();
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
        listHeader: headerBuilder,
        stickyHeader: true,
      }).testID('ll-hdr').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with hideScrollIndicator', () => {
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).hideScrollIndicator().testID('ll-hsi').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with contentPadding', () => {
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).contentPadding('md').testID('ll-cp').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with bounces false', () => {
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).bounces(false).testID('ll-bounce').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with refreshControl', () => {
    const onRefresh = jest.fn();
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).refreshControl(onRefresh, false).testID('ll-rc').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with onEndReached', () => {
    const loadMore = jest.fn();
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).onEndReached(loadMore, 0.5).testID('ll-oer').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with separator', () => {
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).separator(() => Divider()).testID('ll-sep').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with numColumns', () => {
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).numColumns(2).testID('ll-nc').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with emptyComponent', () => {
    const { toJSON } = renderWithDSLTheme(
      LazyList([], {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).emptyComponent(() => Text('No data')).testID('ll-empty').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList without required props as fallback', () => {
    const builder = new ViewBuilder('lazylist', {});
    const { toJSON } = renderWithDSLTheme(builder.toElement());
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList without testID', () => {
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with onEndReached without explicit threshold', () => {
    const loadMore = jest.fn();
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).onEndReached(loadMore).testID('ll-oer-no-th').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders LazyList with header but no stickyHeader', () => {
    const headerBuilder = Text('Header');
    const { toJSON } = renderWithDSLTheme(
      LazyList(testData, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
        listHeader: headerBuilder,
      }).testID('ll-hdr-ns').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });
});

describe('DSLRenderer - SectionedList', () => {
  it('renders SectionedList with renderSectionHeader', () => {
    const { toJSON } = renderWithDSLTheme(
      SectionedList(testSections, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
        renderSectionHeader: (title: string) => Text(title).bold(),
      }).testID('sl-hdr').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders SectionedList with hideScrollIndicator', () => {
    const { toJSON } = renderWithDSLTheme(
      SectionedList(testSections, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).hideScrollIndicator().testID('sl-hsi').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders SectionedList with contentPadding', () => {
    const { toJSON } = renderWithDSLTheme(
      SectionedList(testSections, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).contentPadding('sm').testID('sl-cp').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders SectionedList with bounces', () => {
    const { toJSON } = renderWithDSLTheme(
      SectionedList(testSections, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).bounces(false).testID('sl-bounce').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders SectionedList with refreshControl', () => {
    const onRefresh = jest.fn();
    const { toJSON } = renderWithDSLTheme(
      SectionedList(testSections, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).refreshControl(onRefresh, false).testID('sl-rc').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders SectionedList with separator', () => {
    const { toJSON } = renderWithDSLTheme(
      SectionedList(testSections, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).separator(() => Divider()).testID('sl-sep').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders SectionedList with emptyComponent', () => {
    const { toJSON } = renderWithDSLTheme(
      SectionedList([], {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).emptyComponent(() => Text('No sections')).testID('sl-empty').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders SectionedList without required props as fallback', () => {
    const builder = new ViewBuilder('sectionlist', {});
    const { toJSON } = renderWithDSLTheme(builder.toElement());
    expect(toJSON()).toBeTruthy();
  });

  it('renders SectionedList without testID', () => {
    const { toJSON } = renderWithDSLTheme(
      SectionedList(testSections, {
        keyExtractor: (item: any) => item.id,
        renderItem: (item: any) => Text(item.name),
      }).toElement()
    );
    expect(toJSON()).toBeTruthy();
  });
});
