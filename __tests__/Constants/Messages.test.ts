import { DSLWarnings, DSLErrors } from '@constants';

describe('DSLWarnings', () => {
  it('has blur warning', () => {
    expect(DSLWarnings.blurRequiresLibrary).toContain('blur');
    expect(DSLWarnings.blurRequiresLibrary).toContain('@react-native-community/blur');
  });

  it('has gesture handler warning', () => {
    expect(DSLWarnings.gestureHandlerRequired).toContain('react-native-gesture-handler');
  });

  it('has unknown color token warning', () => {
    const msg = DSLWarnings.unknownColorToken('invalidColor', 'text, tint, card');
    expect(msg).toContain('invalidColor');
    expect(msg).toContain('text, tint, card');
  });
});

describe('DSLErrors', () => {
  it('has log output failed error', () => {
    const msg = DSLErrors.logOutputFailed('connection reset');
    expect(msg).toContain('Log output failed');
    expect(msg).toContain('connection reset');
  });
});
