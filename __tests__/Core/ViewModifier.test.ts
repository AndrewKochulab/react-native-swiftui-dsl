import { ViewModifier, composeModifiers, ViewModifierFn } from '@/Core/ViewModifier';
import { createModifiers } from '@/Core/ModifierSheet';
import { Text } from '@/Primitives/Text';
import { VStack } from '@/Primitives/Containers';
import { ModifierType } from '@/Tokens/ElementType';
import { Color } from '@/Tokens/Color';
import { Font, Weight } from '@/Tokens/Font';
import { Spacing, Edge } from '@/Tokens/Layout';

class TestModifier extends ViewModifier {
  body(content: ReturnType<typeof Text>): ReturnType<typeof Text> {
    return content.padding(Spacing.lg).background(Color.card);
  }
}

class ParameterizedModifier extends ViewModifier {
  constructor(private size: 'sm' | 'md' | 'lg' = 'md') {
    super();
  }
  body(content: ReturnType<typeof Text>): ReturnType<typeof Text> {
    return content.padding(this.size);
  }
}

describe('ViewModifier', () => {
  describe('class-based modifier', () => {
    it('applies body modifiers to view', () => {
      const builder = Text('Hello').modifier(new TestModifier());
      expect(builder.modifiers.length).toBe(2);
      expect(builder.modifiers[0]).toEqual({ type: ModifierType.padding, value: Spacing.lg, edge: Edge.all });
      expect(builder.modifiers[1]).toMatchObject({ type: ModifierType.background, color: Color.card });
    });

    it('returns same instance for chaining', () => {
      const builder = Text('Hello');
      const result = builder.modifier(new TestModifier());
      expect(result).toBe(builder);
    });

    it('supports parameterized modifiers', () => {
      const builder = Text('Hello').modifier(new ParameterizedModifier(Spacing.lg));
      expect(builder.modifiers[0]).toEqual({ type: ModifierType.padding, value: Spacing.lg, edge: Edge.all });

      const builder2 = Text('World').modifier(new ParameterizedModifier(Spacing.sm));
      expect(builder2.modifiers[0]).toEqual({ type: ModifierType.padding, value: Spacing.sm, edge: Edge.all });
    });
  });

  describe('function-based modifier', () => {
    it('applies function modifiers to view', () => {
      const boldTitle: ViewModifierFn = v => v.font(Font.title).bold();
      const builder = Text('Hello').modifier(boldTitle);
      expect(builder.modifiers.length).toBe(2);
      expect(builder.modifiers[0]).toEqual({ type: ModifierType.font, size: Font.title });
      expect(builder.modifiers[1]).toEqual({ type: ModifierType.fontWeight, weight: Weight.bold });
    });

    it('returns same instance for chaining', () => {
      const fn: ViewModifierFn = v => v.padding(Spacing.sm);
      const builder = Text('Hello');
      const result = builder.modifier(fn);
      expect(result).toBe(builder);
    });
  });

  describe('.apply() alias', () => {
    it('works identically to .modifier()', () => {
      const mod = new TestModifier();
      const a = Text('A').modifier(mod);
      const b = Text('B').apply(mod);
      expect(a.modifiers).toEqual(b.modifiers);
    });
  });

  describe('.if() conditional', () => {
    it('applies modifier when condition is true', () => {
      const builder = Text('Price').if(true, v => v.foregroundColor(Color.error));
      expect(builder.modifiers.length).toBe(1);
      expect(builder.modifiers[0]).toMatchObject({ type: ModifierType.foregroundColor, color: Color.error });
    });

    it('skips modifier when condition is false', () => {
      const builder = Text('Price').if(false, v => v.foregroundColor(Color.error));
      expect(builder.modifiers.length).toBe(0);
    });

    it('chains multiple conditional modifiers', () => {
      const builder = Text('Price')
        .if(true, v => v.bold())
        .if(false, v => v.italic())
        .if(true, v => v.underline());
      expect(builder.modifiers.length).toBe(2);
    });
  });

  describe('.clone()', () => {
    it('creates an independent copy', () => {
      const base = VStack(Text('Hello')).padding(Spacing.lg);
      const clone = base.clone();

      expect(clone.modifiers).toEqual(base.modifiers);
      expect(clone.modifiers).not.toBe(base.modifiers);

      clone.background(Color.card);
      expect(clone.modifiers.length).toBe(2);
      expect(base.modifiers.length).toBe(1);
    });

    it('preserves element type and props', () => {
      const base = Text('Hello').font(Font.title);
      const clone = base.clone();
      expect(clone.elementType).toBe('text');
      expect(clone.props.text).toBe('Hello');
    });
  });

  describe('composeModifiers', () => {
    it('composes class and function modifiers', () => {
      const composed = composeModifiers(
        new ParameterizedModifier(Spacing.sm),
        v => v.background(Color.card),
      );
      const builder = Text('Hello').modifier(composed);
      expect(builder.modifiers.length).toBe(2);
    });

    it('applies left-to-right', () => {
      const composed = composeModifiers(
        v => v.padding(Spacing.sm),
        v => v.padding(Spacing.lg),
      );
      const builder = Text('Hello').modifier(composed);
      expect(builder.modifiers[0]).toEqual({ type: ModifierType.padding, value: Spacing.sm, edge: Edge.all });
      expect(builder.modifiers[1]).toEqual({ type: ModifierType.padding, value: Spacing.lg, edge: Edge.all });
    });

    it('handles empty composition', () => {
      const composed = composeModifiers();
      const builder = Text('Hello').modifier(composed);
      expect(builder.modifiers.length).toBe(0);
    });
  });

  describe('createModifiers', () => {
    it('creates a frozen record of modifier functions', () => {
      const modifiers = createModifiers({
        title: v => v.font(Font.title).bold(),
        caption: v => v.font(Font.caption).secondary(),
      });

      expect(Object.isFrozen(modifiers)).toBe(true);
      expect(typeof modifiers.title).toBe('function');
      expect(typeof modifiers.caption).toBe('function');
    });

    it('applies modifiers correctly', () => {
      const modifiers = createModifiers({
        card: v => v.padding(Spacing.lg).background(Color.card),
      });

      const builder = Text('Hello').apply(modifiers.card);
      expect(builder.modifiers.length).toBe(2);
    });
  });
});
