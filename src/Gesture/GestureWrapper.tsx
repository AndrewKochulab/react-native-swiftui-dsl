import React, { useRef } from 'react';
import { PanResponder, View } from 'react-native';
import type { GestureConfig, PanGestureState } from './types';
import { DSLDefaults } from '@/Config/Defaults';
import { SwipeDirection } from '@/Tokens/Interaction';
import { GestureType } from '@/Tokens/ElementType';

interface GestureResponderViewProps {
  gestures: GestureConfig[];
  children: React.ReactElement;
}

/**
 * PanResponder-based gesture wrapper.
 * Provides fallback gesture support when react-native-gesture-handler is not installed.
 * Supports swipe and pan gestures. Pinch/rotation require gesture-handler.
 */
export function GestureResponderView({ gestures, children }: GestureResponderViewProps): React.ReactElement {
  const swipeGestures = gestures.filter((g): g is GestureConfig & { type: GestureType.swipe } => g.type === GestureType.swipe);
  const panGestures = gestures.filter((g): g is GestureConfig & { type: GestureType.pan } => g.type === GestureType.pan);

  const startPosition = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const minDistance = panGestures[0]?.config?.minDistance ?? DSLDefaults.gesture.panMinDistance;
        return Math.abs(gestureState.dx) > minDistance || Math.abs(gestureState.dy) > minDistance;
      },
      onPanResponderGrant: (_, gestureState) => {
        startPosition.current = { x: gestureState.x0, y: gestureState.y0 };
        for (const pan of panGestures) {
          const state: PanGestureState = {
            translation: { x: 0, y: 0 },
            velocity: { x: gestureState.vx, y: gestureState.vy },
            position: { x: gestureState.x0, y: gestureState.y0 },
          };
          pan.onStart?.(state);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        for (const pan of panGestures) {
          const state: PanGestureState = {
            translation: { x: gestureState.dx, y: gestureState.dy },
            velocity: { x: gestureState.vx, y: gestureState.vy },
            position: { x: gestureState.moveX, y: gestureState.moveY },
          };
          pan.onChanged(state);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Handle pan end
        for (const pan of panGestures) {
          const state: PanGestureState = {
            translation: { x: gestureState.dx, y: gestureState.dy },
            velocity: { x: gestureState.vx, y: gestureState.vy },
            position: { x: gestureState.moveX, y: gestureState.moveY },
          };
          pan.onEnded?.(state);
        }

        // Handle swipe detection
        for (const swipe of swipeGestures) {
          const threshold = swipe.threshold ?? DSLDefaults.gesture.swipeThreshold;
          const velThreshold = swipe.velocityThreshold ?? DSLDefaults.gesture.swipeVelocityThreshold;

          switch (swipe.direction) {
            case SwipeDirection.left:
              if (gestureState.dx < -threshold && Math.abs(gestureState.vx) > velThreshold / 1000) {
                swipe.handler();
              }
              break;
            case SwipeDirection.right:
              if (gestureState.dx > threshold && Math.abs(gestureState.vx) > velThreshold / 1000) {
                swipe.handler();
              }
              break;
            case SwipeDirection.up:
              if (gestureState.dy < -threshold && Math.abs(gestureState.vy) > velThreshold / 1000) {
                swipe.handler();
              }
              break;
            case SwipeDirection.down:
              if (gestureState.dy > threshold && Math.abs(gestureState.vy) > velThreshold / 1000) {
                swipe.handler();
              }
              break;
          }
        }
      },
    }),
  ).current;

  return React.createElement(
    View,
    { ...panResponder.panHandlers },
    children,
  );
}
