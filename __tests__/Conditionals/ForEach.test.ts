import { ForEach } from '@/Conditionals/ForEach';
import { Text } from '@/Primitives/Text';
import { ViewBuilder } from '@/Core/ViewBuilder';

describe('ForEach', () => {
  it('maps data to builders', () => {
    const items = ['A', 'B', 'C'];
    const result = ForEach(items, (item) => item, (item) => Text(item));
    expect(result).toHaveLength(3);
  });

  it('passes item to builder', () => {
    const items = ['Hello', 'World'];
    const result = ForEach(items, (item) => item, (item) => Text(item));
    expect((result[0] as ViewBuilder).props.text).toBe('Hello');
    expect((result[1] as ViewBuilder).props.text).toBe('World');
  });

  it('passes index to builder', () => {
    const items = ['A', 'B'];
    const indices: number[] = [];
    ForEach(items, (_, i) => String(i), (_, index) => {
      indices.push(index);
      return Text(String(index));
    });
    expect(indices).toEqual([0, 1]);
  });

  it('supports keyExtractor with index', () => {
    const items = ['A', 'B'];
    // ForEach returns mapped builders — keyExtractor is not called internally,
    // it is used by the consumer. Verify the result array is correct.
    const result = ForEach(
      items,
      (item, index) => `${item}-${index}`,
      (item) => Text(item),
    );
    expect(result).toHaveLength(2);
    expect((result[0] as ViewBuilder).props.text).toBe('A');
    expect((result[1] as ViewBuilder).props.text).toBe('B');
  });

  it('returns empty array for empty data', () => {
    const result = ForEach([] as string[], (item) => String(item), (item) => Text(String(item)));
    expect(result).toHaveLength(0);
  });

  it('works with object data', () => {
    const users = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ];
    const result = ForEach(
      users,
      (user) => user.id,
      (user) => Text(user.name),
    );
    expect(result).toHaveLength(2);
    expect((result[0] as ViewBuilder).props.text).toBe('Alice');
    expect((result[1] as ViewBuilder).props.text).toBe('Bob');
  });

  it('works with numeric keyExtractor', () => {
    const items = ['X', 'Y'];
    const result = ForEach(items, (_, i) => i, (item) => Text(item));
    expect(result).toHaveLength(2);
  });
});
