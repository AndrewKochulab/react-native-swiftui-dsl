import { ViewBuilder } from '@core';
import { ElementType } from '@tokens';

export function Link(title: string, url: string): ViewBuilder {
  return new ViewBuilder(ElementType.link, {
    text: title,
    linkURL: url,
  });
}
