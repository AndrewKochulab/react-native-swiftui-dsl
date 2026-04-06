import { ViewBuilder } from '@/Core/ViewBuilder';
import { DSLDefaults } from '@/Config/Defaults';
import { ElementType } from '@/Tokens/ElementType';
import type { SpinnerSizeToken } from '@/Tokens/Component';

export function Spinner(size: SpinnerSizeToken = DSLDefaults.spinner.defaultSize): ViewBuilder {
  return new ViewBuilder(ElementType.spinner, { spinnerSize: size });
}
