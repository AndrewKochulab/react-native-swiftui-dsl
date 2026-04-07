import { ViewBuilder } from '@core';
import { DSLDefaults } from '@config';
import { ElementType, type SpinnerSizeToken } from '@tokens';

export function Spinner(size: SpinnerSizeToken = DSLDefaults.spinner.defaultSize): ViewBuilder {
  return new ViewBuilder(ElementType.spinner, { spinnerSize: size });
}
