import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export interface SectionData<T> {
  title: string;
  data: ReadonlyArray<T>;
}

export interface SectionedListOptions<T> {
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ViewBuilder;
  renderSectionHeader?: (title: string) => ViewBuilder;
}

export function SectionedList<T>(
  sections: ReadonlyArray<SectionData<T>>,
  options: SectionedListOptions<T>,
): ViewBuilder {
  return new ViewBuilder(ElementType.sectionlist, {
    sectionListData: sections as ReadonlyArray<{ title: string; data: ReadonlyArray<unknown> }>,
    keyExtractor: options.keyExtractor as (item: unknown) => string,
    sectionRenderItem: options.renderItem as (item: unknown) => ViewBuilder,
    sectionRenderHeader: options.renderSectionHeader as ((title: string) => ViewBuilder) | undefined,
  });
}
