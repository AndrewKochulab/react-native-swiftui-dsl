import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';
import type { Binding } from '@/Binding/Binding';
import type { ColorValue } from '@/Core/ThemeResolver';

export function Toggle(
  binding: Binding<boolean>,
  options?: { trackColor?: ColorValue; thumbColor?: ColorValue },
): ViewBuilder {
  return new ViewBuilder(ElementType.toggle, {
    toggleBinding: binding,
    toggleTrackColor: options?.trackColor,
    toggleThumbColor: options?.thumbColor,
  });
}
