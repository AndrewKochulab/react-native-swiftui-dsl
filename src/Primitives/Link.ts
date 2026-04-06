import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function Link(title: string, url: string): ViewBuilder {
  return new ViewBuilder(ElementType.link, {
    text: title,
    linkURL: url,
  });
}
