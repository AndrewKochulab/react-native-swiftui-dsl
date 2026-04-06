import { ViewBuilder } from '@/Core/ViewBuilder';
import { ColorValue } from '@/Core/ThemeResolver';
import { ElementType } from '@/Tokens/ElementType';

export function ProgressBar(
  value: number,
  options?: { trackColor?: ColorValue; progressColor?: ColorValue },
): ViewBuilder {
  return new ViewBuilder(ElementType.progressbar, {
    progressValue: value,
    progressTrackColor: options?.trackColor,
    progressColor: options?.progressColor,
  });
}
