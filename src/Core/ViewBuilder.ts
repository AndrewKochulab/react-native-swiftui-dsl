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
import { Binding } from '../Binding/Binding';
import { DSLDefaults } from '../Config/Defaults';

export const VIEW_BUILDER_SYMBOL = Symbol.for('DSL.ViewBuilder');

export type DSLElementType =
  | 'text'
  | 'vstack'
  | 'hstack'
  | 'zstack'
  | 'icon'
  | 'spacer'
  | 'raw'
  | 'fragment'
  | 'safearea'
  | 'scroll'
  | 'textinput'
  | 'spinner'
  | 'lazylist'
  | 'image'
  | 'toggle'
  | 'button'
  | 'divider'
  | 'link'
  | 'sectionlist'
  | 'modal'
  | 'progressbar';

export interface DSLElementProps {
  text?: string;
  iconName?: string;
  iconSize?: number;
  iconColor?: ColorValue;
  imageSource?: unknown;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  imageAlt?: string;
  rawElement?: React.ReactElement;
  // TextInput
  binding?: Binding<string>;
  // Spinner
  spinnerSize?: 'small' | 'large';
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
  buttonStyle?: 'filled' | 'outlined' | 'plain';
  buttonIcon?: string;
  // Link
  linkURL?: string;
  // SectionList
  sectionListData?: ReadonlyArray<{ title: string; data: ReadonlyArray<unknown> }>;
  sectionRenderItem?: (item: unknown) => ViewBuilder;
  sectionRenderHeader?: (title: string) => ViewBuilder;
  // Modal
  modalBinding?: Binding<boolean>;
  modalAnimationType?: 'none' | 'slide' | 'fade';
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
    return this.withModifier({ type: 'padding', value: value ?? DSLDefaults.spacing, edge: edge ?? DSLDefaults.edge });
  }

  paddingHorizontal(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, 'horizontal');
  }

  paddingVertical(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, 'vertical');
  }

  paddingTop(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, 'top');
  }

  paddingBottom(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, 'bottom');
  }

  paddingLeft(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, 'left');
  }

  paddingRight(value?: number | SpacingToken): ViewBuilder {
    return this.padding(value ?? DSLDefaults.spacing, 'right');
  }

  // --- Margin ---

  margin(value?: number | SpacingToken, edge?: PaddingEdge): ViewBuilder {
    return this.withModifier({ type: 'margin', value: value ?? DSLDefaults.spacing, edge: edge ?? DSLDefaults.edge });
  }

  marginHorizontal(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, 'horizontal');
  }

  marginVertical(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, 'vertical');
  }

  marginBottom(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, 'bottom');
  }

  marginTop(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, 'top');
  }

  marginLeft(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, 'left');
  }

  marginRight(value?: number | SpacingToken): ViewBuilder {
    return this.margin(value ?? DSLDefaults.spacing, 'right');
  }

  // --- Layout ---

  flex(value: number = DSLDefaults.flex): ViewBuilder {
    return this.withModifier({ type: 'flex', value });
  }

  frame(options: {
    width?: number;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    alignment?: 'center' | 'leading' | 'trailing';
  }): ViewBuilder {
    return this.withModifier({ type: 'frame', ...options });
  }

  spacing(value: number): ViewBuilder {
    return this.withModifier({ type: 'spacing', value });
  }

  gap(value: number): ViewBuilder {
    return this.withModifier({ type: 'gap', value });
  }

  // --- Container Layout ---

  justifyContent(value: 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly'): ViewBuilder {
    return this.withModifier({ type: 'justifyContent', value });
  }

  alignItems(value: 'flexStart' | 'flexEnd' | 'center' | 'stretch' | 'baseline'): ViewBuilder {
    return this.withModifier({ type: 'alignItems', value });
  }

  alignment(value: 'center' | 'leading' | 'trailing' | 'stretch'): ViewBuilder {
    return this.withModifier({ type: 'alignment', value });
  }

  flexWrap(value: 'wrap' | 'nowrap' = 'wrap'): ViewBuilder {
    return this.withModifier({ type: 'flexWrap', value });
  }

  // --- Style ---

  background(color: ColorValue): ViewBuilder {
    return this.withModifier({ type: 'background', color });
  }

  backgroundAlpha(color: ColorValue, alpha: number): ViewBuilder {
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return this.withModifier({ type: 'backgroundAlpha', color, alphaHex });
  }

  foregroundColor(color: ColorValue): ViewBuilder {
    return this.withModifier({ type: 'foregroundColor', color });
  }

  cornerRadius(value: number | BorderRadiusToken): ViewBuilder {
    return this.withModifier({ type: 'cornerRadius', value });
  }

  border(width: number, color: ColorValue): ViewBuilder {
    return this.withModifier({ type: 'border', width, color });
  }

  borderStyle(value: 'solid' | 'dotted' | 'dashed'): ViewBuilder {
    return this.withModifier({ type: 'borderStyle', value });
  }

  shadow(options?: {
    color?: ColorValue;
    offset?: { width: number; height: number };
    opacity?: number;
    radius?: number;
    elevation?: number;
  }): ViewBuilder {
    return this.withModifier({
      type: 'shadow',
      color: options?.color ?? DSLDefaults.shadow.color,
      offset: options?.offset ?? DSLDefaults.shadow.offset,
      opacity: options?.opacity ?? DSLDefaults.shadow.opacity,
      radius: options?.radius ?? DSLDefaults.shadow.radius,
      elevation: options?.elevation ?? DSLDefaults.shadow.elevation,
    });
  }

  opacity(value: number): ViewBuilder {
    return this.withModifier({ type: 'opacity', value });
  }

  // --- Text ---

  font(size: FontSizeToken | number): ViewBuilder {
    return this.withModifier({ type: 'font', size });
  }

  fontWeight(weight: FontWeightToken): ViewBuilder {
    return this.withModifier({ type: 'fontWeight', weight });
  }

  bold(): ViewBuilder {
    return this.fontWeight('bold');
  }

  semibold(): ViewBuilder {
    return this.fontWeight('semibold');
  }

  medium(): ViewBuilder {
    return this.fontWeight('medium');
  }

  light(): ViewBuilder {
    return this.fontWeight('light');
  }

  thin(): ViewBuilder {
    return this.fontWeight('thin');
  }

  heavy(): ViewBuilder {
    return this.fontWeight('heavy');
  }

  black(): ViewBuilder {
    return this.fontWeight('black');
  }

  caption(): ViewBuilder {
    return this.font('caption');
  }

  secondary(): ViewBuilder {
    return this.foregroundColor('secondaryText');
  }

  textTransform(value: 'uppercase' | 'lowercase' | 'capitalize' | 'none'): ViewBuilder {
    return this.withModifier({ type: 'textTransform', value });
  }

  letterSpacing(value: number): ViewBuilder {
    return this.withModifier({ type: 'letterSpacing', value });
  }

  lineHeight(value: number): ViewBuilder {
    return this.withModifier({ type: 'lineHeight', value });
  }

  textAlign(value: 'left' | 'center' | 'right' | 'auto'): ViewBuilder {
    return this.withModifier({ type: 'textAlign', value });
  }

  lineLimit(value: number): ViewBuilder {
    return this.withModifier({ type: 'lineLimit', value });
  }

  // --- SafeArea ---

  edges(value: ('top' | 'bottom' | 'left' | 'right')[]): ViewBuilder {
    return this.withModifier({ type: 'safeAreaEdges', value });
  }

  // --- Scroll ---

  hideScrollIndicator(): ViewBuilder {
    return this.withModifier({ type: 'hideScrollIndicator', value: true });
  }

  contentPadding(value?: number | SpacingToken, edge?: PaddingEdge): ViewBuilder {
    return this.withModifier({ type: 'scrollContentPadding', value: value ?? DSLDefaults.spacing, edge: edge ?? DSLDefaults.edge });
  }

  contentPaddingBottom(value?: number | SpacingToken): ViewBuilder {
    return this.contentPadding(value ?? DSLDefaults.spacing, 'bottom');
  }

  horizontal(): ViewBuilder {
    return this.withModifier({ type: 'scrollDirection', value: 'horizontal' });
  }

  keyboardAvoiding(offset: number = DSLDefaults.keyboardAvoidingOffset): ViewBuilder {
    return this.withModifier({ type: 'keyboardAvoiding', offset });
  }

  keyboardShouldPersistTaps(value: 'always' | 'never' | 'handled' = DSLDefaults.keyboardShouldPersistTaps): ViewBuilder {
    return this.withModifier({ type: 'keyboardPersistTaps', value });
  }

  bounces(value: boolean = DSLDefaults.bounces): ViewBuilder {
    return this.withModifier({ type: 'bounces', value });
  }

  // --- TextInput ---

  placeholder(value: string): ViewBuilder {
    return this.withModifier({ type: 'placeholder', value });
  }

  inputLabel(text: string): ViewBuilder {
    return this.withModifier({ type: 'inputLabel', text });
  }

  inputError(message: string | undefined): ViewBuilder {
    return this.withModifier({ type: 'inputError', message });
  }

  keyboardType(value: string): ViewBuilder {
    return this.withModifier({ type: 'keyboardType', value });
  }

  multiline(lines?: number): ViewBuilder {
    return this.withModifier({ type: 'multiline', lines });
  }

  secureEntry(): ViewBuilder {
    return this.withModifier({ type: 'secureEntry' });
  }

  autoCapitalize(value: 'none' | 'sentences' | 'words' | 'characters'): ViewBuilder {
    return this.withModifier({ type: 'autoCapitalize', value });
  }

  returnKeyType(value: string): ViewBuilder {
    return this.withModifier({ type: 'returnKeyType', value });
  }

  maxLength(value: number): ViewBuilder {
    return this.withModifier({ type: 'maxLength', value });
  }

  inputHeight(value: number): ViewBuilder {
    return this.withModifier({ type: 'inputHeight', value });
  }

  // --- Screen Navigation ---

  screenTitle(title: string): ViewBuilder {
    return this.withModifier({ type: 'screenTitle', value: title });
  }

  headerRight(component: () => React.ReactElement): ViewBuilder {
    return this.withModifier({ type: 'headerRight', component });
  }

  headerLeft(component: () => React.ReactElement): ViewBuilder {
    return this.withModifier({ type: 'headerLeft', component });
  }

  // --- Interaction ---

  onTap(handler: () => void): ViewBuilder {
    return this.withModifier({ type: 'onTap', handler });
  }

  disabled(value: boolean = true): ViewBuilder {
    return this.withModifier({ type: 'disabled', value });
  }

  // --- Position & Layout (new) ---

  position(value: 'absolute' | 'relative'): ViewBuilder {
    return this.withModifier({ type: 'position', value });
  }

  positionEdges(edges: { top?: number; left?: number; right?: number; bottom?: number }): ViewBuilder {
    return this.withModifier({ type: 'positionEdges', ...edges });
  }

  zIndex(value: number): ViewBuilder {
    return this.withModifier({ type: 'zIndex', value });
  }

  overflow(value: 'hidden' | 'visible' | 'scroll'): ViewBuilder {
    return this.withModifier({ type: 'overflow', value });
  }

  aspectRatio(value: number): ViewBuilder {
    return this.withModifier({ type: 'aspectRatio', value });
  }

  alignSelf(value: 'auto' | 'flexStart' | 'flexEnd' | 'center' | 'stretch' | 'baseline'): ViewBuilder {
    return this.withModifier({ type: 'alignSelf', value });
  }

  display(value: 'none' | 'flex'): ViewBuilder {
    return this.withModifier({ type: 'display', value });
  }

  hidden(value: boolean = true): ViewBuilder {
    return this.withModifier({ type: 'hidden', value });
  }

  // --- Text (new) ---

  textDecoration(value: 'none' | 'underline' | 'line-through' | 'underline line-through'): ViewBuilder {
    return this.withModifier({ type: 'textDecoration', value });
  }

  underline(): ViewBuilder {
    return this.textDecoration('underline');
  }

  strikethrough(): ViewBuilder {
    return this.textDecoration('line-through');
  }

  fontStyle(value: 'normal' | 'italic'): ViewBuilder {
    return this.withModifier({ type: 'fontStyle', value });
  }

  italic(): ViewBuilder {
    return this.fontStyle('italic');
  }

  fontFamily(value: string): ViewBuilder {
    return this.withModifier({ type: 'fontFamily', value });
  }

  // --- Interaction (new) ---

  onLongPress(handler: () => void): ViewBuilder {
    return this.withModifier({ type: 'onLongPress', handler });
  }

  // --- Accessibility ---

  accessibilityLabel(value: string): ViewBuilder {
    return this.withModifier({ type: 'accessibilityLabel', value });
  }

  accessibilityRole(value: string): ViewBuilder {
    return this.withModifier({ type: 'accessibilityRole', value });
  }

  accessibilityHint(value: string): ViewBuilder {
    return this.withModifier({ type: 'accessibilityHint', value });
  }

  testID(value: string): ViewBuilder {
    return this.withModifier({ type: 'testID', value });
  }

  // --- List modifiers ---

  refreshControl(onRefresh: () => void, refreshing: boolean): ViewBuilder {
    return this.withModifier({ type: 'refreshControl', onRefresh, refreshing });
  }

  onEndReached(handler: () => void, threshold?: number): ViewBuilder {
    return this.withModifier({ type: 'onEndReached', handler, threshold });
  }

  separator(builder: () => ViewBuilder): ViewBuilder {
    return this.withModifier({ type: 'separator', builder });
  }

  numColumns(value: number): ViewBuilder {
    return this.withModifier({ type: 'numColumns', value });
  }

  emptyComponent(builder: () => ViewBuilder): ViewBuilder {
    return this.withModifier({ type: 'emptyComponent', builder });
  }

  // --- Modal ---

  onDismiss(handler: () => void): ViewBuilder {
    return this.withModifier({ type: 'onDismiss', handler });
  }

  // --- Materialization ---

  private extractScreenOptions(): Record<string, unknown> | null {
    let options: Record<string, unknown> | null = null;
    for (const mod of this.modifiers) {
      if (mod.type === 'screenTitle') {
        options = options || {};
        options.title = mod.value;
      } else if (mod.type === 'headerRight') {
        options = options || {};
        options.headerRight = mod.component;
      } else if (mod.type === 'headerLeft') {
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
        const { ScreenConfigRenderer } = require('../Navigation/ScreenConfigRenderer');
        return React.createElement(ScreenConfigRenderer, { options: screenOptions }, renderer);
      } catch {
        // expo-router not available, screen navigation modifiers are no-ops
      }
    }

    return renderer;
  }
}

export function isViewBuilder(value: unknown): value is ViewBuilder {
  return (
    typeof value === 'object' &&
    value !== null &&
    VIEW_BUILDER_SYMBOL in value
  );
}
