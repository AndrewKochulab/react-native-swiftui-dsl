/**
 * Example 1: Basic Usage
 *
 * Demonstrates core DSL primitives, modifiers using Token constants, and the DSLRenderer.
 */
import React from 'react';
import {
  VStack, HStack, Text, Button, Image, Spacer, Divider,
  ScrollStack, DSLRenderer, DSLThemeProvider, defaultThemeConfig,
  Color, Font, Spacing, Radius, ButtonVariant, ImageResize,
  TextAlign, Alignment, ColorScheme as ColorSchemeValue,
} from 'react-native-swiftui-dsl';

// --- Build a simple card ---

function buildWelcomeCard() {
  return VStack(
    Text('Welcome Back').font(Font.title).bold(),
    Text('Track your daily progress').font(Font.footnote).secondary(),
    Divider(),
    HStack(
      Text('Sessions: 12').font(Font.body),
      Spacer(),
      Text('Streak: 5 days').font(Font.body).foregroundColor(Color.tint),
    ),
    Button('Start Session', () => console.log('Started!'), { style: ButtonVariant.filled }),
  )
    .padding(Spacing.lg)
    .background(Color.card)
    .cornerRadius(Radius.md)
    .shadow();
}

// --- Build a profile header ---

function buildProfileHeader(user: { name: string; avatar: string; bio: string }) {
  return VStack(
    Image({ uri: user.avatar }, { resizeMode: ImageResize.cover })
      .frame({ width: 80, height: 80 })
      .cornerRadius(Radius.lg),
    Text(user.name).font(Font.title).bold(),
    Text(user.bio).font(Font.footnote).secondary().textAlign(TextAlign.center),
  )
    .padding(Spacing.lg)
    .alignment(Alignment.center)
    .spacing(12);
}

// --- Screen component ---

export default function WelcomeScreen() {
  return (
    <DSLThemeProvider config={defaultThemeConfig} colorScheme={ColorSchemeValue.light}>
      <DSLRenderer
        builder={ScrollStack(
          buildProfileHeader({
            name: 'John Doe',
            avatar: 'https://example.com/avatar.jpg',
            bio: 'iOS Developer & Music Lover',
          }),
          buildWelcomeCard(),
        ).padding(Spacing.lg)}
      />
    </DSLThemeProvider>
  );
}
