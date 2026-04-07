import { ViewBuilder, DSLChild } from '@core';
import { ElementType } from '@tokens';

export function SafeArea(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.safearea, {}, children);
}
