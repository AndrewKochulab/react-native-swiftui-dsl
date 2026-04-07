import { Text, VStack, HStack, Spacer, Button } from '@primitives';
import {
  ViewBuilder, ViewModifier, composeModifiers, ViewModifierFn, createModifiers, DSLView,
} from '@core';
import { ModifierType, Color, Font, Spacing, Radius, ButtonVariant } from '@tokens';

// --- Modifier precedence ---

describe('Modifier precedence', () => {
  it('last modifier of same type wins (last-write-wins)', () => {
    const builder = Text('Hello')
      .padding(Spacing.sm)
      .padding(Spacing.lg);
    expect(builder.modifiers.length).toBe(2);
    // Both stored — computeStyles will apply last
    expect(builder.modifiers[0]).toMatchObject({ type: ModifierType.padding, value: Spacing.sm });
    expect(builder.modifiers[1]).toMatchObject({ type: ModifierType.padding, value: Spacing.lg });
  });

  it('preserves all modifiers in order', () => {
    const builder = Text('Hello')
      .font(Font.body)
      .bold()
      .font(Font.title)
      .foregroundColor(Color.tint);
    expect(builder.modifiers.map(m => m.type)).toEqual([
      ModifierType.font, ModifierType.fontWeight, ModifierType.font, ModifierType.foregroundColor,
    ]);
  });
});

// --- Clone behavior ---

describe('Clone deep behavior', () => {
  it('clone props are independent', () => {
    const original = Text('Hello').padding(Spacing.lg);
    const clone = original.clone();
    expect(clone.props).toEqual(original.props);
    expect(clone.props).not.toBe(original.props);
  });

  it('clone children are independent array', () => {
    const child = Text('Child');
    const original = VStack(child).padding(Spacing.lg);
    const clone = original.clone();
    expect(clone.children).not.toBe(original.children);
    expect(clone.children.length).toBe(original.children.length);
  });

  it('mutating clone does not affect original', () => {
    const original = VStack(Text('Hello'));
    const clone1 = original.clone().padding(Spacing.sm).background(Color.card);
    const clone2 = original.clone().padding(Spacing.lg).background(Color.error);

    expect(original.modifiers.length).toBe(0);
    expect(clone1.modifiers.length).toBe(2);
    expect(clone2.modifiers.length).toBe(2);
    expect(clone1.modifiers).not.toEqual(clone2.modifiers);
  });

  it('chain clone with modifier/apply', () => {
    const base = Text('Hello').font(Font.body);
    const variant = base.clone().apply(v => v.bold().foregroundColor(Color.tint));
    expect(base.modifiers.length).toBe(1);
    expect(variant.modifiers.length).toBe(3);
  });
});

// --- Empty containers ---

describe('Empty containers', () => {
  it('VStack with no children', () => {
    const builder = VStack();
    expect(builder.elementType).toBe('vstack');
    expect(builder.children.length).toBe(0);
  });

  it('HStack with no children', () => {
    const builder = HStack();
    expect(builder.elementType).toBe('hstack');
    expect(builder.children.length).toBe(0);
  });

  it('VStack with null/undefined/false children', () => {
    const builder = VStack(null, undefined, false as unknown as null, Text('Real'));
    expect(builder.children.length).toBe(4);
    // DSLRenderer's resolveChildren will filter nulls
  });
});

// --- ViewModifier composability ---

describe('ViewModifier composability', () => {
  class PaddingMod extends ViewModifier {
    constructor(private amount: 'sm' | 'md' | 'lg' = 'md') { super(); }
    body(content: ViewBuilder): ViewBuilder {
      return content.padding(this.amount);
    }
  }

  class BoldTitleMod extends ViewModifier {
    body(content: ViewBuilder): ViewBuilder {
      return content.font(Font.title).bold();
    }
  }

  it('compose class-based modifiers', () => {
    const composed = composeModifiers(new PaddingMod(Spacing.lg), new BoldTitleMod());
    const builder = Text('Hello').modifier(composed);
    expect(builder.modifiers.length).toBe(3);
  });

  it('compose mixed class and function modifiers', () => {
    const fn: ViewModifierFn = v => v.background(Color.card);
    const composed = composeModifiers(new PaddingMod(), fn, new BoldTitleMod());
    const builder = Text('Hello').modifier(composed);
    expect(builder.modifiers.length).toBe(4);
  });

  it('createModifiers values apply independently', () => {
    const mods = createModifiers({
      card: v => v.padding(Spacing.lg).background(Color.card),
      title: v => v.font(Font.title).bold(),
    });

    const builder1 = Text('A').apply(mods.card);
    const builder2 = Text('B').apply(mods.title);

    expect(builder1.modifiers.length).toBe(2);
    expect(builder2.modifiers.length).toBe(2);
    expect(builder1.modifiers[0].type).toBe(ModifierType.padding);
    expect(builder2.modifiers[0].type).toBe(ModifierType.font);
  });
});

// --- DSLView edge cases ---

describe('DSLView edge cases', () => {
  class NestedView extends DSLView<{ items: string[] }> {
    body(): ViewBuilder {
      return VStack(
        ...this.props.items.map(item => Text(item).font(Font.body)),
      );
    }
  }

  it('handles dynamic children from props', () => {
    const builder = NestedView.build({ items: ['A', 'B', 'C'] });
    expect(builder.children.length).toBe(3);
  });

  it('handles empty props arrays', () => {
    const builder = NestedView.build({ items: [] });
    expect(builder.children.length).toBe(0);
  });

  class ComposedView extends DSLView<{ title: string }> {
    body(): ViewBuilder {
      return VStack(
        Text(this.props.title).font(Font.title).bold(),
        Spacer(),
        Button('Action', () => {}, { style: ButtonVariant.filled }),
      )
      .padding(Spacing.lg)
      .modifier(new class extends ViewModifier {
        body(content: ViewBuilder): ViewBuilder {
          return content.background(Color.card).cornerRadius(Radius.md);
        }
      }());
    }
  }

  it('supports ViewModifier inside DSLView body', () => {
    const builder = ComposedView.build({ title: 'Test' });
    expect(builder.modifiers.length).toBe(3); // padding + background + cornerRadius
  });
});

// --- .if() edge cases ---

describe('.if() edge cases', () => {
  it('handles chained .if() conditions', () => {
    const builder = Text('Test')
      .if(true, v => v.bold())
      .if(true, v => v.italic())
      .if(false, v => v.underline());
    expect(builder.modifiers.length).toBe(2);
  });

  it('works after other modifiers', () => {
    const builder = Text('Test')
      .font(Font.body)
      .if(true, v => v.bold())
      .padding(Spacing.lg);
    expect(builder.modifiers.length).toBe(3);
    expect(builder.modifiers.map(m => m.type)).toEqual([ModifierType.font, ModifierType.fontWeight, ModifierType.padding]);
  });

  it('works with ViewModifier in condition', () => {
    const cardMod = new class extends ViewModifier {
      body(content: ViewBuilder): ViewBuilder {
        return content.background(Color.card).cornerRadius(Radius.md);
      }
    }();

    const builder = Text('Test')
      .if(true, v => { v.modifier(cardMod); return v; });
    expect(builder.modifiers.length).toBe(2);
  });
});

// --- Transform chaining ---

describe('Transform chaining', () => {
  it('accumulates multiple transforms', () => {
    const builder = Text('Hello')
      .offset(10, 20)
      .rotation(45)
      .scale(1.5)
      .opacity(0.8);
    expect(builder.modifiers.length).toBe(4);
  });

  it('works with modifiers before and after', () => {
    const builder = Text('Hello')
      .padding(Spacing.lg)
      .rotation(45)
      .background(Color.card);
    expect(builder.modifiers.map(m => m.type)).toEqual([ModifierType.padding, ModifierType.rotation, ModifierType.background]);
  });
});

// --- Multiple toElement() calls ---

describe('ViewBuilder.toElement()', () => {
  it('can be called without errors', () => {
    const builder = Text('Hello').font(Font.title);
    expect(() => builder.toElement()).not.toThrow();
  });

  it('returns React element', () => {
    const element = Text('Hello').toElement();
    expect(element).toBeDefined();
    expect(element.type).toBeDefined();
  });

  it('accepts key parameter', () => {
    const element = Text('Hello').toElement('my-key');
    expect(element.key).toBe('my-key');
  });
});
