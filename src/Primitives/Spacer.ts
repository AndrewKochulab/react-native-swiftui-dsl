import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function Spacer(): ViewBuilder {
  return new ViewBuilder(ElementType.spacer);
}
