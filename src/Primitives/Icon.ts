import { ViewBuilder, ColorValue } from '@core';
import { ElementType } from '@tokens';

export function Icon(
  name: string,
  options?: { size?: number; color?: ColorValue },
): ViewBuilder {
  return new ViewBuilder(ElementType.icon, {
    iconName: name,
    iconSize: options?.size,
    iconColor: options?.color,
  });
}
