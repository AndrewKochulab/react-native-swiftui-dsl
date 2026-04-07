import { If } from '@conditionals';
import { Text } from '@primitives';
import { ViewBuilder } from '@core';

describe('If', () => {
  it('returns then builder result when condition is true', () => {
    const result = If(true, () => Text('Yes')) as ViewBuilder;
    expect(result).toBeTruthy();
    expect(result.elementType).toBe('text');
    expect(result.props.text).toBe('Yes');
  });

  it('returns null when condition is false and no else builder', () => {
    const result = If(false, () => Text('Yes'));
    expect(result).toBeNull();
  });

  it('returns else builder result when condition is false', () => {
    const result = If(
      false,
      () => Text('Yes'),
      () => Text('No'),
    ) as ViewBuilder;
    expect(result).toBeTruthy();
    expect(result.elementType).toBe('text');
    expect(result.props.text).toBe('No');
  });

  it('does not call else builder when condition is true', () => {
    const elseFn = jest.fn(() => Text('No'));
    If(true, () => Text('Yes'), elseFn);
    expect(elseFn).not.toHaveBeenCalled();
  });

  it('does not call then builder when condition is false', () => {
    const thenFn = jest.fn(() => Text('Yes'));
    If(false, thenFn, () => Text('No'));
    expect(thenFn).not.toHaveBeenCalled();
  });

  it('works with dynamic condition', () => {
    const isLoggedIn = true;
    const result = If(
      isLoggedIn,
      () => Text('Welcome'),
      () => Text('Login'),
    ) as ViewBuilder;
    expect(result.props.text).toBe('Welcome');
  });
});
