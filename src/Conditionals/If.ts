import { DSLChild } from '@/Core/ViewBuilder';

export function If(
  condition: boolean,
  thenBuilder: () => DSLChild,
  elseBuilder?: () => DSLChild,
): DSLChild {
  if (condition) {
    return thenBuilder();
  }
  return elseBuilder ? elseBuilder() : null;
}
