import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text } from '../../src/Primitives/Text';
import { VStack, HStack } from '../../src/Primitives/Containers';
import { Image } from '../../src/Primitives/Image';
import { Toggle } from '../../src/Primitives/Toggle';
import { Button } from '../../src/Primitives/Button';
import { Divider } from '../../src/Primitives/Divider';
import { Link } from '../../src/Primitives/Link';
import { Icon } from '../../src/Primitives/Icon';
import { Spinner } from '../../src/Primitives/Spinner';
import { Raw } from '../../src/Primitives/Raw';
import { createBinding } from '../../src/Binding/Binding';
import { ViewBuilder } from '../../src/Core/ViewBuilder';
import { DSLThemeProvider } from '../../src/Theme/DSLThemeProvider';
import { renderWithDSLTheme, testThemeConfig } from '../Helpers/renderWithDSLTheme';

const Colors = testThemeConfig.colors;
const Layout = testThemeConfig.layout;

function createWithTheme(element: React.ReactElement) {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(
      React.createElement(DSLThemeProvider, { config: testThemeConfig, colorScheme: 'light' }, element)
    );
  });
  return renderer;
}

function findByStyleFn(instance: TestRenderer.ReactTestInstance): TestRenderer.ReactTestInstance | undefined {
  if (typeof instance.props.style === 'function') return instance;
  for (const child of instance.children) {
    if (typeof child === 'object') {
      const found = findByStyleFn(child as TestRenderer.ReactTestInstance);
      if (found) return found;
    }
  }
  return undefined;
}

describe('DSLRenderer - New Modifiers', () => {
  describe('Position modifiers', () => {
    it('applies position absolute', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).position('absolute').testID('pos').toElement()
      );
      const el = getByTestId('pos');
      expect(el.props.style).toMatchObject({ position: 'absolute' });
    });

    it('applies position edges', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).positionEdges({ top: 0, left: 10 }).testID('edges').toElement()
      );
      const el = getByTestId('edges');
      expect(el.props.style).toMatchObject({ top: 0, left: 10 });
    });

    it('applies zIndex', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).zIndex(5).testID('z').toElement()
      );
      const el = getByTestId('z');
      expect(el.props.style).toMatchObject({ zIndex: 5 });
    });

    it('applies overflow hidden', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).overflow('hidden').testID('ovf').toElement()
      );
      const el = getByTestId('ovf');
      expect(el.props.style).toMatchObject({ overflow: 'hidden' });
    });

    it('applies aspectRatio', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).aspectRatio(1.5).testID('ar').toElement()
      );
      const el = getByTestId('ar');
      expect(el.props.style).toMatchObject({ aspectRatio: 1.5 });
    });

    it('applies alignSelf center', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).alignSelf('center').testID('as').toElement()
      );
      const el = getByTestId('as');
      expect(el.props.style).toMatchObject({ alignSelf: 'center' });
    });

    it('applies display none', () => {
      const { toJSON } = renderWithDSLTheme(
        VStack(Text('X')).display('none').testID('disp').toElement()
      );
      const tree = toJSON();
      expect(tree.props.style).toMatchObject({ display: 'none' });
      expect(tree.props.testID).toBe('disp');
    });

    it('applies hidden modifier', () => {
      const { toJSON } = renderWithDSLTheme(
        VStack(Text('X')).hidden().testID('hide').toElement()
      );
      const tree = toJSON();
      expect(tree.props.style).toMatchObject({ display: 'none' });
      expect(tree.props.testID).toBe('hide');
    });
  });

  describe('Text modifiers', () => {
    it('applies textDecoration underline', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Underlined').underline().toElement()
      );
      const el = getByText('Underlined');
      expect(el.props.style).toMatchObject({
        textDecorationLine: 'underline',
      });
    });

    it('applies textDecoration strikethrough', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Struck').strikethrough().toElement()
      );
      const el = getByText('Struck');
      expect(el.props.style).toMatchObject({
        textDecorationLine: 'line-through',
      });
    });

    it('applies italic', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Italic').italic().toElement()
      );
      const el = getByText('Italic');
      expect(el.props.style).toMatchObject({
        fontStyle: 'italic',
      });
    });

    it('applies fontFamily', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Custom').fontFamily('Courier').toElement()
      );
      const el = getByText('Custom');
      expect(el.props.style).toMatchObject({
        fontFamily: 'Courier',
      });
    });
  });

  describe('Interaction modifiers', () => {
    it('wraps with Pressable for onLongPress', () => {
      const handler = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Text('LongPressable').onLongPress(handler).toElement()
      );
      expect(getByText('LongPressable')).toBeTruthy();
    });
  });

  describe('Accessibility modifiers', () => {
    it('applies accessibilityRole to text', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Heading').accessibilityRole('header').toElement()
      );
      const el = getByText('Heading');
      expect(el.props.accessibilityRole).toBe('header');
    });

    it('applies accessibilityHint to text', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Tap me').accessibilityHint('Opens settings').toElement()
      );
      const el = getByText('Tap me');
      expect(el.props.accessibilityHint).toBe('Opens settings');
    });

    it('applies accessibilityRole to container', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).accessibilityRole('button').testID('ar-cont').toElement()
      );
      const el = getByTestId('ar-cont');
      expect(el.props.accessibilityRole).toBe('button');
    });

    it('applies accessibilityHint to container', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).accessibilityHint('Navigates').testID('ah-cont').toElement()
      );
      const el = getByTestId('ah-cont');
      expect(el.props.accessibilityHint).toBe('Navigates');
    });
  });

  describe('New element rendering', () => {
    it('renders Image element', () => {
      const { toJSON } = renderWithDSLTheme(
        Image({ uri: 'https://example.com/img.png' }).testID('img').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Toggle element', () => {
      const binding = createBinding<boolean>(true, jest.fn());
      const { toJSON } = renderWithDSLTheme(
        Toggle(binding).testID('toggle').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Button with filled style', () => {
      const action = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Button('Submit', action).toElement()
      );
      expect(getByText('Submit')).toBeTruthy();
    });

    it('renders Button with outlined style', () => {
      const action = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Button('Cancel', action, { style: 'outlined' }).toElement()
      );
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('renders Button with plain style', () => {
      const action = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Button('Skip', action, { style: 'plain' }).toElement()
      );
      expect(getByText('Skip')).toBeTruthy();
    });

    it('renders Button with icon', () => {
      const action = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Button('Save', action, { icon: 'save' }).toElement()
      );
      expect(getByText('Save')).toBeTruthy();
    });

    it('renders Divider', () => {
      const { toJSON } = renderWithDSLTheme(
        Divider().testID('div').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Link', () => {
      const { getByText } = renderWithDSLTheme(
        Link('Visit', 'https://example.com').toElement()
      );
      expect(getByText('Visit')).toBeTruthy();
    });

    it('renders Divider with custom color', () => {
      const { toJSON } = renderWithDSLTheme(
        Divider().foregroundColor('error').testID('div-colored').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Toggle with options', () => {
    it('renders Toggle with trackColor', () => {
      const binding = createBinding<boolean>(true, jest.fn());
      const { toJSON } = renderWithDSLTheme(
        Toggle(binding, { trackColor: 'success' }).testID('tgl-tc').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Toggle with thumbColor', () => {
      const binding = createBinding<boolean>(false, jest.fn());
      const { toJSON } = renderWithDSLTheme(
        Toggle(binding, { thumbColor: 'card' }).testID('tgl-thc').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Toggle with viewStyle', () => {
      const binding = createBinding<boolean>(true, jest.fn());
      const { toJSON } = renderWithDSLTheme(
        Toggle(binding).padding('sm').testID('tgl-vs').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Toggle with disabled', () => {
      const binding = createBinding<boolean>(true, jest.fn());
      const { toJSON } = renderWithDSLTheme(
        Toggle(binding).disabled().testID('tgl-dis').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Toggle with accessibilityLabel', () => {
      const binding = createBinding<boolean>(true, jest.fn());
      const { toJSON } = renderWithDSLTheme(
        Toggle(binding).accessibilityLabel('Dark mode').testID('tgl-al').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Spinner with viewStyle', () => {
    it('renders Spinner wrapped in View when has viewStyle', () => {
      const { toJSON } = renderWithDSLTheme(
        Spinner('small').padding('sm').testID('sp-vs').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Raw element rendering', () => {
    it('renders Raw with viewStyle', () => {
      const child = React.createElement('View', { testID: 'raw-child' });
      const { toJSON } = renderWithDSLTheme(
        Raw(child).padding('md').testID('raw-vs').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Raw with onTap interaction', () => {
      const handler = jest.fn();
      const child = React.createElement('View', { testID: 'raw-child2' });
      const { toJSON } = renderWithDSLTheme(
        Raw(child).onTap(handler).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Raw without styles as-is', () => {
      const child = React.createElement('View', { testID: 'raw-plain' });
      const { toJSON } = renderWithDSLTheme(
        Raw(child).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Icon with viewStyle', () => {
    it('renders Icon wrapped in View when has viewStyle', () => {
      const { toJSON } = renderWithDSLTheme(
        Icon('star', { size: 24, color: 'tint' }).padding('sm').testID('icon-vs').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Icon with onTap wraps in Pressable', () => {
      const handler = jest.fn();
      const { toJSON } = renderWithDSLTheme(
        Icon('star').onTap(handler).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Image with accessibilityLabel', () => {
    it('renders Image with accessibilityLabel', () => {
      const { toJSON } = renderWithDSLTheme(
        Image({ uri: 'https://example.com/img.png' }).accessibilityLabel('Photo').testID('img-al').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Image with alt text', () => {
      const { toJSON } = renderWithDSLTheme(
        Image({ uri: 'https://example.com/img.png' }, { alt: 'My image' }).testID('img-alt').toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders Image with onTap wraps in Pressable', () => {
      const handler = jest.fn();
      const { toJSON } = renderWithDSLTheme(
        Image({ uri: 'https://example.com/img.png' }).onTap(handler).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Button with custom styles', () => {
    it('renders Button with custom foregroundColor', () => {
      const action = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Button('Custom', action).foregroundColor('error').toElement()
      );
      expect(getByText('Custom')).toBeTruthy();
    });

    it('renders Button with disabled', () => {
      const action = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Button('Disabled', action).disabled().toElement()
      );
      expect(getByText('Disabled')).toBeTruthy();
    });

    it('renders Button with accessibilityLabel', () => {
      const action = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Button('Labeled', action).accessibilityLabel('Submit button').toElement()
      );
      expect(getByText('Labeled')).toBeTruthy();
    });

    it('renders outlined Button with custom foregroundColor', () => {
      const action = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Button('Outlined', action, { style: 'outlined' }).foregroundColor('error').toElement()
      );
      expect(getByText('Outlined')).toBeTruthy();
    });
  });

  describe('Container accessibilityLabel', () => {
    it('applies accessibilityLabel on container', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).accessibilityLabel('Container label').testID('c-al').toElement()
      );
      const el = getByTestId('c-al');
      expect(el.props.accessibilityLabel).toBe('Container label');
    });
  });

  describe('Default element type fallback', () => {
    it('renders unknown element type as View', () => {
      const builder = new ViewBuilder('unknown' as any, {}, []);
      const { toJSON } = renderWithDSLTheme(builder.toElement());
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Toggle without binding', () => {
    it('renders Toggle without binding (fallback value false)', () => {
      const builder = new ViewBuilder('toggle', {});
      const { toJSON } = renderWithDSLTheme(builder.toElement());
      expect(toJSON()).toBeTruthy();
    });

    it('renders Toggle without testID', () => {
      const binding = createBinding<boolean>(true, jest.fn());
      const { toJSON } = renderWithDSLTheme(
        Toggle(binding).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Spinner without explicit spinnerSize', () => {
    it('renders Spinner with default size when spinnerSize is undefined', () => {
      const builder = new ViewBuilder('spinner', {});
      const { toJSON } = renderWithDSLTheme(builder.toElement());
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Button without explicit buttonStyle', () => {
    it('renders Button with default filled style when buttonStyle is undefined', () => {
      const action = jest.fn();
      const builder = new ViewBuilder('button', {
        buttonTitle: 'Test',
        buttonAction: action,
      });
      const { toJSON } = renderWithDSLTheme(builder.toElement());
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Link without URL', () => {
    it('renders Link without linkURL (onPress does nothing)', () => {
      const builder = new ViewBuilder('link', { text: 'Click me' });
      const renderer = createWithTheme(builder.toElement());
      const root = renderer.root;
      // Find the element with onPress handler and fire it
      const pressable = findByStyleFn(root);
      expect(pressable).toBeTruthy();
      // Trigger onPress — it should not throw because linkURL is undefined
      expect(() => pressable!.props.onPress()).not.toThrow();
    });
  });

  describe('hidden(false)', () => {
    it('does not apply display:none when hidden is false', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).hidden(false).testID('not-hidden').toElement()
      );
      const el = getByTestId('not-hidden');
      expect(el.props.style.display).not.toBe('none');
    });
  });

  describe('shadow without elevation', () => {
    it('applies shadow without elevation property', () => {
      const builder = new ViewBuilder('vstack', {}, [Text('X')]);
      builder.withModifier({
        type: 'shadow',
        color: 'text',
        offset: { width: 0, height: 2 },
        opacity: 0.25,
        radius: 4,
      } as any);
      const { toJSON } = renderWithDSLTheme(builder.toElement());
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('positionEdges full coverage', () => {
    it('applies positionEdges with all four edges', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).positionEdges({ top: 0, left: 10, right: 20, bottom: 30 }).testID('all-edges').toElement()
      );
      const el = getByTestId('all-edges');
      expect(el.props.style).toMatchObject({ top: 0, left: 10, right: 20, bottom: 30 });
    });

    it('applies positionEdges with only right and bottom', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).positionEdges({ right: 5, bottom: 15 }).testID('rb-edges').toElement()
      );
      const el = getByTestId('rb-edges');
      expect(el.props.style).toMatchObject({ right: 5, bottom: 15 });
    });
  });

  describe('Pressable pressed state callbacks', () => {
    function findByPropDeep(instance: TestRenderer.ReactTestInstance, propName: string, propValue: unknown): TestRenderer.ReactTestInstance | undefined {
      if (instance.props[propName] === propValue) return instance;
      for (const child of instance.children) {
        if (typeof child === 'object') {
          const found = findByPropDeep(child as TestRenderer.ReactTestInstance, propName, propValue);
          if (found) return found;
        }
      }
      return undefined;
    }

    it('Button style function returns correct opacity for pressed and unpressed', () => {
      const action = jest.fn();
      const renderer = createWithTheme(
        Button('Press', action).testID('btn-press').toElement()
      );
      const pressable = findByPropDeep(renderer.root, 'testID', 'btn-press');
      expect(pressable).toBeTruthy();
      // The Pressable's style function may be on this element or a parent
      const withStyleFn = typeof pressable!.props.style === 'function'
        ? pressable!
        : findByStyleFn(renderer.root);
      expect(withStyleFn).toBeTruthy();
      const styleFn = withStyleFn!.props.style;
      expect(typeof styleFn).toBe('function');
      const unpressedStyle = styleFn({ pressed: false });
      const pressedStyle = styleFn({ pressed: true });
      expect(unpressedStyle.opacity).toBe(1);
      expect(pressedStyle.opacity).toBeLessThan(1);
    });

    it('Link style function returns correct opacity for pressed and unpressed', () => {
      const renderer = createWithTheme(
        Link('Visit', 'https://example.com').testID('link-press').toElement()
      );
      const withStyleFn = findByStyleFn(renderer.root);
      expect(withStyleFn).toBeTruthy();
      const styleFn = withStyleFn!.props.style;
      expect(typeof styleFn).toBe('function');
      const unpressedStyle = styleFn({ pressed: false });
      const pressedStyle = styleFn({ pressed: true });
      expect(unpressedStyle.opacity).toBe(1);
      expect(pressedStyle.opacity).toBeLessThan(1);
    });

    it('onTap wrapper style function returns correct opacity for pressed and unpressed', () => {
      const handler = jest.fn();
      const renderer = createWithTheme(
        Text('Tappable').onTap(handler).toElement()
      );
      const withStyleFn = findByStyleFn(renderer.root);
      expect(withStyleFn).toBeTruthy();
      const styleFn = withStyleFn!.props.style;
      expect(typeof styleFn).toBe('function');
      const unpressedStyle = styleFn({ pressed: false });
      const pressedStyle = styleFn({ pressed: true });
      expect(unpressedStyle.opacity).toBe(1);
      expect(pressedStyle.opacity).toBeLessThan(1);
    });
  });
});
