import { formatCurrency } from '@/utils/format';

import { AppText } from './AppText';

type Props = {
  collected: number;
  total: number;
  /** `sm` for carousel cards, `md` for full-width bill cards. */
  size?: 'sm' | 'md';
};

/** "₱12,000 / ₱16,000 collected" — emphasised amount followed by a muted total. */
export function CollectedAmount({ collected, total, size = 'sm' }: Props) {
  const amount = formatCurrency(collected);
  const rest = `${formatCurrency(total)} collected`;

  if (size === 'sm') {
    return (
      <AppText variant="micro" color="textSecondary" numberOfLines={1}>
        <AppText variant="captionMedium">{amount}</AppText>
        {` / ${rest}`}
      </AppText>
    );
  }

  return (
    <AppText variant="captionSm" color="textSecondary" numberOfLines={1}>
      <AppText variant="amountSm">{amount}</AppText>
      <AppText variant="bodySm" color="textSecondary">{' / '}</AppText>
      {rest}
    </AppText>
  );
}
