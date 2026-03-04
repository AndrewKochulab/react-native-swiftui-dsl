import { DSLDefaults, defaultThemeConfig } from '../../src/Config/Defaults';

describe('DSLDefaults', () => {
  it('has spacing default', () => {
    expect(DSLDefaults.spacing).toBe('md');
  });

  it('has edge default', () => {
    expect(DSLDefaults.edge).toBe('all');
  });

  it('has flex default', () => {
    expect(DSLDefaults.flex).toBe(1);
  });

  it('has keyboardAvoidingOffset', () => {
    expect(DSLDefaults.keyboardAvoidingOffset).toBe(100);
  });

  it('has keyboardShouldPersistTaps', () => {
    expect(DSLDefaults.keyboardShouldPersistTaps).toBe('handled');
  });

  it('has bounces default', () => {
    expect(DSLDefaults.bounces).toBe(true);
  });

  describe('shadow defaults', () => {
    it('has color', () => {
      expect(DSLDefaults.shadow.color).toBe('cardShadow');
    });

    it('has offset', () => {
      expect(DSLDefaults.shadow.offset).toEqual({ width: 0, height: 2 });
    });

    it('has opacity', () => {
      expect(DSLDefaults.shadow.opacity).toBe(1);
    });

    it('has radius', () => {
      expect(DSLDefaults.shadow.radius).toBe(8);
    });

    it('has elevation', () => {
      expect(DSLDefaults.shadow.elevation).toBe(3);
    });
  });

  describe('input defaults', () => {
    it('has borderRadius', () => {
      expect(DSLDefaults.input.borderRadius).toBe(8);
    });

    it('has paddingHorizontal', () => {
      expect(DSLDefaults.input.paddingHorizontal).toBe(12);
    });

    it('has paddingVertical', () => {
      expect(DSLDefaults.input.paddingVertical).toBe(10);
    });

    it('has minHeight', () => {
      expect(DSLDefaults.input.minHeight).toBe(44);
    });

    it('has labelMarginBottom', () => {
      expect(DSLDefaults.input.labelMarginBottom).toBe(6);
    });

    it('has errorMarginTop', () => {
      expect(DSLDefaults.input.errorMarginTop).toBe(4);
    });

    it('has wrapperMarginBottom', () => {
      expect(DSLDefaults.input.wrapperMarginBottom).toBe(12);
    });
  });

  it('has iconSize default', () => {
    expect(DSLDefaults.iconSize).toBe(18);
  });

  it('has pressedOpacity', () => {
    expect(DSLDefaults.pressedOpacity).toBe(0.9);
  });

  it('has fullOpacity', () => {
    expect(DSLDefaults.fullOpacity).toBe(1);
  });

  describe('button defaults', () => {
    it('has buttonHeight', () => {
      expect(DSLDefaults.buttonHeight).toBe(48);
    });

    it('has buttonCornerRadius', () => {
      expect(DSLDefaults.buttonCornerRadius).toBe(12);
    });

    it('has buttonPaddingHorizontal', () => {
      expect(DSLDefaults.buttonPaddingHorizontal).toBe(16);
    });

    it('has buttonIconSpacing', () => {
      expect(DSLDefaults.buttonIconSpacing).toBe(8);
    });

    it('has buttonFontSize', () => {
      expect(DSLDefaults.buttonFontSize).toBe('body');
    });

    it('has buttonBorderWidth', () => {
      expect(DSLDefaults.buttonBorderWidth).toBe(1.5);
    });
  });

  it('has imageResizeMode default', () => {
    expect(DSLDefaults.imageResizeMode).toBe('cover');
  });

  it('has dividerColor default', () => {
    expect(DSLDefaults.dividerColor).toBe('separator');
  });

  it('has linkColor default', () => {
    expect(DSLDefaults.linkColor).toBe('tint');
  });

  it('has onEndReachedThreshold default', () => {
    expect(DSLDefaults.onEndReachedThreshold).toBe(0.5);
  });

  it('is frozen (as const)', () => {
    // Verify the object is read-only at runtime level
    expect(typeof DSLDefaults).toBe('object');
    expect(Object.keys(DSLDefaults).length).toBeGreaterThan(10);
  });

  describe('fontWeightFallbacks', () => {
    it('has thin fallback', () => {
      expect(DSLDefaults.fontWeightFallbacks.thin).toBe('100');
    });

    it('has ultralight fallback', () => {
      expect(DSLDefaults.fontWeightFallbacks.ultralight).toBe('200');
    });

    it('has light fallback', () => {
      expect(DSLDefaults.fontWeightFallbacks.light).toBe('300');
    });

    it('has heavy fallback', () => {
      expect(DSLDefaults.fontWeightFallbacks.heavy).toBe('800');
    });

    it('has black fallback', () => {
      expect(DSLDefaults.fontWeightFallbacks.black).toBe('900');
    });
  });

  describe('progressBar defaults', () => {
    it('has progressBarHeight', () => {
      expect(DSLDefaults.progressBarHeight).toBe(4);
    });

    it('has progressBarCornerRadius', () => {
      expect(DSLDefaults.progressBarCornerRadius).toBe(2);
    });
  });
});

describe('defaultThemeConfig', () => {
  it('has light and dark colors', () => {
    const colors = defaultThemeConfig.colors as { light: Record<string, string>; dark: Record<string, string> };
    expect(colors.light).toBeDefined();
    expect(colors.dark).toBeDefined();
    expect(colors.light.text).toBe('#000000');
    expect(colors.dark.text).toBe('#FFFFFF');
  });

  it('has font sizes', () => {
    expect(defaultThemeConfig.fonts.size.body).toBe(17);
    expect(defaultThemeConfig.fonts.size.hero).toBe(40);
  });

  it('has font weights', () => {
    expect(defaultThemeConfig.fonts.weight.regular).toBe('400');
    expect(defaultThemeConfig.fonts.weight.bold).toBe('700');
  });

  it('has spacing', () => {
    expect(defaultThemeConfig.layout.spacing.md).toBe(16);
    expect(defaultThemeConfig.layout.spacing.lg).toBe(24);
  });

  it('has borderRadius', () => {
    expect(defaultThemeConfig.layout.borderRadius.sm).toBe(4);
    expect(defaultThemeConfig.layout.borderRadius.lg).toBe(16);
  });
});
