import { Text, Image } from '@primitives';
import { GestureType, ModifierType, SwipeDirection } from '@tokens';

describe('Gesture modifiers', () => {
  describe('.onSwipe()', () => {
    it('adds swipe modifier with direction and handler', () => {
      const handler = jest.fn();
      const builder = Text('Hello').onSwipe(SwipeDirection.left, handler);
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.onSwipe,
        direction: SwipeDirection.left,
        handler,
      });
    });

    it('accepts threshold options', () => {
      const handler = jest.fn();
      const builder = Text('Hello').onSwipe(SwipeDirection.right, handler, {
        threshold: 100,
        velocityThreshold: 500,
      });
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.onSwipe,
        threshold: 100,
        velocityThreshold: 500,
      });
    });

    it('supports all four directions', () => {
      const h = jest.fn();
      const builder = Text('Hello')
        .onSwipe(SwipeDirection.left, h)
        .onSwipe(SwipeDirection.right, h)
        .onSwipe(SwipeDirection.up, h)
        .onSwipe(SwipeDirection.down, h);
      expect(builder.modifiers.length).toBe(4);
    });
  });

  describe('.onPan()', () => {
    it('adds pan modifier with handlers', () => {
      const onChanged = jest.fn();
      const onEnded = jest.fn();
      const builder = Image({ uri: 'test' }).onPan({ onChanged, onEnded });
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.onPan,
        onChanged,
        onEnded,
      });
    });

    it('accepts optional onStart handler', () => {
      const onStart = jest.fn();
      const onChanged = jest.fn();
      const builder = Image({ uri: 'test' }).onPan({ onStart, onChanged });
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.onPan,
        onStart,
        onChanged,
      });
    });
  });

  describe('.onPinch()', () => {
    it('adds pinch modifier', () => {
      const onChanged = jest.fn();
      const builder = Image({ uri: 'test' }).onPinch({ onChanged });
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.onPinch,
        onChanged,
      });
    });
  });

  describe('.onRotate()', () => {
    it('adds rotation gesture modifier', () => {
      const onChanged = jest.fn();
      const builder = Image({ uri: 'test' }).onRotate({ onChanged });
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.onRotate,
        onChanged,
      });
    });
  });

  describe('.gesture()', () => {
    it('adds generic gesture config', () => {
      const handler = jest.fn();
      const builder = Text('Hello').gesture({
        type: GestureType.swipe,
        direction: SwipeDirection.left,
        handler,
      });
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.gesture,
        config: { type: GestureType.swipe, direction: SwipeDirection.left },
      });
    });
  });
});
