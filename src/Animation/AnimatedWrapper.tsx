import React, { useRef, useEffect } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import type { AnimationConfig, ComputedAnimation, ComputedTransition, TransitionConfig } from './types';
import { DSLDefaults } from '@/Config/Defaults';
import { Transition, AnimationType, Easing as EasingToken, TransitionEdge } from '@/Tokens/Animation';
import { RNTransform } from '@/Tokens/RNStyle';

// --- Optional reanimated detection ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ReanimatedModule: any = null;
try {
  ReanimatedModule = require('react-native-reanimated');
} catch {
  // react-native-reanimated not installed — using RN Animated API fallback
}

/**
 * Returns true if react-native-reanimated is available.
 */
export function isReanimatedAvailable(): boolean {
  return ReanimatedModule !== null;
}

// --- Easing resolution ---

function resolveEasing(name: string): (value: number) => number {
  switch (name) {
    case EasingToken.linear:
      return Easing.linear;
    case EasingToken.easeIn:
      return Easing.in(Easing.ease);
    case EasingToken.easeOut:
      return Easing.out(Easing.ease);
    case EasingToken.easeInOut:
      return Easing.inOut(Easing.ease);
    default:
      return Easing.inOut(Easing.ease);
  }
}

// --- Animation execution ---

function runTimingAnimation(
  animatedValue: Animated.Value,
  toValue: number,
  config: AnimationConfig & { type: AnimationType.timing },
): void {
  const delay = config.delay ?? DSLDefaults.animation.defaultDelay;

  Animated.timing(animatedValue, {
    toValue,
    duration: config.duration ?? DSLDefaults.animation.defaultDuration,
    easing: resolveEasing(config.easing ?? DSLDefaults.animation.defaultEasing),
    delay,
    useNativeDriver: true,
  }).start();
}

function runSpringAnimation(
  animatedValue: Animated.Value,
  toValue: number,
  config: AnimationConfig & { type: AnimationType.spring },
): void {
  const d = DSLDefaults.animation.spring;

  Animated.spring(animatedValue, {
    toValue,
    damping: config.damping ?? d.damping,
    stiffness: config.stiffness ?? d.stiffness,
    mass: config.mass ?? d.mass,
    velocity: config.velocity ?? d.velocity,
    useNativeDriver: true,
  }).start();
}

function runAnimation(
  animatedValue: Animated.Value,
  toValue: number,
  config: AnimationConfig,
): void {
  if (config.type === AnimationType.spring) {
    runSpringAnimation(animatedValue, toValue, config);
  } else {
    runTimingAnimation(animatedValue, toValue, config);
  }
}

// --- AnimatedWrapper component ---

interface AnimatedWrapperProps {
  animation: ComputedAnimation;
  children: React.ReactElement;
}

/**
 * Wraps a child element with animated behavior.
 * Tracks value changes and triggers animations when the tracked value changes.
 *
 * Animates opacity (fade in) and scale (subtle spring) for visual feedback.
 * The animation config determines timing/easing.
 *
 * Uses react-native-reanimated if available, falls back to RN Animated.
 */
export function AnimatedWrapper({ animation, children }: AnimatedWrapperProps): React.ReactElement {
  const progress = useRef(new Animated.Value(1)).current;
  const previousValue = useRef(animation.value);

  useEffect(() => {
    if (previousValue.current !== animation.value) {
      previousValue.current = animation.value;

      // Reset to start state, then animate to end state
      progress.setValue(0);
      runAnimation(progress, 1, animation.config);
    }
  }, [animation.value, animation.config, progress]);

  // The progress value drives multiple animated properties
  const { scaleRange } = DSLDefaults.animation;
  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    opacity: progress,
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [scaleRange.from, scaleRange.to],
        }),
      },
    ],
  } as unknown as Animated.WithAnimatedObject<ViewStyle>;

  return React.createElement(
    Animated.View,
    { style: animatedStyle },
    children,
  );
}

// --- TransitionWrapper component ---

interface TransitionWrapperProps {
  transition: ComputedTransition;
  visible: boolean;
  children: React.ReactElement;
}

function getTransitionInitialValue(config: TransitionConfig): number {
  switch (config.effect) {
    case Transition.opacity:
      return 0;
    case Transition.scale:
      return 0;
    case Transition.slide:
    case Transition.move:
      return 1; // offset value
    default:
      return 0;
  }
}

function getTransitionAnimatedStyle(
  config: TransitionConfig,
  animatedValue: Animated.Value,
): Animated.WithAnimatedObject<ViewStyle> {
  switch (config.effect) {
    case Transition.opacity:
      return { opacity: animatedValue } as unknown as Animated.WithAnimatedObject<ViewStyle>;
    case Transition.scale:
      return {
        transform: [{ scale: animatedValue }],
      } as unknown as Animated.WithAnimatedObject<ViewStyle>;
    case Transition.slide: {
      const direction = config.edge ?? TransitionEdge.bottom;
      const translateProp = direction === TransitionEdge.top || direction === TransitionEdge.bottom
        ? RNTransform.translateY
        : RNTransform.translateX;
      const sign = direction === TransitionEdge.bottom || direction === TransitionEdge.trailing ? 1 : -1;
      return {
        transform: [{
          [translateProp]: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [sign * DSLDefaults.animation.slideDistance, 0],
          }),
        }],
      } as unknown as Animated.WithAnimatedObject<ViewStyle>;
    }
    case Transition.move: {
      const moveDirection = config.edge ?? TransitionEdge.bottom;
      const moveProp = moveDirection === TransitionEdge.top || moveDirection === TransitionEdge.bottom
        ? RNTransform.translateY
        : RNTransform.translateX;
      const moveSign = moveDirection === TransitionEdge.bottom || moveDirection === TransitionEdge.trailing ? 1 : -1;
      return {
        transform: [{
          [moveProp]: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [moveSign * DSLDefaults.animation.moveDistance, 0],
          }),
        }],
      } as unknown as Animated.WithAnimatedObject<ViewStyle>;
    }
    default:
      return { opacity: animatedValue } as unknown as Animated.WithAnimatedObject<ViewStyle>;
  }
}

/**
 * Manages enter/exit transitions for a child element.
 */
export function TransitionWrapper({ transition, visible, children }: TransitionWrapperProps): React.ReactElement | null {
  const animatedValue = useRef(new Animated.Value(visible ? 1 : getTransitionInitialValue(transition.enter))).current;

  useEffect(() => {
    const config = visible ? transition.enter : transition.exit;
    const toValue = visible ? 1 : 0;
    const animConfig = config.animation ?? {
      type: AnimationType.timing,
      easing: DSLDefaults.animation.defaultEasing,
      duration: DSLDefaults.animation.defaultDuration,
    };

    runAnimation(animatedValue, toValue, animConfig);
  }, [visible, transition, animatedValue]);

  const style = getTransitionAnimatedStyle(
    visible ? transition.enter : transition.exit,
    animatedValue,
  );

  return React.createElement(
    Animated.View,
    { style },
    children,
  );
}
