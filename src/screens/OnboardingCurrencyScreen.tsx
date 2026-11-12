import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { PillButton } from '@/components/auth';
import { ChoiceCard, FlagSymbol, FooterNote, OnboardingFrame } from '@/components/onboarding';
import { AppText, Icon } from '@/components/ui';
import { currencies } from '@/data/currencies';
import { setCurrency, useProfile } from '@/data/profileStore';
import { colors, spacing, typography } from '@/theme';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

export function OnboardingCurrencyScreen() {
  const [selected, setSelected] = useState(useProfile().currency);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const search = query.trim().toLowerCase();
  const matches = search
    ? currencies.filter(({ code, name }) => code.toLowerCase().includes(search) || name.toLowerCase().includes(search))
    : currencies;

  const next = () => {
    setCurrency(selected);
    router.push('/onboarding/appearance');
  };

  return (
    <OnboardingFrame
      onBack={() => router.back()}
      fixed
      footer={
        <View style={styles.next}>
          <FooterNote>Don’t worry, you can change this later or add multiple currencies</FooterNote>
          <PillButton label={`Use ${selected} and continue`} icon="onboardingArrowRight" onPress={next} />
        </View>
      }>
      <View style={styles.page}>
        <View style={styles.intro}>
          <AppText variant="authTitle" accessibilityRole="header">
            Let’s talk in your currency.
          </AppText>
          <AppText variant="onboardingBody" color="textSecondary">
            Choose the default for your money overview. We’ve started with Philippine pesos.
          </AppText>
        </View>

        <View style={[styles.search, searching && styles.searchFocused]}>
          <Icon name="search" />
          <TextInput
            accessibilityLabel="Search currencies"
            placeholder="Search currencies"
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.brand}
            cursorColor={colors.brand}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearching(true)}
            onBlur={() => setSearching(false)}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            style={styles.searchText}
          />
        </View>

        {/* Only the list scrolls; the heading, search and footer stay put. */}
        <ScrollView
          accessibilityRole="radiogroup"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          style={styles.list}
          contentContainerStyle={styles.choices}>
          {matches.map((currency) => (
            <ChoiceCard
              key={currency.code}
              symbol={<FlagSymbol flag={currency.flag} />}
              title={currency.code}
              description={currency.name}
              selected={selected === currency.code}
              onPress={() => setSelected(currency.code)}
            />
          ))}
          {matches.length === 0 ? (
            <AppText variant="onboardingNote" color="textSecondary" style={styles.empty}>
              No currencies match “{query.trim()}”.
            </AppText>
          ) : null}
        </ScrollView>
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    gap: 24,
  },
  intro: {
    gap: 10,
  },
  search: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14 - STROKE,
    borderRadius: 14,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchFocused: {
    borderColor: colors.brand,
  },
  searchText: {
    ...typography.inputLg,
    flex: 1,
    height: '100%',
    padding: 0,
    color: colors.textPrimary,
  },
  list: {
    flex: 1,
    // Let the cards scroll right up to the footer panel.
    marginHorizontal: -spacing.screenX,
  },
  choices: {
    gap: 10,
    paddingHorizontal: spacing.screenX,
    paddingBottom: 18,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 12,
  },
  next: {
    gap: 12,
  },
});
