# Gesture System

Gesture support with PanResponder fallback and optional `react-native-gesture-handler` integration.

[<-- Back to README](../README.md)

> For implementation details, see [src/Gesture/README.md](../src/Gesture/README.md)
> See [examples/05-animations-gestures.tsx](../examples/05-animations-gestures.tsx)

---

## Swipe

```ts
Image(source)
  .onSwipe(SwipeDirection.left, () => handleNext())
  .onSwipe(SwipeDirection.right, () => handlePrev())
  .onSwipe(SwipeDirection.up, () => handleDismiss(), { threshold: 100 })
```

## Pan (Drag)

```ts
Image(source).onPan({
  onStart: (state) => console.log('Started at', state.position),
  onChanged: (state) => updatePosition(state.translation),
  onEnded: (state) => snapToGrid(state.translation),
})
```

## Pinch & Rotation

Requires `react-native-gesture-handler` for full support.

```ts
Image(source)
  .onPinch({
    onChanged: (state) => setScale(state.scale),
    onEnded: (state) => console.log('Final scale:', state.scale),
  })

Image(source)
  .onRotate({
    onChanged: (state) => setAngle(state.rotation),
  })
```

## Optional Gesture Handler

Install `react-native-gesture-handler` for pinch/rotation support and better gesture coordination. Without it, swipe and pan gestures use React Native's built-in PanResponder.
