import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function Text(content: string): ViewBuilder {
  return new ViewBuilder(ElementType.text, { text: content });
}
