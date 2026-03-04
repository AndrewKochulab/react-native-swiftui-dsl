import React from 'react';
import { Text } from '../../src/Primitives/Text';
import { VStack, HStack } from '../../src/Primitives/Containers';
import { Icon } from '../../src/Primitives/Icon';
import { Spacer } from '../../src/Primitives/Spacer';
import { SafeArea } from '../../src/Primitives/SafeArea';
import { Group } from '../../src/Conditionals/Group';
import { DSLDefaults } from '../../src/Config/Defaults';
import { renderWithDSLTheme, testThemeConfig } from '../Helpers/renderWithDSLTheme';

jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ options }: { options: Record<string, unknown> }) => null,
  },
}));

const Colors = testThemeConfig.colors;
const Fonts = testThemeConfig.fonts;
const Layout = testThemeConfig.layout;

describe('DSLRenderer', () => {
  describe('Text rendering', () => {
    it('renders text content', () => {
      const { getByText } = renderWithDSLTheme(Text('Hello World').toElement());
      expect(getByText('Hello World')).toBeTruthy();
    });

    it('applies font size modifier', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Styled').font('title').toElement()
      );
      const element = getByText('Styled');
      expect(element.props.style).toMatchObject({
        fontSize: Fonts.size.title,
      });
    });

    it('applies fontWeight modifier', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Bold').bold().toElement()
      );
      const element = getByText('Bold');
      expect(element.props.style).toMatchObject({
        fontWeight: Fonts.weight.bold,
      });
    });

    it('applies foregroundColor with theme token', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Colored').foregroundColor('tint').toElement()
      );
      const element = getByText('Colored');
      expect(element.props.style).toMatchObject({
        color: Colors.light.tint,
      });
    });

    it('applies default text color from theme', () => {
      const { getByText } = renderWithDSLTheme(Text('Default').toElement());
      const element = getByText('Default');
      expect(element.props.style).toMatchObject({
        color: Colors.light.text,
      });
    });

    it('applies textTransform modifier', () => {
      const { getByText } = renderWithDSLTheme(
        Text('upper').textTransform('uppercase').toElement()
      );
      const element = getByText('upper');
      expect(element.props.style).toMatchObject({
        textTransform: 'uppercase',
      });
    });

    it('applies letterSpacing modifier', () => {
      const letterSpacingValue = 0.5;
      const { getByText } = renderWithDSLTheme(
        Text('spaced').letterSpacing(letterSpacingValue).toElement()
      );
      const element = getByText('spaced');
      expect(element.props.style).toMatchObject({
        letterSpacing: letterSpacingValue,
      });
    });

    it('applies lineLimit as numberOfLines', () => {
      const lineLimitValue = 1;
      const { getByText } = renderWithDSLTheme(
        Text('Truncated text').lineLimit(lineLimitValue).toElement()
      );
      const element = getByText('Truncated text');
      expect(element.props.numberOfLines).toBe(lineLimitValue);
    });

    it('applies testID', () => {
      const { getByTestId } = renderWithDSLTheme(
        Text('Test').testID('my-text').toElement()
      );
      expect(getByTestId('my-text')).toBeTruthy();
    });

    it('chains multiple text modifiers', () => {
      const letterSpacingValue = 0.5;
      const { getByText } = renderWithDSLTheme(
        Text('Multi')
          .font('caption')
          .semibold()
          .foregroundColor('secondaryText')
          .textTransform('uppercase')
          .letterSpacing(letterSpacingValue)
          .toElement()
      );
      const element = getByText('Multi');
      expect(element.props.style).toMatchObject({
        fontSize: Fonts.size.caption,
        fontWeight: Fonts.weight.semibold,
        color: Colors.light.secondaryText,
        textTransform: 'uppercase',
        letterSpacing: letterSpacingValue,
      });
    });
  });

  describe('Container rendering', () => {
    it('renders VStack with children', () => {
      const { getByText } = renderWithDSLTheme(
        VStack(Text('Child 1'), Text('Child 2')).toElement()
      );
      expect(getByText('Child 1')).toBeTruthy();
      expect(getByText('Child 2')).toBeTruthy();
    });

    it('renders HStack with children', () => {
      const { getByText } = renderWithDSLTheme(
        HStack(Text('Left'), Text('Right')).toElement()
      );
      expect(getByText('Left')).toBeTruthy();
      expect(getByText('Right')).toBeTruthy();
    });

    it('renders nested containers', () => {
      const { getByText } = renderWithDSLTheme(
        VStack(
          HStack(Text('Nested')),
          Text('Outer'),
        ).toElement()
      );
      expect(getByText('Nested')).toBeTruthy();
      expect(getByText('Outer')).toBeTruthy();
    });

    it('filters null children', () => {
      const { getByText } = renderWithDSLTheme(
        VStack(Text('Visible'), null, Text('Also Visible')).toElement()
      );
      expect(getByText('Visible')).toBeTruthy();
      expect(getByText('Also Visible')).toBeTruthy();
    });

    it('filters boolean children', () => {
      const { getByText } = renderWithDSLTheme(
        VStack(Text('Show'), false, true).toElement()
      );
      expect(getByText('Show')).toBeTruthy();
    });
  });

  describe('Style modifiers on containers', () => {
    it('applies padding', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).padding('md').testID('padded').toElement()
      );
      const container = getByTestId('padded');
      expect(container.props.style).toMatchObject({
        padding: Layout.spacing.md,
      });
    });

    it('applies background with theme token', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).background('card').testID('bg').toElement()
      );
      const container = getByTestId('bg');
      expect(container.props.style).toMatchObject({
        backgroundColor: Colors.light.card,
      });
    });

    it('applies backgroundAlpha', () => {
      const alphaValue = 0.08;
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).backgroundAlpha('tint', alphaValue).testID('bga').toElement()
      );
      const container = getByTestId('bga');
      const bgColor = container.props.style.backgroundColor;
      expect(bgColor).toMatch(new RegExp(`^${Colors.light.tint.replace('#', '#')}[0-9a-f]{2}$`, 'i'));
    });

    it('applies cornerRadius with token', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).cornerRadius('md').testID('cr').toElement()
      );
      const container = getByTestId('cr');
      expect(container.props.style).toMatchObject({
        borderRadius: Layout.borderRadius.md,
      });
    });

    it('applies border', () => {
      const borderWidth = 1;
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).border(borderWidth, 'cardBorder').testID('border').toElement()
      );
      const container = getByTestId('border');
      expect(container.props.style).toMatchObject({
        borderWidth,
        borderColor: Colors.light.cardBorder,
      });
    });

    it('applies shadow', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).shadow().testID('shadow').toElement()
      );
      const container = getByTestId('shadow');
      expect(container.props.style).toMatchObject({
        shadowColor: Colors.light.cardShadow,
        shadowOffset: DSLDefaults.shadow.offset,
        shadowOpacity: DSLDefaults.shadow.opacity,
        shadowRadius: DSLDefaults.shadow.radius,
        elevation: DSLDefaults.shadow.elevation,
      });
    });

    it('applies flex', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).flex(DSLDefaults.flex).testID('flex').toElement()
      );
      const container = getByTestId('flex');
      expect(container.props.style).toMatchObject({ flex: DSLDefaults.flex });
    });

    it('applies alignment', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).alignment('center').testID('align').toElement()
      );
      const container = getByTestId('align');
      expect(container.props.style).toMatchObject({ alignItems: 'center' });
    });
  });

  describe('Interaction modifiers', () => {
    it('wraps with Pressable when onTap is set', () => {
      const handler = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Text('Tappable').onTap(handler).toElement()
      );
      const element = getByText('Tappable');
      expect(element).toBeTruthy();
    });
  });

  describe('Group rendering', () => {
    it('renders Group children without wrapper', () => {
      const { getByText } = renderWithDSLTheme(
        VStack(
          Group(Text('A'), Text('B')),
          Text('C'),
        ).toElement()
      );
      expect(getByText('A')).toBeTruthy();
      expect(getByText('B')).toBeTruthy();
      expect(getByText('C')).toBeTruthy();
    });
  });

  describe('Additional text modifiers rendering', () => {
    it('applies lineHeight', () => {
      const { getByText } = renderWithDSLTheme(
        Text('LH').lineHeight(28).toElement()
      );
      const el = getByText('LH');
      expect(el.props.style).toMatchObject({ lineHeight: 28 });
    });

    it('applies textAlign', () => {
      const { getByText } = renderWithDSLTheme(
        Text('TA').textAlign('right').toElement()
      );
      const el = getByText('TA');
      expect(el.props.style).toMatchObject({ textAlign: 'right' });
    });

    it('applies accessibilityLabel on text', () => {
      const { getByText } = renderWithDSLTheme(
        Text('AL').accessibilityLabel('Accessible text').toElement()
      );
      const el = getByText('AL');
      expect(el.props.accessibilityLabel).toBe('Accessible text');
    });

    it('applies disabled on text via Pressable', () => {
      const handler = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Text('Disabled').onTap(handler).disabled().toElement()
      );
      expect(getByText('Disabled')).toBeTruthy();
    });
  });

  describe('Additional style modifiers rendering', () => {
    it('applies borderStyle', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).borderStyle('dashed').testID('bs').toElement()
      );
      const el = getByTestId('bs');
      expect(el.props.style).toMatchObject({ borderStyle: 'dashed' });
    });

    it('applies flexWrap', () => {
      const { getByTestId } = renderWithDSLTheme(
        HStack(Text('X')).flexWrap().testID('fw').toElement()
      );
      const el = getByTestId('fw');
      expect(el.props.style).toMatchObject({ flexWrap: 'wrap' });
    });

    it('applies opacity', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).opacity(0.5).testID('op').toElement()
      );
      const el = getByTestId('op');
      expect(el.props.style).toMatchObject({ opacity: 0.5 });
    });

    it('applies frame with leading alignment', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).frame({ width: 100, alignment: 'leading' }).testID('fl').toElement()
      );
      const el = getByTestId('fl');
      expect(el.props.style).toMatchObject({ width: 100, alignItems: 'flex-start' });
    });

    it('applies frame with trailing alignment', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).frame({ width: 100, alignment: 'trailing' }).testID('ft').toElement()
      );
      const el = getByTestId('ft');
      expect(el.props.style).toMatchObject({ width: 100, alignItems: 'flex-end' });
    });

    it('applies frame with minWidth/maxWidth/minHeight/maxHeight', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).frame({ minWidth: 50, maxWidth: 200, minHeight: 30, maxHeight: 100 }).testID('fmm').toElement()
      );
      const el = getByTestId('fmm');
      expect(el.props.style).toMatchObject({
        minWidth: 50,
        maxWidth: 200,
        minHeight: 30,
        maxHeight: 100,
      });
    });

    it('applies cornerRadius with numeric value', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).cornerRadius(16).testID('crn').toElement()
      );
      const el = getByTestId('crn');
      expect(el.props.style).toMatchObject({ borderRadius: 16 });
    });

    it('applies font with numeric value', () => {
      const { getByText } = renderWithDSLTheme(
        Text('Num').font(20).toElement()
      );
      const el = getByText('Num');
      expect(el.props.style).toMatchObject({ fontSize: 20 });
    });
  });

  describe('Edge-specific padding/margin rendering', () => {
    it('applies padding vertical', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).paddingVertical(8).testID('pv').toElement()
      );
      const el = getByTestId('pv');
      expect(el.props.style).toMatchObject({ paddingVertical: 8 });
    });

    it('applies padding top', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).paddingTop(12).testID('pt').toElement()
      );
      const el = getByTestId('pt');
      expect(el.props.style).toMatchObject({ paddingTop: 12 });
    });

    it('applies padding left', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).paddingLeft(6).testID('pl').toElement()
      );
      const el = getByTestId('pl');
      expect(el.props.style).toMatchObject({ paddingLeft: 6 });
    });

    it('applies padding right', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).paddingRight(6).testID('pr').toElement()
      );
      const el = getByTestId('pr');
      expect(el.props.style).toMatchObject({ paddingRight: 6 });
    });

    it('applies padding bottom', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).paddingBottom(16).testID('pb').toElement()
      );
      const el = getByTestId('pb');
      expect(el.props.style).toMatchObject({ paddingBottom: 16 });
    });

    it('applies margin vertical', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).marginVertical(8).testID('mv').toElement()
      );
      const el = getByTestId('mv');
      expect(el.props.style).toMatchObject({ marginVertical: 8 });
    });

    it('applies margin top', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).marginTop(6).testID('mt').toElement()
      );
      const el = getByTestId('mt');
      expect(el.props.style).toMatchObject({ marginTop: 6 });
    });

    it('applies margin left', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).marginLeft(4).testID('ml').toElement()
      );
      const el = getByTestId('ml');
      expect(el.props.style).toMatchObject({ marginLeft: 4 });
    });

    it('applies margin right', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).marginRight(4).testID('mr').toElement()
      );
      const el = getByTestId('mr');
      expect(el.props.style).toMatchObject({ marginRight: 4 });
    });

    it('applies padding horizontal', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).paddingHorizontal('lg').testID('ph').toElement()
      );
      const el = getByTestId('ph');
      expect(el.props.style).toMatchObject({ paddingHorizontal: Layout.spacing.lg });
    });

    it('applies margin horizontal', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).marginHorizontal('sm').testID('mh').toElement()
      );
      const el = getByTestId('mh');
      expect(el.props.style).toMatchObject({ marginHorizontal: Layout.spacing.sm });
    });

    it('applies margin bottom', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).marginBottom(10).testID('mb').toElement()
      );
      const el = getByTestId('mb');
      expect(el.props.style).toMatchObject({ marginBottom: 10 });
    });
  });

  describe('Spacer rendering', () => {
    it('renders Spacer as flex:1 view', () => {
      const { toJSON } = renderWithDSLTheme(
        HStack(Text('Left'), Spacer(), Text('Right')).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Container gap/spacing rendering', () => {
    it('applies spacing as gap on container', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('A'), Text('B')).spacing(12).testID('gap-c').toElement()
      );
      const el = getByTestId('gap-c');
      expect(el.props.style).toMatchObject({ gap: 12 });
    });

    it('applies gap modifier on container', () => {
      const { getByTestId } = renderWithDSLTheme(
        HStack(Text('A'), Text('B')).gap(8).testID('gap-h').toElement()
      );
      const el = getByTestId('gap-h');
      expect(el.props.style).toMatchObject({ gap: 8 });
    });

    it('applies justifyContent on container', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('A')).justifyContent('spaceBetween').testID('jc').toElement()
      );
      const el = getByTestId('jc');
      expect(el.props.style).toMatchObject({ justifyContent: 'space-between' });
    });

    it('applies alignItems on container', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('A')).alignItems('center').testID('ai').toElement()
      );
      const el = getByTestId('ai');
      expect(el.props.style).toMatchObject({ alignItems: 'center' });
    });
  });

  describe('SafeArea rendering', () => {
    it('renders SafeArea with edges', () => {
      const { toJSON } = renderWithDSLTheme(
        SafeArea(Text('Safe')).edges(['top', 'bottom']).testID('sa-edges').toElement()
      );
      const tree = toJSON();
      expect(tree).toBeTruthy();
      // SafeAreaView transforms edges array into an object
      expect(tree.props.edges).toBeDefined();
    });

    it('renders SafeArea with testID', () => {
      const { toJSON } = renderWithDSLTheme(
        SafeArea(Text('Safe')).testID('sa-tid').toElement()
      );
      const tree = toJSON();
      expect(tree.props.testID).toBe('sa-tid');
    });
  });

  describe('Frame alignment center rendering', () => {
    it('applies frame with center alignment', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).frame({ width: 100, height: 100, alignment: 'center' }).testID('fc').toElement()
      );
      const el = getByTestId('fc');
      expect(el.props.style).toMatchObject({
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
      });
    });
  });

  describe('Interaction with flex', () => {
    it('passes flex to Pressable wrapper when onTap and flex are both set', () => {
      const handler = jest.fn();
      const { getByText } = renderWithDSLTheme(
        Text('Flex+Tap').flex(1).onTap(handler).toElement()
      );
      expect(getByText('Flex+Tap')).toBeTruthy();
    });
  });

  describe('Children types', () => {
    it('renders string children', () => {
      const { toJSON } = renderWithDSLTheme(
        VStack('hello' as any, Text('World')).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders number children', () => {
      const { toJSON } = renderWithDSLTheme(
        VStack(42 as any, Text('Answer')).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renders React element children directly', () => {
      const rawEl = React.createElement('View', { key: 'raw' });
      const { toJSON } = renderWithDSLTheme(
        VStack(rawEl as any, Text('Mixed')).toElement()
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Screen navigation modifiers in computeStyles', () => {
    it('screen modifiers are no-ops in computeStyles', () => {
      const { getByTestId } = renderWithDSLTheme(
        VStack(Text('X')).screenTitle('Title').testID('sn').toElement()
      );
      // screenTitle doesn't affect viewStyle
      const el = getByTestId('sn');
      expect(el).toBeTruthy();
    });
  });
});
