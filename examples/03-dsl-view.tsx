/**
 * Example 3: DSLView — Reusable View Components
 *
 * Demonstrates the SwiftUI-like body() pattern for defining reusable views.
 */
import React from 'react';
import {
  VStack, HStack, Text, Image, Button, Spacer, Divider,
  DSLView, ViewBuilder, ViewModifier,
  DSLRenderer, DSLThemeProvider, defaultThemeConfig,
  Color, Font, Spacing, Radius, ButtonVariant, ImageResize,
  TextAlign, Alignment, ColorScheme as ColorSchemeValue,
} from 'react-native-swiftui-dsl';

// --- Reusable modifier ---

class CardStyle extends ViewModifier {
  body(content: ViewBuilder): ViewBuilder {
    return content
      .padding(Spacing.lg)
      .background(Color.card)
      .cornerRadius(Radius.md)
      .shadow();
  }
}

// --- Reusable view: Avatar ---

class AvatarView extends DSLView<{ imageUrl: string; size?: number }> {
  body(): ViewBuilder {
    const size = this.props.size ?? 60;
    return Image({ uri: this.props.imageUrl }, { resizeMode: ImageResize.cover })
      .frame({ width: size, height: size })
      .cornerRadius(Radius.lg);
  }
}

// --- Reusable view: ProfileCard ---

class ProfileCard extends DSLView<{
  name: string;
  bio: string;
  avatar: string;
  onEdit: () => void;
}> {
  body(): ViewBuilder {
    return VStack(
      AvatarView.build({ imageUrl: this.props.avatar, size: 80 }),
      Text(this.props.name).font(Font.title).bold(),
      Text(this.props.bio).font(Font.footnote).secondary().textAlign(TextAlign.center),
      Button('Edit Profile', this.props.onEdit, { style: ButtonVariant.outlined }),
    )
      .modifier(new CardStyle())
      .alignment(Alignment.center)
      .spacing(12);
  }
}

// --- Reusable view: StatRow ---

class StatRow extends DSLView<{ label: string; value: string; color?: string }> {
  body(): ViewBuilder {
    return HStack(
      Text(this.props.label).font(Font.body).secondary(),
      Spacer(),
      Text(this.props.value)
        .font(Font.body)
        .bold()
        .if(!!this.props.color, v => v.foregroundColor(this.props.color!)),
    ).padding(Spacing.md);
  }
}

// --- Reusable view: StatsCard ---

class StatsCard extends DSLView<{
  stats: Array<{ label: string; value: string; color?: string }>;
}> {
  body(): ViewBuilder {
    const statRows = this.props.stats.map((stat, i) =>
      VStack(
        StatRow.build(stat),
        ...(i < this.props.stats.length - 1 ? [Divider()] : []),
      ),
    );

    return VStack(...statRows)
      .modifier(new CardStyle());
  }
}

// --- Screen ---

function buildProfileScreen() {
  return VStack(
    ProfileCard.build({
      name: 'Sarah Johnson',
      bio: 'Product designer crafting delightful experiences',
      avatar: 'https://example.com/sarah.jpg',
      onEdit: () => console.log('Edit profile'),
    }),

    StatsCard.build({
      stats: [
        { label: 'Projects', value: '24', color: Color.tint },
        { label: 'Followers', value: '1.2k' },
        { label: 'Following', value: '348' },
      ],
    }).marginTop(Spacing.md),
  )
    .padding(Spacing.lg);
}

export default function DSLViewDemo() {
  return (
    <DSLThemeProvider config={defaultThemeConfig} colorScheme={ColorSchemeValue.light}>
      <DSLRenderer builder={buildProfileScreen()} />
    </DSLThemeProvider>
  );
}
