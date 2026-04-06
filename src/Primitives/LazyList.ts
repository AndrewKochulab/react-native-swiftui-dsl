import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export interface LazyListOptions<T> {
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ViewBuilder;
  listHeader?: ViewBuilder;
  stickyHeader?: boolean;
}

export function LazyList<T>(
  data: ReadonlyArray<T>,
  options: LazyListOptions<T>,
): ViewBuilder {
  return new ViewBuilder(ElementType.lazylist, {
    listData: data as ReadonlyArray<unknown>,
    keyExtractor: options.keyExtractor as (item: unknown) => string,
    renderItem: options.renderItem as (item: unknown) => ViewBuilder,
    listHeader: options.listHeader,
    stickyHeader: options.stickyHeader,
  });
}
