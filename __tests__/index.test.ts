describe('barrel export (src/index.ts)', () => {
  // Use require to force the barrel file to be instrumented by coverage
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const barrel = require('../src/index');

  it('exports theme utilities', () => {
    expect(barrel.DSLThemeProvider).toBeDefined();
    expect(barrel.useDSLTheme).toBeDefined();
    expect(barrel.normalizeColors).toBeDefined();
  });

  it('exports config', () => {
    expect(barrel.DSLDefaults).toBeDefined();
    expect(barrel.defaultThemeConfig).toBeDefined();
  });

  it('exports core', () => {
    expect(barrel.ViewBuilder).toBeDefined();
    expect(barrel.isViewBuilder).toBeDefined();
    expect(barrel.resolveColor).toBeDefined();
    expect(barrel.DSLRenderer).toBeDefined();
  });

  it('exports binding', () => {
    expect(barrel.createBinding).toBeDefined();
    expect(barrel.bindForm).toBeDefined();
  });

  it('exports all primitives', () => {
    expect(barrel.Text).toBeDefined();
    expect(barrel.VStack).toBeDefined();
    expect(barrel.HStack).toBeDefined();
    expect(barrel.ZStack).toBeDefined();
    expect(barrel.Icon).toBeDefined();
    expect(barrel.Spacer).toBeDefined();
    expect(barrel.Raw).toBeDefined();
    expect(barrel.SafeArea).toBeDefined();
    expect(barrel.ScrollStack).toBeDefined();
    expect(barrel.TextInput).toBeDefined();
    expect(barrel.Spinner).toBeDefined();
    expect(barrel.LazyList).toBeDefined();
    expect(barrel.Image).toBeDefined();
    expect(barrel.Toggle).toBeDefined();
    expect(barrel.Button).toBeDefined();
    expect(barrel.Divider).toBeDefined();
    expect(barrel.Link).toBeDefined();
    expect(barrel.SectionedList).toBeDefined();
    expect(barrel.Modal).toBeDefined();
    expect(barrel.ProgressBar).toBeDefined();
  });

  it('exports conditionals', () => {
    expect(barrel.If).toBeDefined();
    expect(barrel.ForEach).toBeDefined();
    expect(barrel.Group).toBeDefined();
  });
});
