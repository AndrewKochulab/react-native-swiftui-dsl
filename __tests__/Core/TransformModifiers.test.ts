import { Text, VStack, Image } from '@primitives';
import { ModifierType } from '@tokens';

describe('Transform modifiers', () => {
  describe('.offset()', () => {
    it('adds offset modifier with x and y', () => {
      const builder = Text('Hello').offset(10, -5);
      expect(builder.modifiers).toContainEqual({ type: ModifierType.offset, x: 10, y: -5 });
    });

    it('defaults y to 0', () => {
      const builder = Text('Hello').offset(10);
      expect(builder.modifiers).toContainEqual({ type: ModifierType.offset, x: 10, y: 0 });
    });
  });

  describe('.rotation()', () => {
    it('adds rotation modifier with degrees', () => {
      const builder = Text('Hello').rotation(45);
      expect(builder.modifiers).toContainEqual({ type: ModifierType.rotation, degrees: 45 });
    });

    it('supports negative degrees', () => {
      const builder = Text('Hello').rotation(-90);
      expect(builder.modifiers).toContainEqual({ type: ModifierType.rotation, degrees: -90 });
    });
  });

  describe('.rotationEffect()', () => {
    it('is an alias for .rotation()', () => {
      const a = Text('A').rotation(45);
      const b = Text('B').rotationEffect(45);
      expect(a.modifiers).toEqual(b.modifiers);
    });
  });

  describe('.scale()', () => {
    it('scales uniformly when only x is provided', () => {
      const builder = Text('Hello').scale(1.5);
      expect(builder.modifiers).toContainEqual({ type: ModifierType.scale, x: 1.5, y: 1.5 });
    });

    it('scales non-uniformly when x and y provided', () => {
      const builder = Text('Hello').scale(0.8, 1.2);
      expect(builder.modifiers).toContainEqual({ type: ModifierType.scale, x: 0.8, y: 1.2 });
    });
  });

  describe('.scaleEffect()', () => {
    it('is an alias for .scale()', () => {
      const a = Text('A').scale(2);
      const b = Text('B').scaleEffect(2);
      expect(a.modifiers).toEqual(b.modifiers);
    });
  });

  describe('.blur()', () => {
    it('adds blur modifier', () => {
      const builder = Image({ uri: 'test' }).blur(10);
      expect(builder.modifiers).toContainEqual({ type: ModifierType.blur, radius: 10 });
    });
  });

  describe('.overlay()', () => {
    it('adds overlay modifier with builder function', () => {
      const builder = Image({ uri: 'test' }).overlay(() => Text('Badge'));
      const overlayMod = builder.modifiers.find(m => m.type === ModifierType.overlay);
      expect(overlayMod).toBeDefined();
      expect(typeof (overlayMod as { builder: () => unknown }).builder).toBe('function');
    });
  });

  describe('chaining transforms', () => {
    it('combines multiple transforms', () => {
      const builder = Text('Hello')
        .offset(10, 20)
        .rotation(45)
        .scale(1.5);
      expect(builder.modifiers.length).toBe(3);
    });
  });
});
