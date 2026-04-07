import { ViewBuilder, ColorValue } from '@core';
import { ElementType } from '@tokens';

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
