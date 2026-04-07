import { ViewBuilder, DSLChild } from '@core';
import { ElementType } from '@tokens';

export function Group(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.fragment, {}, children);
}
