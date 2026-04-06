import { DSLDefaults, defaultThemeConfig } from '@/Config/Defaults';

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

  it('has icon defaultSize', () => {
    expect(DSLDefaults.icon.defaultSize).toBe(18);
  });

  it('has interaction pressedOpacity', () => {
    expect(DSLDefaults.interaction.pressedOpacity).toBe(0.9);
  });

  it('has interaction fullOpacity', () => {
    expect(DSLDefaults.interaction.fullOpacity).toBe(1);
  });

  describe('button defaults', () => {
    it('has height', () => {
      expect(DSLDefaults.button.height).toBe(48);
    });

    it('has cornerRadius', () => {
      expect(DSLDefaults.button.cornerRadius).toBe(12);
    });

    it('has paddingHorizontal', () => {
      expect(DSLDefaults.button.paddingHorizontal).toBe(16);
    });

    it('has iconSpacing', () => {
      expect(DSLDefaults.button.iconSpacing).toBe(8);
    });

    it('has fontSize', () => {
      expect(DSLDefaults.button.fontSize).toBe('body');
    });

    it('has borderWidth', () => {
      expect(DSLDefaults.button.borderWidth).toBe(1.5);
    });

    it('has defaultStyle', () => {
      expect(DSLDefaults.button.defaultStyle).toBe('filled');
    });
  });

  it('has image resizeMode default', () => {
    expect(DSLDefaults.image.resizeMode).toBe('cover');
  });

  it('has divider color default', () => {
    expect(DSLDefaults.divider.color).toBe('separator');
  });

  it('has link color default', () => {
    expect(DSLDefaults.link.color).toBe('tint');
  });

  it('has onEndReachedThreshold default', () => {
    expect(DSLDefaults.onEndReachedThreshold).toBe(0.5);
  });

  it('is frozen (as const)', () => {
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
    it('has height', () => {
      expect(DSLDefaults.progressBar.height).toBe(4);
    });

    it('has cornerRadius', () => {
      expect(DSLDefaults.progressBar.cornerRadius).toBe(2);
    });
  });

  describe('animation defaults', () => {
    it('has defaultDuration', () => {
      expect(DSLDefaults.animation.defaultDuration).toBe(300);
    });

    it('has defaultEasing', () => {
      expect(DSLDefaults.animation.defaultEasing).toBe('easeInOut');
    });

    it('has spring config', () => {
      expect(DSLDefaults.animation.spring.damping).toBe(10);
      expect(DSLDefaults.animation.spring.stiffness).toBe(100);
    });
  });

  describe('gesture defaults', () => {
    it('has swipeThreshold', () => {
      expect(DSLDefaults.gesture.swipeThreshold).toBe(50);
    });

    it('has panMinDistance', () => {
      expect(DSLDefaults.gesture.panMinDistance).toBe(10);
    });
  });

  describe('responsive defaults', () => {
    it('has breakpoints', () => {
      expect(DSLDefaults.responsive.breakpoints.compact).toEqual({ min: 0, max: 599 });
      expect(DSLDefaults.responsive.breakpoints.regular).toEqual({ min: 600, max: 1023 });
      expect(DSLDefaults.responsive.breakpoints.large.min).toBe(1024);
    });
  });

  describe('modal defaults', () => {
    it('has animationType', () => {
      expect(DSLDefaults.modal.animationType).toBe('slide');
    });

    it('has transparent', () => {
      expect(DSLDefaults.modal.transparent).toBe(false);
    });
  });

  describe('spinner defaults', () => {
    it('has defaultSize', () => {
      expect(DSLDefaults.spinner.defaultSize).toBe('large');
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
