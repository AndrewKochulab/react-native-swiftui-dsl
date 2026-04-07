import { DSLChild } from '@core';

export function ForEach<T>(
  data: ReadonlyArray<T>,
  keyExtractor: (item: T, index: number) => string | number,
  builder: (item: T, index: number) => DSLChild,
): DSLChild[] {
  return data.map((item, index) => builder(item, index));
}
