# Transform Modifiers

Visual transform modifiers for positioning, rotation, scaling, and effects.

[<-- Back to README](../README.md)

> For implementation details, see [src/Core/README.md](../src/Core/README.md)
> See [examples/07-transforms-environment.tsx](../examples/07-transforms-environment.tsx)

---

## Offset

```ts
Text('Hello').offset(10, -5)
```

## Rotation

```ts
Icon('arrow').rotation(45)
Icon('arrow').rotationEffect(45)  // alias
```

## Scale

```ts
Image(source).scale(1.5)          // uniform
Image(source).scale(0.8, 1.2)    // non-uniform (x, y)
Image(source).scaleEffect(2)      // alias
```

## Blur

Cross-platform approximation:

```ts
Image(source).blur(10)
```

## Overlay

Layer a view on top of another:

```ts
Image(source).overlay(() =>
  Text('Badge')
    .font(Font.caption)
    .foregroundColor(Color.background)
    .padding(Spacing.xs)
    .background(Color.tint)
    .cornerRadius(Radius.sm)
)
```

## Composing Transforms

Transforms compose -- apply multiple in sequence:

```ts
Text('Hello')
  .offset(10, 0)
  .rotation(15)
  .scale(1.1)
```
