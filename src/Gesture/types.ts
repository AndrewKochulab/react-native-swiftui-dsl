/**
 * Gesture system types for the SwiftUI-inspired DSL.
 * All types derived from Token enums.
 */

import { GestureType, type SwipeDirectionToken } from '@tokens';

// --- Direction (derived from enum) ---

export type SwipeDirection = SwipeDirectionToken;

// --- Gesture state ---

export interface GesturePoint {
  x: number;
  y: number;
}

export interface PanGestureState {
  translation: GesturePoint;
  velocity: GesturePoint;
  position: GesturePoint;
}

export interface PinchGestureState {
  scale: number;
  focalPoint: GesturePoint;
  velocity: number;
}

export interface RotationGestureState {
  rotation: number;
  velocity: number;
  anchor: GesturePoint;
}

// --- Config ---

export interface PanGestureConfig {
  minDistance?: number;
  maxPointers?: number;
  minPointers?: number;
  enabled?: boolean;
}

export interface PinchGestureConfig {
  enabled?: boolean;
}

export interface RotationGestureConfig {
  enabled?: boolean;
}

// --- Generic gesture config (discriminant from GestureType enum) ---

export type GestureConfig =
  | {
      type: GestureType.swipe;
      direction: SwipeDirection;
      handler: () => void;
      threshold?: number;
      velocityThreshold?: number;
    }
  | {
      type: GestureType.pan;
      config?: PanGestureConfig;
      onStart?: (state: PanGestureState) => void;
      onChanged: (state: PanGestureState) => void;
      onEnded?: (state: PanGestureState) => void;
    }
  | {
      type: GestureType.pinch;
      config?: PinchGestureConfig;
      onChanged: (state: PinchGestureState) => void;
      onEnded?: (state: PinchGestureState) => void;
    }
  | {
      type: GestureType.rotation;
      config?: RotationGestureConfig;
      onChanged: (state: RotationGestureState) => void;
      onEnded?: (state: RotationGestureState) => void;
    };

// --- Computed gestures for renderer ---

export interface ComputedGestures {
  gestures: GestureConfig[];
}
