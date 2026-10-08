import type { TextStyle } from 'react-native';

/**
 * Font family names as registered with `useFonts` in the root layout.
 * Always set `fontFamily` (never `fontWeight`) so weights render identically on iOS and Android.
 */
export const fonts = {
  displayRegular: 'BricolageGrotesque_400Regular',
  displayMedium: 'BricolageGrotesque_500Medium',
  displaySemibold: 'BricolageGrotesque_600SemiBold',
  displayBold: 'BricolageGrotesque_700Bold',
  bodyRegular: 'GeneralSans-Regular',
  bodyMedium: 'GeneralSans-Medium',
  bodySemibold: 'GeneralSans-Semibold',
  bodyBold: 'GeneralSans-Bold',
} as const;

export const typography = {
  /** Screen title — "September 2026" */
  title: { fontFamily: fonts.displaySemibold, fontSize: 24 },
  /** Pushed page title — "Monthly Budgets" */
  pageTitle: { fontFamily: fonts.displaySemibold, fontSize: 20, lineHeight: 24 },
  /** Section headers — "My Accounts" */
  sectionTitle: { fontFamily: fonts.displaySemibold, fontSize: 16 },
  /** Accounts page sections — "Investments & Assets" */
  sectionTitleLg: { fontFamily: fonts.displaySemibold, fontSize: 18, lineHeight: 22 },
  /** Total net worth */
  amountHero: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 38 },
  /** Cash account balance on the Accounts page */
  amountCard: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 26 },
  /** Investment and credit card balance on the Accounts page */
  amountCardPlain: { fontFamily: fonts.bodySemibold, fontSize: 22, lineHeight: 30 },
  overlineMd: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16, textTransform: 'uppercase' },
  /** Account balance */
  amountLg: { fontFamily: fonts.displayBold, fontSize: 20 },
  /** Monthly stat value */
  amountMd: { fontFamily: fonts.displayBold, fontSize: 18 },

  overline: { fontFamily: fonts.bodyMedium, fontSize: 11, textTransform: 'uppercase' },
  overlineSm: { fontFamily: fonts.bodyMedium, fontSize: 10, textTransform: 'uppercase' },
  overlineXs: { fontFamily: fonts.bodyMedium, fontSize: 9, lineHeight: 12, textTransform: 'uppercase' },

  /** Bill card title */
  cardTitle: { fontFamily: fonts.displayBold, fontSize: 15 },
  titleMd: { fontFamily: fonts.bodySemibold, fontSize: 15 },
  titleSm: { fontFamily: fonts.bodySemibold, fontSize: 14 },
  /** Empty-state headline — "Your money story starts here" */
  emptyTitle: { fontFamily: fonts.bodySemibold, fontSize: 15, lineHeight: 20, letterSpacing: -0.15 },
  amountRow: { fontFamily: fonts.bodyBold, fontSize: 15 },

  amountSm: { fontFamily: fonts.bodyMedium, fontSize: 13 },
  bodySm: { fontFamily: fonts.bodyRegular, fontSize: 13 },
  statusLabel: { fontFamily: fonts.bodyMedium, fontSize: 11 },
  captionSm: { fontFamily: fonts.bodyRegular, fontSize: 11 },
  labelSemibold: { fontFamily: fonts.bodySemibold, fontSize: 12 },
  labelSemiboldMd: { fontFamily: fonts.bodySemibold, fontSize: 13 },
  labelBold: { fontFamily: fonts.bodyBold, fontSize: 12 },
  caption: { fontFamily: fonts.bodyRegular, fontSize: 12 },
  captionMedium: { fontFamily: fonts.bodyMedium, fontSize: 12 },

  micro: { fontFamily: fonts.bodyRegular, fontSize: 10 },
  microSemibold: { fontFamily: fonts.bodySemibold, fontSize: 10, lineHeight: 14 },
  link: { fontFamily: fonts.bodySemibold, fontSize: 11, lineHeight: 15 },
  badge: { fontFamily: fonts.bodySemibold, fontSize: 11, lineHeight: 15 },
  microMedium: { fontFamily: fonts.bodyMedium, fontSize: 10 },
  nano: { fontFamily: fonts.bodyRegular, fontSize: 8 },

  tabLabel: { fontFamily: fonts.bodyMedium, fontSize: 10 },
  tabLabelActive: { fontFamily: fonts.displaySemibold, fontSize: 10 },
  /** Add-transaction sheet */
  sheetTitle: { fontFamily: fonts.displayBold, fontSize: 18 },
  fieldLabel: { fontFamily: fonts.bodySemibold, fontSize: 12, textTransform: 'uppercase' },
  fieldLabelSm: { fontFamily: fonts.bodySemibold, fontSize: 11, textTransform: 'uppercase' },
  fieldLabelXs: { fontFamily: fonts.bodySemibold, fontSize: 10, lineHeight: 14, textTransform: 'uppercase' },
  /** Names and amounts in the bill allocation step. */
  displayBody: { fontFamily: fonts.displayRegular, fontSize: 14, lineHeight: 17 },
  currencySm: { fontFamily: fonts.displayBold, fontSize: 15, lineHeight: 18 },
  amountInput: { fontFamily: fonts.displayBold, fontSize: 20 },
  amountInputSm: { fontFamily: fonts.displaySemibold, fontSize: 18, lineHeight: 22 },
  segment: { fontFamily: fonts.bodySemibold, fontSize: 13 },
  input: { fontFamily: fonts.bodyRegular, fontSize: 13 },
  inputLg: { fontFamily: fonts.bodyRegular, fontSize: 14 },
  inputMedium: { fontFamily: fonts.bodyMedium, fontSize: 13 },
  button: { fontFamily: fonts.displayBold, fontSize: 14 },

  /** Bill detail */
  amountXl: { fontFamily: fonts.displayBold, fontSize: 26 },
  amountOf: { fontFamily: fonts.displayMedium, fontSize: 20, lineHeight: 24 },
  bodyMd: { fontFamily: fonts.bodyMedium, fontSize: 14 },
  sectionTitleBold: { fontFamily: fonts.displayBold, fontSize: 16 },
  rowTitle: { fontFamily: fonts.displaySemibold, fontSize: 14 },
  rowAmount: { fontFamily: fonts.displayBold, fontSize: 14 },

  /** Profile & Settings */
  profileName: { fontFamily: fonts.displayBold, fontSize: 18 },
  overlineBold: { fontFamily: fonts.bodyBold, fontSize: 11, textTransform: 'uppercase' },
  badgeBold: { fontFamily: fonts.bodyBold, fontSize: 10 },
  /** Notifications summary card — "Push notifications" */
  cardTitleSm: { fontFamily: fonts.displayBold, fontSize: 14 },
  captionSmTight: { fontFamily: fonts.bodyRegular, fontSize: 11, lineHeight: 14.3 },
  /** Edit Profile */
  fieldLabelBold: { fontFamily: fonts.bodyBold, fontSize: 10, textTransform: 'uppercase' },
  linkBold: { fontFamily: fonts.bodyBold, fontSize: 12 },
  headerAction: { fontFamily: fonts.bodyBold, fontSize: 13 },
  note: { fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 14.85 },

  /** Emoji glyphs use the system emoji font, so only size is set. */
  emoji: { fontSize: 18, lineHeight: 22 },
  avatarInitial: { fontFamily: fonts.bodyBold, fontSize: 11.2 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
