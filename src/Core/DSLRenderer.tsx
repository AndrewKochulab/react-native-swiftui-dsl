import React from 'react';
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  ScrollView,
  FlatList,
  SectionList,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Linking,
  RefreshControl,
  StyleSheet,
  Image as RNImage,
  Modal as RNModal,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDSLTheme } from '../Theme/DSLThemeContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let FontAwesomeComponent: React.ComponentType<any> | null = null;
try {
  FontAwesomeComponent = require('@expo/vector-icons/FontAwesome').default;
} catch {
  // @expo/vector-icons not installed — Icon and Button icon will render fallback text
}

/** @internal Test-only helper to override the icon component for testing fallback paths. */
export function _setIconComponent(component: React.ComponentType<unknown> | null): void {
  FontAwesomeComponent = component;
}
import { DSLThemeConfig, normalizeColors } from '../Theme/types';
import { DSLDefaults } from '../Config/Defaults';
import { ViewBuilder, DSLChild, isViewBuilder } from './ViewBuilder';
import {
  Modifier,
  resolveSpacing,
  resolveBorderRadius,
  resolveFontSize,
} from './Modifier';
import { ColorValue, resolveColor } from './ThemeResolver';

interface DSLRendererProps {
  builder: ViewBuilder;
}

type ColorResolver = (color: ColorValue) => string;

export function DSLRenderer({ builder }: DSLRendererProps): React.ReactElement {
  const { config, colorScheme } = useDSLTheme();
  const resolve: ColorResolver = (color) => resolveColor(color, colorScheme, config.colors);

  return renderBuilder(builder, resolve, config);
}

function renderBuilder(
  builder: ViewBuilder,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const { elementType, props, children, modifiers } = builder;
  const computed = computeStyles(modifiers, resolve, config);

  const resolvedChildren = resolveChildren(children, resolve, config);

  switch (elementType) {
    case 'text':
      return renderText(props, computed, resolve);

    case 'vstack':
      return renderContainer('column', resolvedChildren, computed);

    case 'hstack':
      return renderContainer('row', resolvedChildren, computed);

    case 'zstack':
      return renderZStack(resolvedChildren, computed);

    case 'icon':
      return renderIcon(props, computed, resolve);

    case 'safearea':
      return renderSafeArea(resolvedChildren, computed);

    case 'scroll':
      return renderScroll(resolvedChildren, computed, resolve);

    case 'textinput':
      return renderTextInput(props, computed, resolve, config);

    case 'spinner':
      return renderSpinner(props, computed, resolve);

    case 'lazylist':
      return renderLazyList(props, computed, resolve, config);

    case 'image':
      return renderImage(props, computed);

    case 'toggle':
      return renderToggle(props, computed, resolve);

    case 'button':
      return renderButton(props, computed, resolve, config);

    case 'divider':
      return renderDivider(computed, resolve);

    case 'link':
      return renderLink(props, computed, resolve, config);

    case 'sectionlist':
      return renderSectionList(props, computed, resolve, config);

    case 'modal':
      return renderModal(props, resolvedChildren, computed);

    case 'progressbar':
      return renderProgressBar(props, computed, resolve);

    case 'spacer':
      return React.createElement(View, {
        style: { flex: 1, ...computed.viewStyle },
      });

    case 'raw':
      if (Object.keys(computed.viewStyle).length > 0 || computed.onTap || computed.onLongPress) {
        return wrapWithInteraction(
          React.createElement(View, { style: computed.viewStyle }, props.rawElement),
          computed,
        );
      }
      return props.rawElement!;

    case 'fragment':
      return React.createElement(React.Fragment, null, ...resolvedChildren);

    default:
      return React.createElement(
        View,
        { style: computed.viewStyle, testID: computed.testID },
        ...resolvedChildren,
      );
  }
}

// --- Render functions ---

function renderText(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const textColor = computed.textStyle.color ?? resolve('text');
  const mergedStyle: TextStyle = {
    ...computed.viewStyle as TextStyle,
    ...computed.textStyle,
    color: textColor,
  };

  const textProps: Record<string, unknown> = { style: mergedStyle };
  if (computed.lineLimit !== undefined) {
    textProps.numberOfLines = computed.lineLimit;
  }
  if (computed.testID) textProps.testID = computed.testID;
  if (computed.accessibilityLabel) textProps.accessibilityLabel = computed.accessibilityLabel;
  if (computed.accessibilityRole) textProps.accessibilityRole = computed.accessibilityRole;
  if (computed.accessibilityHint) textProps.accessibilityHint = computed.accessibilityHint;

  const element = React.createElement(RNText, textProps, props.text);
  return wrapWithInteraction(element, computed);
}

function renderContainer(
  direction: 'column' | 'row',
  children: React.ReactNode[],
  computed: ComputedStyles,
): React.ReactElement {
  const style: ViewStyle = {
    flexDirection: direction,
    ...computed.viewStyle,
  };

  if (computed.gap !== undefined) {
    style.gap = computed.gap;
  }

  const containerProps: Record<string, unknown> = { style };
  if (computed.testID) containerProps.testID = computed.testID;
  if (computed.accessibilityLabel) containerProps.accessibilityLabel = computed.accessibilityLabel;
  if (computed.accessibilityRole) containerProps.accessibilityRole = computed.accessibilityRole;
  if (computed.accessibilityHint) containerProps.accessibilityHint = computed.accessibilityHint;

  const element = React.createElement(View, containerProps, ...children);
  return wrapWithInteraction(element, computed);
}

function renderZStack(
  children: React.ReactNode[],
  computed: ComputedStyles,
): React.ReactElement {
  const style: ViewStyle = {
    ...computed.viewStyle,
  };

  const element = React.createElement(View, { style, testID: computed.testID }, ...children);
  return wrapWithInteraction(element, computed);
}

function renderSafeArea(
  children: React.ReactNode[],
  computed: ComputedStyles,
): React.ReactElement {
  const safeProps: Record<string, unknown> = {
    style: computed.viewStyle,
  };
  if (computed.safeAreaEdges) {
    safeProps.edges = computed.safeAreaEdges;
  }
  if (computed.testID) safeProps.testID = computed.testID;

  return React.createElement(SafeAreaView, safeProps, ...children);
}

function renderScroll(
  children: React.ReactNode[],
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const scrollProps: Record<string, unknown> = {
    style: computed.viewStyle,
  };
  if (computed.hideScrollIndicator) {
    scrollProps.showsVerticalScrollIndicator = false;
    scrollProps.showsHorizontalScrollIndicator = false;
  }
  if (computed.contentPadding && Object.keys(computed.contentPadding).length > 0) {
    scrollProps.contentContainerStyle = computed.contentPadding;
  }
  if (computed.scrollDirection === 'horizontal') {
    scrollProps.horizontal = true;
  }
  if (computed.keyboardPersistTaps) {
    scrollProps.keyboardShouldPersistTaps = computed.keyboardPersistTaps;
  }
  if (computed.bounces !== undefined) {
    scrollProps.bounces = computed.bounces;
  }
  if (computed.testID) scrollProps.testID = computed.testID;

  if (computed.refreshControlData) {
    scrollProps.refreshControl = React.createElement(RefreshControl, {
      refreshing: computed.refreshControlData.refreshing,
      onRefresh: computed.refreshControlData.onRefresh,
      tintColor: resolve('tint'),
    });
  }

  const scrollElement = React.createElement(ScrollView, scrollProps, ...children);

  if (computed.keyboardAvoiding !== undefined) {
    return React.createElement(
      KeyboardAvoidingView,
      {
        behavior: Platform.OS === 'ios' ? 'padding' : undefined,
        keyboardVerticalOffset: computed.keyboardAvoiding,
        style: { flex: 1 } as ViewStyle,
      },
      scrollElement,
    );
  }

  return scrollElement;
}

function renderTextInput(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const { binding } = props;
  if (!binding) {
    return React.createElement(View, null);
  }

  const textColor = resolve('text');
  const placeholderColor = resolve('secondaryText');
  const errorColor = resolve('error');
  const inputBg = resolve('inputBackground');

  const inputStyle: TextStyle = {
    fontSize: computed.textStyle.fontSize ?? config.fonts.size.body,
    fontWeight: computed.textStyle.fontWeight,
    color: textColor,
    backgroundColor: inputBg,
    borderRadius: computed.viewStyle.borderRadius ?? DSLDefaults.input.borderRadius,
    paddingHorizontal: DSLDefaults.input.paddingHorizontal,
    paddingVertical: DSLDefaults.input.paddingVertical,
    ...(computed.inputHeight ? { height: computed.inputHeight } : {}),
    ...(computed.multiline ? { textAlignVertical: 'top' as const, minHeight: computed.inputHeight ?? DSLDefaults.input.minHeight } : {}),
  };

  const inputProps: Record<string, unknown> = {
    value: binding.value,
    onChangeText: binding.update,
    style: inputStyle,
    placeholderTextColor: placeholderColor,
    testID: computed.testID,
  };

  if (computed.placeholder) inputProps.placeholder = computed.placeholder;
  if (computed.keyboardType) inputProps.keyboardType = computed.keyboardType;
  if (computed.multiline) {
    inputProps.multiline = true;
    if (computed.multilineLines) inputProps.numberOfLines = computed.multilineLines;
  }
  if (computed.secureEntry) inputProps.secureTextEntry = true;
  if (computed.autoCapitalize) inputProps.autoCapitalize = computed.autoCapitalize;
  if (computed.returnKeyType) inputProps.returnKeyType = computed.returnKeyType;
  if (computed.maxLength) inputProps.maxLength = computed.maxLength;
  if (computed.accessibilityLabel) inputProps.accessibilityLabel = computed.accessibilityLabel;

  const textInput = React.createElement(RNTextInput, inputProps);

  if (computed.inputLabel || computed.inputError) {
    const wrapperChildren: React.ReactElement[] = [];

    if (computed.inputLabel) {
      wrapperChildren.push(
        React.createElement(RNText, {
          key: 'label',
          style: {
            fontSize: config.fonts.size.caption,
            fontWeight: config.fonts.weight.semibold,
            color: textColor,
            marginBottom: DSLDefaults.input.labelMarginBottom,
          } as TextStyle,
        }, computed.inputLabel),
      );
    }

    wrapperChildren.push(
      React.cloneElement(textInput, { key: 'input' }),
    );

    if (computed.inputError) {
      wrapperChildren.push(
        React.createElement(RNText, {
          key: 'error',
          style: {
            fontSize: config.fonts.size.caption,
            color: errorColor,
            marginTop: DSLDefaults.input.errorMarginTop,
          } as TextStyle,
        }, computed.inputError),
      );
    }

    return React.createElement(
      View,
      { style: { marginBottom: DSLDefaults.input.wrapperMarginBottom, ...computed.viewStyle } as ViewStyle },
      ...wrapperChildren,
    );
  }

  if (Object.keys(computed.viewStyle).length > 0) {
    return React.createElement(View, { style: computed.viewStyle }, textInput);
  }

  return textInput;
}

function renderSpinner(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const color = resolve('tint');
  const spinner = React.createElement(ActivityIndicator, {
    size: props.spinnerSize ?? 'large',
    color,
    testID: computed.testID,
  });

  if (Object.keys(computed.viewStyle).length > 0) {
    return React.createElement(View, { style: computed.viewStyle }, spinner);
  }

  return spinner;
}

function renderLazyList(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const { listData, keyExtractor, renderItem, listHeader, stickyHeader } = props;

  if (!listData || !keyExtractor || !renderItem) {
    return React.createElement(View, null);
  }

  const flatListRenderItem = ({ item }: { item: unknown }) => {
    const builder = renderItem(item);
    return renderBuilder(builder, resolve, config);
  };

  const listProps: Record<string, unknown> = {
    data: listData,
    keyExtractor,
    renderItem: flatListRenderItem,
    style: computed.viewStyle,
  };

  if (computed.hideScrollIndicator) {
    listProps.showsVerticalScrollIndicator = false;
  }
  if (computed.contentPadding && Object.keys(computed.contentPadding).length > 0) {
    listProps.contentContainerStyle = computed.contentPadding;
  }
  if (computed.bounces !== undefined) {
    listProps.bounces = computed.bounces;
  }
  if (computed.testID) listProps.testID = computed.testID;

  if (listHeader) {
    const headerComponent = renderBuilder(listHeader, resolve, config);
    listProps.ListHeaderComponent = () => headerComponent;
    if (stickyHeader) {
      listProps.stickyHeaderIndices = [0];
    }
  }

  if (computed.refreshControlData) {
    listProps.refreshControl = React.createElement(RefreshControl, {
      refreshing: computed.refreshControlData.refreshing,
      onRefresh: computed.refreshControlData.onRefresh,
      tintColor: resolve('tint'),
    });
  }

  if (computed.onEndReachedData) {
    listProps.onEndReached = computed.onEndReachedData.handler;
    listProps.onEndReachedThreshold = computed.onEndReachedData.threshold ?? DSLDefaults.onEndReachedThreshold;
  }

  if (computed.separatorBuilder) {
    const SeparatorComponent = () => {
      const builder = computed.separatorBuilder!();
      return renderBuilder(builder as ViewBuilder, resolve, config);
    };
    listProps.ItemSeparatorComponent = SeparatorComponent;
  }

  if (computed.numColumns !== undefined) {
    listProps.numColumns = computed.numColumns;
  }

  if (computed.emptyComponentBuilder) {
    const EmptyComponent = () => {
      const builder = computed.emptyComponentBuilder!();
      return renderBuilder(builder as ViewBuilder, resolve, config);
    };
    listProps.ListEmptyComponent = EmptyComponent;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement(FlatList as any, listProps);
}

function renderIcon(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const color = props.iconColor ? resolve(props.iconColor) : resolve('tint');

  let iconElement: React.ReactElement;
  if (FontAwesomeComponent) {
    iconElement = React.createElement(FontAwesomeComponent, {
      name: props.iconName,
      size: props.iconSize ?? DSLDefaults.iconSize,
      color,
      testID: computed.testID,
    });
  } else {
    iconElement = React.createElement(RNText, {
      style: { fontSize: props.iconSize ?? DSLDefaults.iconSize, color } as TextStyle,
      testID: computed.testID,
    }, props.iconName);
  }

  if (Object.keys(computed.viewStyle).length > 0) {
    return wrapWithInteraction(
      React.createElement(View, { style: computed.viewStyle }, iconElement),
      computed,
    );
  }

  return wrapWithInteraction(iconElement, computed);
}

// --- New render functions ---

function renderImage(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
): React.ReactElement {
  const imageStyle: ImageStyle = {
    ...computed.viewStyle as ImageStyle,
  };

  const imageProps: Record<string, unknown> = {
    source: props.imageSource,
    style: imageStyle,
    resizeMode: props.resizeMode ?? DSLDefaults.imageResizeMode,
  };

  if (computed.testID) imageProps.testID = computed.testID;
  if (computed.accessibilityLabel ?? props.imageAlt) {
    imageProps.accessibilityLabel = computed.accessibilityLabel ?? props.imageAlt;
  }

  const element = React.createElement(RNImage, imageProps);
  return wrapWithInteraction(element, computed);
}

function renderToggle(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const { toggleBinding, toggleTrackColor, toggleThumbColor } = props;

  const switchProps: Record<string, unknown> = {
    value: toggleBinding?.value ?? false,
    onValueChange: toggleBinding?.update,
    disabled: computed.disabled,
  };

  if (toggleTrackColor) {
    const resolvedTrackColor = resolve(toggleTrackColor);
    switchProps.trackColor = { true: resolvedTrackColor, false: undefined };
  }

  if (toggleThumbColor) {
    switchProps.thumbColor = resolve(toggleThumbColor);
  }

  if (computed.testID) switchProps.testID = computed.testID;
  if (computed.accessibilityLabel) switchProps.accessibilityLabel = computed.accessibilityLabel;

  const element = React.createElement(Switch, switchProps);

  if (Object.keys(computed.viewStyle).length > 0) {
    return React.createElement(View, { style: computed.viewStyle }, element);
  }

  return element;
}

function renderButton(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const { buttonTitle, buttonAction, buttonStyle = 'filled', buttonIcon } = props;
  const tintColor = resolve('tint');

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: computed.viewStyle.height ?? DSLDefaults.buttonHeight,
    borderRadius: computed.viewStyle.borderRadius ?? DSLDefaults.buttonCornerRadius,
    paddingHorizontal: DSLDefaults.buttonPaddingHorizontal,
    ...computed.viewStyle,
  };

  let textColor: string;
  const customTextColor = computed.textStyle.color as string | undefined;

  switch (buttonStyle) {
    case 'filled':
      containerStyle.backgroundColor = containerStyle.backgroundColor ?? tintColor;
      textColor = customTextColor ?? resolve('buttonText');
      break;
    case 'outlined':
      containerStyle.borderWidth = containerStyle.borderWidth ?? DSLDefaults.buttonBorderWidth;
      containerStyle.borderColor = containerStyle.borderColor ?? tintColor;
      containerStyle.backgroundColor = containerStyle.backgroundColor ?? 'transparent';
      textColor = customTextColor ?? tintColor;
      break;
    case 'plain':
    default:
      containerStyle.backgroundColor = containerStyle.backgroundColor ?? 'transparent';
      textColor = customTextColor ?? tintColor;
      break;
  }

  const textStyleObj: TextStyle = {
    fontSize: computed.textStyle.fontSize ?? config.fonts.size[DSLDefaults.buttonFontSize],
    fontWeight: computed.textStyle.fontWeight ?? (config.fonts.weight.semibold as TextStyle['fontWeight']),
    color: textColor,
  };

  const children: React.ReactElement[] = [];

  if (buttonIcon) {
    if (FontAwesomeComponent) {
      children.push(
        React.createElement(FontAwesomeComponent, {
          key: 'icon',
          name: buttonIcon,
          size: DSLDefaults.iconSize,
          color: textColor,
          style: { marginRight: DSLDefaults.buttonIconSpacing } as TextStyle,
        }),
      );
    } else {
      children.push(
        React.createElement(RNText, {
          key: 'icon',
          style: { fontSize: DSLDefaults.iconSize, color: textColor, marginRight: DSLDefaults.buttonIconSpacing } as TextStyle,
        }, buttonIcon),
      );
    }
  }

  children.push(
    React.createElement(RNText, { key: 'text', style: textStyleObj }, buttonTitle),
  );

  return React.createElement(
    Pressable,
    {
      onPress: buttonAction,
      disabled: computed.disabled,
      testID: computed.testID,
      accessibilityLabel: computed.accessibilityLabel,
      accessibilityRole: 'button',
      style: ({ pressed }: { pressed: boolean }) => ({
        ...containerStyle,
        opacity: pressed ? DSLDefaults.pressedOpacity : DSLDefaults.fullOpacity,
      }),
    },
    ...children,
  );
}

function renderDivider(
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const color = computed.textStyle.color ?? resolve(DSLDefaults.dividerColor);

  const style: ViewStyle = {
    height: StyleSheet.hairlineWidth,
    backgroundColor: color,
    alignSelf: 'stretch' as const,
    ...computed.viewStyle,
  };

  return React.createElement(View, { style, testID: computed.testID });
}

function renderLink(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const linkColor = computed.textStyle.color ?? resolve(DSLDefaults.linkColor);

  const textStyleObj: TextStyle = {
    textDecorationLine: 'underline',
    fontSize: computed.textStyle.fontSize ?? config.fonts.size.body,
    ...computed.textStyle,
    color: linkColor,
  };

  const textElement = React.createElement(RNText, { style: textStyleObj }, props.text);

  return React.createElement(
    Pressable,
    {
      onPress: () => {
        if (props.linkURL) {
          Linking.openURL(props.linkURL);
        }
      },
      testID: computed.testID,
      accessibilityLabel: computed.accessibilityLabel,
      accessibilityRole: 'link',
      style: ({ pressed }: { pressed: boolean }) => ({
        ...computed.viewStyle,
        opacity: pressed ? DSLDefaults.pressedOpacity : DSLDefaults.fullOpacity,
      }),
    },
    textElement,
  );
}

function renderSectionList(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const { sectionListData, keyExtractor, sectionRenderItem, sectionRenderHeader } = props;

  if (!sectionListData || !keyExtractor || !sectionRenderItem) {
    return React.createElement(View, null);
  }

  const sectionListRenderItem = ({ item }: { item: unknown }) => {
    const builder = sectionRenderItem(item);
    return renderBuilder(builder, resolve, config);
  };

  const sectionListProps: Record<string, unknown> = {
    sections: sectionListData,
    keyExtractor,
    renderItem: sectionListRenderItem,
    style: computed.viewStyle,
  };

  if (sectionRenderHeader) {
    sectionListProps.renderSectionHeader = ({ section }: { section: { title: string } }) => {
      const builder = sectionRenderHeader(section.title);
      return renderBuilder(builder, resolve, config);
    };
  }

  if (computed.hideScrollIndicator) {
    sectionListProps.showsVerticalScrollIndicator = false;
  }
  if (computed.contentPadding && Object.keys(computed.contentPadding).length > 0) {
    sectionListProps.contentContainerStyle = computed.contentPadding;
  }
  if (computed.bounces !== undefined) {
    sectionListProps.bounces = computed.bounces;
  }
  if (computed.testID) sectionListProps.testID = computed.testID;

  if (computed.refreshControlData) {
    sectionListProps.refreshControl = React.createElement(RefreshControl, {
      refreshing: computed.refreshControlData.refreshing,
      onRefresh: computed.refreshControlData.onRefresh,
      tintColor: resolve('tint'),
    });
  }

  if (computed.separatorBuilder) {
    const SeparatorComponent = () => {
      const builder = computed.separatorBuilder!();
      return renderBuilder(builder as ViewBuilder, resolve, config);
    };
    sectionListProps.ItemSeparatorComponent = SeparatorComponent;
  }

  if (computed.emptyComponentBuilder) {
    const EmptyComponent = () => {
      const builder = computed.emptyComponentBuilder!();
      return renderBuilder(builder as ViewBuilder, resolve, config);
    };
    sectionListProps.ListEmptyComponent = EmptyComponent;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement(SectionList as any, sectionListProps);
}

function renderModal(
  props: ViewBuilder['props'],
  children: React.ReactNode[],
  computed: ComputedStyles,
): React.ReactElement {
  const { modalBinding, modalAnimationType, modalTransparent } = props;

  const modalProps: Record<string, unknown> = {
    visible: modalBinding?.value ?? false,
    animationType: modalAnimationType ?? 'slide',
    transparent: modalTransparent ?? false,
    onRequestClose: () => {
      if (computed.onDismiss) computed.onDismiss();
      modalBinding?.update(false);
    },
    testID: computed.testID,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    ...computed.viewStyle,
  };

  return React.createElement(
    RNModal,
    modalProps,
    React.createElement(View, { style: contentStyle }, ...children),
  );
}

function renderProgressBar(
  props: ViewBuilder['props'],
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const value = Math.max(0, Math.min(1, props.progressValue ?? 0));
  const trackColor = props.progressTrackColor ? resolve(props.progressTrackColor) : resolve('separator');
  const progressColor = props.progressColor ? resolve(props.progressColor) : resolve('tint');
  const height = computed.viewStyle.height ?? DSLDefaults.progressBarHeight;
  const borderRadius = computed.viewStyle.borderRadius ?? DSLDefaults.progressBarCornerRadius;

  const trackStyle: ViewStyle = {
    height,
    borderRadius,
    backgroundColor: trackColor,
    overflow: 'hidden',
    ...computed.viewStyle,
  };

  const fillStyle: ViewStyle = {
    width: `${value * 100}%` as unknown as number,
    height: '100%' as unknown as number,
    backgroundColor: progressColor,
    borderRadius,
  };

  return React.createElement(
    View,
    { style: trackStyle, testID: computed.testID, accessibilityRole: 'progressbar' },
    React.createElement(View, { style: fillStyle }),
  );
}

// --- Interaction wrapper ---

function wrapWithInteraction(
  element: React.ReactElement,
  computed: ComputedStyles,
): React.ReactElement {
  if (computed.onTap || computed.onLongPress) {
    const pressableStyle: ViewStyle = {};
    if (computed.viewStyle.flex !== undefined) {
      pressableStyle.flex = computed.viewStyle.flex;
    }
    return React.createElement(
      Pressable,
      {
        onPress: computed.onTap,
        onLongPress: computed.onLongPress,
        disabled: computed.disabled,
        accessibilityLabel: computed.accessibilityLabel,
        style: ({ pressed }: { pressed: boolean }) => ({
          ...pressableStyle,
          opacity: pressed ? DSLDefaults.pressedOpacity : DSLDefaults.fullOpacity,
        }),
      },
      element,
    );
  }
  return element;
}

// --- Children resolution ---

function resolveChildren(
  children: ReadonlyArray<DSLChild>,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactNode[] {
  return children
    .filter((c): c is Exclude<DSLChild, null | undefined | boolean> =>
      c != null && typeof c !== 'boolean')
    .map((child, index) => resolveChild(child, resolve, config, index));
}

function resolveChild(
  child: Exclude<DSLChild, null | undefined | boolean>,
  resolve: ColorResolver,
  config: DSLThemeConfig,
  _index: number,
): React.ReactNode {
  if (isViewBuilder(child)) {
    return renderBuilder(child, resolve, config);
  }
  if (typeof child === 'string' || typeof child === 'number') {
    return String(child);
  }
  return child;
}

// --- ComputedStyles interface ---

interface ComputedStyles {
  viewStyle: ViewStyle;
  textStyle: TextStyle;
  onTap?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
  testID?: string;
  lineLimit?: number;
  gap?: number;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  hideScrollIndicator?: boolean;
  contentPadding?: ViewStyle;
  scrollDirection?: 'horizontal';
  keyboardAvoiding?: number;
  keyboardPersistTaps?: 'always' | 'never' | 'handled';
  bounces?: boolean;
  // TextInput
  placeholder?: string;
  inputLabel?: string;
  inputError?: string;
  keyboardType?: string;
  multiline?: boolean;
  multilineLines?: number;
  secureEntry?: boolean;
  autoCapitalize?: string;
  returnKeyType?: string;
  maxLength?: number;
  inputHeight?: number;
  // List
  refreshControlData?: { onRefresh: () => void; refreshing: boolean };
  onEndReachedData?: { handler: () => void; threshold?: number };
  separatorBuilder?: () => unknown;
  numColumns?: number;
  emptyComponentBuilder?: () => unknown;
  // Modal
  onDismiss?: () => void;
}

// --- computeStyles ---

function computeStyles(
  modifiers: ReadonlyArray<Modifier>,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): ComputedStyles {
  const viewStyle: ViewStyle = {};
  const textStyle: TextStyle = {};
  let onTap: (() => void) | undefined;
  let onLongPress: (() => void) | undefined;
  let disabled: boolean | undefined;
  let accessibilityLabel: string | undefined;
  let accessibilityRole: string | undefined;
  let accessibilityHint: string | undefined;
  let testID: string | undefined;
  let lineLimit: number | undefined;
  let gap: number | undefined;
  let safeAreaEdges: ('top' | 'bottom' | 'left' | 'right')[] | undefined;
  let hideScrollIndicator: boolean | undefined;
  const contentPadding: ViewStyle = {};
  let scrollDirection: 'horizontal' | undefined;
  let keyboardAvoiding: number | undefined;
  let keyboardPersistTaps: 'always' | 'never' | 'handled' | undefined;
  let bounces: boolean | undefined;
  // TextInput
  let placeholder: string | undefined;
  let inputLabel: string | undefined;
  let inputError: string | undefined;
  let keyboardType: string | undefined;
  let multiline: boolean | undefined;
  let multilineLines: number | undefined;
  let secureEntry: boolean | undefined;
  let autoCapitalize: string | undefined;
  let returnKeyType: string | undefined;
  let maxLength: number | undefined;
  let inputHeight: number | undefined;
  // List
  let refreshControlData: { onRefresh: () => void; refreshing: boolean } | undefined;
  let onEndReachedData: { handler: () => void; threshold?: number } | undefined;
  let separatorBuilder: (() => unknown) | undefined;
  let numColumns: number | undefined;
  let emptyComponentBuilder: (() => unknown) | undefined;
  // Modal
  let onDismiss: (() => void) | undefined;

  for (const mod of modifiers) {
    switch (mod.type) {
      case 'padding': {
        const px = resolveSpacing(mod.value, config.layout);
        applyEdge(viewStyle, 'padding', mod.edge, px);
        break;
      }
      case 'margin': {
        const px = resolveSpacing(mod.value, config.layout);
        applyEdge(viewStyle, 'margin', mod.edge, px);
        break;
      }
      case 'background':
        viewStyle.backgroundColor = resolve(mod.color);
        break;
      case 'backgroundAlpha':
        viewStyle.backgroundColor = resolve(mod.color) + mod.alphaHex;
        break;
      case 'foregroundColor':
        textStyle.color = resolve(mod.color);
        break;
      case 'cornerRadius':
        viewStyle.borderRadius = resolveBorderRadius(mod.value, config.layout);
        break;
      case 'border':
        viewStyle.borderWidth = mod.width;
        viewStyle.borderColor = resolve(mod.color);
        break;
      case 'borderStyle':
        viewStyle.borderStyle = mod.value;
        break;
      case 'shadow':
        viewStyle.shadowColor = resolve(mod.color);
        viewStyle.shadowOffset = mod.offset;
        viewStyle.shadowOpacity = mod.opacity;
        viewStyle.shadowRadius = mod.radius;
        if (mod.elevation !== undefined) viewStyle.elevation = mod.elevation;
        break;
      case 'opacity':
        viewStyle.opacity = mod.value;
        break;
      case 'flex':
        viewStyle.flex = mod.value;
        break;
      case 'frame':
        if (mod.width !== undefined) viewStyle.width = mod.width;
        if (mod.height !== undefined) viewStyle.height = mod.height;
        if (mod.minWidth !== undefined) viewStyle.minWidth = mod.minWidth;
        if (mod.maxWidth !== undefined) viewStyle.maxWidth = mod.maxWidth;
        if (mod.minHeight !== undefined) viewStyle.minHeight = mod.minHeight;
        if (mod.maxHeight !== undefined) viewStyle.maxHeight = mod.maxHeight;
        if (mod.alignment === 'center') {
          viewStyle.alignItems = 'center';
          viewStyle.justifyContent = 'center';
        } else if (mod.alignment === 'leading') {
          viewStyle.alignItems = 'flex-start';
        } else if (mod.alignment === 'trailing') {
          viewStyle.alignItems = 'flex-end';
        }
        break;
      case 'spacing':
        gap = mod.value;
        break;
      case 'gap':
        gap = mod.value;
        break;
      case 'justifyContent': {
        const jcMap: Record<string, ViewStyle['justifyContent']> = {
          flexStart: 'flex-start',
          flexEnd: 'flex-end',
          center: 'center',
          spaceBetween: 'space-between',
          spaceAround: 'space-around',
          spaceEvenly: 'space-evenly',
        };
        viewStyle.justifyContent = jcMap[mod.value];
        break;
      }
      case 'alignItems': {
        const aiMap: Record<string, ViewStyle['alignItems']> = {
          flexStart: 'flex-start',
          flexEnd: 'flex-end',
          center: 'center',
          stretch: 'stretch',
          baseline: 'baseline',
        };
        viewStyle.alignItems = aiMap[mod.value];
        break;
      }
      case 'alignment': {
        const alignMap: Record<string, ViewStyle['alignItems']> = {
          center: 'center',
          leading: 'flex-start',
          trailing: 'flex-end',
          stretch: 'stretch',
        };
        viewStyle.alignItems = alignMap[mod.value];
        break;
      }
      case 'flexWrap':
        viewStyle.flexWrap = mod.value;
        break;
      case 'font':
        textStyle.fontSize = resolveFontSize(mod.size, config.fonts);
        break;
      case 'fontWeight': {
        const resolved = config.fonts.weight[mod.weight] ?? DSLDefaults.fontWeightFallbacks[mod.weight];
        if (resolved) {
          textStyle.fontWeight = resolved as TextStyle['fontWeight'];
        }
        break;
      }
      case 'textTransform':
        textStyle.textTransform = mod.value;
        break;
      case 'letterSpacing':
        textStyle.letterSpacing = mod.value;
        break;
      case 'lineHeight':
        textStyle.lineHeight = mod.value;
        break;
      case 'textAlign':
        textStyle.textAlign = mod.value;
        break;
      case 'lineLimit':
        lineLimit = mod.value;
        break;
      case 'onTap':
        onTap = mod.handler;
        break;
      case 'onLongPress':
        onLongPress = mod.handler;
        break;
      case 'disabled':
        disabled = mod.value;
        break;
      case 'accessibilityLabel':
        accessibilityLabel = mod.value;
        break;
      case 'accessibilityRole':
        accessibilityRole = mod.value;
        break;
      case 'accessibilityHint':
        accessibilityHint = mod.value;
        break;
      case 'testID':
        testID = mod.value;
        break;
      case 'safeAreaEdges':
        safeAreaEdges = mod.value;
        break;
      case 'hideScrollIndicator':
        hideScrollIndicator = mod.value;
        break;
      case 'scrollContentPadding': {
        const cpx = resolveSpacing(mod.value, config.layout);
        applyEdge(contentPadding, 'padding', mod.edge, cpx);
        break;
      }
      case 'scrollDirection':
        scrollDirection = mod.value;
        break;
      case 'keyboardAvoiding':
        keyboardAvoiding = mod.offset;
        break;
      case 'keyboardPersistTaps':
        keyboardPersistTaps = mod.value;
        break;
      case 'bounces':
        bounces = mod.value;
        break;
      // TextInput modifiers
      case 'placeholder':
        placeholder = mod.value;
        break;
      case 'inputLabel':
        inputLabel = mod.text;
        break;
      case 'inputError':
        inputError = mod.message;
        break;
      case 'keyboardType':
        keyboardType = mod.value;
        break;
      case 'multiline':
        multiline = true;
        multilineLines = mod.lines;
        break;
      case 'secureEntry':
        secureEntry = true;
        break;
      case 'autoCapitalize':
        autoCapitalize = mod.value;
        break;
      case 'returnKeyType':
        returnKeyType = mod.value;
        break;
      case 'maxLength':
        maxLength = mod.value;
        break;
      case 'inputHeight':
        inputHeight = mod.value;
        break;
      // New layout modifiers
      case 'position':
        viewStyle.position = mod.value;
        break;
      case 'positionEdges':
        if (mod.top !== undefined) viewStyle.top = mod.top;
        if (mod.left !== undefined) viewStyle.left = mod.left;
        if (mod.right !== undefined) viewStyle.right = mod.right;
        if (mod.bottom !== undefined) viewStyle.bottom = mod.bottom;
        break;
      case 'zIndex':
        viewStyle.zIndex = mod.value;
        break;
      case 'overflow':
        viewStyle.overflow = mod.value;
        break;
      case 'aspectRatio':
        viewStyle.aspectRatio = mod.value;
        break;
      case 'alignSelf': {
        const asMap: Record<string, ViewStyle['alignSelf']> = {
          auto: 'auto',
          flexStart: 'flex-start',
          flexEnd: 'flex-end',
          center: 'center',
          stretch: 'stretch',
          baseline: 'baseline',
        };
        viewStyle.alignSelf = asMap[mod.value];
        break;
      }
      case 'display':
        viewStyle.display = mod.value;
        break;
      case 'hidden':
        if (mod.value) {
          viewStyle.display = 'none';
        }
        break;
      // New text modifiers
      case 'textDecoration':
        textStyle.textDecorationLine = mod.value as TextStyle['textDecorationLine'];
        break;
      case 'fontStyle':
        textStyle.fontStyle = mod.value;
        break;
      case 'fontFamily':
        textStyle.fontFamily = mod.value;
        break;
      // List modifiers
      case 'refreshControl':
        refreshControlData = { onRefresh: mod.onRefresh, refreshing: mod.refreshing };
        break;
      case 'onEndReached':
        onEndReachedData = { handler: mod.handler, threshold: mod.threshold };
        break;
      case 'separator':
        separatorBuilder = mod.builder;
        break;
      case 'numColumns':
        numColumns = mod.value;
        break;
      case 'emptyComponent':
        emptyComponentBuilder = mod.builder;
        break;
      // Modal
      case 'onDismiss':
        onDismiss = mod.handler;
        break;
      // Screen navigation modifiers are handled by ViewBuilder.toElement()
      case 'screenTitle':
      case 'headerRight':
      case 'headerLeft':
        break;
    }
  }

  return {
    viewStyle, textStyle, onTap, onLongPress, disabled,
    accessibilityLabel, accessibilityRole, accessibilityHint, testID,
    lineLimit, gap, safeAreaEdges, hideScrollIndicator, contentPadding,
    scrollDirection, keyboardAvoiding, keyboardPersistTaps, bounces,
    placeholder, inputLabel, inputError, keyboardType, multiline,
    multilineLines, secureEntry, autoCapitalize, returnKeyType,
    maxLength, inputHeight,
    refreshControlData, onEndReachedData, separatorBuilder, numColumns, emptyComponentBuilder,
    onDismiss,
  };
}

// --- Helper ---

function applyEdge(
  style: ViewStyle,
  prefix: 'padding' | 'margin',
  edge: string,
  value: number,
): void {
  switch (edge) {
    case 'horizontal':
      (style as Record<string, unknown>)[`${prefix}Horizontal`] = value;
      break;
    case 'vertical':
      (style as Record<string, unknown>)[`${prefix}Vertical`] = value;
      break;
    case 'top':
      (style as Record<string, unknown>)[`${prefix}Top`] = value;
      break;
    case 'bottom':
      (style as Record<string, unknown>)[`${prefix}Bottom`] = value;
      break;
    case 'left':
      (style as Record<string, unknown>)[`${prefix}Left`] = value;
      break;
    case 'right':
      (style as Record<string, unknown>)[`${prefix}Right`] = value;
      break;
    default:
      (style as Record<string, unknown>)[prefix] = value;
  }
}
