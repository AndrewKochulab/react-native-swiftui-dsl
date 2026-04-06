import type { AnimationConfig } from './types';
import { DSLDefaults } from '@/Config/Defaults';
import { AnimationType } from '@/Tokens/Animation';

/**
 * Tracks the currently active animation config.
 * When set, state changes triggered within the callback will be animated.
 */
let activeAnimationConfig: AnimationConfig | null = null;

/**
 * Returns the currently active animation config, or null if none is active.
 * Used internally by the animation system to detect animated state changes.
 */
export function getActiveAnimation(): AnimationConfig | null {
  return activeAnimationConfig;
}

/**
 * Wraps a state change in an animation context.
 * Any state mutations within the callback will be animated using the provided config.
 *
 * @example
 * ```ts
 * withAnimation(Animation.spring(), () => {
 *   setIsVisible(!isVisible);
 * });
 *
 * // With default animation:
 * withAnimation(undefined, () => {
 *   setExpanded(true);
 * });
 * ```
 */
export function withAnimation(
  config: AnimationConfig | undefined,
  callback: () => void,
): void {
  const resolved: AnimationConfig = config ?? {
    type: AnimationType.timing,
    easing: DSLDefaults.animation.defaultEasing,
    duration: DSLDefaults.animation.defaultDuration,
  };
  activeAnimationConfig = resolved;
  try {
    callback();
  } finally {
    // Use microtask to allow React batch updates to see the config
    queueMicrotask(() => {
      activeAnimationConfig = null;
    });
  }
}
