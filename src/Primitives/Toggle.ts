import { ViewBuilder, type ColorValue } from '@core';
import { ElementType } from '@tokens';
import type { Binding } from '@binding';

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
