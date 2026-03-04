import { isViewBuilder } from '../../src/Core/ViewBuilder';
import { Text } from '../../src/Primitives/Text';
import { VStack, HStack } from '../../src/Primitives/Containers';
import { Icon } from '../../src/Primitives/Icon';
import { Spacer } from '../../src/Primitives/Spacer';
import { SafeArea } from '../../src/Primitives/SafeArea';
import { ScrollStack } from '../../src/Primitives/ScrollStack';
import { DSLDefaults } from '../../src/Config/Defaults';

// Mock expo-router for toElement() with screen options
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ options }: { options: Record<string, unknown> }) => null,
  },
}));

describe('ViewBuilder', () => {
  describe('construction', () => {
    it('creates a text element', () => {
      const builder = Text('Hello');
      expect(builder.elementType).toBe('text');
      expect(builder.props.text).toBe('Hello');
      expect(builder.children).toHaveLength(0);
      expect(builder.modifiers).toHaveLength(0);
    });

    it('creates a vstack with children', () => {
      const builder = VStack(Text('A'), Text('B'));
      expect(builder.elementType).toBe('vstack');
      expect(builder.children).toHaveLength(2);
    });

    it('creates an hstack with children', () => {
      const builder = HStack(Text('X'), Text('Y'));
      expect(builder.elementType).toBe('hstack');
      expect(builder.children).toHaveLength(2);
    });

    it('creates an icon element', () => {
      const iconSize = 24;
      const builder = Icon('star', { size: iconSize, color: 'tint' });
      expect(builder.elementType).toBe('icon');
      expect(builder.props.iconName).toBe('star');
      expect(builder.props.iconSize).toBe(iconSize);
      expect(builder.props.iconColor).toBe('tint');
    });

    it('creates a spacer element', () => {
      const builder = Spacer();
      expect(builder.elementType).toBe('spacer');
    });
  });

  describe('chaining', () => {
    it('returns the same instance for chained modifiers', () => {
      const a = Text('Hello');
      const b = a.font('title');
      const c = b.bold();

      expect(a).toBe(b);
      expect(b).toBe(c);
    });

    it('accumulates modifiers on the same builder', () => {
      const builder = Text('Hello').font('title').bold();
      expect(builder.modifiers).toHaveLength(2);
    });

    it('preserves element type and props through chaining', () => {
      const builder = Text('Hello').font('title').bold().foregroundColor('tint');

      expect(builder.elementType).toBe('text');
      expect(builder.props.text).toBe('Hello');
      expect(builder.modifiers).toHaveLength(3);
    });
  });

  describe('text modifiers', () => {
    it('adds font modifier', () => {
      const builder = Text('X').font('title');
      expect(builder.modifiers).toEqual([{ type: 'font', size: 'title' }]);
    });

    it('adds numeric font size', () => {
      const numericSize = 20;
      const builder = Text('X').font(numericSize);
      expect(builder.modifiers).toEqual([{ type: 'font', size: numericSize }]);
    });

    it('adds fontWeight modifier', () => {
      const builder = Text('X').fontWeight('semibold');
      expect(builder.modifiers).toEqual([{ type: 'fontWeight', weight: 'semibold' }]);
    });

    it('bold is shortcut for fontWeight bold', () => {
      const builder = Text('X').bold();
      expect(builder.modifiers).toEqual([{ type: 'fontWeight', weight: 'bold' }]);
    });

    it('semibold is shortcut for fontWeight semibold', () => {
      const builder = Text('X').semibold();
      expect(builder.modifiers).toEqual([{ type: 'fontWeight', weight: 'semibold' }]);
    });

    it('caption is shortcut for font caption', () => {
      const builder = Text('X').caption();
      expect(builder.modifiers).toEqual([{ type: 'font', size: 'caption' }]);
    });

    it('secondary is shortcut for foregroundColor secondaryText', () => {
      const builder = Text('X').secondary();
      expect(builder.modifiers).toEqual([{ type: 'foregroundColor', color: 'secondaryText' }]);
    });

    it('adds textTransform modifier', () => {
      const builder = Text('X').textTransform('uppercase');
      expect(builder.modifiers).toEqual([{ type: 'textTransform', value: 'uppercase' }]);
    });

    it('adds letterSpacing modifier', () => {
      const letterSpacingValue = 0.5;
      const builder = Text('X').letterSpacing(letterSpacingValue);
      expect(builder.modifiers).toEqual([{ type: 'letterSpacing', value: letterSpacingValue }]);
    });

    it('adds lineLimit modifier', () => {
      const lineLimitValue = 1;
      const builder = Text('X').lineLimit(lineLimitValue);
      expect(builder.modifiers).toEqual([{ type: 'lineLimit', value: lineLimitValue }]);
    });
  });

  describe('layout modifiers', () => {
    it('adds default padding', () => {
      const builder = Text('X').padding();
      expect(builder.modifiers).toEqual([{ type: 'padding', value: DSLDefaults.spacing, edge: DSLDefaults.edge }]);
    });

    it('adds padding with token', () => {
      const builder = Text('X').padding('sm');
      expect(builder.modifiers).toEqual([{ type: 'padding', value: 'sm', edge: DSLDefaults.edge }]);
    });

    it('adds padding with numeric value and edge', () => {
      const paddingValue = 12;
      const builder = Text('X').padding(paddingValue, 'horizontal');
      expect(builder.modifiers).toEqual([{ type: 'padding', value: paddingValue, edge: 'horizontal' }]);
    });

    it('adds paddingHorizontal', () => {
      const builder = Text('X').paddingHorizontal('lg');
      expect(builder.modifiers).toEqual([{ type: 'padding', value: 'lg', edge: 'horizontal' }]);
    });

    it('adds paddingHorizontal with default', () => {
      const builder = Text('X').paddingHorizontal();
      expect(builder.modifiers).toEqual([{ type: 'padding', value: DSLDefaults.spacing, edge: 'horizontal' }]);
    });

    it('adds paddingVertical', () => {
      const paddingValue = 8;
      const builder = Text('X').paddingVertical(paddingValue);
      expect(builder.modifiers).toEqual([{ type: 'padding', value: paddingValue, edge: 'vertical' }]);
    });

    it('adds paddingVertical with default', () => {
      const builder = Text('X').paddingVertical();
      expect(builder.modifiers).toEqual([{ type: 'padding', value: DSLDefaults.spacing, edge: 'vertical' }]);
    });

    it('adds margin', () => {
      const builder = Text('X').margin('sm');
      expect(builder.modifiers).toEqual([{ type: 'margin', value: 'sm', edge: DSLDefaults.edge }]);
    });

    it('adds default margin', () => {
      const builder = Text('X').margin();
      expect(builder.modifiers).toEqual([{ type: 'margin', value: DSLDefaults.spacing, edge: DSLDefaults.edge }]);
    });

    it('adds marginBottom', () => {
      const marginValue = 4;
      const builder = Text('X').marginBottom(marginValue);
      expect(builder.modifiers).toEqual([{ type: 'margin', value: marginValue, edge: 'bottom' }]);
    });

    it('adds marginBottom with default', () => {
      const builder = Text('X').marginBottom();
      expect(builder.modifiers).toEqual([{ type: 'margin', value: DSLDefaults.spacing, edge: 'bottom' }]);
    });

    it('adds marginLeft', () => {
      const marginValue = 8;
      const builder = Text('X').marginLeft(marginValue);
      expect(builder.modifiers).toEqual([{ type: 'margin', value: marginValue, edge: 'left' }]);
    });

    it('adds marginLeft with default', () => {
      const builder = Text('X').marginLeft();
      expect(builder.modifiers).toEqual([{ type: 'margin', value: DSLDefaults.spacing, edge: 'left' }]);
    });

    it('adds marginRight', () => {
      const marginValue = 12;
      const builder = Text('X').marginRight(marginValue);
      expect(builder.modifiers).toEqual([{ type: 'margin', value: marginValue, edge: 'right' }]);
    });

    it('adds marginRight with default', () => {
      const builder = Text('X').marginRight();
      expect(builder.modifiers).toEqual([{ type: 'margin', value: DSLDefaults.spacing, edge: 'right' }]);
    });

    it('adds paddingLeft', () => {
      const paddingValue = 6;
      const builder = Text('X').paddingLeft(paddingValue);
      expect(builder.modifiers).toEqual([{ type: 'padding', value: paddingValue, edge: 'left' }]);
    });

    it('adds paddingLeft with default', () => {
      const builder = Text('X').paddingLeft();
      expect(builder.modifiers).toEqual([{ type: 'padding', value: DSLDefaults.spacing, edge: 'left' }]);
    });

    it('adds paddingRight', () => {
      const paddingValue = 10;
      const builder = Text('X').paddingRight(paddingValue);
      expect(builder.modifiers).toEqual([{ type: 'padding', value: paddingValue, edge: 'right' }]);
    });

    it('adds paddingRight with default', () => {
      const builder = Text('X').paddingRight();
      expect(builder.modifiers).toEqual([{ type: 'padding', value: DSLDefaults.spacing, edge: 'right' }]);
    });

    it('adds flex', () => {
      const builder = Text('X').flex(DSLDefaults.flex);
      expect(builder.modifiers).toEqual([{ type: 'flex', value: DSLDefaults.flex }]);
    });

    it('adds default flex', () => {
      const builder = Text('X').flex();
      expect(builder.modifiers).toEqual([{ type: 'flex', value: DSLDefaults.flex }]);
    });

    it('adds frame', () => {
      const frameWidth = 36;
      const frameHeight = 36;
      const builder = Text('X').frame({ width: frameWidth, height: frameHeight, alignment: 'center' });
      expect(builder.modifiers).toEqual([
        { type: 'frame', width: frameWidth, height: frameHeight, alignment: 'center' },
      ]);
    });

    it('adds spacing', () => {
      const spacingValue = 8;
      const builder = VStack(Text('A')).spacing(spacingValue);
      expect(builder.modifiers).toEqual([{ type: 'spacing', value: spacingValue }]);
    });

    it('adds gap', () => {
      const gapValue = 4;
      const builder = HStack(Text('A')).gap(gapValue);
      expect(builder.modifiers).toEqual([{ type: 'gap', value: gapValue }]);
    });
  });

  describe('style modifiers', () => {
    it('adds background', () => {
      const builder = Text('X').background('card');
      expect(builder.modifiers).toEqual([{ type: 'background', color: 'card' }]);
    });

    it('adds backgroundAlpha', () => {
      const alphaValue = 0.08;
      const expectedAlphaHex = '14';
      const builder = Text('X').backgroundAlpha('tint', alphaValue);
      expect(builder.modifiers[0]).toMatchObject({
        type: 'backgroundAlpha',
        color: 'tint',
        alphaHex: expectedAlphaHex,
      });
    });

    it('adds foregroundColor', () => {
      const builder = Text('X').foregroundColor('error');
      expect(builder.modifiers).toEqual([{ type: 'foregroundColor', color: 'error' }]);
    });

    it('adds cornerRadius with number', () => {
      const radiusValue = 12;
      const builder = Text('X').cornerRadius(radiusValue);
      expect(builder.modifiers).toEqual([{ type: 'cornerRadius', value: radiusValue }]);
    });

    it('adds cornerRadius with token', () => {
      const builder = Text('X').cornerRadius('md');
      expect(builder.modifiers).toEqual([{ type: 'cornerRadius', value: 'md' }]);
    });

    it('adds border', () => {
      const borderWidth = 1;
      const builder = Text('X').border(borderWidth, 'cardBorder');
      expect(builder.modifiers).toEqual([{ type: 'border', width: borderWidth, color: 'cardBorder' }]);
    });

    it('adds shadow with defaults', () => {
      const builder = Text('X').shadow();
      expect(builder.modifiers).toEqual([{
        type: 'shadow',
        color: DSLDefaults.shadow.color,
        offset: DSLDefaults.shadow.offset,
        opacity: DSLDefaults.shadow.opacity,
        radius: DSLDefaults.shadow.radius,
        elevation: DSLDefaults.shadow.elevation,
      }]);
    });

    it('adds shadow with custom values', () => {
      const customRadius = 4;
      const customElevation = 1;
      const builder = Text('X').shadow({ color: 'error', radius: customRadius, elevation: customElevation });
      expect(builder.modifiers[0]).toMatchObject({
        type: 'shadow',
        color: 'error',
        radius: customRadius,
        elevation: customElevation,
      });
    });

    it('adds opacity', () => {
      const opacityValue = 0.5;
      const builder = Text('X').opacity(opacityValue);
      expect(builder.modifiers).toEqual([{ type: 'opacity', value: opacityValue }]);
    });
  });

  describe('container modifiers', () => {
    it('adds justifyContent', () => {
      const builder = HStack(Text('A')).justifyContent('spaceBetween');
      expect(builder.modifiers).toEqual([{ type: 'justifyContent', value: 'spaceBetween' }]);
    });

    it('adds alignItems', () => {
      const builder = VStack(Text('A')).alignItems('center');
      expect(builder.modifiers).toEqual([{ type: 'alignItems', value: 'center' }]);
    });

    it('adds alignment', () => {
      const builder = VStack(Text('A')).alignment('center');
      expect(builder.modifiers).toEqual([{ type: 'alignment', value: 'center' }]);
    });

    it('adds flexWrap', () => {
      const builder = HStack(Text('A')).flexWrap();
      expect(builder.modifiers).toEqual([{ type: 'flexWrap', value: 'wrap' }]);
    });
  });

  describe('interaction modifiers', () => {
    it('adds onTap', () => {
      const handler = jest.fn();
      const builder = Text('X').onTap(handler);
      expect(builder.modifiers).toEqual([{ type: 'onTap', handler }]);
    });

    it('adds disabled', () => {
      const builder = Text('X').disabled();
      expect(builder.modifiers).toEqual([{ type: 'disabled', value: true }]);
    });

    it('adds testID', () => {
      const builder = Text('X').testID('my-text');
      expect(builder.modifiers).toEqual([{ type: 'testID', value: 'my-text' }]);
    });

    it('adds accessibilityLabel', () => {
      const builder = Text('X').accessibilityLabel('Hello');
      expect(builder.modifiers).toEqual([{ type: 'accessibilityLabel', value: 'Hello' }]);
    });
  });

  describe('modifier chaining', () => {
    it('chains multiple modifiers correctly', () => {
      const builder = Text('Hello')
        .font('title')
        .bold()
        .foregroundColor('tint')
        .padding('sm')
        .background('card');

      expect(builder.modifiers).toHaveLength(5);
      expect(builder.modifiers[0]).toEqual({ type: 'font', size: 'title' });
      expect(builder.modifiers[1]).toEqual({ type: 'fontWeight', weight: 'bold' });
      expect(builder.modifiers[2]).toEqual({ type: 'foregroundColor', color: 'tint' });
      expect(builder.modifiers[3]).toEqual({ type: 'padding', value: 'sm', edge: DSLDefaults.edge });
      expect(builder.modifiers[4]).toEqual({ type: 'background', color: 'card' });
    });
  });

  describe('children handling', () => {
    it('filters null children', () => {
      const builder = VStack(Text('A'), null, Text('B'));
      expect(builder.children).toHaveLength(3);
      // Null filtering happens at render time in DSLRenderer
    });

    it('accepts string children', () => {
      const builder = VStack('hello' as any);
      expect(builder.children).toHaveLength(1);
    });

    it('accepts nested builders', () => {
      const inner = HStack(Text('X'));
      const outer = VStack(inner, Text('Y'));
      expect(outer.children).toHaveLength(2);
    });
  });

  describe('safearea modifiers', () => {
    it('adds edges modifier', () => {
      const builder = SafeArea(Text('X')).edges(['top']);
      expect(builder.modifiers).toEqual([
        { type: 'safeAreaEdges', value: ['top'] },
      ]);
    });

    it('adds edges with multiple values', () => {
      const builder = SafeArea(Text('X')).edges(['top', 'bottom']);
      expect(builder.modifiers).toEqual([
        { type: 'safeAreaEdges', value: ['top', 'bottom'] },
      ]);
    });
  });

  describe('scroll modifiers', () => {
    it('adds hideScrollIndicator', () => {
      const builder = ScrollStack(Text('X')).hideScrollIndicator();
      expect(builder.modifiers).toEqual([
        { type: 'hideScrollIndicator', value: true },
      ]);
    });

    it('adds contentPadding with defaults', () => {
      const builder = ScrollStack(Text('X')).contentPadding();
      expect(builder.modifiers).toEqual([
        { type: 'scrollContentPadding', value: DSLDefaults.spacing, edge: DSLDefaults.edge },
      ]);
    });

    it('adds contentPadding with custom value and edge', () => {
      const paddingValue = 24;
      const builder = ScrollStack(Text('X')).contentPadding(paddingValue, 'bottom');
      expect(builder.modifiers).toEqual([
        { type: 'scrollContentPadding', value: paddingValue, edge: 'bottom' },
      ]);
    });

    it('adds contentPaddingBottom with default', () => {
      const builder = ScrollStack(Text('X')).contentPaddingBottom();
      expect(builder.modifiers).toEqual([
        { type: 'scrollContentPadding', value: DSLDefaults.spacing, edge: 'bottom' },
      ]);
    });

    it('adds contentPaddingBottom with custom value', () => {
      const paddingValue = 32;
      const builder = ScrollStack(Text('X')).contentPaddingBottom(paddingValue);
      expect(builder.modifiers).toEqual([
        { type: 'scrollContentPadding', value: paddingValue, edge: 'bottom' },
      ]);
    });
  });

  describe('isViewBuilder', () => {
    it('returns true for ViewBuilder instances', () => {
      expect(isViewBuilder(Text('Hello'))).toBe(true);
      expect(isViewBuilder(VStack())).toBe(true);
    });

    it('returns false for non-ViewBuilder values', () => {
      expect(isViewBuilder(null)).toBe(false);
      expect(isViewBuilder(undefined)).toBe(false);
      expect(isViewBuilder('string')).toBe(false);
      expect(isViewBuilder(42)).toBe(false);
      expect(isViewBuilder({})).toBe(false);
    });
  });

  describe('new layout modifiers', () => {
    it('adds position modifier', () => {
      const builder = Text('X').position('absolute');
      expect(builder.modifiers).toEqual([{ type: 'position', value: 'absolute' }]);
    });

    it('adds positionEdges modifier', () => {
      const builder = Text('X').positionEdges({ top: 0, left: 10, right: 10 });
      expect(builder.modifiers).toEqual([{ type: 'positionEdges', top: 0, left: 10, right: 10 }]);
    });

    it('adds zIndex modifier', () => {
      const builder = Text('X').zIndex(10);
      expect(builder.modifiers).toEqual([{ type: 'zIndex', value: 10 }]);
    });

    it('adds overflow modifier', () => {
      const builder = Text('X').overflow('hidden');
      expect(builder.modifiers).toEqual([{ type: 'overflow', value: 'hidden' }]);
    });

    it('adds aspectRatio modifier', () => {
      const aspectValue = 1.5;
      const builder = Text('X').aspectRatio(aspectValue);
      expect(builder.modifiers).toEqual([{ type: 'aspectRatio', value: aspectValue }]);
    });

    it('adds alignSelf modifier', () => {
      const builder = Text('X').alignSelf('center');
      expect(builder.modifiers).toEqual([{ type: 'alignSelf', value: 'center' }]);
    });

    it('adds display modifier', () => {
      const builder = Text('X').display('none');
      expect(builder.modifiers).toEqual([{ type: 'display', value: 'none' }]);
    });

    it('adds hidden modifier with default true', () => {
      const builder = Text('X').hidden();
      expect(builder.modifiers).toEqual([{ type: 'hidden', value: true }]);
    });

    it('adds hidden modifier with false', () => {
      const builder = Text('X').hidden(false);
      expect(builder.modifiers).toEqual([{ type: 'hidden', value: false }]);
    });
  });

  describe('new text modifiers', () => {
    it('adds textDecoration modifier', () => {
      const builder = Text('X').textDecoration('underline');
      expect(builder.modifiers).toEqual([{ type: 'textDecoration', value: 'underline' }]);
    });

    it('adds underline shortcut', () => {
      const builder = Text('X').underline();
      expect(builder.modifiers).toEqual([{ type: 'textDecoration', value: 'underline' }]);
    });

    it('adds strikethrough shortcut', () => {
      const builder = Text('X').strikethrough();
      expect(builder.modifiers).toEqual([{ type: 'textDecoration', value: 'line-through' }]);
    });

    it('adds fontStyle modifier', () => {
      const builder = Text('X').fontStyle('italic');
      expect(builder.modifiers).toEqual([{ type: 'fontStyle', value: 'italic' }]);
    });

    it('adds italic shortcut', () => {
      const builder = Text('X').italic();
      expect(builder.modifiers).toEqual([{ type: 'fontStyle', value: 'italic' }]);
    });

    it('adds fontFamily modifier', () => {
      const builder = Text('X').fontFamily('Helvetica');
      expect(builder.modifiers).toEqual([{ type: 'fontFamily', value: 'Helvetica' }]);
    });
  });

  describe('additional text modifiers', () => {
    it('adds medium shortcut', () => {
      const builder = Text('X').medium();
      expect(builder.modifiers).toEqual([{ type: 'fontWeight', weight: 'medium' }]);
    });

    it('adds lineHeight modifier', () => {
      const builder = Text('X').lineHeight(24);
      expect(builder.modifiers).toEqual([{ type: 'lineHeight', value: 24 }]);
    });

    it('adds textAlign modifier', () => {
      const builder = Text('X').textAlign('center');
      expect(builder.modifiers).toEqual([{ type: 'textAlign', value: 'center' }]);
    });
  });

  describe('additional padding/margin modifiers', () => {
    it('adds paddingTop with value', () => {
      const builder = Text('X').paddingTop(10);
      expect(builder.modifiers).toEqual([{ type: 'padding', value: 10, edge: 'top' }]);
    });

    it('adds paddingTop with default', () => {
      const builder = Text('X').paddingTop();
      expect(builder.modifiers).toEqual([{ type: 'padding', value: DSLDefaults.spacing, edge: 'top' }]);
    });

    it('adds paddingBottom with value', () => {
      const builder = Text('X').paddingBottom(10);
      expect(builder.modifiers).toEqual([{ type: 'padding', value: 10, edge: 'bottom' }]);
    });

    it('adds paddingBottom with default', () => {
      const builder = Text('X').paddingBottom();
      expect(builder.modifiers).toEqual([{ type: 'padding', value: DSLDefaults.spacing, edge: 'bottom' }]);
    });

    it('adds marginHorizontal', () => {
      const builder = Text('X').marginHorizontal('sm');
      expect(builder.modifiers).toEqual([{ type: 'margin', value: 'sm', edge: 'horizontal' }]);
    });

    it('adds marginHorizontal with default', () => {
      const builder = Text('X').marginHorizontal();
      expect(builder.modifiers).toEqual([{ type: 'margin', value: DSLDefaults.spacing, edge: 'horizontal' }]);
    });

    it('adds marginVertical', () => {
      const builder = Text('X').marginVertical(12);
      expect(builder.modifiers).toEqual([{ type: 'margin', value: 12, edge: 'vertical' }]);
    });

    it('adds marginVertical with default', () => {
      const builder = Text('X').marginVertical();
      expect(builder.modifiers).toEqual([{ type: 'margin', value: DSLDefaults.spacing, edge: 'vertical' }]);
    });

    it('adds marginTop', () => {
      const builder = Text('X').marginTop(6);
      expect(builder.modifiers).toEqual([{ type: 'margin', value: 6, edge: 'top' }]);
    });

    it('adds marginTop with default', () => {
      const builder = Text('X').marginTop();
      expect(builder.modifiers).toEqual([{ type: 'margin', value: DSLDefaults.spacing, edge: 'top' }]);
    });
  });

  describe('additional scroll modifiers', () => {
    it('adds horizontal modifier', () => {
      const builder = ScrollStack(Text('X')).horizontal();
      expect(builder.modifiers).toEqual([{ type: 'scrollDirection', value: 'horizontal' }]);
    });

    it('adds keyboardAvoiding with value', () => {
      const builder = ScrollStack(Text('X')).keyboardAvoiding(80);
      expect(builder.modifiers).toEqual([{ type: 'keyboardAvoiding', offset: 80 }]);
    });

    it('adds keyboardAvoiding with default', () => {
      const builder = ScrollStack(Text('X')).keyboardAvoiding();
      expect(builder.modifiers).toEqual([{ type: 'keyboardAvoiding', offset: DSLDefaults.keyboardAvoidingOffset }]);
    });

    it('adds keyboardShouldPersistTaps with value', () => {
      const builder = ScrollStack(Text('X')).keyboardShouldPersistTaps('always');
      expect(builder.modifiers).toEqual([{ type: 'keyboardPersistTaps', value: 'always' }]);
    });

    it('adds keyboardShouldPersistTaps with default', () => {
      const builder = ScrollStack(Text('X')).keyboardShouldPersistTaps();
      expect(builder.modifiers).toEqual([{ type: 'keyboardPersistTaps', value: DSLDefaults.keyboardShouldPersistTaps }]);
    });

    it('adds bounces with value', () => {
      const builder = ScrollStack(Text('X')).bounces(false);
      expect(builder.modifiers).toEqual([{ type: 'bounces', value: false }]);
    });

    it('adds bounces with default', () => {
      const builder = ScrollStack(Text('X')).bounces();
      expect(builder.modifiers).toEqual([{ type: 'bounces', value: DSLDefaults.bounces }]);
    });
  });

  describe('additional textinput modifiers', () => {
    it('adds autoCapitalize modifier', () => {
      const builder = Text('X').autoCapitalize('none');
      expect(builder.modifiers).toEqual([{ type: 'autoCapitalize', value: 'none' }]);
    });

    it('adds returnKeyType modifier', () => {
      const builder = Text('X').returnKeyType('done');
      expect(builder.modifiers).toEqual([{ type: 'returnKeyType', value: 'done' }]);
    });

    it('adds inputHeight modifier', () => {
      const builder = Text('X').inputHeight(60);
      expect(builder.modifiers).toEqual([{ type: 'inputHeight', value: 60 }]);
    });
  });

  describe('screen navigation modifiers', () => {
    it('adds screenTitle modifier', () => {
      const builder = VStack(Text('X')).screenTitle('Home');
      expect(builder.modifiers).toEqual([{ type: 'screenTitle', value: 'Home' }]);
    });

    it('adds headerRight modifier', () => {
      const component = () => null as any;
      const builder = VStack(Text('X')).headerRight(component);
      expect(builder.modifiers).toEqual([{ type: 'headerRight', component }]);
    });

    it('adds headerLeft modifier', () => {
      const component = () => null as any;
      const builder = VStack(Text('X')).headerLeft(component);
      expect(builder.modifiers).toEqual([{ type: 'headerLeft', component }]);
    });
  });

  describe('borderStyle modifier', () => {
    it('adds borderStyle modifier', () => {
      const builder = Text('X').borderStyle('dashed');
      expect(builder.modifiers).toEqual([{ type: 'borderStyle', value: 'dashed' }]);
    });
  });

  describe('toElement with screen options', () => {
    it('wraps with ScreenConfigRenderer when screenTitle is set', () => {
      const builder = VStack(Text('Screen')).screenTitle('My Screen');
      const element = builder.toElement();
      expect(element).toBeTruthy();
    });

    it('wraps with ScreenConfigRenderer when headerRight is set', () => {
      const builder = VStack(Text('Screen')).headerRight(() => null as any);
      const element = builder.toElement();
      expect(element).toBeTruthy();
    });

    it('wraps with ScreenConfigRenderer when headerLeft is set', () => {
      const builder = VStack(Text('Screen')).headerLeft(() => null as any);
      const element = builder.toElement();
      expect(element).toBeTruthy();
    });

    it('wraps with ScreenConfigRenderer for combined screen modifiers', () => {
      const builder = VStack(Text('Screen'))
        .screenTitle('Title')
        .headerRight(() => null as any)
        .headerLeft(() => null as any);
      const element = builder.toElement();
      expect(element).toBeTruthy();
    });
  });

  describe('new interaction modifiers', () => {
    it('adds onLongPress modifier', () => {
      const handler = jest.fn();
      const builder = Text('X').onLongPress(handler);
      expect(builder.modifiers).toEqual([{ type: 'onLongPress', handler }]);
    });
  });

  describe('new accessibility modifiers', () => {
    it('adds accessibilityRole modifier', () => {
      const builder = Text('X').accessibilityRole('header');
      expect(builder.modifiers).toEqual([{ type: 'accessibilityRole', value: 'header' }]);
    });

    it('adds accessibilityHint modifier', () => {
      const builder = Text('X').accessibilityHint('Opens detail');
      expect(builder.modifiers).toEqual([{ type: 'accessibilityHint', value: 'Opens detail' }]);
    });
  });

  describe('new list modifiers', () => {
    it('adds refreshControl modifier', () => {
      const onRefresh = jest.fn();
      const builder = ScrollStack(Text('X')).refreshControl(onRefresh, false);
      expect(builder.modifiers).toContainEqual({
        type: 'refreshControl',
        onRefresh,
        refreshing: false,
      });
    });

    it('adds onEndReached modifier', () => {
      const handler = jest.fn();
      const builder = ScrollStack(Text('X')).onEndReached(handler, 0.5);
      expect(builder.modifiers).toContainEqual({
        type: 'onEndReached',
        handler,
        threshold: 0.5,
      });
    });

    it('adds separator modifier', () => {
      const separatorFn = jest.fn();
      const builder = ScrollStack(Text('X')).separator(separatorFn);
      expect(builder.modifiers).toContainEqual({
        type: 'separator',
        builder: separatorFn,
      });
    });

    it('adds numColumns modifier', () => {
      const builder = ScrollStack(Text('X')).numColumns(3);
      expect(builder.modifiers).toContainEqual({
        type: 'numColumns',
        value: 3,
      });
    });

    it('adds emptyComponent modifier', () => {
      const emptyFn = jest.fn();
      const builder = ScrollStack(Text('X')).emptyComponent(emptyFn);
      expect(builder.modifiers).toContainEqual({
        type: 'emptyComponent',
        builder: emptyFn,
      });
    });
  });

  describe('new element type construction', () => {
    it('creates an image element', () => {
      const { Image } = require('../../src/Primitives/Image');
      const builder = Image({ uri: 'https://example.com/img.png' });
      expect(builder.elementType).toBe('image');
      expect(builder.props.imageSource).toEqual({ uri: 'https://example.com/img.png' });
    });

    it('creates a toggle element', () => {
      const { Toggle } = require('../../src/Primitives/Toggle');
      const { createBinding } = require('../../src/Binding/Binding');
      const binding = createBinding(false, jest.fn());
      const builder = Toggle(binding);
      expect(builder.elementType).toBe('toggle');
      expect(builder.props.toggleBinding).toBe(binding);
    });

    it('creates a button element', () => {
      const { Button } = require('../../src/Primitives/Button');
      const action = jest.fn();
      const builder = Button('Click', action, { style: 'outlined', icon: 'star' });
      expect(builder.elementType).toBe('button');
      expect(builder.props.buttonTitle).toBe('Click');
      expect(builder.props.buttonAction).toBe(action);
      expect(builder.props.buttonStyle).toBe('outlined');
      expect(builder.props.buttonIcon).toBe('star');
    });

    it('creates a divider element', () => {
      const { Divider } = require('../../src/Primitives/Divider');
      const builder = Divider();
      expect(builder.elementType).toBe('divider');
    });

    it('creates a link element', () => {
      const { Link } = require('../../src/Primitives/Link');
      const builder = Link('Visit', 'https://example.com');
      expect(builder.elementType).toBe('link');
      expect(builder.props.text).toBe('Visit');
      expect(builder.props.linkURL).toBe('https://example.com');
    });

    it('creates a sectionlist element', () => {
      const { SectionedList } = require('../../src/Primitives/SectionedList');
      const sections = [{ title: 'A', data: ['1', '2'] }];
      const builder = SectionedList(sections, {
        keyExtractor: (item: string) => item,
        renderItem: (item: string) => Text(item),
      });
      expect(builder.elementType).toBe('sectionlist');
      expect(builder.props.sectionListData).toBe(sections);
    });

    it('creates a modal element', () => {
      const { Modal } = require('../../src/Primitives/Modal');
      const { createBinding } = require('../../src/Binding/Binding');
      const binding = createBinding(true, jest.fn());
      const builder = Modal(binding, { animationType: 'fade', transparent: true }, Text('Content'));
      expect(builder.elementType).toBe('modal');
      expect(builder.props.modalBinding).toBe(binding);
      expect(builder.props.modalAnimationType).toBe('fade');
      expect(builder.props.modalTransparent).toBe(true);
      expect(builder.children).toHaveLength(1);
    });

    it('creates a modal with defaults', () => {
      const { Modal } = require('../../src/Primitives/Modal');
      const { createBinding } = require('../../src/Binding/Binding');
      const binding = createBinding(false, jest.fn());
      const builder = Modal(binding);
      expect(builder.elementType).toBe('modal');
      expect(builder.props.modalAnimationType).toBe('slide');
      expect(builder.props.modalTransparent).toBe(false);
    });

    it('creates a progressbar element', () => {
      const { ProgressBar } = require('../../src/Primitives/ProgressBar');
      const builder = ProgressBar(0.75, { trackColor: '#E0E0E0', progressColor: 'tint' });
      expect(builder.elementType).toBe('progressbar');
      expect(builder.props.progressValue).toBe(0.75);
      expect(builder.props.progressTrackColor).toBe('#E0E0E0');
      expect(builder.props.progressColor).toBe('tint');
    });

    it('creates a progressbar with defaults', () => {
      const { ProgressBar } = require('../../src/Primitives/ProgressBar');
      const builder = ProgressBar(0.5);
      expect(builder.elementType).toBe('progressbar');
      expect(builder.props.progressValue).toBe(0.5);
      expect(builder.props.progressTrackColor).toBeUndefined();
      expect(builder.props.progressColor).toBeUndefined();
    });
  });

  describe('new font weight shortcuts', () => {
    it('adds light font weight modifier', () => {
      const builder = Text('Hello').light();
      expect(builder.modifiers).toContainEqual({ type: 'fontWeight', weight: 'light' });
    });

    it('adds thin font weight modifier', () => {
      const builder = Text('Hello').thin();
      expect(builder.modifiers).toContainEqual({ type: 'fontWeight', weight: 'thin' });
    });

    it('adds heavy font weight modifier', () => {
      const builder = Text('Hello').heavy();
      expect(builder.modifiers).toContainEqual({ type: 'fontWeight', weight: 'heavy' });
    });

    it('adds black font weight modifier', () => {
      const builder = Text('Hello').black();
      expect(builder.modifiers).toContainEqual({ type: 'fontWeight', weight: 'black' });
    });
  });

  describe('modal modifier', () => {
    it('adds onDismiss modifier', () => {
      const handler = jest.fn();
      const builder = VStack(Text('Hello')).onDismiss(handler);
      expect(builder.modifiers).toContainEqual({ type: 'onDismiss', handler });
    });
  });
});
