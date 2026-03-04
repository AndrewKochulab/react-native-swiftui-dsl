import { ViewBuilder, DSLChild } from '../Core/ViewBuilder';
import { Binding } from '../Binding/Binding';

export type ModalAnimationType = 'none' | 'slide' | 'fade';

export function Modal(
  isPresented: Binding<boolean>,
  options?: { animationType?: ModalAnimationType; transparent?: boolean },
  ...children: DSLChild[]
): ViewBuilder {
  return new ViewBuilder('modal', {
    modalBinding: isPresented,
    modalAnimationType: options?.animationType ?? 'slide',
    modalTransparent: options?.transparent ?? false,
  }, children);
}
