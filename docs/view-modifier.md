# ViewModifier Protocol

Reusable, composable modifiers inspired by SwiftUI's `ViewModifier` protocol.

[<-- Back to README](../README.md)

> For implementation details, see [src/Core/README.md](../src/Core/README.md)
> See [examples/02-view-modifiers.tsx](../examples/02-view-modifiers.tsx)

---

## Class-Based (SwiftUI Pattern)

```ts
import { ViewModifier, ViewBuilder, Spacing, Color, Radius } from 'react-native-swiftui-dsl';

class CardModifier extends ViewModifier {
  body(content: ViewBuilder): ViewBuilder {
    return content
      .padding(Spacing.lg)
      .background(Color.card)
      .cornerRadius(Radius.md)
      .shadow();
  }
}

// Parameterized modifiers
class PaddedCard extends ViewModifier {
  constructor(private size: SpacingToken = Spacing.md) { super(); }
  body(content: ViewBuilder): ViewBuilder {
    return content.padding(this.size).background(Color.card).cornerRadius(Radius.md);
  }
}

// Apply
Text('Hello').modifier(new CardModifier())
Text('Hello').modifier(new PaddedCard(Spacing.lg))
```

## Function-Based (Quick & Simple)

```ts
const titleStyle = (v: ViewBuilder) => v.font(Font.title).bold();
const captionStyle = (v: ViewBuilder) => v.font(Font.caption).secondary();

Text('Hello').apply(titleStyle)
```

## createModifiers (Grouped Styles)

```ts
import { createModifiers, Font, Spacing, Color, Radius } from 'react-native-swiftui-dsl';

const styles = createModifiers({
  card: v => v.padding(Spacing.lg).background(Color.card).cornerRadius(Radius.md),
  title: v => v.font(Font.title).bold(),
  badge: v => v.paddingHorizontal(Spacing.sm).paddingVertical(Spacing.xs).background(Color.tint).cornerRadius(Radius.lg),
});

Text('Hello').apply(styles.title)
VStack(...).apply(styles.card)
```

## composeModifiers

```ts
import { composeModifiers } from 'react-native-swiftui-dsl';

const elevatedCard = composeModifiers(
  new CardModifier(),
  v => v.shadow({ radius: 12, elevation: 6 }),
);

Text('Hello').modifier(elevatedCard)
```

## Conditional Modifiers (.if)

```ts
Text('$29.99')
  .font(Font.title)
  .if(isOnSale, v => v.foregroundColor(Color.error).strikethrough())
  .if(isFeatured, v => v.bold().font(Font.hero))
  .if(!isAvailable, v => v.opacity(0.5).disabled())
```

## Clone

Create independent copies of a ViewBuilder to apply different modifiers:

```ts
const base = VStack(Text('Hello')).padding(Spacing.lg);
const card = base.clone().background(Color.card);
const alert = base.clone().background(Color.error);
// base is unchanged, card and alert are independent
```
