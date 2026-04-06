import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';
import type { ImageSourcePropType } from 'react-native';
import type { ImageResizeToken } from '@/Tokens/Component';

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
