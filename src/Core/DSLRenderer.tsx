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
import { useDSLTheme, type DSLThemeConfig } from '@theme';

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
import { DSLDefaults } from '@config';
import {
  Color, FlexDirection, Alignment as AlignmentToken, JustifyContent as JustifyContentToken,
  AlignItems as AlignItemsToken, AlignSelf as AlignSelfToken, Position as PositionToken,
  Overflow as OverflowConstant, ButtonVariant, AccessibilityRole, KeyboardPersistTaps,
  KeyboardBehavior, ModalAnimation, ScrollDirection as ScrollDirectionToken, SpinnerSize,
  DSLPlatform, Transition, AnimationType, SwipeDirection as SwipeDirectionToken, Edge, isString,
  isNumber, isBoolean, isNil, RNAlign, RNDisplay, RNColor, RNTextAlignVertical, RNPointerEvents,
  ApplyEdgePrefix, RNKey, ElementType, GestureType, ModifierType, type ApplyEdgePrefixToken,
  type EdgeToken, type KeyboardBehaviorToken, type KeyboardPersistTapsToken,
  type ScrollDirectionToken as ScrollDirType,
} from '@tokens';
import { DSLWarnings } from '@constants';
import { ViewBuilder, DSLChild, isViewBuilder } from './ViewBuilder';
import {
  Modifier,
  resolveSpacing,
  resolveBorderRadius,
  resolveFontSize,
} from './Modifier';
import { ColorValue, resolveColor } from './ThemeResolver';
import {
  useResponsiveContext, resolveResponsiveModifiers, type ResponsiveContext,
} from '@responsive';
import {
  AnimatedWrapper, TransitionWrapper, type ComputedAnimation, type ComputedTransition,
} from '@animation';
import type { GestureConfig } from '@gesture';
import { EnvironmentCtx } from './Environment';

type FlexDirectionStyle = ViewStyle['flexDirection'];
type JustifyContentStyle = ViewStyle['justifyContent'];
type AlignItemsStyle = ViewStyle['alignItems'];
type AlignSelfStyle = ViewStyle['alignSelf'];
type FontWeightStyle = TextStyle['fontWeight'];
type TextDecorationLineStyle = TextStyle['textDecorationLine'];
type TransformStyle = ViewStyle['transform'];
type DSLProps = ViewBuilder['props'];

interface DSLRendererProps {
  builder: ViewBuilder;
}

type ColorResolver = (color: ColorValue) => string;

export function DSLRenderer({ builder }: DSLRendererProps): React.ReactElement {
  const { config, colorScheme } = useDSLTheme();
  const responsiveCtx = useResponsiveContext();
  const resolve: ColorResolver = (color) => resolveColor(color, colorScheme, config.colors);

  return renderBuilder(builder, resolve, config, responsiveCtx);
}

function renderBuilder(
  builder: ViewBuilder,
  resolve: ColorResolver,
  config: DSLThemeConfig,
  responsiveCtx: ResponsiveContext | null,
): React.ReactElement {
  const { elementType, props, children, modifiers } = builder;

  // Resolve responsive modifiers before computing styles
  const resolvedModifiers = responsiveCtx
    ? resolveResponsiveModifiers(modifiers, responsiveCtx, config.responsive?.customBreakpoints)
    : modifiers;

  const computed = computeStyles(resolvedModifiers, resolve, config);

  const resolvedChildren = resolveChildren(children, resolve, config, responsiveCtx);

  let element: React.ReactElement;

  switch (elementType) {
    case ElementType.text:
      element = renderText(props, computed, resolve);
      break;

    case ElementType.vstack:
      element = renderContainer(FlexDirection.column, resolvedChildren, computed);
      break;

    case ElementType.hstack:
      element = renderContainer(FlexDirection.row, resolvedChildren, computed);
      break;

    case ElementType.zstack:
      element = renderZStack(resolvedChildren, computed);
      break;

    case ElementType.icon:
      element = renderIcon(props, computed, resolve);
      break;

    case ElementType.safearea:
      element = renderSafeArea(resolvedChildren, computed);
      break;

    case ElementType.scroll:
      element = renderScroll(resolvedChildren, computed, resolve);
      break;

    case ElementType.textinput:
      element = renderTextInput(props, computed, resolve, config);
      break;

    case ElementType.spinner:
      element = renderSpinner(props, computed, resolve);
      break;

    case ElementType.lazylist:
      element = renderLazyList(props, computed, resolve, config, responsiveCtx);
      break;

    case ElementType.image:
      element = renderImage(props, computed);
      break;

    case ElementType.toggle:
      element = renderToggle(props, computed, resolve);
      break;

    case ElementType.button:
      element = renderButton(props, computed, resolve, config);
      break;

    case ElementType.divider:
      element = renderDivider(computed, resolve);
      break;

    case ElementType.link:
      element = renderLink(props, computed, resolve, config);
      break;

    case ElementType.sectionlist:
      element = renderSectionList(props, computed, resolve, config, responsiveCtx);
      break;

    case ElementType.modal:
      element = renderModal(props, resolvedChildren, computed);
      break;

    case ElementType.progressbar:
      element = renderProgressBar(props, computed, resolve);
      break;

    case ElementType.spacer:
      element = React.createElement(View, {
        style: { flex: 1, ...computed.viewStyle },
      });
      break;

    case ElementType.raw:
      if (Object.keys(computed.viewStyle).length > 0 || computed.onTap || computed.onLongPress) {
        element = wrapWithInteraction(
          React.createElement(View, { style: computed.viewStyle }, props.rawElement),
          computed,
        );
      } else {
        element = props.rawElement!;
      }
      break;

    case ElementType.fragment:
      element = React.createElement(React.Fragment, null, ...resolvedChildren);
      break;

    default:
      element = React.createElement(
        View,
        { style: computed.viewStyle, testID: computed.testID },
        ...resolvedChildren,
      );
      break;
  }

  // Apply wrapping chain: interaction → overlay → gestures → animation → environment
  element = wrapWithOverlay(element, computed, resolve, config, responsiveCtx);
  element = wrapWithGestures(element, computed);
  element = wrapWithAnimation(element, computed);

  // Wrap with environment context if environment values are set
  if (computed.environmentValues && Object.keys(computed.environmentValues).length > 0) {
    element = React.createElement(
      EnvironmentCtx.Provider,
      { value: computed.environmentValues },
      element,
    );
  }

  return element;
}

// --- Render functions ---

function renderText(
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const textColor = computed.textStyle.color ?? resolve(Color.text);
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
  direction: string,
  children: React.ReactNode[],
  computed: ComputedStyles,
): React.ReactElement {
  const style: ViewStyle = {
    flexDirection: direction as FlexDirectionStyle,
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
  if (computed.scrollDirection === ScrollDirectionToken.horizontal) {
    scrollProps.horizontal = true;
  }
  // Always apply keyboardShouldPersistTaps — use modifier value or default
  scrollProps.keyboardShouldPersistTaps = computed.keyboardPersistTaps ?? DSLDefaults.keyboardShouldPersistTaps;
  if (computed.bounces !== undefined) {
    scrollProps.bounces = computed.bounces;
  }
  if (computed.testID) scrollProps.testID = computed.testID;

  if (computed.refreshControlData) {
    scrollProps.refreshControl = React.createElement(RefreshControl, {
      refreshing: computed.refreshControlData.refreshing,
      onRefresh: computed.refreshControlData.onRefresh,
      tintColor: resolve(Color.tint),
    });
  }

  const scrollElement = React.createElement(ScrollView, scrollProps, ...children);

  if (computed.keyboardAvoiding !== undefined) {
    return React.createElement(
      KeyboardAvoidingView,
      {
        behavior: computed.keyboardAvoidingBehavior ?? (Platform.OS === DSLPlatform.ios ? KeyboardBehavior.padding : undefined),
        keyboardVerticalOffset: computed.keyboardAvoiding,
        style: { flex: 1 } as ViewStyle,
      },
      scrollElement,
    );
  }

  return scrollElement;
}

function renderTextInput(
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const { binding } = props;
  if (!binding) {
    return React.createElement(View, null);
  }

  const textColor = resolve(Color.text);
  const placeholderColor = resolve(config.components?.input?.placeholderColor ?? DSLDefaults.input.placeholderColor);
  const errorColor = resolve(Color.error);
  const inputBg = resolve(Color.inputBackground);

  const inputStyle: TextStyle = {
    fontSize: computed.textStyle.fontSize ?? config.fonts.size.body,
    fontWeight: computed.textStyle.fontWeight,
    color: textColor,
    backgroundColor: inputBg,
    borderRadius: computed.viewStyle.borderRadius ?? DSLDefaults.input.borderRadius,
    paddingHorizontal: DSLDefaults.input.paddingHorizontal,
    paddingVertical: DSLDefaults.input.paddingVertical,
    ...(computed.inputHeight ? { height: computed.inputHeight } : {}),
    ...(computed.multiline ? { textAlignVertical: RNTextAlignVertical.top, minHeight: computed.inputHeight ?? DSLDefaults.input.minHeight } : {}),
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
  if (computed.inputRef) inputProps.ref = computed.inputRef;
  if (computed.onSubmitEditing) inputProps.onSubmitEditing = computed.onSubmitEditing;

  const textInput = React.createElement(RNTextInput, inputProps);

  if (computed.inputLabel || computed.inputError) {
    const wrapperChildren: React.ReactElement[] = [];

    if (computed.inputLabel) {
      wrapperChildren.push(
        React.createElement(RNText, {
          key: RNKey.label,
          style: {
            fontSize: config.fonts.size[config.components?.input?.labelFontSize ?? DSLDefaults.input.labelFontSize],
            fontWeight: (config.fonts.weight[config.components?.input?.labelFontWeight ?? DSLDefaults.input.labelFontWeight] ?? config.fonts.weight.semibold) as FontWeightStyle,
            color: textColor,
            marginBottom: config.components?.input?.labelMarginBottom ?? DSLDefaults.input.labelMarginBottom,
          } as TextStyle,
        }, computed.inputLabel),
      );
    }

    wrapperChildren.push(
      React.cloneElement(textInput, { key: RNKey.input }),
    );

    if (computed.inputError) {
      wrapperChildren.push(
        React.createElement(RNText, {
          key: RNKey.error,
          style: {
            fontSize: config.fonts.size[config.components?.input?.errorFontSize ?? DSLDefaults.input.errorFontSize],
            color: errorColor,
            marginTop: config.components?.input?.errorMarginTop ?? DSLDefaults.input.errorMarginTop,
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
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const color = resolve(Color.tint);
  const spinner = React.createElement(ActivityIndicator, {
    size: props.spinnerSize ?? SpinnerSize.large,
    color,
    testID: computed.testID,
  });

  if (Object.keys(computed.viewStyle).length > 0) {
    return React.createElement(View, { style: computed.viewStyle }, spinner);
  }

  return spinner;
}

function renderLazyList(
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
  responsiveCtx: ResponsiveContext | null,
): React.ReactElement {
  const { listData, keyExtractor, renderItem, listHeader, stickyHeader } = props;

  if (!listData || !keyExtractor || !renderItem) {
    return React.createElement(View, null);
  }

  const flatListRenderItem = ({ item }: { item: unknown }) => {
    const builder = renderItem(item);
    return renderBuilder(builder, resolve, config, responsiveCtx);
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
    const headerComponent = renderBuilder(listHeader, resolve, config, responsiveCtx);
    listProps.ListHeaderComponent = () => headerComponent;
    if (stickyHeader) {
      listProps.stickyHeaderIndices = [0];
    }
  }

  if (computed.refreshControlData) {
    listProps.refreshControl = React.createElement(RefreshControl, {
      refreshing: computed.refreshControlData.refreshing,
      onRefresh: computed.refreshControlData.onRefresh,
      tintColor: resolve(Color.tint),
    });
  }

  if (computed.onEndReachedData) {
    listProps.onEndReached = computed.onEndReachedData.handler;
    listProps.onEndReachedThreshold = computed.onEndReachedData.threshold ?? DSLDefaults.onEndReachedThreshold;
  }

  if (computed.separatorBuilder) {
    const separatorElement = renderBuilder(
      computed.separatorBuilder() as ViewBuilder, resolve, config, responsiveCtx,
    );
    listProps.ItemSeparatorComponent = () => separatorElement;
  }

  if (computed.numColumns !== undefined) {
    listProps.numColumns = computed.numColumns;
  }

  if (computed.emptyComponentBuilder) {
    const emptyElement = renderBuilder(
      computed.emptyComponentBuilder() as ViewBuilder, resolve, config, responsiveCtx,
    );
    listProps.ListEmptyComponent = () => emptyElement;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement(FlatList as any, listProps);
}

function renderIcon(
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const color = props.iconColor ? resolve(props.iconColor) : resolve(Color.tint);

  let iconElement: React.ReactElement;
  if (FontAwesomeComponent) {
    iconElement = React.createElement(FontAwesomeComponent, {
      name: props.iconName,
      size: props.iconSize ?? DSLDefaults.icon.defaultSize,
      color,
      testID: computed.testID,
    });
  } else {
    iconElement = React.createElement(RNText, {
      style: { fontSize: props.iconSize ?? DSLDefaults.icon.defaultSize, color } as TextStyle,
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
  props: DSLProps,
  computed: ComputedStyles,
): React.ReactElement {
  const imageStyle: ImageStyle = {
    ...computed.viewStyle as ImageStyle,
  };

  const imageProps: Record<string, unknown> = {
    source: props.imageSource,
    style: imageStyle,
    resizeMode: props.resizeMode ?? DSLDefaults.image.resizeMode,
  };

  if (computed.testID) imageProps.testID = computed.testID;
  if (computed.accessibilityLabel ?? props.imageAlt) {
    imageProps.accessibilityLabel = computed.accessibilityLabel ?? props.imageAlt;
  }

  const element = React.createElement(RNImage, imageProps);
  return wrapWithInteraction(element, computed);
}

function renderToggle(
  props: DSLProps,
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
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const { buttonTitle, buttonAction, buttonStyle = ButtonVariant.filled, buttonIcon } = props;
  const tintColor = resolve(Color.tint);

  const containerStyle: ViewStyle = {
    flexDirection: FlexDirection.row,
    alignItems: RNAlign.center,
    justifyContent: RNAlign.center,
    height: computed.viewStyle.height ?? DSLDefaults.button.height,
    borderRadius: computed.viewStyle.borderRadius ?? DSLDefaults.button.cornerRadius,
    paddingHorizontal: DSLDefaults.button.paddingHorizontal,
    ...computed.viewStyle,
  };

  let textColor: string;
  const customTextColor = computed.textStyle.color as string | undefined;

  switch (buttonStyle) {
    case ButtonVariant.filled:
      containerStyle.backgroundColor = containerStyle.backgroundColor ?? tintColor;
      textColor = customTextColor ?? resolve(Color.buttonText);
      break;
    case ButtonVariant.outlined:
      containerStyle.borderWidth = containerStyle.borderWidth ?? DSLDefaults.button.borderWidth;
      containerStyle.borderColor = containerStyle.borderColor ?? tintColor;
      containerStyle.backgroundColor = containerStyle.backgroundColor ?? RNColor.transparent;
      textColor = customTextColor ?? tintColor;
      break;
    case ButtonVariant.plain:
    default:
      containerStyle.backgroundColor = containerStyle.backgroundColor ?? RNColor.transparent;
      textColor = customTextColor ?? tintColor;
      break;
  }

  const textStyleObj: TextStyle = {
    fontSize: computed.textStyle.fontSize ?? config.fonts.size[DSLDefaults.button.fontSize],
    fontWeight: computed.textStyle.fontWeight ?? (config.fonts.weight[config.components?.button?.fontWeight ?? DSLDefaults.button.fontWeight] ?? config.fonts.weight.semibold) as FontWeightStyle,
    color: textColor,
  };

  const children: React.ReactElement[] = [];

  if (buttonIcon) {
    if (FontAwesomeComponent) {
      children.push(
        React.createElement(FontAwesomeComponent, {
          key: RNKey.icon,
          name: buttonIcon,
          size: DSLDefaults.icon.defaultSize,
          color: textColor,
          style: { marginEnd: DSLDefaults.button.iconSpacing } as TextStyle,
        }),
      );
    } else {
      children.push(
        React.createElement(RNText, {
          key: RNKey.icon,
          style: { fontSize: DSLDefaults.icon.defaultSize, color: textColor, marginEnd: DSLDefaults.button.iconSpacing } as TextStyle,
        }, buttonIcon),
      );
    }
  }

  children.push(
    React.createElement(RNText, { key: RNKey.text, style: textStyleObj }, buttonTitle),
  );

  return React.createElement(
    Pressable,
    {
      onPress: buttonAction,
      disabled: computed.disabled,
      testID: computed.testID,
      accessibilityLabel: computed.accessibilityLabel,
      accessibilityRole: AccessibilityRole.button,
      style: ({ pressed }: { pressed: boolean }) => ({
        ...containerStyle,
        opacity: pressed ? DSLDefaults.interaction.pressedOpacity : DSLDefaults.interaction.fullOpacity,
      }),
    },
    ...children,
  );
}

function renderDivider(
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const color = computed.textStyle.color ?? resolve(DSLDefaults.divider.color);

  const style: ViewStyle = {
    height: StyleSheet.hairlineWidth,
    backgroundColor: color,
    alignSelf: RNAlign.stretch,
    ...computed.viewStyle,
  };

  return React.createElement(View, { style, testID: computed.testID });
}

function renderLink(
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
): React.ReactElement {
  const linkColor = computed.textStyle.color ?? resolve(DSLDefaults.link.color);

  const textStyleObj: TextStyle = {
    textDecorationLine: (config.components?.link?.textDecoration ?? DSLDefaults.link.textDecoration) as TextDecorationLineStyle,
    fontSize: computed.textStyle.fontSize ?? config.fonts.size[config.components?.link?.fontSize ?? DSLDefaults.link.fontSize],
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
      accessibilityRole: AccessibilityRole.link,
      style: ({ pressed }: { pressed: boolean }) => ({
        ...computed.viewStyle,
        opacity: pressed ? DSLDefaults.interaction.pressedOpacity : DSLDefaults.interaction.fullOpacity,
      }),
    },
    textElement,
  );
}

function renderSectionList(
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
  responsiveCtx: ResponsiveContext | null,
): React.ReactElement {
  const { sectionListData, keyExtractor, sectionRenderItem, sectionRenderHeader } = props;

  if (!sectionListData || !keyExtractor || !sectionRenderItem) {
    return React.createElement(View, null);
  }

  const sectionListRenderItem = ({ item }: { item: unknown }) => {
    const builder = sectionRenderItem(item);
    return renderBuilder(builder, resolve, config, responsiveCtx);
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
      return renderBuilder(builder, resolve, config, responsiveCtx);
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
      tintColor: resolve(Color.tint),
    });
  }

  if (computed.separatorBuilder) {
    const separatorElement = renderBuilder(
      computed.separatorBuilder() as ViewBuilder, resolve, config, responsiveCtx,
    );
    sectionListProps.ItemSeparatorComponent = () => separatorElement;
  }

  if (computed.emptyComponentBuilder) {
    const emptyElement = renderBuilder(
      computed.emptyComponentBuilder() as ViewBuilder, resolve, config, responsiveCtx,
    );
    sectionListProps.ListEmptyComponent = () => emptyElement;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement(SectionList as any, sectionListProps);
}

function renderModal(
  props: DSLProps,
  children: React.ReactNode[],
  computed: ComputedStyles,
): React.ReactElement {
  const { modalBinding, modalAnimationType, modalTransparent } = props;

  const modalProps: Record<string, unknown> = {
    visible: modalBinding?.value ?? false,
    animationType: modalAnimationType ?? ModalAnimation.slide,
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
  props: DSLProps,
  computed: ComputedStyles,
  resolve: ColorResolver,
): React.ReactElement {
  const value = Math.max(0, Math.min(1, props.progressValue ?? 0));
  const trackColor = props.progressTrackColor ? resolve(props.progressTrackColor) : resolve(Color.separator);
  const progressColor = props.progressColor ? resolve(props.progressColor) : resolve(Color.tint);
  const height = computed.viewStyle.height ?? DSLDefaults.progressBar.height;
  const borderRadius = computed.viewStyle.borderRadius ?? DSLDefaults.progressBar.cornerRadius;

  const trackStyle: ViewStyle = {
    height,
    borderRadius,
    backgroundColor: trackColor,
    overflow: OverflowConstant.hidden,
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
    { style: trackStyle, testID: computed.testID, accessibilityRole: AccessibilityRole.progressbar },
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
          opacity: pressed ? DSLDefaults.interaction.pressedOpacity : DSLDefaults.interaction.fullOpacity,
        }),
      },
      element,
    );
  }
  return element;
}

// --- Overlay wrapper ---

function wrapWithOverlay(
  element: React.ReactElement,
  computed: ComputedStyles,
  resolve: ColorResolver,
  config: DSLThemeConfig,
  responsiveCtx: ResponsiveContext | null,
): React.ReactElement {
  if (!computed.overlayBuilder) return element;

  const overlayView = computed.overlayBuilder() as ViewBuilder;
  const overlayElement = renderBuilder(overlayView, resolve, config, responsiveCtx);

  return React.createElement(
    View,
    { style: { position: PositionToken.relative } },
    element,
    React.createElement(
      View,
      {
        style: {
          position: PositionToken.absolute,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: RNAlign.center,
          alignItems: RNAlign.center,
        },
        pointerEvents: RNPointerEvents.boxNone,
      },
      overlayElement,
    ),
  );
}

// --- Animation wrapper ---

function wrapWithAnimation(
  element: React.ReactElement,
  computed: ComputedStyles,
): React.ReactElement {
  if (computed.animationData) {
    return React.createElement(AnimatedWrapper, {
      animation: computed.animationData,
      children: element,
    });
  }
  if (computed.transitionData) {
    return React.createElement(TransitionWrapper, {
      transition: computed.transitionData,
      visible: true,
      children: element,
    });
  }
  return element;
}

// --- Gesture wrapper ---

function wrapWithGestures(
  element: React.ReactElement,
  computed: ComputedStyles,
): React.ReactElement {
  if (!computed.gestures || computed.gestures.length === 0) {
    return element;
  }

  // Try react-native-gesture-handler first
  try {
    const GestureHandler = require('react-native-gesture-handler');
    return wrapWithGestureHandler(element, computed.gestures, GestureHandler);
  } catch {
    // Fall back to PanResponder for swipe/pan only
    return wrapWithPanResponder(element, computed.gestures);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapWithGestureHandler(
  element: React.ReactElement,
  gestures: GestureConfig[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GH: any,
): React.ReactElement {
  const { Gesture, GestureDetector } = GH;
  const gestureObjects: unknown[] = [];

  for (const g of gestures) {
    switch (g.type) {
      case GestureType.swipe: {
        const pan = Gesture.Pan()
          .onEnd((event: { translationX: number; translationY: number; velocityX: number; velocityY: number }) => {
            const threshold = g.threshold ?? DSLDefaults.gesture.swipeThreshold;
            const velThreshold = g.velocityThreshold ?? DSLDefaults.gesture.swipeVelocityThreshold;

            switch (g.direction) {
              case SwipeDirectionToken.left:
                if (event.translationX < -threshold && Math.abs(event.velocityX) > velThreshold) g.handler();
                break;
              case SwipeDirectionToken.right:
                if (event.translationX > threshold && Math.abs(event.velocityX) > velThreshold) g.handler();
                break;
              case SwipeDirectionToken.up:
                if (event.translationY < -threshold && Math.abs(event.velocityY) > velThreshold) g.handler();
                break;
              case SwipeDirectionToken.down:
                if (event.translationY > threshold && Math.abs(event.velocityY) > velThreshold) g.handler();
                break;
            }
          });
        gestureObjects.push(pan);
        break;
      }
      case GestureType.pan: {
        let pan = Gesture.Pan();
        if (g.config?.minDistance !== undefined) pan = pan.minDistance(g.config.minDistance);
        if (g.config?.maxPointers !== undefined) pan = pan.maxPointers(g.config.maxPointers);
        if (g.config?.minPointers !== undefined) pan = pan.minPointers(g.config.minPointers);
        if (g.config?.enabled === false) pan = pan.enabled(false);

        if (g.onStart) {
          const startHandler = g.onStart;
          pan = pan.onStart((e: { translationX: number; translationY: number; absoluteX: number; absoluteY: number; velocityX: number; velocityY: number }) => {
            startHandler({ translation: { x: e.translationX, y: e.translationY }, velocity: { x: e.velocityX, y: e.velocityY }, position: { x: e.absoluteX, y: e.absoluteY } });
          });
        }
        pan = pan.onUpdate((e: { translationX: number; translationY: number; absoluteX: number; absoluteY: number; velocityX: number; velocityY: number }) => {
          g.onChanged({ translation: { x: e.translationX, y: e.translationY }, velocity: { x: e.velocityX, y: e.velocityY }, position: { x: e.absoluteX, y: e.absoluteY } });
        });
        if (g.onEnded) {
          const endHandler = g.onEnded;
          pan = pan.onEnd((e: { translationX: number; translationY: number; absoluteX: number; absoluteY: number; velocityX: number; velocityY: number }) => {
            endHandler({ translation: { x: e.translationX, y: e.translationY }, velocity: { x: e.velocityX, y: e.velocityY }, position: { x: e.absoluteX, y: e.absoluteY } });
          });
        }
        gestureObjects.push(pan);
        break;
      }
      case GestureType.pinch: {
        let pinch = Gesture.Pinch();
        if (g.config?.enabled === false) pinch = pinch.enabled(false);
        pinch = pinch.onUpdate((e: { scale: number; focalX: number; focalY: number; velocity: number }) => {
          g.onChanged({ scale: e.scale, focalPoint: { x: e.focalX, y: e.focalY }, velocity: e.velocity });
        });
        if (g.onEnded) {
          const endHandler = g.onEnded;
          pinch = pinch.onEnd((e: { scale: number; focalX: number; focalY: number; velocity: number }) => {
            endHandler({ scale: e.scale, focalPoint: { x: e.focalX, y: e.focalY }, velocity: e.velocity });
          });
        }
        gestureObjects.push(pinch);
        break;
      }
      case GestureType.rotation: {
        let rotation = Gesture.Rotation();
        if (g.config?.enabled === false) rotation = rotation.enabled(false);
        rotation = rotation.onUpdate((e: { rotation: number; anchorX: number; anchorY: number; velocity: number }) => {
          g.onChanged({ rotation: e.rotation, velocity: e.velocity, anchor: { x: e.anchorX, y: e.anchorY } });
        });
        if (g.onEnded) {
          const endHandler = g.onEnded;
          rotation = rotation.onEnd((e: { rotation: number; anchorX: number; anchorY: number; velocity: number }) => {
            endHandler({ rotation: e.rotation, velocity: e.velocity, anchor: { x: e.anchorX, y: e.anchorY } });
          });
        }
        gestureObjects.push(rotation);
        break;
      }
    }
  }

  if (gestureObjects.length === 0) return element;

  // Compose multiple gestures simultaneously
  const composed = gestureObjects.length === 1
    ? gestureObjects[0]
    : Gesture.Simultaneous(...gestureObjects);

  return React.createElement(GestureDetector, { gesture: composed }, element);
}

function wrapWithPanResponder(
  element: React.ReactElement,
  gestures: GestureConfig[],
): React.ReactElement {
  // PanResponder fallback only supports swipe and pan gestures
  const supportedGestures = gestures.filter(g => g.type === GestureType.swipe || g.type === GestureType.pan);
  const unsupportedGestures = gestures.filter(g => g.type === GestureType.pinch || g.type === GestureType.rotation);

  if (unsupportedGestures.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      DSLWarnings.gestureHandlerRequired,
    );
  }

  if (supportedGestures.length === 0) return element;

  // For PanResponder fallback, we wrap with a View that has a PanResponder
  // The actual PanResponder setup happens in the GestureWrapper component
  const { GestureResponderView } = require('@/Gesture/GestureWrapper');
  return React.createElement(GestureResponderView, { gestures: supportedGestures }, element);
}

// --- Children resolution ---

function resolveChildren(
  children: ReadonlyArray<DSLChild>,
  resolve: ColorResolver,
  config: DSLThemeConfig,
  responsiveCtx: ResponsiveContext | null,
): React.ReactNode[] {
  return children
    .filter((c): c is Exclude<DSLChild, null | undefined | boolean> =>
      !isNil(c) && !isBoolean(c))
    .map((child, index) => resolveChild(child, resolve, config, responsiveCtx, index));
}

function resolveChild(
  child: Exclude<DSLChild, null | undefined | boolean>,
  resolve: ColorResolver,
  config: DSLThemeConfig,
  responsiveCtx: ResponsiveContext | null,
  _index: number,
): React.ReactNode {
  if (isViewBuilder(child)) {
    return renderBuilder(child, resolve, config, responsiveCtx);
  }
  if (isString(child) || isNumber(child)) {
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
  safeAreaEdges?: EdgeToken[];
  hideScrollIndicator?: boolean;
  contentPadding?: ViewStyle;
  scrollDirection?: ScrollDirType;
  keyboardAvoiding?: number;
  keyboardAvoidingBehavior?: KeyboardBehaviorToken;
  keyboardPersistTaps?: KeyboardPersistTapsToken;
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
  inputRef?: React.RefObject<unknown>;
  onSubmitEditing?: () => void;
  // List
  refreshControlData?: { onRefresh: () => void; refreshing: boolean };
  onEndReachedData?: { handler: () => void; threshold?: number };
  separatorBuilder?: () => unknown;
  numColumns?: number;
  emptyComponentBuilder?: () => unknown;
  // Modal
  onDismiss?: () => void;
  // Transform
  overlayBuilder?: () => unknown;
  // Animation
  animationData?: ComputedAnimation;
  transitionData?: ComputedTransition;
  // Gesture
  gestures?: GestureConfig[];
  // Environment
  environmentValues?: Record<string, unknown>;
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
  let safeAreaEdges: EdgeToken[] | undefined;
  let hideScrollIndicator: boolean | undefined;
  const contentPadding: ViewStyle = {};
  let scrollDirection: ScrollDirType | undefined;
  let keyboardAvoiding: number | undefined;
  let keyboardAvoidingBehavior: KeyboardBehaviorToken | undefined;
  let keyboardPersistTaps: KeyboardPersistTapsToken | undefined;
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
  let inputRef: React.RefObject<unknown> | undefined;
  let onSubmitEditing: (() => void) | undefined;
  // List
  let refreshControlData: { onRefresh: () => void; refreshing: boolean } | undefined;
  let onEndReachedData: { handler: () => void; threshold?: number } | undefined;
  let separatorBuilder: (() => unknown) | undefined;
  let numColumns: number | undefined;
  let emptyComponentBuilder: (() => unknown) | undefined;
  // Modal
  let onDismiss: (() => void) | undefined;
  // Transform
  let overlayBuilder: (() => unknown) | undefined;
  // Animation
  let animationData: ComputedAnimation | undefined;
  let transitionData: ComputedTransition | undefined;
  // Gesture
  let gestures: GestureConfig[] | undefined;
  // Environment
  let environmentValues: Record<string, unknown> | undefined;

  for (const mod of modifiers) {
    switch (mod.type) {
      case ModifierType.padding: {
        const px = resolveSpacing(mod.value, config.layout);
        applyEdge(viewStyle, ApplyEdgePrefix.padding, mod.edge, px);
        break;
      }
      case ModifierType.margin: {
        const px = resolveSpacing(mod.value, config.layout);
        applyEdge(viewStyle, ApplyEdgePrefix.margin, mod.edge, px);
        break;
      }
      case ModifierType.background:
        viewStyle.backgroundColor = resolve(mod.color);
        break;
      case ModifierType.backgroundAlpha:
        viewStyle.backgroundColor = resolve(mod.color) + mod.alphaHex;
        break;
      case ModifierType.foregroundColor:
        textStyle.color = resolve(mod.color);
        break;
      case ModifierType.cornerRadius:
        viewStyle.borderRadius = resolveBorderRadius(mod.value, config.layout);
        break;
      case ModifierType.border:
        viewStyle.borderWidth = mod.width;
        viewStyle.borderColor = resolve(mod.color);
        break;
      case ModifierType.borderStyle:
        viewStyle.borderStyle = mod.value;
        break;
      case ModifierType.shadow:
        viewStyle.shadowColor = resolve(mod.color);
        viewStyle.shadowOffset = mod.offset;
        viewStyle.shadowOpacity = mod.opacity;
        viewStyle.shadowRadius = mod.radius;
        if (mod.elevation !== undefined) viewStyle.elevation = mod.elevation;
        break;
      case ModifierType.opacity:
        viewStyle.opacity = mod.value;
        break;
      case ModifierType.flex:
        viewStyle.flex = mod.value;
        break;
      case ModifierType.frame:
        if (mod.width !== undefined) viewStyle.width = mod.width;
        if (mod.height !== undefined) viewStyle.height = mod.height;
        if (mod.minWidth !== undefined) viewStyle.minWidth = mod.minWidth;
        if (mod.maxWidth !== undefined) viewStyle.maxWidth = mod.maxWidth;
        if (mod.minHeight !== undefined) viewStyle.minHeight = mod.minHeight;
        if (mod.maxHeight !== undefined) viewStyle.maxHeight = mod.maxHeight;
        if (mod.alignment === AlignmentToken.center) {
          viewStyle.alignItems = RNAlign.center;
          viewStyle.justifyContent = RNAlign.center;
        } else if (mod.alignment === AlignmentToken.leading) {
          viewStyle.alignItems = RNAlign.flexStart;
        } else if (mod.alignment === AlignmentToken.trailing) {
          viewStyle.alignItems = RNAlign.flexEnd;
        }
        break;
      case ModifierType.spacing:
        gap = mod.value;
        break;
      case ModifierType.gap:
        gap = mod.value;
        break;
      case ModifierType.justifyContent: {
        const jcMap: Record<string, JustifyContentStyle> = {
          [JustifyContentToken.flexStart]: RNAlign.flexStart,
          [JustifyContentToken.flexEnd]: RNAlign.flexEnd,
          [JustifyContentToken.center]: RNAlign.center,
          [JustifyContentToken.spaceBetween]: RNAlign.spaceBetween,
          [JustifyContentToken.spaceAround]: RNAlign.spaceAround,
          [JustifyContentToken.spaceEvenly]: RNAlign.spaceEvenly,
        };
        viewStyle.justifyContent = jcMap[mod.value];
        break;
      }
      case ModifierType.alignItems: {
        const aiMap: Record<string, AlignItemsStyle> = {
          [AlignItemsToken.flexStart]: RNAlign.flexStart,
          [AlignItemsToken.flexEnd]: RNAlign.flexEnd,
          [AlignItemsToken.center]: RNAlign.center,
          [AlignItemsToken.stretch]: RNAlign.stretch,
          [AlignItemsToken.baseline]: RNAlign.baseline,
        };
        viewStyle.alignItems = aiMap[mod.value];
        break;
      }
      case ModifierType.alignment: {
        const alignMap: Record<string, AlignItemsStyle> = {
          [AlignmentToken.center]: RNAlign.center,
          [AlignmentToken.leading]: RNAlign.flexStart,
          [AlignmentToken.trailing]: RNAlign.flexEnd,
          [AlignmentToken.stretch]: RNAlign.stretch,
        };
        viewStyle.alignItems = alignMap[mod.value];
        break;
      }
      case ModifierType.flexWrap:
        viewStyle.flexWrap = mod.value;
        break;
      case ModifierType.font:
        textStyle.fontSize = resolveFontSize(mod.size, config.fonts);
        break;
      case ModifierType.fontWeight: {
        const resolved = config.fonts.weight[mod.weight] ?? DSLDefaults.fontWeightFallbacks[mod.weight];
        if (resolved) {
          textStyle.fontWeight = resolved as FontWeightStyle;
        }
        break;
      }
      case ModifierType.textTransform:
        textStyle.textTransform = mod.value;
        break;
      case ModifierType.letterSpacing:
        textStyle.letterSpacing = mod.value;
        break;
      case ModifierType.lineHeight:
        textStyle.lineHeight = mod.value;
        break;
      case ModifierType.textAlign:
        textStyle.textAlign = mod.value;
        break;
      case ModifierType.lineLimit:
        lineLimit = mod.value;
        break;
      case ModifierType.onTap:
        onTap = mod.handler;
        break;
      case ModifierType.onLongPress:
        onLongPress = mod.handler;
        break;
      case ModifierType.disabled:
        disabled = mod.value;
        break;
      case ModifierType.accessibilityLabel:
        accessibilityLabel = mod.value;
        break;
      case ModifierType.accessibilityRole:
        accessibilityRole = mod.value;
        break;
      case ModifierType.accessibilityHint:
        accessibilityHint = mod.value;
        break;
      case ModifierType.testID:
        testID = mod.value;
        break;
      case ModifierType.safeAreaEdges:
        safeAreaEdges = mod.value;
        break;
      case ModifierType.hideScrollIndicator:
        hideScrollIndicator = mod.value;
        break;
      case ModifierType.scrollContentPadding: {
        const cpx = resolveSpacing(mod.value, config.layout);
        applyEdge(contentPadding, ApplyEdgePrefix.padding, mod.edge, cpx);
        break;
      }
      case ModifierType.scrollDirection:
        scrollDirection = mod.value;
        break;
      case ModifierType.keyboardAvoiding:
        keyboardAvoiding = mod.offset;
        keyboardAvoidingBehavior = mod.behavior;
        break;
      case ModifierType.keyboardPersistTaps:
        keyboardPersistTaps = mod.value;
        break;
      case ModifierType.bounces:
        bounces = mod.value;
        break;
      // TextInput modifiers
      case ModifierType.placeholder:
        placeholder = mod.value;
        break;
      case ModifierType.inputLabel:
        inputLabel = mod.text;
        break;
      case ModifierType.inputError:
        inputError = mod.message;
        break;
      case ModifierType.keyboardType:
        keyboardType = mod.value;
        break;
      case ModifierType.multiline:
        multiline = true;
        multilineLines = mod.lines;
        break;
      case ModifierType.secureEntry:
        secureEntry = true;
        break;
      case ModifierType.autoCapitalize:
        autoCapitalize = mod.value;
        break;
      case ModifierType.returnKeyType:
        returnKeyType = mod.value;
        break;
      case ModifierType.maxLength:
        maxLength = mod.value;
        break;
      case ModifierType.inputHeight:
        inputHeight = mod.value;
        break;
      case ModifierType.inputRef:
        inputRef = mod.ref;
        break;
      case ModifierType.onSubmitEditing:
        onSubmitEditing = mod.handler;
        break;
      // New layout modifiers
      case ModifierType.position:
        viewStyle.position = mod.value;
        break;
      case ModifierType.positionEdges:
        if (mod.top !== undefined) viewStyle.top = mod.top;
        if (mod.left !== undefined) viewStyle.left = mod.left;
        if (mod.right !== undefined) viewStyle.right = mod.right;
        if (mod.bottom !== undefined) viewStyle.bottom = mod.bottom;
        break;
      case ModifierType.zIndex:
        viewStyle.zIndex = mod.value;
        break;
      case ModifierType.overflow:
        viewStyle.overflow = mod.value;
        break;
      case ModifierType.aspectRatio:
        viewStyle.aspectRatio = mod.value;
        break;
      case ModifierType.alignSelf: {
        const asMap: Record<string, AlignSelfStyle> = {
          [AlignSelfToken.auto]: RNAlign.auto,
          [AlignSelfToken.flexStart]: RNAlign.flexStart,
          [AlignSelfToken.flexEnd]: RNAlign.flexEnd,
          [AlignSelfToken.center]: RNAlign.center,
          [AlignSelfToken.stretch]: RNAlign.stretch,
          [AlignSelfToken.baseline]: RNAlign.baseline,
        };
        viewStyle.alignSelf = asMap[mod.value];
        break;
      }
      case ModifierType.display:
        viewStyle.display = mod.value;
        break;
      case ModifierType.hidden:
        if (mod.value) {
          viewStyle.display = RNDisplay.none;
        }
        break;
      // New text modifiers
      case ModifierType.textDecoration:
        textStyle.textDecorationLine = mod.value as TextDecorationLineStyle;
        break;
      case ModifierType.fontStyle:
        textStyle.fontStyle = mod.value;
        break;
      case ModifierType.fontFamily:
        textStyle.fontFamily = mod.value;
        break;
      // List modifiers
      case ModifierType.refreshControl:
        refreshControlData = { onRefresh: mod.onRefresh, refreshing: mod.refreshing };
        break;
      case ModifierType.onEndReached:
        onEndReachedData = { handler: mod.handler, threshold: mod.threshold };
        break;
      case ModifierType.separator:
        separatorBuilder = mod.builder;
        break;
      case ModifierType.numColumns:
        numColumns = mod.value;
        break;
      case ModifierType.emptyComponent:
        emptyComponentBuilder = mod.builder;
        break;
      // Modal
      case ModifierType.onDismiss:
        onDismiss = mod.handler;
        break;
      // Screen navigation modifiers are handled by ViewBuilder.toElement()
      case ModifierType.screenTitle:
      case ModifierType.headerRight:
      case ModifierType.headerLeft:
        break;
      // Transform
      case ModifierType.offset: {
        const transforms = (viewStyle.transform as unknown[]) ?? [];
        transforms.push({ translateX: mod.x }, { translateY: mod.y });
        viewStyle.transform = transforms as TransformStyle;
        break;
      }
      case ModifierType.rotation: {
        const transforms = (viewStyle.transform as unknown[]) ?? [];
        transforms.push({ rotate: `${mod.degrees}deg` });
        viewStyle.transform = transforms as TransformStyle;
        break;
      }
      case ModifierType.scale: {
        const transforms = (viewStyle.transform as unknown[]) ?? [];
        transforms.push({ scaleX: mod.x }, { scaleY: mod.y });
        viewStyle.transform = transforms as TransformStyle;
        break;
      }
      case ModifierType.blur:
        // No-op: blur requires @react-native-community/blur
        // The warning is emitted in ViewBuilder.blur()
        break;
      case ModifierType.overlay:
        overlayBuilder = mod.builder;
        break;
      // Animation
      case ModifierType.animation:
        animationData = { config: mod.config, value: mod.value };
        break;
      case ModifierType.transition:
        transitionData = { enter: mod.enter, exit: mod.exit };
        break;
      // Gesture
      case ModifierType.onSwipe:
        gestures = gestures ?? [];
        gestures.push({
          type: GestureType.swipe,
          direction: mod.direction,
          handler: mod.handler,
          threshold: mod.threshold,
          velocityThreshold: mod.velocityThreshold,
        });
        break;
      case ModifierType.onPan:
        gestures = gestures ?? [];
        gestures.push({
          type: GestureType.pan,
          config: mod.config,
          onStart: mod.onStart,
          onChanged: mod.onChanged,
          onEnded: mod.onEnded,
        });
        break;
      case ModifierType.onPinch:
        gestures = gestures ?? [];
        gestures.push({
          type: GestureType.pinch,
          config: mod.config,
          onChanged: mod.onChanged,
          onEnded: mod.onEnded,
        });
        break;
      case ModifierType.onRotate:
        gestures = gestures ?? [];
        gestures.push({
          type: GestureType.rotation,
          config: mod.config,
          onChanged: mod.onChanged,
          onEnded: mod.onEnded,
        });
        break;
      case ModifierType.gesture:
        gestures = gestures ?? [];
        gestures.push(mod.config);
        break;
      // Environment
      case ModifierType.environment:
        environmentValues = environmentValues ?? {};
        environmentValues[mod.key] = mod.value;
        break;
      // Responsive/platform modifiers are resolved before computeStyles — skip here
      case ModifierType.responsive:
      case ModifierType.onCompact:
      case ModifierType.onRegular:
      case ModifierType.onLarge:
      case ModifierType.onIOS:
      case ModifierType.onAndroid:
        break;
    }
  }

  return {
    viewStyle, textStyle, onTap, onLongPress, disabled,
    accessibilityLabel, accessibilityRole, accessibilityHint, testID,
    lineLimit, gap, safeAreaEdges, hideScrollIndicator, contentPadding,
    scrollDirection, keyboardAvoiding, keyboardAvoidingBehavior, keyboardPersistTaps, bounces,
    placeholder, inputLabel, inputError, keyboardType, multiline,
    multilineLines, secureEntry, autoCapitalize, returnKeyType,
    maxLength, inputHeight, inputRef, onSubmitEditing,
    refreshControlData, onEndReachedData, separatorBuilder, numColumns, emptyComponentBuilder,
    onDismiss, overlayBuilder,
    animationData, transitionData, gestures, environmentValues,
  };
}

// --- Helper ---

function applyEdge(
  style: ViewStyle,
  prefix: ApplyEdgePrefixToken,
  edge: string,
  value: number,
): void {
  switch (edge) {
    case Edge.horizontal:
      (style as Record<string, unknown>)[`${prefix}Horizontal`] = value;
      break;
    case Edge.vertical:
      (style as Record<string, unknown>)[`${prefix}Vertical`] = value;
      break;
    case Edge.top:
      (style as Record<string, unknown>)[`${prefix}Top`] = value;
      break;
    case Edge.bottom:
      (style as Record<string, unknown>)[`${prefix}Bottom`] = value;
      break;
    case Edge.left:
      (style as Record<string, unknown>)[`${prefix}Left`] = value;
      break;
    case Edge.right:
      (style as Record<string, unknown>)[`${prefix}Right`] = value;
      break;
    default:
      (style as Record<string, unknown>)[prefix] = value;
  }
}
