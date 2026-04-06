import React from 'react';
import { Text } from '@/Primitives/Text';
import { VStack, HStack } from '@/Primitives/Containers';
import { Spacer } from '@/Primitives/Spacer';
import { Button } from '@/Primitives/Button';
import { Image } from '@/Primitives/Image';
import { Divider } from '@/Primitives/Divider';
import { ViewModifier } from '@/Core/ViewModifier';
import { ViewBuilder } from '@/Core/ViewBuilder';
import { DSLView } from '@/Core/DSLView';
import { createModifiers } from '@/Core/ModifierSheet';
import { renderWithDSLTheme, testColors } from '@tests/Helpers/renderWithDSLTheme';
import { ModifierType } from '@/Tokens/ElementType';
import { Color } from '@/Tokens/Color';
import { Font } from '@/Tokens/Font';
import { Spacing, Radius } from '@/Tokens/Layout';
import { ButtonVariant } from '@/Tokens/Component';

describe('Integration rendering', () => {
  describe('ViewModifier in rendered tree', () => {
    class CardModifier extends ViewModifier {
      body(content: ViewBuilder): ViewBuilder {
        return content.padding(Spacing.lg).background(Color.card).cornerRadius(Radius.md);
      }
    }

    it('renders element with class-based modifier', () => {
      const element = Text('Card Text')
        .modifier(new CardModifier())
        .testID('card')
        .toElement();
      const { getByText, getByTestId } = renderWithDSLTheme(element);
      expect(getByText('Card Text')).toBeTruthy();
    });

    it('renders element with function-based modifier', () => {
      const element = Text('Styled')
        .apply(v => v.font(Font.title).bold())
        .toElement();
      const { getByText } = renderWithDSLTheme(element);
      const textEl = getByText('Styled');
      expect(textEl.props.style).toMatchObject({
        fontSize: expect.any(Number),
        fontWeight: expect.any(String),
      });
    });
  });

  describe('DSLView rendering', () => {
    class ProfileCard extends DSLView<{ name: string; bio: string }> {
      body(): ViewBuilder {
        return VStack(
          Text(this.props.name).font(Font.title).bold(),
          Text(this.props.bio).font(Font.footnote).secondary(),
        ).padding(Spacing.lg);
      }
    }

    it('renders DSLView correctly', () => {
      const element = ProfileCard.build({ name: 'John', bio: 'Developer' }).toElement();
      const { getByText } = renderWithDSLTheme(element);
      expect(getByText('John')).toBeTruthy();
      expect(getByText('Developer')).toBeTruthy();
    });

    it('DSLView result is chainable', () => {
      const element = ProfileCard.build({ name: 'Jane', bio: 'Designer' })
        .background(Color.card)
        .cornerRadius(Radius.md)
        .testID('profile')
        .toElement();
      const { getByTestId } = renderWithDSLTheme(element);
      expect(getByTestId('profile')).toBeTruthy();
    });
  });

  describe('createModifiers rendering', () => {
    const styles = createModifiers({
      card: v => v.padding(Spacing.lg).background(Color.card).cornerRadius(Radius.md),
      title: v => v.font(Font.title).bold(),
    });

    it('renders with applied modifier sheet styles', () => {
      const element = VStack(
        Text('Title').apply(styles.title),
        Text('Body content'),
      )
        .apply(styles.card)
        .testID('styled-card')
        .toElement();

      const { getByText, getByTestId } = renderWithDSLTheme(element);
      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Body content')).toBeTruthy();
      expect(getByTestId('styled-card')).toBeTruthy();
    });
  });

  describe('.if() conditional rendering', () => {
    it('applies modifiers when condition is true', () => {
      const element = Text('Important')
        .if(true, v => v.foregroundColor(Color.error))
        .toElement();
      const { getByText } = renderWithDSLTheme(element);
      const el = getByText('Important');
      expect(el.props.style).toMatchObject({
        color: testColors.light.error,
      });
    });

    it('does not apply when condition is false', () => {
      const element = Text('Normal')
        .if(false, v => v.foregroundColor(Color.error))
        .toElement();
      const { getByText } = renderWithDSLTheme(element);
      const el = getByText('Normal');
      // Color should be default text, not error
      expect((el.props.style as Record<string, unknown>).color).toBe(testColors.light.text);
    });
  });

  describe('Transform rendering', () => {
    it('renders with offset modifier', () => {
      const element = Text('Offset').offset(10, 20).testID('offset-text').toElement();
      const { getByTestId } = renderWithDSLTheme(element);
      expect(getByTestId('offset-text')).toBeTruthy();
    });

    it('renders with rotation modifier', () => {
      const element = Text('Rotated').rotation(45).testID('rotated-text').toElement();
      const { getByTestId } = renderWithDSLTheme(element);
      expect(getByTestId('rotated-text')).toBeTruthy();
    });

    it('renders with scale modifier', () => {
      const element = Text('Scaled').scale(1.5).testID('scaled-text').toElement();
      const { getByTestId } = renderWithDSLTheme(element);
      expect(getByTestId('scaled-text')).toBeTruthy();
    });
  });

  describe('Complex nested rendering', () => {
    it('renders a complete screen-like layout', () => {
      const element = VStack(
        HStack(
          Text('Title').font(Font.title).bold(),
          Spacer(),
          Button('Action', jest.fn(), { style: ButtonVariant.filled }),
        ),
        Divider(),
        VStack(
          Text('Content line 1').font(Font.body),
          Text('Content line 2').font(Font.body).secondary(),
        ).padding(Spacing.md),
        Image({ uri: 'https://example.com/img.jpg' })
          .frame({ width: 100, height: 100 })
          .cornerRadius(Radius.lg),
      )
        .padding(Spacing.lg)
        .background(Color.background)
        .testID('main-layout')
        .toElement();

      const { getByText, getByTestId } = renderWithDSLTheme(element);
      expect(getByTestId('main-layout')).toBeTruthy();
      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Content line 1')).toBeTruthy();
      expect(getByText('Content line 2')).toBeTruthy();
    });
  });

  describe('Clone + render independence', () => {
    it('renders cloned builders independently', () => {
      const base = Text('Base').font(Font.body);
      const variant1 = base.clone().foregroundColor(Color.tint).testID('v1');
      const variant2 = base.clone().foregroundColor(Color.error).testID('v2');

      const el1 = variant1.toElement();
      const el2 = variant2.toElement();

      const { getByTestId: get1 } = renderWithDSLTheme(el1);
      expect(get1('v1')).toBeTruthy();

      const { getByTestId: get2 } = renderWithDSLTheme(el2);
      expect(get2('v2')).toBeTruthy();
    });
  });
});
