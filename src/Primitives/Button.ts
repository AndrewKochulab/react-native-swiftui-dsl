import { ViewBuilder } from '@/Core/ViewBuilder';
import { DSLDefaults } from '@/Config/Defaults';
import { ElementType } from '@/Tokens/ElementType';
import type { ButtonVariantToken } from '@/Tokens/Component';

export type ButtonStyle = ButtonVariantToken;

export function Button(
  title: string,
  action: () => void,
  options?: { style?: ButtonStyle; icon?: string },
): ViewBuilder {
  return new ViewBuilder(ElementType.button, {
    buttonTitle: title,
    buttonAction: action,
    buttonStyle: options?.style ?? DSLDefaults.button.defaultStyle,
    buttonIcon: options?.icon,
  });
}
