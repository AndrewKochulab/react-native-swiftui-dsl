import { ViewBuilder, DSLChild } from '@/Core/ViewBuilder';
import { Binding } from '@/Binding/Binding';
import { DSLDefaults } from '@/Config/Defaults';
import { ElementType } from '@/Tokens/ElementType';
import type { ModalAnimationToken } from '@/Tokens/Component';

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
