# Animation System

SwiftUI-inspired animations with React Native Animated API and optional `react-native-reanimated` support.

[<-- Back to README](../README.md)

> For implementation details, see [src/Animation/README.md](../src/Animation/README.md)
> See [examples/05-animations-gestures.tsx](../examples/05-animations-gestures.tsx)

---

## Animation Presets

```ts
import { Animation } from 'react-native-swiftui-dsl';

Animation.easeIn()           // timing, easeIn, 300ms
Animation.easeOut(500)       // timing, easeOut, 500ms
Animation.easeInOut()        // timing, easeInOut, 300ms
Animation.spring()           // spring with default config
Animation.spring({ damping: 15, stiffness: 200 })
Animation.linear(1000)       // linear, 1000ms
Animation.quick()            // fast animation (150ms, easeOut)
Animation.gentle()           // gentle animation (500ms, easeInOut)
```

## Animated Value Tracking

```ts
Text('Hello')
  .opacity(isVisible ? 1 : 0)
  .animation(Animation.easeInOut(300), isVisible)

// When `isVisible` changes, the opacity animates
```

## Transitions

```ts
Text('Sliding in')
  .transition({ effect: Transition.slide, edge: TransitionEdge.bottom })

Text('Fading in, sliding out')
  .transition(
    { effect: Transition.opacity },                                  // enter
    { effect: Transition.slide, edge: TransitionEdge.trailing },     // exit
  )
```

**Transition effects:** `opacity`, `slide`, `scale`, `move`

**Transition edges:** `top`, `bottom`, `leading`, `trailing`

## withAnimation()

```ts
import { withAnimation, Animation } from 'react-native-swiftui-dsl';

withAnimation(Animation.spring(), () => {
  setIsExpanded(!isExpanded);
});
```

## Optional Reanimated

Install `react-native-reanimated` for enhanced animation performance. The framework detects it automatically and uses it when available, falling back to React Native's `Animated` API.
