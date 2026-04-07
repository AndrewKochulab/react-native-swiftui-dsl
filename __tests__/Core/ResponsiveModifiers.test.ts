import { Text, VStack } from '@primitives';
import { ViewBuilder } from '@core';
import { resolveResponsiveModifiers, type ResponsiveContext } from '@responsive';
import { ModifierType, Color, Font, Spacing, Edge } from '@tokens';

const compactCtx: ResponsiveContext = {
  sizeClass: 'compact',
  orientation: 'portrait',
  width: 375,
  height: 812,
  scale: 3,
};

const regularCtx: ResponsiveContext = {
  sizeClass: 'regular',
  orientation: 'landscape',
  width: 768,
  height: 1024,
  scale: 2,
};

const largeCtx: ResponsiveContext = {
  sizeClass: 'large',
  orientation: 'landscape',
  width: 1366,
  height: 1024,
  scale: 2,
};

describe('Responsive modifiers', () => {
  describe('.responsive()', () => {
    it('adds responsive modifier', () => {
      const builder = Text('Hello').responsive({
        compact: v => v.font(Font.body),
        large: v => v.font(Font.header),
      });
      expect(builder.modifiers.length).toBe(1);
      expect(builder.modifiers[0].type).toBe(ModifierType.responsive);
    });
  });

  describe('.onCompact()', () => {
    it('adds onCompact modifier', () => {
      const builder = Text('Hello').onCompact(v => v.font(Font.body));
      expect(builder.modifiers[0].type).toBe(ModifierType.onCompact);
    });
  });

  describe('.onRegular()', () => {
    it('adds onRegular modifier', () => {
      const builder = Text('Hello').onRegular(v => v.font(Font.title));
      expect(builder.modifiers[0].type).toBe(ModifierType.onRegular);
    });
  });

  describe('.onLarge()', () => {
    it('adds onLarge modifier', () => {
      const builder = Text('Hello').onLarge(v => v.font(Font.header));
      expect(builder.modifiers[0].type).toBe(ModifierType.onLarge);
    });
  });

  describe('resolveResponsiveModifiers', () => {
    it('expands compact modifiers on compact screen', () => {
      const builder = Text('Hello')
        .onCompact(v => v.font(Font.body).padding(Spacing.sm));
      const resolved = resolveResponsiveModifiers(builder.modifiers, compactCtx);
      expect(resolved.length).toBe(2);
      expect(resolved[0]).toEqual({ type: ModifierType.font, size: Font.body });
      expect(resolved[1]).toEqual({ type: ModifierType.padding, value: Spacing.sm, edge: Edge.all });
    });

    it('skips compact modifiers on large screen', () => {
      const builder = Text('Hello')
        .onCompact(v => v.font(Font.body));
      const resolved = resolveResponsiveModifiers(builder.modifiers, largeCtx);
      expect(resolved.length).toBe(0);
    });

    it('expands large modifiers on large screen', () => {
      const builder = Text('Hello')
        .onLarge(v => v.font(Font.header));
      const resolved = resolveResponsiveModifiers(builder.modifiers, largeCtx);
      expect(resolved.length).toBe(1);
      expect(resolved[0]).toEqual({ type: ModifierType.font, size: Font.header });
    });

    it('expands responsive config matching size class', () => {
      const builder = Text('Hello').responsive({
        compact: v => v.font(Font.body),
        regular: v => v.font(Font.title),
        large: v => v.font(Font.header),
      });
      const resolved = resolveResponsiveModifiers(builder.modifiers, regularCtx);
      expect(resolved.length).toBe(1);
      expect(resolved[0]).toEqual({ type: ModifierType.font, size: Font.title });
    });

    it('preserves non-responsive modifiers', () => {
      const builder = Text('Hello')
        .padding(Spacing.lg)
        .onCompact(v => v.font(Font.body))
        .background(Color.card);
      const resolved = resolveResponsiveModifiers(builder.modifiers, compactCtx);
      expect(resolved.length).toBe(3);
      expect(resolved[0].type).toBe(ModifierType.padding);
      expect(resolved[1].type).toBe(ModifierType.font);
      expect(resolved[2].type).toBe(ModifierType.background);
    });

    it('handles empty responsive config gracefully', () => {
      const builder = Text('Hello').responsive({});
      const resolved = resolveResponsiveModifiers(builder.modifiers, compactCtx);
      expect(resolved.length).toBe(0);
    });
  });
});
