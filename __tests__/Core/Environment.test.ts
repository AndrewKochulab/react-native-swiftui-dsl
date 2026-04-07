import { Text, VStack } from '@primitives';
import { ModifierType, Color, Spacing } from '@tokens';

describe('Environment modifiers', () => {
  it('adds environment modifier', () => {
    const builder = VStack(Text('Hello')).environment('accentColor', Color.tint);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.environment, key: 'accentColor', value: Color.tint });
  });

  it('supports multiple environment values', () => {
    const builder = VStack(Text('Hello'))
      .environment('accentColor', Color.tint)
      .environment('spacing', Spacing.sm);
    const envMods = builder.modifiers.filter(m => m.type === ModifierType.environment);
    expect(envMods.length).toBe(2);
  });

  it('chains with other modifiers', () => {
    const builder = VStack(Text('Hello'))
      .padding(Spacing.lg)
      .environment('key', 'value')
      .background(Color.card);
    expect(builder.modifiers.length).toBe(3);
  });
});
