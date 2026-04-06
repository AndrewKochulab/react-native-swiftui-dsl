import { ViewBuilder } from '@/Core/ViewBuilder';
import { ColorValue } from '@/Core/ThemeResolver';
import { ElementType } from '@/Tokens/ElementType';

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
