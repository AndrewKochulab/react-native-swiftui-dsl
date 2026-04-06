import { assertNever } from '@/Utils/exhaustive';

describe('assertNever', () => {
  it('throws with default message', () => {
    expect(() => assertNever('unexpected' as never)).toThrow('Unhandled discriminated union member');
  });

  it('throws with custom message', () => {
    expect(() => assertNever('x' as never, 'Custom error')).toThrow('Custom error');
  });

  it('includes the value in default message', () => {
    expect(() => assertNever('foo' as never)).toThrow('"foo"');
  });
});
