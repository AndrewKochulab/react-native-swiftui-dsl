import type { AnimationConfig, SpringConfig, AnimationPresets } from './types';
import { DSLDefaults } from '@/Config/Defaults';
import { Easing as EasingToken, AnimationType } from '@/Tokens/Animation';

/**
 * Creates animation preset factories using the current DSLDefaults values.
 * All durations and parameters are configurable — no hardcoded values.
 */
export function createAnimationPresets(): AnimationPresets {
  const d = DSLDefaults.animation;
  return {
    easeIn: (duration?: number): AnimationConfig => ({
      type: AnimationType.timing,
      easing: EasingToken.easeIn,
      duration: duration ?? d.defaultDuration,
    }),
    easeOut: (duration?: number): AnimationConfig => ({
      type: AnimationType.timing,
      easing: EasingToken.easeOut,
      duration: duration ?? d.defaultDuration,
    }),
    easeInOut: (duration?: number): AnimationConfig => ({
      type: AnimationType.timing,
      easing: EasingToken.easeInOut,
      duration: duration ?? d.defaultDuration,
    }),
    spring: (config?: Partial<SpringConfig>): AnimationConfig => ({
      type: AnimationType.spring,
      damping: config?.damping ?? d.spring.damping,
      stiffness: config?.stiffness ?? d.spring.stiffness,
      mass: config?.mass ?? d.spring.mass,
      velocity: config?.velocity ?? d.spring.velocity,
    }),
    linear: (duration?: number): AnimationConfig => ({
      type: AnimationType.timing,
      easing: EasingToken.linear,
      duration: duration ?? d.defaultDuration,
    }),
    quick: (): AnimationConfig => ({
      type: AnimationType.timing,
      easing: d.quick.easing,
      duration: d.quick.duration,
    }),
    gentle: (): AnimationConfig => ({
      type: AnimationType.timing,
      easing: d.gentle.easing,
      duration: d.gentle.duration,
    }),
  };
}

/**
 * Pre-built animation presets using DSLDefaults values.
 *
 * @example
 * ```ts
 * Text('Hello')
 *   .opacity(isVisible ? 1 : 0)
 *   .animation(Animation.spring(), isVisible)
 *
 * View(...).animation(Animation.easeInOut(500), someValue)
 * View(...).animation(Animation.quick(), toggle)
 * ```
 */
export const Animation: AnimationPresets = createAnimationPresets();
