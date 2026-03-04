import { ViewBuilder } from '../Core/ViewBuilder';
import { ColorValue } from '../Core/ThemeResolver';

export function ProgressBar(
  value: number,
  options?: { trackColor?: ColorValue; progressColor?: ColorValue },
): ViewBuilder {
  return new ViewBuilder('progressbar', {
    progressValue: value,
    progressTrackColor: options?.trackColor,
    progressColor: options?.progressColor,
  });
}
