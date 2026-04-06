import {
  isNumber,
  isString,
  isBoolean,
  isSymbol,
  isObject,
  isNil,
  toString,
  JSType,
  ColorSchemeField,
} from '@/Tokens/TypeGuards';

describe('JSType enum', () => {
  it('has correct values', () => {
    expect(JSType.string).toBe('string');
    expect(JSType.number).toBe('number');
    expect(JSType.boolean).toBe('boolean');
    expect(JSType.object).toBe('object');
    expect(JSType.function).toBe('function');
    expect(JSType.symbol).toBe('symbol');
    expect(JSType.undefined).toBe('undefined');
  });

  it('has 7 members', () => {
    expect(Object.keys(JSType).length).toBe(7);
  });
});

describe('ColorSchemeField enum', () => {
  it('has correct values', () => {
    expect(ColorSchemeField.light).toBe('light');
    expect(ColorSchemeField.dark).toBe('dark');
  });

  it('has 2 members', () => {
    expect(Object.keys(ColorSchemeField).length).toBe(2);
  });
});

describe('isNumber', () => {
  it('returns true for integers', () => {
    expect(isNumber(42)).toBe(true);
  });

  it('returns true for floats', () => {
    expect(isNumber(3.14)).toBe(true);
  });

  it('returns true for zero', () => {
    expect(isNumber(0)).toBe(true);
  });

  it('returns true for negative numbers', () => {
    expect(isNumber(-99)).toBe(true);
  });

  it('returns true for NaN', () => {
    expect(isNumber(NaN)).toBe(true);
  });

  it('returns true for Infinity', () => {
    expect(isNumber(Infinity)).toBe(true);
  });

  it('returns false for numeric strings', () => {
    expect(isNumber('42')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isNumber(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isNumber(undefined)).toBe(false);
  });

  it('returns false for booleans', () => {
    expect(isNumber(true)).toBe(false);
  });

  it('returns false for objects', () => {
    expect(isNumber({})).toBe(false);
  });
});

describe('isString', () => {
  it('returns true for string literals', () => {
    expect(isString('hello')).toBe(true);
  });

  it('returns true for empty strings', () => {
    expect(isString('')).toBe(true);
  });

  it('returns true for template literals', () => {
    expect(isString(`template`)).toBe(true);
  });

  it('returns false for numbers', () => {
    expect(isString(42)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isString(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isString(undefined)).toBe(false);
  });

  it('returns false for booleans', () => {
    expect(isString(true)).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isString([])).toBe(false);
  });

  it('returns false for objects', () => {
    expect(isString({})).toBe(false);
  });
});

describe('isBoolean', () => {
  it('returns true for true', () => {
    expect(isBoolean(true)).toBe(true);
  });

  it('returns true for false', () => {
    expect(isBoolean(false)).toBe(true);
  });

  it('returns false for 1', () => {
    expect(isBoolean(1)).toBe(false);
  });

  it('returns false for 0', () => {
    expect(isBoolean(0)).toBe(false);
  });

  it('returns false for truthy strings', () => {
    expect(isBoolean('true')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isBoolean(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isBoolean(undefined)).toBe(false);
  });
});

describe('isSymbol', () => {
  it('returns true for Symbol()', () => {
    expect(isSymbol(Symbol())).toBe(true);
  });

  it('returns true for named symbols', () => {
    expect(isSymbol(Symbol('named'))).toBe(true);
  });

  it('returns true for well-known symbols', () => {
    expect(isSymbol(Symbol.iterator)).toBe(true);
  });

  it('returns false for strings', () => {
    expect(isSymbol('sym')).toBe(false);
  });

  it('returns false for numbers', () => {
    expect(isSymbol(42)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isSymbol(null)).toBe(false);
  });

  it('returns false for objects', () => {
    expect(isSymbol({})).toBe(false);
  });
});

describe('isObject', () => {
  it('returns true for plain objects', () => {
    expect(isObject({})).toBe(true);
  });

  it('returns true for objects with properties', () => {
    expect(isObject({ key: 'value' })).toBe(true);
  });

  it('returns true for arrays', () => {
    expect(isObject([])).toBe(true);
  });

  it('returns true for Date objects', () => {
    expect(isObject(new Date())).toBe(true);
  });

  it('returns true for RegExp objects', () => {
    expect(isObject(/regex/)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isObject(undefined)).toBe(false);
  });

  it('returns false for strings', () => {
    expect(isObject('hello')).toBe(false);
  });

  it('returns false for numbers', () => {
    expect(isObject(42)).toBe(false);
  });

  it('returns false for booleans', () => {
    expect(isObject(true)).toBe(false);
  });

  it('returns false for functions', () => {
    expect(isObject(() => {})).toBe(false);
  });

  it('returns false for symbols', () => {
    expect(isObject(Symbol())).toBe(false);
  });
});

describe('isNil', () => {
  it('returns true for null', () => {
    expect(isNil(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isNil(undefined)).toBe(true);
  });

  it('returns true for void 0', () => {
    expect(isNil(void 0)).toBe(true);
  });

  it('returns false for 0', () => {
    expect(isNil(0)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isNil('')).toBe(false);
  });

  it('returns false for false', () => {
    expect(isNil(false)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isNil(NaN)).toBe(false);
  });

  it('returns false for empty object', () => {
    expect(isNil({})).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(isNil([])).toBe(false);
  });
});

describe('toString', () => {
  it('converts numbers to strings', () => {
    expect(toString(42)).toBe('42');
    expect(toString(0)).toBe('0');
    expect(toString(-1)).toBe('-1');
    expect(toString(3.14)).toBe('3.14');
  });

  it('converts null to "null"', () => {
    expect(toString(null)).toBe('null');
  });

  it('converts undefined to "undefined"', () => {
    expect(toString(undefined)).toBe('undefined');
  });

  it('converts booleans to strings', () => {
    expect(toString(true)).toBe('true');
    expect(toString(false)).toBe('false');
  });

  it('passes through strings unchanged', () => {
    expect(toString('hello')).toBe('hello');
    expect(toString('')).toBe('');
  });

  it('converts NaN to "NaN"', () => {
    expect(toString(NaN)).toBe('NaN');
  });

  it('converts Infinity to "Infinity"', () => {
    expect(toString(Infinity)).toBe('Infinity');
  });

  it('converts objects via String()', () => {
    expect(toString({})).toBe('[object Object]');
  });

  it('converts arrays via String()', () => {
    expect(toString([1, 2, 3])).toBe('1,2,3');
  });
});
