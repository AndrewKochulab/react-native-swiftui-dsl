import React from 'react';
import { Modal as RNModal } from 'react-native';
import { renderWithDSLTheme } from '../Helpers/renderWithDSLTheme';
import { Modal } from '../../src/Primitives/Modal';
import { Text } from '../../src/Primitives/Text';
import { VStack } from '../../src/Primitives/Containers';
import { DSLRenderer } from '../../src/Core/DSLRenderer';
import { createBinding } from '../../src/Binding/Binding';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
}));

describe('Modal primitive', () => {
  it('renders a visible modal', () => {
    const binding = createBinding(true, jest.fn());
    const builder = Modal(binding, undefined, Text('Modal Content'));
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('renders with custom animation type', () => {
    const binding = createBinding(true, jest.fn());
    const builder = Modal(binding, { animationType: 'fade' }, Text('Fade'));
    const { UNSAFE_getByType } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const modal = UNSAFE_getByType(RNModal);
    expect(modal.props.animationType).toBe('fade');
  });

  it('renders as transparent', () => {
    const binding = createBinding(true, jest.fn());
    const builder = Modal(binding, { transparent: true }, Text('Transparent'));
    const { UNSAFE_getByType } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const modal = UNSAFE_getByType(RNModal);
    expect(modal.props.transparent).toBe(true);
  });

  it('renders with multiple children', () => {
    const binding = createBinding(true, jest.fn());
    const builder = Modal(binding, undefined, Text('Title'), Text('Body'));
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Body')).toBeTruthy();
  });

  it('applies modifiers to modal content', () => {
    const binding = createBinding(true, jest.fn());
    const builder = Modal(binding, undefined, Text('Styled')).padding(20);
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('Styled')).toBeTruthy();
  });

  it('calls onRequestClose which updates binding', () => {
    const updateFn = jest.fn();
    const binding = createBinding(true, updateFn);
    const builder = Modal(binding, undefined, Text('Close me'));
    const { UNSAFE_getByType } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const modal = UNSAFE_getByType(RNModal);
    modal.props.onRequestClose();
    expect(updateFn).toHaveBeenCalledWith(false);
  });

  it('passes testID to modal', () => {
    const binding = createBinding(true, jest.fn());
    const builder = Modal(binding, undefined, Text('Test')).testID('my-modal');
    const { UNSAFE_getByType } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const modal = UNSAFE_getByType(RNModal);
    expect(modal.props.testID).toBe('my-modal');
  });

  it('calls onDismiss handler on close', () => {
    const dismissHandler = jest.fn();
    const updateFn = jest.fn();
    const binding = createBinding(true, updateFn);
    const builder = Modal(binding, undefined, Text('Dismiss me')).onDismiss(dismissHandler);
    const { UNSAFE_getByType } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const modal = UNSAFE_getByType(RNModal);
    modal.props.onRequestClose();
    expect(dismissHandler).toHaveBeenCalled();
    expect(updateFn).toHaveBeenCalledWith(false);
  });

  it('renders hidden when binding is false', () => {
    const binding = createBinding(false, jest.fn());
    const builder = Modal(binding, undefined, Text('Hidden'));
    const { UNSAFE_getByType } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const modal = UNSAFE_getByType(RNModal);
    expect(modal.props.visible).toBe(false);
  });
});
