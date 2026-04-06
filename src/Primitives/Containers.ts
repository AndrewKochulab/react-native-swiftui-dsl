import { ViewBuilder, DSLChild } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function VStack(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.vstack, {}, children);
}

export function HStack(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.hstack, {}, children);
}

export function ZStack(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.zstack, {}, children);
}
