import { ViewBuilder, DSLChild } from '@core';
import { ElementType } from '@tokens';

export function ScrollStack(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.scroll, {}, children);
}
