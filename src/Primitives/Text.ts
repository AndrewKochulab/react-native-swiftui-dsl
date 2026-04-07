import { ViewBuilder } from '@core';
import { ElementType } from '@tokens';

export function Text(content: string): ViewBuilder {
  return new ViewBuilder(ElementType.text, { text: content });
}
