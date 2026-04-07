import { ViewBuilder } from '@core';
import { ElementType, type ImageResizeToken } from '@tokens';
import type { ImageSourcePropType } from 'react-native';

export type ImageSource = ImageSourcePropType | { uri: string };

export function Image(
  source: ImageSource,
  options?: { resizeMode?: ImageResizeToken; alt?: string },
): ViewBuilder {
  return new ViewBuilder(ElementType.image, {
    imageSource: source,
    resizeMode: options?.resizeMode,
    imageAlt: options?.alt,
  });
}
