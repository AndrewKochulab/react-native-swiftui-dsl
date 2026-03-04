import React from 'react';
import { TextInput } from '../../src/Primitives/TextInput';
import { createBinding } from '../../src/Binding/Binding';
import { ViewBuilder } from '../../src/Core/ViewBuilder';
import { renderWithDSLTheme, testThemeConfig } from '../Helpers/renderWithDSLTheme';

describe('DSLRenderer - TextInput', () => {
  const makeBinding = (val = '') => createBinding<string>(val, jest.fn());

  it('renders TextInput with binding', () => {
    const binding = makeBinding('hello');
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).testID('ti').toElement()
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders TextInput without binding as empty view', () => {
    // Create a textinput builder without binding
    const builder = new ViewBuilder('textinput', {});
    const { toJSON } = renderWithDSLTheme(builder.toElement());
    expect(toJSON()).toBeTruthy();
  });

  it('renders TextInput with placeholder', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).placeholder('Enter here').testID('ti-ph').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with inputLabel and inputError', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding)
        .inputLabel('Email')
        .inputError('Invalid email')
        .testID('ti-le')
        .toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    // Should find the label text and error text
    const children = tree.children;
    expect(children.length).toBeGreaterThanOrEqual(2);
  });

  it('renders TextInput with inputLabel only', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding)
        .inputLabel('Name')
        .toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with multiline', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).multiline(4).testID('ti-ml').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with secureEntry', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).secureEntry().testID('ti-se').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with keyboardType', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).keyboardType('email-address').testID('ti-kt').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with autoCapitalize', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).autoCapitalize('none').testID('ti-ac').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with returnKeyType', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).returnKeyType('done').testID('ti-rk').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with maxLength', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).maxLength(100).testID('ti-mx').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with inputHeight', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).inputHeight(60).testID('ti-ih').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with viewStyle but no label/error', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).padding('sm').testID('ti-vs').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with accessibilityLabel', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).accessibilityLabel('Email input').testID('ti-al').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with all modifiers combined', () => {
    const binding = makeBinding('test');
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding)
        .placeholder('Type here')
        .inputLabel('Field')
        .inputError('Required')
        .keyboardType('default')
        .multiline(3)
        .autoCapitalize('sentences')
        .returnKeyType('next')
        .maxLength(200)
        .inputHeight(80)
        .accessibilityLabel('Text field')
        .testID('ti-all')
        .toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders TextInput with inputError only (no inputLabel)', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding)
        .inputError('Field is required')
        .testID('ti-err-only')
        .toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    // wrapper should exist (inputError triggers wrapper) but no label child
    const children = tree.children;
    expect(children).toBeDefined();
  });

  it('renders TextInput with multiline but no lines count', () => {
    const binding = makeBinding();
    const { toJSON } = renderWithDSLTheme(
      TextInput(binding).multiline().testID('ti-ml-no-lines').toElement()
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });
});
