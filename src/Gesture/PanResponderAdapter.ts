/**
 * PanResponder adapter utilities.
 * This module provides helper functions for converting between
 * PanResponder gesture state and the DSL's gesture state types.
 */

import type { PanGestureState, GesturePoint } from './types';

/**
 * Creates a PanGestureState from PanResponder's GestureState.
 */
export function createPanState(
  dx: number,
  dy: number,
  vx: number,
  vy: number,
  moveX: number,
  moveY: number,
): PanGestureState {
  return {
    translation: { x: dx, y: dy },
    velocity: { x: vx, y: vy },
    position: { x: moveX, y: moveY },
  };
}

/**
 * Calculates the distance between two points.
 */
export function distance(a: GesturePoint, b: GesturePoint): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
