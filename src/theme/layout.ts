export const spacing = {
  screenX: 20,
  cardGap: 8,
} as const;

export const radii = {
  sm: 3,
  md: 12,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  sheet: 32,
  pill: 999,
} as const;

export const shadows = {
  card: '0px 6px 8px rgba(15, 23, 42, 0.03)',
  cardRaised: '0px 6px 16px rgba(15, 23, 42, 0.03)',
  cardSoft: '0px 6px 16px rgba(15, 23, 42, 0.04)',
  brand: '0px 6px 8px rgba(16, 185, 129, 0.25)',
  sheet: '0px -10px 12px rgba(15, 23, 42, 0.1)',
  segment: '0px 2px 2px rgba(15, 23, 42, 0.03)',
  button: '0px 4px 6px rgba(15, 155, 113, 0.13)',
  brandButton: '0px 7px 18px rgba(16, 185, 129, 0.21)',
  /** Pill call-to-action on the sign-up screen. */
  ctaPill: '0px 6px 16px rgba(15, 155, 113, 0.15)',
  /** Add Transfer button. */
  buttonSoft: '0px 4px 12px rgba(15, 155, 113, 0.13)',
  buttonLg: '0px 4px 12px rgba(15, 155, 113, 0.15)',
  /** Grouped settings lists. */
  settingsCard: '0px 5px 14px rgba(15, 23, 42, 0.04)',
  /** Switch thumb. */
  thumb: '0px 1px 3px rgba(15, 23, 42, 0.1)',
  /** Floating dropdowns and the date picker. */
  popover: '0px 10px 24px rgba(15, 23, 42, 0.14)',
} as const;

/** Height of the bottom tab bar, excluding the device's bottom safe-area inset. */
export const TAB_BAR_HEIGHT = 64;
