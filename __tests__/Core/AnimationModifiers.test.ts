import { Text } from '@primitives';
import { Animation, withAnimation, getActiveAnimation } from '@animation';
import { ModifierType, Transition, TransitionEdge, AnimationType } from '@tokens';

describe('Animation modifiers', () => {
  describe('.animation()', () => {
    it('adds animation modifier with config and tracked value', () => {
      const config = Animation.easeInOut(300);
      const builder = Text('Hello').animation(config, true);
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.animation,
        config: { type: AnimationType.timing, easing: 'easeInOut', duration: 300 },
        value: true,
      });
    });

    it('supports spring animation', () => {
      const config = Animation.spring({ damping: 15 });
      const builder = Text('Hello').animation(config, 'value');
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.animation,
        config: { type: AnimationType.spring, damping: 15 },
      });
    });
  });

  describe('.transition()', () => {
    it('adds transition modifier with enter config', () => {
      const builder = Text('Hello').transition({ effect: Transition.opacity });
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.transition,
        enter: { effect: Transition.opacity },
        exit: { effect: Transition.opacity },
      });
    });

    it('adds separate enter and exit transitions', () => {
      const builder = Text('Hello').transition(
        { effect: Transition.slide, edge: TransitionEdge.bottom },
        { effect: Transition.opacity },
      );
      expect(builder.modifiers[0]).toMatchObject({
        type: ModifierType.transition,
        enter: { effect: Transition.slide, edge: TransitionEdge.bottom },
        exit: { effect: Transition.opacity },
      });
    });
  });

  describe('withAnimation()', () => {
    it('sets active animation config during callback', () => {
      expect(getActiveAnimation()).toBeNull();

      let captured: unknown = null;
      withAnimation(Animation.spring(), () => {
        captured = getActiveAnimation();
      });

      expect(captured).toMatchObject({ type: AnimationType.spring });
    });

    it('uses default config when undefined', () => {
      let captured: unknown = null;
      withAnimation(undefined, () => {
        captured = getActiveAnimation();
      });
      expect(captured).toMatchObject({ type: AnimationType.timing, easing: 'easeInOut' });
    });
  });
});
