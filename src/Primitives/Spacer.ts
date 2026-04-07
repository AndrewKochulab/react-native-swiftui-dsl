import { ViewBuilder } from '@core';
import { ElementType } from '@tokens';

export function Spacer(): ViewBuilder {
  return new ViewBuilder(ElementType.spacer);
}
