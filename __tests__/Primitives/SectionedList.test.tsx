import React from 'react';
import { SectionedList, Text } from '@primitives';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';
import { ElementType, ModifierType } from '@tokens';

describe('SectionedList', () => {
  const sections = [
    { title: 'Fruits', data: ['Apple', 'Banana'] },
    { title: 'Vegetables', data: ['Carrot', 'Pea'] },
  ];

  const options = {
    keyExtractor: (item: string) => item,
    renderItem: (item: string) => Text(item),
    renderSectionHeader: (title: string) => Text(title).bold(),
  };

  it('creates a sectionlist element type', () => {
    const builder = SectionedList(sections, options);
    expect(builder.elementType).toBe(ElementType.sectionlist);
  });

  it('stores sections data in props', () => {
    const builder = SectionedList(sections, options);
    expect(builder.props.sectionListData).toHaveLength(2);
  });

  it('stores keyExtractor in props', () => {
    const builder = SectionedList(sections, options);
    expect(builder.props.keyExtractor).toBeDefined();
  });

  it('stores renderItem in props', () => {
    const builder = SectionedList(sections, options);
    expect(builder.props.sectionRenderItem).toBeDefined();
  });

  it('stores renderSectionHeader in props', () => {
    const builder = SectionedList(sections, options);
    expect(builder.props.sectionRenderHeader).toBeDefined();
  });

  it('renders without crashing', () => {
    const { toJSON } = renderWithDSLTheme(
      SectionedList(sections, options).testID('section-list').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies hideScrollIndicator modifier', () => {
    const builder = SectionedList(sections, options).hideScrollIndicator();
    expect(builder.modifiers).toContainEqual({ type: ModifierType.hideScrollIndicator, value: true });
  });

  it('applies testID modifier', () => {
    const builder = SectionedList(sections, options).testID('sections');
    expect(builder.modifiers).toContainEqual({ type: ModifierType.testID, value: 'sections' });
  });
});
