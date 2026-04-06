import { ViewBuilder } from '@/Core/ViewBuilder';
import { Binding } from '@/Binding/Binding';
import { ElementType } from '@/Tokens/ElementType';

export function TextInput(binding: Binding<string>): ViewBuilder {
  return new ViewBuilder(ElementType.textinput, { binding });
}
