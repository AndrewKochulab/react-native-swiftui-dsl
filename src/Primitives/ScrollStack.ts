import { ViewBuilder, DSLChild } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function ScrollStack(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.scroll, {}, children);
}
