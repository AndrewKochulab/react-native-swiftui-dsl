import { ViewBuilder, DSLChild } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function SafeArea(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.safearea, {}, children);
}
