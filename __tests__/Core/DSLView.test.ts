import { DSLView, ViewBuilder } from '@core';
import { Text, VStack } from '@primitives';
import { ModifierType, Color, Font, Spacing, Edge } from '@tokens';

class SimpleCard extends DSLView<{ title: string }> {
  body(): ViewBuilder {
    return VStack(
      Text(this.props.title).font(Font.title).bold(),
    ).padding(Spacing.lg);
  }
}

class EmptyView extends DSLView {
  body(): ViewBuilder {
    return VStack();
  }
}

describe('DSLView', () => {
  it('builds a ViewBuilder from props', () => {
    const builder = SimpleCard.build({ title: 'Hello' });
    expect(builder).toBeInstanceOf(ViewBuilder);
    expect(builder.elementType).toBe('vstack');
  });

  it('applies modifiers from body()', () => {
    const builder = SimpleCard.build({ title: 'Test' });
    expect(builder.modifiers.length).toBe(1);
    expect(builder.modifiers[0]).toEqual({ type: ModifierType.padding, value: Spacing.lg, edge: Edge.all });
  });

  it('returns chainable ViewBuilder', () => {
    const builder = SimpleCard.build({ title: 'Test' }).background(Color.card);
    expect(builder.modifiers.length).toBe(2);
  });

  it('supports views with no props', () => {
    const builder = EmptyView.build({});
    expect(builder.elementType).toBe('vstack');
  });

  it('passes props to body correctly', () => {
    const builder = SimpleCard.build({ title: 'Custom Title' });
    const children = builder.children;
    expect(children.length).toBe(1);
    const textChild = children[0] as ViewBuilder;
    expect(textChild.props.text).toBe('Custom Title');
  });
});
