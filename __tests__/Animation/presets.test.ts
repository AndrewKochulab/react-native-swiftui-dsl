import { Animation, createAnimationPresets } from '@/Animation/presets';
import { AnimationType, Easing } from '@/Tokens/Animation';

describe('Animation presets', () => {
  it('creates easeIn timing config', () => {
    const config = Animation.easeIn();
    expect(config.type).toBe(AnimationType.timing);
    expect(config).toMatchObject({ easing: Easing.easeIn, duration: 300 });
  });

  it('creates easeIn with custom duration', () => {
    const config = Animation.easeIn(500);
    expect(config).toMatchObject({ type: AnimationType.timing, easing: Easing.easeIn, duration: 500 });
  });

  it('creates easeOut timing config', () => {
    const config = Animation.easeOut();
    expect(config).toMatchObject({ type: AnimationType.timing, easing: Easing.easeOut });
  });

  it('creates easeInOut timing config', () => {
    const config = Animation.easeInOut();
    expect(config).toMatchObject({ type: AnimationType.timing, easing: Easing.easeInOut });
  });

  it('creates spring config', () => {
    const config = Animation.spring();
    expect(config.type).toBe(AnimationType.spring);
    expect(config).toMatchObject({ damping: 10, stiffness: 100, mass: 1, velocity: 0 });
  });

  it('creates spring with custom config', () => {
    const config = Animation.spring({ damping: 20, stiffness: 200 });
    expect(config).toMatchObject({ type: AnimationType.spring, damping: 20, stiffness: 200, mass: 1 });
  });

  it('creates linear timing config', () => {
    const config = Animation.linear();
    expect(config).toMatchObject({ type: AnimationType.timing, easing: Easing.linear });
  });

  it('creates quick preset', () => {
    const config = Animation.quick();
    expect(config).toMatchObject({ type: AnimationType.timing, duration: 150, easing: Easing.easeOut });
  });

  it('creates gentle preset', () => {
    const config = Animation.gentle();
    expect(config).toMatchObject({ type: AnimationType.timing, duration: 500, easing: Easing.easeInOut });
  });

  it('createAnimationPresets returns fresh presets', () => {
    const presets = createAnimationPresets();
    expect(presets.easeIn).toBeDefined();
    expect(presets.spring).toBeDefined();
  });
});
