import { ViewBuilder } from '@core';
import { ElementType } from '@tokens';

export function Divider(): ViewBuilder {
  return new ViewBuilder(ElementType.divider);
}
