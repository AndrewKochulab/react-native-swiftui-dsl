import { ViewBuilder } from '@core';
import { Binding } from '@binding';
import { ElementType } from '@tokens';

export function TextInput(binding: Binding<string>): ViewBuilder {
  return new ViewBuilder(ElementType.textinput, { binding });
}
