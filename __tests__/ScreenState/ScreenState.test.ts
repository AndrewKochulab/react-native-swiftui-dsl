import {
  ScreenStateType,
  loadingState, contentState, errorState, emptyState, listContentState,
  DataScreenState, ListScreenState, AsyncOpState, FormLoadState, FormSubmitState,
} from '@screen-state';

describe('ScreenState', () => {
  describe('ScreenStateType enum', () => {
    it('has all expected values', () => {
      expect(ScreenStateType.loading).toBe('loading');
      expect(ScreenStateType.content).toBe('content');
      expect(ScreenStateType.error).toBe('error');
      expect(ScreenStateType.empty).toBe('empty');
      expect(ScreenStateType.idle).toBe('idle');
      expect(ScreenStateType.running).toBe('running');
      expect(ScreenStateType.failed).toBe('failed');
      expect(ScreenStateType.submitting).toBe('submitting');
      expect(ScreenStateType.success).toBe('success');
      expect(ScreenStateType.ready).toBe('ready');
      expect(ScreenStateType.loadError).toBe('loadError');
      expect(ScreenStateType.submitError).toBe('submitError');
    });
  });

  describe('Helper functions', () => {
    it('loadingState creates loading', () => {
      const state = loadingState();
      expect(state.type).toBe(ScreenStateType.loading);
    });

    it('contentState creates content with data', () => {
      const state = contentState({ name: 'John' });
      expect(state.type).toBe(ScreenStateType.content);
      expect(state.data).toEqual({ name: 'John' });
    });

    it('errorState creates error with message', () => {
      const state = errorState('Network failed');
      expect(state.type).toBe(ScreenStateType.error);
      expect(state.error).toBe('Network failed');
    });

    it('emptyState creates empty', () => {
      const state = emptyState();
      expect(state.type).toBe(ScreenStateType.empty);
    });

    it('listContentState creates content with items', () => {
      const state = listContentState([1, 2, 3]);
      expect(state.type).toBe(ScreenStateType.content);
      expect(state.items).toEqual([1, 2, 3]);
    });
  });

  describe('Type narrowing', () => {
    it('DataScreenState narrows correctly', () => {
      const state: DataScreenState<string> = { type: ScreenStateType.content, data: 'hello' };
      if (state.type === ScreenStateType.content) {
        expect(state.data).toBe('hello');
      }
    });

    it('ListScreenState supports empty', () => {
      const state: ListScreenState<number> = { type: ScreenStateType.empty };
      expect(state.type).toBe(ScreenStateType.empty);
    });

    it('AsyncOpState models operation lifecycle', () => {
      let state: AsyncOpState = { type: ScreenStateType.idle };
      expect(state.type).toBe(ScreenStateType.idle);

      state = { type: ScreenStateType.running };
      expect(state.type).toBe(ScreenStateType.running);

      state = { type: ScreenStateType.failed, error: 'Timeout' };
      expect(state.type).toBe(ScreenStateType.failed);
    });

    it('FormLoadState models form loading', () => {
      let state: FormLoadState<{ name: string }> = { type: ScreenStateType.idle };
      expect(state.type).toBe(ScreenStateType.idle);

      state = { type: ScreenStateType.ready, data: { name: 'John' } };
      expect(state.type).toBe(ScreenStateType.ready);
    });

    it('FormSubmitState models form submission', () => {
      let state: FormSubmitState = { type: ScreenStateType.idle };
      expect(state.type).toBe(ScreenStateType.idle);

      state = { type: ScreenStateType.submitting };
      expect(state.type).toBe(ScreenStateType.submitting);

      state = { type: ScreenStateType.success };
      expect(state.type).toBe(ScreenStateType.success);

      state = { type: ScreenStateType.submitError, error: 'Validation failed' };
      expect(state.type).toBe(ScreenStateType.submitError);
    });
  });
});
