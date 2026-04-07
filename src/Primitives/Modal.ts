import { ViewBuilder, DSLChild } from '@core';
import { Binding } from '@binding';
import { DSLDefaults } from '@config';
import { ElementType, type ModalAnimationToken } from '@tokens';

export type ModalAnimationType = ModalAnimationToken;

export function Modal(
  isPresented: Binding<boolean>,
  options?: { animationType?: ModalAnimationType; transparent?: boolean },
  ...children: DSLChild[]
): ViewBuilder {
  return new ViewBuilder(ElementType.modal, {
    modalBinding: isPresented,
    modalAnimationType: options?.animationType ?? DSLDefaults.modal.animationType,
    modalTransparent: options?.transparent ?? DSLDefaults.modal.transparent,
  }, children);
}
