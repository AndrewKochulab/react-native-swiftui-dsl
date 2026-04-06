# Gesture

Gesture recognition system supporting swipe, pan, pinch, and rotation gestures. Uses `PanResponder` as a built-in fallback when `react-native-gesture-handler` is not installed.

## Files

| File | Purpose |
|------|---------|
| `types.ts` | All gesture-related TypeScript types: `GestureConfig`, `PanGestureState`, `PinchGestureState`, `RotationGestureState` |
| `GestureWrapper.tsx` | `GestureResponderView` component that wraps children with PanResponder-based gesture detection |
| `PanResponderAdapter.ts` | Helper utilities for converting PanResponder state to DSL gesture state types |

## API Reference

### Types (`types.ts`)

#### `GestureConfig`

A discriminated union for all supported gesture types. Uses `GestureType` enum as discriminant.

```ts
import { GestureType } from '@/Tokens/ElementType';
import { SwipeDirection } from '@/Tokens/Interaction';

type GestureConfig =
  | { type: GestureType.swipe; direction: SwipeDirection; handler: () => void; threshold?: number; velocityThreshold?: number }
  | { type: GestureType.pan; config?: PanGestureConfig; onStart?: (state: PanGestureState) => void; onChanged: (state: PanGestureState) => void; onEnded?: (state: PanGestureState) => void }
  | { type: GestureType.pinch; config?: PinchGestureConfig; onChanged: (state: PinchGestureState) => void; onEnded?: (state: PinchGestureState) => void }
  | { type: GestureType.rotation; config?: RotationGestureConfig; onChanged: (state: RotationGestureState) => void; onEnded?: (state: RotationGestureState) => void };
```

#### `GesturePoint`

```ts
interface GesturePoint {
  x: number;
  y: number;
}
```

#### `PanGestureState`

```ts
interface PanGestureState {
  translation: GesturePoint;
  velocity: GesturePoint;
  position: GesturePoint;
}
```

#### `PinchGestureState`

```ts
interface PinchGestureState {
  scale: number;
  focalPoint: GesturePoint;
  velocity: number;
}
```

#### `RotationGestureState`

```ts
interface RotationGestureState {
  rotation: number;
  velocity: number;
  anchor: GesturePoint;
}
```

#### Gesture Config Types

```ts
interface PanGestureConfig {
  minDistance?: number;
  maxPointers?: number;
  minPointers?: number;
  enabled?: boolean;
}

interface PinchGestureConfig { enabled?: boolean; }
interface RotationGestureConfig { enabled?: boolean; }
```

---

### Usage via ViewBuilder Modifiers

Gestures are attached to views using chainable modifiers. The renderer wraps the element in a `GestureResponderView` automatically.

**Swipe gestures:**

```ts
import { VStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { SwipeDirection } from '@/Tokens/Interaction';

VStack(
  Text('Swipe me'),
).onSwipe(SwipeDirection.left, () => {
  console.log('Swiped left!');
}).toElement();

// Swipe with custom threshold
VStack(
  Text('Swipe right'),
).onSwipe(SwipeDirection.right, () => {
  navigateBack();
}, { threshold: 100, velocityThreshold: 500 }).toElement();
```

**Pan gestures:**

```ts
import { VStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';

VStack(
  Text('Drag me'),
).onPan({
  onStart: (state) => console.log('Pan started', state.position),
  onChanged: (state) => {
    translateX.value = state.translation.x;
    translateY.value = state.translation.y;
  },
  onEnded: (state) => console.log('Pan ended', state.velocity),
}).toElement();
```

**Pinch and rotation gestures:**

```ts
import { Image } from '@/Primitives/Image';
import { ImageResize } from '@/Tokens/Component';

Image(source, { resizeMode: ImageResize.contain })
  .onPinch({
    onChanged: (state) => { scale.value = state.scale; },
    onEnded: () => { scale.value = 1; },
  })
  .onRotate({
    onChanged: (state) => { rotation.value = state.rotation; },
  })
  .toElement();
```

---

### `GestureResponderView`

PanResponder-based gesture wrapper component. Provides fallback gesture support when `react-native-gesture-handler` is not installed. Supports swipe and pan gestures natively; pinch and rotation require `react-native-gesture-handler`.

```ts
interface GestureResponderViewProps {
  gestures: GestureConfig[];
  children: React.ReactElement;
}

function GestureResponderView({ gestures, children }: GestureResponderViewProps): React.ReactElement
```

Used internally by `DSLRenderer` when gesture modifiers are present. You typically do not use this directly.

---

### `PanResponderAdapter`

Helper utilities for converting between PanResponder's gesture state and the DSL's gesture state types.

```ts
function createPanState(dx: number, dy: number, vx: number, vy: number, moveX: number, moveY: number): PanGestureState
function distance(a: GesturePoint, b: GesturePoint): number
```
