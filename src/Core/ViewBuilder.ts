import React from 'react';
import {
  Modifier,
  PaddingEdge,
  SpacingToken,
  BorderRadiusToken,
  FontSizeToken,
  FontWeightToken,
} from './Modifier';
import { ColorValue } from './ThemeResolver';
import { Binding } from '@binding';
import { DSLDefaults } from '@config';
import { ViewModifier as ViewModifierClass, ViewModifierFn } from './ViewModifier';
import {
  Color, Edge, Font, Weight, ElementType, ElementTypeValue, ModifierType, TextDecoration,
  FontStyle as FontStyleToken, FlexWrap as FlexWrapToken, ScrollDirection, isObject, type EdgeToken,
  type ImageResizeToken, type SpinnerSizeToken, type ButtonVariantToken, type ModalAnimationToken,
  type TextAlignToken, type TextDecorationToken, type TextTransformToken,
  type FontStyleToken as FontStyleType, type BorderStyleToken, type PositionToken,
  type OverflowToken, type DisplayToken, type FlexWrapToken as FlexWrapType,
  type JustifyContentToken, type AlignItemsToken, type AlignSelfToken, type AlignmentToken,
  type FrameAlignmentToken, type AutoCapitalizeToken, type KeyboardBehaviorToken,
  type KeyboardPersistTapsToken,
} from '@tokens';
import { DSLWarnings } from '@constants';
import type { AnimationConfig, TransitionConfig } from '@animation';
import type {
  SwipeDirection, PanGestureState, PinchGestureState, RotationGestureState, PanGestureConfig,
  PinchGestureConfig, RotationGestureConfig, GestureConfig,
} from '@gesture';
import type { ResponsiveConfig, ResponsiveModifierFn } from '@responsive';

export const VIEW_BUILDER_SYMBOL = Symbol.for('DSL.ViewBuilder');

export type DSLElementType = ElementTypeValue;

export interface DSLElementProps {
  text?: string;
  iconName?: string;
  iconSize?: number;
  iconColor?: ColorValue;
  imageSource?: unknown;
  resizeMode?: ImageResizeToken;
  imageAlt?: string;
  rawElement?: React.ReactElement;
  // TextInput
  binding?: Binding<string>;
  // Spinner
  spinnerSize?: SpinnerSizeToken;
  // LazyList
  listData?: ReadonlyArray<unknown>;
  keyExtractor?: (item: unknown) => string;
  renderItem?: (item: unknown) => ViewBuilder;
  listHeader?: ViewBuilder;
  stickyHeader?: boolean;
  // Toggle
  toggleBinding?: Binding<boolean>;
  toggleTrackColor?: ColorValue;
  toggleThumbColor?: ColorValue;
  // Button
  buttonTitle?: string;
  buttonAction?: () => void;
  buttonStyle?: ButtonVariantToken;
  buttonIcon?: string;
  // Link
  linkURL?: string;
  // SectionList
  sectionListData?: ReadonlyArray<{ title: string; data: ReadonlyArray<unknown> }>;
  sectionRenderItem?: (item: unknown) => ViewBuilder;
  sectionRenderHeader?: (title: string) => ViewBuilder;
  // Modal
  modalBinding?: Binding<boolean>;
  modalAnimationType?: ModalAnimationToken;
  modalTransparent?: boolean;
  // ProgressBar
  progressValue?: number;
  progressTrackColor?: ColorValue;
  progressColor?: ColorValue;
}

export type DSLChild = ViewBuilder | React.ReactElement | string | number | null | undefined | boolean;

export class ViewBuilder {
  readonly [VIEW_BUILDER_SYMBOL] = true;

  readonly elementType: DSLElementType;
  readonly props: DSLElementProps;
  readonly children: DSLChild[];
  readonly modifiers: Modifier[];

  constructor(
    elementType: DSLElementType,
    props: DSLElementProps = {},
    children: DSLChild[] = [],
    modifiers: Modifier[] = [],
  ) {
    this.elementType = elementType;
    this.props = props;
    this.children = children;
    this.modifiers = modifiers;
  }

  private withModifier(modifier: Modifier): this {
    this.modifiers.push(modifier);
    return this;
  }

  // --- Padding ---

  padding(value?: number | SpacingToken, edge?: PaddingEdge): ViewBuilder {
    return this.withModifier({ type: ModifierType.padding, value: value ?? DSLDefaults.spacing, edge: edge ?? DSLDefaults.edge });
  }

  paddingHorizontal(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, Edge.horizontal);
  }

  paddingVertical(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, Edge.vertical);
  }

  paddingTop(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, Edge.top);
  }

  paddingBottom(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, Edge.bottom);
  }

  paddingLeft(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, Edge.left);
  }

  paddingRight(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, Edge.right);
  }

  // --- Margin ---

  margin(value?: number | SpacingToken, edge?: PaddingEdge): ViewBuilder {
    return this.withModifier({ type: ModifierType.margin, value: value ?? DSLDefaults.spacing, edge: edge ?? DSLDefaults.edge });
  }

  marginHorizontal(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, Edge.horizontal);
  }

  marginVertical(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, Edge.vertical);
  }

  marginBottom(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, Edge.bottom);
  }

  marginTop(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, Edge.top);
  }

  marginLeft(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, Edge.left);
  }

  marginRight(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, Edge.right);
  }

  // --- Layout ---

  flex(value: number = DSLDefaults.flex): ViewBuilder {
    return this.withModifier({ type: ModifierType.flex, value });
  }

  frame(options: {
    width?: number;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    alignment?: FrameAlignmentToken;
  }): ViewBuilder {
    return this.withModifier({ type: ModifierType.frame, ...options });
  }

  spacing(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.spacing, value });
  }

  gap(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.gap, value });
  }

  // --- Container Layout ---

  justifyContent(value: JustifyContentToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.justifyContent, value });
  }

  alignItems(value: AlignItemsToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.alignItems, value });
  }

  alignment(value: AlignmentToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.alignment, value });
  }

  flexWrap(value: FlexWrapType = FlexWrapToken.wrap): ViewBuilder {
    return this.withModifier({ type: ModifierType.flexWrap, value });
  }

  // --- Style ---

  background(color: ColorValue): ViewBuilder {
    return this.withModifier({ type: ModifierType.background, color });
  }

  backgroundAlpha(color: ColorValue, alpha: number): ViewBuilder {
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return this.withModifier({ type: ModifierType.backgroundAlpha, color, alphaHex });
  }

  foregroundColor(color: ColorValue): ViewBuilder {
    return this.withModifier({ type: ModifierType.foregroundColor, color });
  }

  cornerRadius(value: number | BorderRadiusToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.cornerRadius, value });
  }

  border(width: number, color: ColorValue): ViewBuilder {
    return this.withModifier({ type: ModifierType.border, width, color });
  }

  borderStyle(value: BorderStyleToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.borderStyle, value });
  }

  shadow(options?: {
    color?: ColorValue;
    offset?: { width: number; height: number };
    opacity?: number;
    radius?: number;
    elevation?: number;
  }): ViewBuilder {
    return this.withModifier({
      type: ModifierType.shadow,
      color: options?.color ?? DSLDefaults.shadow.color,
      offset: options?.offset ?? DSLDefaults.shadow.offset,
      opacity: options?.opacity ?? DSLDefaults.shadow.opacity,
      radius: options?.radius ?? DSLDefaults.shadow.radius,
      elevation: options?.elevation ?? DSLDefaults.shadow.elevation,
    });
  }

  opacity(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.opacity, value });
  }

  // --- Text ---

  font(size: FontSizeToken | number): ViewBuilder {
    return this.withModifier({ type: ModifierType.font, size });
  }

  fontWeight(weight: FontWeightToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.fontWeight, weight });
  }

  bold(): ViewBuilder {
    return this.fontWeight(Weight.bold);
  }

  semibold(): ViewBuilder {
    return this.fontWeight(Weight.semibold);
  }

  medium(): ViewBuilder {
    return this.fontWeight(Weight.medium);
  }

  light(): ViewBuilder {
    return this.fontWeight(Weight.light);
  }

  thin(): ViewBuilder {
    return this.fontWeight(Weight.thin);
  }

  heavy(): ViewBuilder {
    return this.fontWeight(Weight.heavy);
  }

  black(): ViewBuilder {
    return this.fontWeight(Weight.black);
  }

  caption(): ViewBuilder {
    return this.font(Font.caption);
  }

  secondary(): ViewBuilder {
    return this.foregroundColor(Color.secondaryText);
  }

  textTransform(value: TextTransformToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.textTransform, value });
  }

  letterSpacing(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.letterSpacing, value });
  }

  lineHeight(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.lineHeight, value });
  }

  textAlign(value: TextAlignToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.textAlign, value });
  }

  lineLimit(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.lineLimit, value });
  }

  // --- SafeArea ---

  edges(value: EdgeToken[]): ViewBuilder {
    return this.withModifier({ type: ModifierType.safeAreaEdges, value });
  }

  // --- Scroll ---

  hideScrollIndicator(): ViewBuilder {
    return this.withModifier({ type: ModifierType.hideScrollIndicator, value: true });
  }

  contentPadding(value?: number | SpacingToken, edge?: PaddingEdge): ViewBuilder {
    return this.withModifier({ type: ModifierType.scrollContentPadding, value: value ?? DSLDefaults.spacing, edge: edge ?? DSLDefaults.edge });
  }

  contentPaddingBottom(value?: number | SpacingToken): ViewBuilder {
    return this.contentPadding(value ?? DSLDefaults.spacing, Edge.bottom);
  }

  horizontal(): ViewBuilder {
    return this.withModifier({ type: ModifierType.scrollDirection, value: ScrollDirection.horizontal });
  }

  keyboardAvoiding(
    offset: number = DSLDefaults.keyboardAvoidingOffset,
    behavior?: KeyboardBehaviorToken,
  ): ViewBuilder {
    return this.withModifier({ type: ModifierType.keyboardAvoiding, offset, behavior });
  }

  keyboardShouldPersistTaps(value: KeyboardPersistTapsToken = DSLDefaults.keyboardShouldPersistTaps): ViewBuilder {
    return this.withModifier({ type: ModifierType.keyboardPersistTaps, value });
  }

  bounces(value: boolean = DSLDefaults.bounces): ViewBuilder {
    return this.withModifier({ type: ModifierType.bounces, value });
  }

  // --- TextInput ---

  placeholder(value: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.placeholder, value });
  }

  inputLabel(text: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.inputLabel, text });
  }

  inputError(message: string | undefined): ViewBuilder {
    return this.withModifier({ type: ModifierType.inputError, message });
  }

  keyboardType(value: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.keyboardType, value });
  }

  multiline(lines?: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.multiline, lines });
  }

  secureEntry(): ViewBuilder {
    return this.withModifier({ type: ModifierType.secureEntry });
  }

  autoCapitalize(value: AutoCapitalizeToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.autoCapitalize, value });
  }

  returnKeyType(value: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.returnKeyType, value });
  }

  maxLength(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.maxLength, value });
  }

  inputHeight(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.inputHeight, value });
  }

  /**
   * Attaches a ref to the TextInput for focus management.
   *
   * @example
   * ```ts
   * const emailRef = useRef(null);
   * const passwordRef = useRef(null);
   *
   * TextInput(emailBinding)
   *   .inputRef(emailRef)
   *   .returnKeyType('next')
   *   .onSubmitEditing(() => passwordRef.current?.focus())
   *
   * TextInput(passwordBinding)
   *   .inputRef(passwordRef)
   *   .returnKeyType('done')
   *   .onSubmitEditing(() => handleSubmit())
   * ```
   */
  inputRef(ref: React.RefObject<unknown>): ViewBuilder {
    return this.withModifier({ type: ModifierType.inputRef, ref });
  }

  /**
   * Called when the user presses the return key on the keyboard.
   * Use with .returnKeyType() for focus chain management.
   */
  onSubmitEditing(handler: () => void): ViewBuilder {
    return this.withModifier({ type: ModifierType.onSubmitEditing, handler });
  }

  // --- Screen Navigation ---

  screenTitle(title: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.screenTitle, value: title });
  }

  headerRight(component: () => React.ReactElement): ViewBuilder {
    return this.withModifier({ type: ModifierType.headerRight, component });
  }

  headerLeft(component: () => React.ReactElement): ViewBuilder {
    return this.withModifier({ type: ModifierType.headerLeft, component });
  }

  // --- Interaction ---

  onTap(handler: () => void): ViewBuilder {
    return this.withModifier({ type: ModifierType.onTap, handler });
  }

  disabled(value: boolean = true): ViewBuilder {
    return this.withModifier({ type: ModifierType.disabled, value });
  }

  // --- Position & Layout (new) ---

  position(value: PositionToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.position, value });
  }

  positionEdges(edges: { top?: number; left?: number; right?: number; bottom?: number }): ViewBuilder {
    return this.withModifier({ type: ModifierType.positionEdges, ...edges });
  }

  zIndex(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.zIndex, value });
  }

  overflow(value: OverflowToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.overflow, value });
  }

  aspectRatio(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.aspectRatio, value });
  }

  alignSelf(value: AlignSelfToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.alignSelf, value });
  }

  display(value: DisplayToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.display, value });
  }

  hidden(value: boolean = true): ViewBuilder {
    return this.withModifier({ type: ModifierType.hidden, value });
  }

  // --- Text (new) ---

  textDecoration(value: TextDecorationToken): ViewBuilder {
    return this.withModifier({ type: ModifierType.textDecoration, value });
  }

  underline(): ViewBuilder {
    return this.textDecoration(TextDecoration.underline);
  }

  strikethrough(): ViewBuilder {
    return this.textDecoration(TextDecoration.lineThrough);
  }

  fontStyle(value: FontStyleType): ViewBuilder {
    return this.withModifier({ type: ModifierType.fontStyle, value });
  }

  italic(): ViewBuilder {
    return this.fontStyle(FontStyleToken.italic);
  }

  fontFamily(value: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.fontFamily, value });
  }

  // --- Interaction (new) ---

  onLongPress(handler: () => void): ViewBuilder {
    return this.withModifier({ type: ModifierType.onLongPress, handler });
  }

  // --- Accessibility ---

  accessibilityLabel(value: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.accessibilityLabel, value });
  }

  accessibilityRole(value: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.accessibilityRole, value });
  }

  accessibilityHint(value: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.accessibilityHint, value });
  }

  testID(value: string): ViewBuilder {
    return this.withModifier({ type: ModifierType.testID, value });
  }

  // --- List modifiers ---

  refreshControl(onRefresh: () => void, refreshing: boolean): ViewBuilder {
    return this.withModifier({ type: ModifierType.refreshControl, onRefresh, refreshing });
  }

  onEndReached(handler: () => void, threshold?: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.onEndReached, handler, threshold });
  }

  separator(builder: () => ViewBuilder): ViewBuilder {
    return this.withModifier({ type: ModifierType.separator, builder });
  }

  numColumns(value: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.numColumns, value });
  }

  emptyComponent(builder: () => ViewBuilder): ViewBuilder {
    return this.withModifier({ type: ModifierType.emptyComponent, builder });
  }

  // --- Modal ---

  onDismiss(handler: () => void): ViewBuilder {
    return this.withModifier({ type: ModifierType.onDismiss, handler });
  }

  // --- ViewModifier ---

  /**
   * Applies a ViewModifier class instance or a modifier function.
   * Accepts both class-based and function-based modifiers.
   *
   * @example
   * ```ts
   * Text('Hello').modifier(new CardModifier())
   * Text('Hello').modifier(v => v.padding(Spacing.lg).bold())
   * ```
   */
  modifier(mod: ViewModifierClass | ViewModifierFn): this {
    if (mod instanceof ViewModifierClass) {
      mod.body(this);
    } else {
      mod(this);
    }
    return this;
  }

  /**
   * Alias for .modifier() — applies a ViewModifier or modifier function.
   * Use for readability when applying style-oriented modifiers.
   */
  apply(mod: ViewModifierClass | ViewModifierFn): this {
    return this.modifier(mod);
  }

  /**
   * Conditionally applies a modifier function.
   * When condition is false, the view passes through unchanged.
   *
   * @example
   * ```ts
   * Text('Price')
   *   .if(isOnSale, v => v.foregroundColor(Color.error).strikethrough())
   *   .if(isFeatured, v => v.bold().font(Font.hero))
   * ```
   */
  if(condition: boolean, apply: ViewModifierFn): this {
    if (condition) {
      apply(this);
    }
    return this;
  }

  /**
   * Creates an independent copy of this ViewBuilder.
   * Mutations to the clone do not affect the original.
   *
   * @example
   * ```ts
   * const base = VStack(Text('Hello')).padding(Spacing.lg);
   * const card = base.clone().background(Color.card);
   * const alert = base.clone().background(Color.error);
   * ```
   */
  clone(): ViewBuilder {
    return new ViewBuilder(
      this.elementType,
      { ...this.props },
      [...this.children],
      [...this.modifiers],
    );
  }

  // --- Platform ---

  /**
   * Applies modifiers only on iOS.
   *
   * @example
   * ```ts
   * Text('Hello')
   *   .onIOS(v => v.font(Font.title).padding(Spacing.lg))
   *   .onAndroid(v => v.font(Font.header).padding(Spacing.md))
   * ```
   */
  onIOS(apply: (view: ViewBuilder) => ViewBuilder): ViewBuilder {
    return this.withModifier({ type: ModifierType.onIOS, apply: apply as (view: unknown) => unknown });
  }

  /** Applies modifiers only on Android. */
  onAndroid(apply: (view: ViewBuilder) => ViewBuilder): ViewBuilder {
    return this.withModifier({ type: ModifierType.onAndroid, apply: apply as (view: unknown) => unknown });
  }

  // --- Transform ---

  /**
   * Offsets the view's position by the given x and y values.
   *
   * @example
   * ```ts
   * Text('Hello').offset(10, -5)
   * ```
   */
  offset(x: number, y: number = 0): ViewBuilder {
    return this.withModifier({ type: ModifierType.offset, x, y });
  }

  /**
   * Rotates the view by the given degrees.
   *
   * @example
   * ```ts
   * Icon('arrow').rotation(45)
   * Image(source).rotation(-90)
   * ```
   */
  rotation(degrees: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.rotation, degrees });
  }

  /**
   * Alias for rotation() — matches SwiftUI's rotationEffect.
   */
  rotationEffect(degrees: number): ViewBuilder {
    return this.rotation(degrees);
  }

  /**
   * Scales the view by the given x and y factors.
   * If only x is provided, scales uniformly.
   *
   * @example
   * ```ts
   * Icon('star').scale(1.5)
   * Image(source).scale(0.8, 1.2)
   * ```
   */
  scale(x: number, y?: number): ViewBuilder {
    return this.withModifier({ type: ModifierType.scale, x, y: y ?? x });
  }

  /**
   * Alias for scale() — matches SwiftUI's scaleEffect.
   */
  scaleEffect(x: number, y?: number): ViewBuilder {
    return this.scale(x, y);
  }

  /**
   * Applies a blur effect to the view.
   * Requires `@react-native-community/blur` for actual blur rendering.
   * Without the library, this modifier is a no-op with a development warning.
   *
   * @example
   * ```ts
   * Image(source).blur(10)
   * ```
   */
  blur(radius: number): ViewBuilder {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(
        DSLWarnings.blurRequiresLibrary,
      );
    }
    return this.withModifier({ type: ModifierType.blur, radius });
  }

  /**
   * Overlays another view on top of this view.
   *
   * @example
   * ```ts
   * Image(source)
   *   .overlay(() => Text('Badge').font(Font.caption).foregroundColor(Color.error))
   * ```
   */
  overlay(builder: () => ViewBuilder): ViewBuilder {
    return this.withModifier({ type: ModifierType.overlay, builder });
  }

  // --- Responsive ---

  /**
   * Applies different modifiers based on the current screen size class.
   *
   * @example
   * ```ts
   * Text('Hello')
   *   .responsive({
   *     compact: v => v.font(Font.body).padding(Spacing.sm),
   *     regular: v => v.font(Font.title).padding(Spacing.md),
   *     large: v => v.font(Font.header).padding(Spacing.lg),
   *   })
   * ```
   */
  responsive(config: ResponsiveConfig): ViewBuilder {
    return this.withModifier({ type: ModifierType.responsive, config });
  }

  /** Applies modifiers only on compact (phone portrait) screens. */
  onCompact(apply: ResponsiveModifierFn): ViewBuilder {
    return this.withModifier({ type: ModifierType.onCompact, apply });
  }

  /** Applies modifiers only on regular (phone landscape, small tablet) screens. */
  onRegular(apply: ResponsiveModifierFn): ViewBuilder {
    return this.withModifier({ type: ModifierType.onRegular, apply });
  }

  /** Applies modifiers only on large (tablet) screens. */
  onLarge(apply: ResponsiveModifierFn): ViewBuilder {
    return this.withModifier({ type: ModifierType.onLarge, apply });
  }

  // --- Animation ---

  /**
   * Animates changes to the view when the tracked value changes.
   *
   * @example
   * ```ts
   * Text('Hello')
   *   .opacity(isVisible ? 1 : 0)
   *   .animation(Animation.easeInOut(300), isVisible)
   * ```
   */
  animation(config: AnimationConfig, value: unknown): ViewBuilder {
    return this.withModifier({ type: ModifierType.animation, config, value });
  }

  /**
   * Defines enter/exit transitions for the view.
   *
   * @example
   * ```ts
   * Text('Hello')
   *   .transition({ effect: Transition.opacity })
   *   .transition({ effect: Transition.slide, edge: TransitionEdge.bottom }, { effect: Transition.opacity })
   * ```
   */
  transition(enter: TransitionConfig, exit?: TransitionConfig): ViewBuilder {
    return this.withModifier({ type: ModifierType.transition, enter, exit: exit ?? enter });
  }

  // --- Gesture ---

  /**
   * Handles swipe gestures in a specific direction.
   *
   * @example
   * ```ts
   * Image(source)
   *   .onSwipe(SwipeDirection.left, () => handleNext())
   *   .onSwipe(SwipeDirection.right, () => handlePrev())
   * ```
   */
  onSwipe(
    direction: SwipeDirection,
    handler: () => void,
    options?: { threshold?: number; velocityThreshold?: number },
  ): ViewBuilder {
    return this.withModifier({
      type: ModifierType.onSwipe,
      direction,
      handler,
      threshold: options?.threshold,
      velocityThreshold: options?.velocityThreshold,
    });
  }

  /**
   * Handles pan (drag) gestures.
   *
   * @example
   * ```ts
   * Image(source).onPan({
   *   onChanged: (state) => updatePosition(state.translation),
   *   onEnded: (state) => snapToGrid(state.translation),
   * })
   * ```
   */
  onPan(
    handlers: {
      onStart?: (state: PanGestureState) => void;
      onChanged: (state: PanGestureState) => void;
      onEnded?: (state: PanGestureState) => void;
    },
    config?: PanGestureConfig,
  ): ViewBuilder {
    return this.withModifier({
      type: ModifierType.onPan,
      onStart: handlers.onStart,
      onChanged: handlers.onChanged,
      onEnded: handlers.onEnded,
      config,
    });
  }

  /**
   * Handles pinch-to-zoom gestures.
   * Requires react-native-gesture-handler for full support.
   */
  onPinch(
    handlers: {
      onChanged: (state: PinchGestureState) => void;
      onEnded?: (state: PinchGestureState) => void;
    },
    config?: PinchGestureConfig,
  ): ViewBuilder {
    return this.withModifier({
      type: ModifierType.onPinch,
      onChanged: handlers.onChanged,
      onEnded: handlers.onEnded,
      config,
    });
  }

  /**
   * Handles rotation gestures.
   * Requires react-native-gesture-handler for full support.
   */
  onRotate(
    handlers: {
      onChanged: (state: RotationGestureState) => void;
      onEnded?: (state: RotationGestureState) => void;
    },
    config?: RotationGestureConfig,
  ): ViewBuilder {
    return this.withModifier({
      type: ModifierType.onRotate,
      onChanged: handlers.onChanged,
      onEnded: handlers.onEnded,
      config,
    });
  }

  /** Generic gesture modifier for advanced gesture configurations. */
  gesture(config: GestureConfig): ViewBuilder {
    return this.withModifier({ type: ModifierType.gesture, config });
  }

  // --- Environment ---

  /**
   * Sets an environment value that child views can read.
   *
   * @example
   * ```ts
   * VStack(children)
   *   .environment('accentColor', Color.tint)
   *   .environment('spacing', Spacing.sm)
   * ```
   */
  environment(key: string, value: unknown): ViewBuilder {
    return this.withModifier({ type: ModifierType.environment, key, value });
  }

  // --- Materialization ---

  private extractScreenOptions(): Record<string, unknown> | null {
    let options: Record<string, unknown> | null = null;
    for (const mod of this.modifiers) {
      if (mod.type === ModifierType.screenTitle) {
        options = options || {};
        options.title = mod.value;
      } else if (mod.type === ModifierType.headerRight) {
        options = options || {};
        options.headerRight = mod.component;
      } else if (mod.type === ModifierType.headerLeft) {
        options = options || {};
        options.headerLeft = mod.component;
      }
    }
    return options;
  }

  toElement(key?: string | number): React.ReactElement {
    const { DSLRenderer } = require('./DSLRenderer');
    const renderer = React.createElement(DSLRenderer, { builder: this, key });

    const screenOptions = this.extractScreenOptions();
    if (screenOptions) {
      try {
        const { ScreenConfigRenderer } = require('@/Navigation/ScreenConfigRenderer');
        return React.createElement(ScreenConfigRenderer, { options: screenOptions }, renderer);
      } catch {
        // expo-router not available, screen navigation modifiers are no-ops
      }
    }

    return renderer;
  }
}

export function isViewBuilder(value: unknown): value is ViewBuilder {
  return isObject(value) && VIEW_BUILDER_SYMBOL in value;
}
