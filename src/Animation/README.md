# Animation

Animation system inspired by SwiftUI's declarative animation API. Supports timing and spring animations, enter/exit transitions, and optional `react-native-reanimated` integration with automatic fallback to the built-in React Native `Animated` API.

## Files

| File | Purpose |
|------|---------|
| `types.ts` | All animation-related TypeScript types: `AnimationConfig`, `TransitionConfig`, `ComputedAnimation`, `ComputedTransition`, `AnimationPresets` |
| `presets.ts` | `Animation` preset factory object and `createAnimationPresets()` |
| `withAnimation.ts` | `withAnimation()` function for wrapping state changes in an animation context |
| `AnimatedWrapper.tsx` | `AnimatedWrapper` and `TransitionWrapper` React components used by the renderer |

## API Reference

### Types (`types.ts`)

#### `AnimationConfig`

A discriminated union for timing or spring animation configuration. Uses `AnimationType` enum as discriminant.

```ts
import { AnimationType } from '@/Tokens/Animation';

type AnimationConfig =
  | { type: AnimationType.timing; easing?: EasingPreset; duration?: number; delay?: number }
  | { type: AnimationType.spring; damping?: number; stiffness?: number; mass?: number; velocity?: number; delay?: number };
```

#### `TransitionConfig`

Configuration for enter/exit transitions. Uses `Transition` and `TransitionEdge` enums.

```ts
import { Transition, TransitionEdge } from '@/Tokens/Animation';

interface TransitionConfig {
  effect: TransitionEffect;   // Transition.opacity | Transition.slide | Transition.scale | Transition.move
  edge?: TransitionEdgeType;  // TransitionEdge.top | TransitionEdge.bottom | TransitionEdge.leading | TransitionEdge.trailing
  animation?: AnimationConfig;
}
```

#### `TimingConfig`

```ts
interface TimingConfig {
  easing?: EasingPreset;
  duration?: number;
  delay?: number;
}
```

#### `SpringConfig`

```ts
interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
  velocity?: number;
}
```

#### `ComputedAnimation` / `ComputedTransition`

Internal types used by the renderer to track animation state:

```ts
interface ComputedAnimation {
  config: AnimationConfig;
  value: unknown;
}

interface ComputedTransition {
  enter: TransitionConfig;
  exit: TransitionConfig;
}
```

---

### `Animation` (presets)

Pre-built animation preset factories. Each returns an `AnimationConfig` that can be passed to `.animation()`.

```ts
import { Animation } from '@/Animation/presets';
```

| Preset | Description |
|--------|-------------|
| `Animation.easeIn(duration?)` | Ease-in timing animation |
| `Animation.easeOut(duration?)` | Ease-out timing animation |
| `Animation.easeInOut(duration?)` | Ease-in-out timing animation |
| `Animation.linear(duration?)` | Linear timing animation |
| `Animation.spring(config?)` | Spring physics animation |
| `Animation.quick()` | Quick preset (short duration, ease-out) |
| `Animation.gentle()` | Gentle preset (longer duration, ease-in-out) |

**Example:**

```ts
import { Text } from '@/Primitives/Text';
import { VStack } from '@/Primitives/Containers';
import { Animation } from '@/Animation/presets';
import { Transition, TransitionEdge } from '@/Tokens/Animation';

// Animate opacity changes with a spring
Text('Hello')
  .opacity(isVisible ? 1 : 0)
  .animation(Animation.spring(), isVisible)

// Animate with custom timing
VStack(child)
  .animation(Animation.easeInOut(500), someValue)

// Quick toggle animation
VStack(child)
  .animation(Animation.quick(), toggle)
```

### `createAnimationPresets()`

Factory function that creates the preset object using current `DSLDefaults.animation` values. The exported `Animation` constant is created by calling this function.

```ts
function createAnimationPresets(): AnimationPresets
```

---

### `withAnimation(config, callback)`

Wraps a state change in an animation context. Any state mutations within the callback will be animated using the provided config.

```ts
function withAnimation(
  config: AnimationConfig | undefined,
  callback: () => void,
): void
```

**Example:**

```ts
import { withAnimation } from '@/Animation/withAnimation';
import { Animation } from '@/Animation/presets';

// Animate a state change with a spring
withAnimation(Animation.spring(), () => {
  setIsVisible(!isVisible);
});

// With default animation (uses DSLDefaults):
withAnimation(undefined, () => {
  setExpanded(true);
});
```

---

### `AnimatedWrapper`

React component that wraps a child element with animated behavior. Tracks value changes and triggers animations when the tracked value changes. Animates opacity and scale for visual feedback.

```ts
interface AnimatedWrapperProps {
  animation: ComputedAnimation;
  children: React.ReactElement;
}

function AnimatedWrapper({ animation, children }: AnimatedWrapperProps): React.ReactElement
```

Used internally by `DSLRenderer` when a `.animation()` modifier is present. You typically do not use this directly.

---

### `TransitionWrapper`

React component that manages enter/exit transitions for a child element. Supports opacity, scale, slide, and move effects with configurable edge directions.

```ts
interface TransitionWrapperProps {
  transition: ComputedTransition;
  visible: boolean;
  children: React.ReactElement;
}

function TransitionWrapper({ transition, visible, children }: TransitionWrapperProps): React.ReactElement | null
```

**Example -- using transitions via ViewBuilder:**

```ts
import { VStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { Transition, TransitionEdge } from '@/Tokens/Animation';
import { Animation } from '@/Animation/presets';

VStack(
  Text('Sliding content'),
).transition({
  effect: Transition.slide,
  edge: TransitionEdge.bottom,
  animation: Animation.easeInOut(300),
}).toElement();

// Opacity transition
Text('Fading content').transition({
  effect: Transition.opacity,
}).toElement();

// Scale transition
Text('Scaling content').transition({
  effect: Transition.scale,
  animation: Animation.spring(),
}).toElement();
```

---

### Reanimated Support

The animation system automatically detects `react-native-reanimated` at runtime. If available, it is preferred for better performance. If not installed, the system falls back to React Native's built-in `Animated` API with no configuration needed.

```ts
function isReanimatedAvailable(): boolean
```
