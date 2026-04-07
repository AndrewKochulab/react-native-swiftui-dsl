import { ViewBuilder } from '@core';
import { DSLDefaults } from '@config';
import { ElementType, type ButtonVariantToken } from '@tokens';

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
