export const colors = {
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  track: '#F1F5F9',
  ringTrack: '#E1F0E9',

  success: '#10B981',
  successSoft: '#DCFCE7',
  /** "Default" account badge. */
  successTint: '#E5F7EB',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',

  white: '#FFFFFF',

  brand: '#0F9B71',
  /** Pale brand wash behind small brand-colored labels (e.g. "0 linked"). */
  brandTint: '#F1FBF5',
  /** Faint mint surface for empty-state rows. */
  surfaceMint: '#F8FFFB',
  /** Inset input fill (budget limit fields). */
  surfaceMuted: '#F8FAFC',
  /** "Split equally" pill. */
  brandWash: '#E8F8F1',
  /** Border of the transfer direction badge. */
  brandWashBorder: '#BDE8D7',
  /** Avatar for a person who hasn't been named yet. */
  avatarEmpty: '#E8E8E8',
  black: '#000000',
  /** Mint tile behind settings icons, the avatar ring and the "Verified member" badge. */
  brandMint: '#E4F7EE',
  /** Dark brand green for text on `brandMint`. */
  brandDeep: '#087655',
  /** Border of mint highlight cards (notifications summary). */
  brandMintBorder: '#CBEEDC',
  /** Profile form input fill. */
  surfaceInput: '#F7FCFA',
  /** Destructive row tile ("Sign out"). */
  dangerTint: '#FDECEC',
  /** Destructive row label ("Sign out"). */
  dangerMuted: '#DC5252',
  /** Selected category chip fill (brand lime at 50%). */
  brandSoft: 'rgba(202, 238, 167, 0.5)',
  /** Dimmer behind bottom sheets. */
  scrim: 'rgba(15, 23, 42, 0.3)',
} as const;

/** Talli brand gradient (dark green → lime), used for active states and progress. */
export const brandGradient = {
  colors: ['#0F9B71', '#CAEEA7'] as const,
  locations: [0.025909, 0.92227] as const,
};

export type ColorToken = keyof typeof colors;
