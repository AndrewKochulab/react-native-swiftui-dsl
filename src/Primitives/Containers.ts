import { ViewBuilder, DSLChild } from '@core';
import { ElementType } from '@tokens';

export function VStack(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.vstack, {}, children);
}

export function HStack(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.hstack, {}, children);
}

export function ZStack(...children: DSLChild[]): ViewBuilder {
  return new ViewBuilder(ElementType.zstack, {}, children);
}
