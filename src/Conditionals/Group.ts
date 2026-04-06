import { ViewBuilder, DSLChild } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function Group(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.fragment, {}, children);
}
