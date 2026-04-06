import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function Divider(): ViewBuilder {
  return new ViewBuilder(ElementType.divider);
}
