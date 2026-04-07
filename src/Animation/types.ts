/**
 * Animation system types for the SwiftUI-inspired DSL.
 * All types derived from Token enums.
 */

import { Easing, AnimationType, Transition, TransitionEdge } from '@tokens';

// --- Easing (derived from enum) ---

export type EasingPreset = `${Easing}`;

// --- Config ---

export interface TimingConfig {
  easing?: EasingPreset;
  duration?: number;
  delay?: number;
}

export interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
  velocity?: number;
}

export type AnimationConfig =
  | ({ type: AnimationType.timing } & TimingConfig)
  | ({ type: AnimationType.spring } & SpringConfig & { delay?: number });

// --- Transitions (derived from enums) ---

export type TransitionEffect = `${Transition}`;
export type TransitionEdgeType = `${TransitionEdge}`;

export interface TransitionConfig {
  effect: TransitionEffect;
  edge?: TransitionEdgeType;
  animation?: AnimationConfig;
}

// --- Computed values for renderer ---

export interface ComputedAnimation {
  config: AnimationConfig;
  value: unknown;
}

export interface ComputedTransition {
  enter: TransitionConfig;
  exit: TransitionConfig;
}

// --- Preset factory interface ---

export interface AnimationPresets {
  easeIn: (duration?: number) => AnimationConfig;
  easeOut: (duration?: number) => AnimationConfig;
  easeInOut: (duration?: number) => AnimationConfig;
  spring: (config?: Partial<SpringConfig>) => AnimationConfig;
  linear: (duration?: number) => AnimationConfig;
  quick: () => AnimationConfig;
  gentle: () => AnimationConfig;
}
