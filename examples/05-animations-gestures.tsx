/**
 * Example 5: Animations & Gestures
 *
 * Demonstrates animation modifiers, transition effects, gesture handlers,
 * and the withAnimation() helper.
 */
import React, { useState } from 'react';
import {
  VStack, HStack, Text, Image, Button, Spacer,
  Animation, withAnimation, Transition, TransitionEdge,
  DSLRenderer, DSLThemeProvider, defaultThemeConfig,
  Color, Font, Spacing, Radius, ButtonVariant, SwipeDirection,
  ColorScheme as ColorSchemeValue,
} from 'react-native-swiftui-dsl';

// --- Animated toggle ---

function buildAnimatedCard(isExpanded: boolean, toggle: () => void) {
  return VStack(
    HStack(
      Text('Details').font(Font.subtitle).bold(),
      Spacer(),
      Button(isExpanded ? 'Collapse' : 'Expand', toggle, { style: ButtonVariant.plain }),
    ),

    // Animated content
    Text('This content appears with animation')
      .font(Font.body)
      .opacity(isExpanded ? 1 : 0)
      .animation(Animation.easeInOut(300), isExpanded),

    // Transition effect
    Text('Sliding content')
      .font(Font.caption)
      .secondary()
      .if(isExpanded, v => v.padding(Spacing.md))
      .transition(
        { effect: Transition.slide, edge: TransitionEdge.top },
        { effect: Transition.opacity },
      ),
  )
    .padding(Spacing.lg)
    .background(Color.card)
    .cornerRadius(Radius.md);
}

// --- Gesture card ---

function buildGestureCard() {
  return VStack(
    Text('Swipe & Pan Demo').font(Font.subtitle).bold(),

    // Swipeable item
    HStack(
      Text('Swipe me left or right').font(Font.body),
    )
      .padding(Spacing.md)
      .background(Color.card)
      .cornerRadius(Radius.sm)
      .onSwipe(SwipeDirection.left, () => console.log('Swiped left!'))
      .onSwipe(SwipeDirection.right, () => console.log('Swiped right!')),

    // Draggable item
    Image({ uri: 'https://example.com/photo.jpg' })
      .frame({ width: 100, height: 100 })
      .cornerRadius(Radius.lg)
      .onPan({
        onChanged: (state) => {
          console.log('Dragging:', state.translation.x, state.translation.y);
        },
        onEnded: (state) => {
          console.log('Drag ended at:', state.translation.x, state.translation.y);
        },
      }),

    // Pinch-to-zoom (requires react-native-gesture-handler)
    Image({ uri: 'https://example.com/zoomable.jpg' })
      .frame({ width: 200, height: 200 })
      .cornerRadius(Radius.md)
      .onPinch({
        onChanged: (state) => console.log('Scale:', state.scale),
      }),
  )
    .padding(Spacing.lg)
    .spacing(16);
}

// --- Animation presets demo ---

function buildPresetDemo(isVisible: boolean) {
  return VStack(
    Text('Animation Presets').font(Font.subtitle).bold(),

    Text('Spring').animation(Animation.spring(), isVisible),
    Text('Quick').animation(Animation.quick(), isVisible),
    Text('Gentle').animation(Animation.gentle(), isVisible),
    Text('Custom Spring').animation(
      Animation.spring({ damping: 5, stiffness: 200 }),
      isVisible,
    ),
    Text('Custom Timing').animation(
      Animation.easeOut(500),
      isVisible,
    ),
  )
    .padding(Spacing.lg)
    .spacing(8);
}

// --- Screen with withAnimation ---

export default function AnimationGestureDemo() {
  const [isExpanded, setExpanded] = useState(false);
  const [isVisible, setVisible] = useState(true);

  const toggle = () => {
    withAnimation(Animation.spring(), () => {
      setExpanded(!isExpanded);
    });
  };

  return (
    <DSLThemeProvider config={defaultThemeConfig} colorScheme={ColorSchemeValue.light}>
      <DSLRenderer
        builder={VStack(
          buildAnimatedCard(isExpanded, toggle),
          buildGestureCard(),
          buildPresetDemo(isVisible),
          Button('Toggle Visibility', () => setVisible(!isVisible), { style: ButtonVariant.outlined }),
        ).padding(Spacing.lg).spacing(20)}
      />
    </DSLThemeProvider>
  );
}
