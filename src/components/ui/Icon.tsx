import { Image, type ImageSource } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';

type Layer = { source: ImageSource | number; x: number; y: number; width: number; height: number };
type IconDef = { width: number; height: number; layers: Layer[] };

/** A single SVG centered in its Figma frame, rendered at the SVG's own size. */
function centered(source: number, box: [number, number], svg: [number, number]): IconDef {
  const [width, height] = box;
  const [w, h] = svg;
  return { width, height, layers: [{ source, x: (width - w) / 2, y: (height - h) / 2, width: w, height: h }] };
}

const registry = {
  arrowRight: centered(require('@/assets/icons/arrow-right-brand.svg'), [12, 12], [12, 12]),
  checkMd: centered(require('@/assets/icons/check-md.svg'), [18, 18], [18, 18]),
  sheetBack: centered(require('@/assets/icons/sheet-back.svg'), [24, 24], [24, 24]),
  check: centered(require('@/assets/icons/check-white.svg'), [7.636, 7.636], [7.636, 7.636]),
  divide: centered(require('@/assets/icons/divide.svg'), [13, 13], [13, 13]),
  trash: centered(require('@/assets/icons/trash.svg'), [14, 14], [14, 14]),
  plusMuted: centered(require('@/assets/icons/plus-sm.svg'), [13, 13], [13, 13]),
  chevronDownSm: centered(require('@/assets/icons/chevron-down-sm.svg'), [14, 14], [14, 14]),
  chevronLeft: centered(require('@/assets/icons/chevron-left.svg'), [18, 18], [18, 18]),
  chevronRight: centered(require('@/assets/icons/chevron-right.svg'), [5, 9], [6.5, 10.5]),
  crystalBall: centered(require('@/assets/icons/crystal-ball.svg'), [24, 24], [24, 24]),
  calendar: {
    width: 18,
    height: 18,
    layers: [
      { source: require('@/assets/icons/calendar-body.svg'), x: 0.6, y: 2.1, width: 16.8, height: 15.3 },
      { source: require('@/assets/icons/calendar-top.svg'), x: 0.6, y: 0.6, width: 16.8, height: 7.8 },
    ],
  },
  dot: centered(require('@/assets/icons/notif-badge.svg'), [8, 8], [8, 8]),
  walletCards: centered(require('@/assets/icons/wallet-cards.svg'), [16, 16], [16, 16]),
  arrowDown: centered(require('@/assets/icons/arrow-down.svg'), [20, 20], [20, 20]),
  car: centered(require('@/assets/icons/car.svg'), [20, 20], [20, 20]),
  package: centered(require('@/assets/icons/package.svg'), [20, 20], [20, 20]),
  add: centered(require('@/assets/icons/add.svg'), [20, 20], [20, 20]),
  addWhite: centered(require('@/assets/icons/add-white.svg'), [20, 20], [20, 20]),
  /** The whole 40pt back button (white circle, border and arrow) is one Figma asset. */
  backButton: centered(require('@/assets/icons/back-button.svg'), [40, 40], [40, 40]),
  settingsSm: centered(require('@/assets/icons/settings-sm.svg'), [18, 18], [18, 18]),
  plusLg: centered(require('@/assets/icons/plus-lg.svg'), [39, 39], [31.2, 31.2]),
  plus: centered(require('@/assets/icons/plus.svg'), [20, 20], [16, 16]),
  plusSm: centered(require('@/assets/icons/plus.svg'), [16, 16], [16, 16]),
  home: centered(require('@/assets/icons/tab-dashboard.svg'), [24, 24], [24, 24]),
  notebook: centered(require('@/assets/icons/tab-bills.svg'), [24, 24], [24, 24]),
  wallet: centered(require('@/assets/icons/tab-accounts.svg'), [24, 24], [20, 20]),
  /** Figma draws this tab icon at 27pt, larger than the other 24pt tab icons. */
  userSettings: centered(require('@/assets/icons/tab-profile.svg'), [27, 27], [27, 27]),
  helpInfo: centered(require('@/assets/icons/help-info.svg'), [20, 20], [18, 18]),
  shieldCheckSm: centered(require('@/assets/icons/shield-check-sm.svg'), [13, 13], [10, 10]),
  pencil: centered(require('@/assets/icons/pencil.svg'), [17, 17], [14, 14]),
  chevronRightMuted: centered(require('@/assets/icons/chevron-right-muted.svg'), [17, 17], [14, 14]),
  userPen: {
    width: 24,
    height: 24,
    layers: [{ source: require('@/assets/icons/settings-user-pen.svg'), x: 6, y: 4, width: 17.1113, height: 18 }],
  },
  bell: {
    width: 16,
    height: 16,
    layers: [{ source: require('@/assets/icons/settings-bell.svg'), x: 1.6667, y: 0.3333, width: 12.6656, height: 15.3333 }],
  },
  shieldCheck: centered(require('@/assets/icons/settings-shield.svg'), [18, 18], [16, 16]),
  coins: centered(require('@/assets/icons/settings-currency.svg'), [14.143, 11], [16.1429, 13]),
  palette: centered(require('@/assets/icons/settings-palette.svg'), [18, 18], [16, 16]),
  circleHelp: centered(require('@/assets/icons/settings-help.svg'), [20, 20], [16, 16]),
  fieldUser: centered(require('@/assets/icons/field-user.svg'), [17, 17], [14, 14]),
  fieldMail: centered(require('@/assets/icons/field-mail.svg'), [17, 17], [14, 14]),
  fieldPhone: centered(require('@/assets/icons/field-phone.svg'), [17, 17], [14, 14]),
  fieldCalendar: centered(require('@/assets/icons/field-calendar.svg'), [17, 17], [14, 14]),
  infoBrand: centered(require('@/assets/icons/info-brand.svg'), [16, 16], [13, 13]),
  checkSm: centered(require('@/assets/icons/check-white-sm.svg'), [18, 18], [14, 14]),
  camera: centered(require('@/assets/icons/camera.svg'), [14, 14], [11, 11]),
  bellRing: centered(require('@/assets/icons/notif-bell-ring.svg'), [20, 20], [16, 16]),
  arrowDownToLine: centered(require('@/assets/icons/notif-arrow-down-to-line.svg'), [18, 18], [14, 14]),
  arrowUpFromLine: centered(require('@/assets/icons/notif-arrow-up-from-line.svg'), [18, 18], [14, 14]),
  walletCardsSm: centered(require('@/assets/icons/notif-wallet-cards.svg'), [18, 18], [14, 14]),
  calendarClock: centered(require('@/assets/icons/notif-calendar-clock.svg'), [18, 18], [14, 14]),
  barChart: centered(require('@/assets/icons/notif-chart.svg'), [18, 18], [14, 14]),
  smartphone: centered(require('@/assets/icons/notif-smartphone.svg'), [18, 18], [14, 14]),
  megaphone: centered(require('@/assets/icons/notif-megaphone.svg'), [18, 18], [14, 14]),
  keyRound: centered(require('@/assets/icons/security-key-round.svg'), [18, 18], [14, 14]),
  scanFace: centered(require('@/assets/icons/security-scan-face.svg'), [18, 18], [14, 14]),
  shieldPlus: centered(require('@/assets/icons/security-shield-plus.svg'), [18, 18], [14, 14]),
  eye: centered(require('@/assets/icons/security-eye.svg'), [18, 18], [14, 14]),
  barChart3: centered(require('@/assets/icons/security-bar-chart-3.svg'), [18, 18], [14, 14]),
  fileLock: centered(require('@/assets/icons/security-file-lock-2.svg'), [18, 18], [14, 14]),
  chevronDownAccount: centered(require('@/assets/icons/chevron-down-account.svg'), [13, 13], [13, 13]),
  arrowRightTransfer: centered(require('@/assets/icons/arrow-right-transfer.svg'), [15, 15], [15, 15]),
  calendarDaysSm: centered(require('@/assets/icons/calendar-days-sm.svg'), [14, 14], [14, 14]),
  talliLogo: centered(require('@/assets/icons/talli-logo.svg'), [86.049, 41.0213], [86.049, 41.0213]),
  authUser: centered(require('@/assets/icons/auth-user.svg'), [18, 18], [18, 18]),
  authMail: centered(require('@/assets/icons/auth-mail.svg'), [18, 18], [18, 18]),
  authLock: centered(require('@/assets/icons/auth-lock.svg'), [18, 18], [18, 18]),
  authEye: centered(require('@/assets/icons/auth-eye.svg'), [18, 18], [18, 18]),
  arrowRightWhite: centered(require('@/assets/icons/arrow-right-white.svg'), [16, 16], [16, 16]),
  appleMark: centered(require('@/assets/icons/apple-mark.svg'), [17, 20], [17, 20]),
  appleMarkSm: centered(require('@/assets/icons/apple-mark-sm.svg'), [14.45, 17], [14.45, 17]),
  googleMark: centered(require('@/assets/icons/google-mark.svg'), [17, 17], [17, 17]),
  checkboxCheck: centered(require('@/assets/icons/checkbox-check.svg'), [12, 12], [12, 12]),
  logOut: centered(require('@/assets/icons/settings-logout.svg'), [18, 18], [14, 14]),
  close: centered(require('@/assets/icons/sheet-close.svg'), [12, 12], [12, 12]),
  calendarSmBold: centered(require('@/assets/icons/calendar-sm-bold.svg'), [14, 14], [14, 14]),
  calendarSm: centered(require('@/assets/icons/sheet-calendar.svg'), [14, 14], [14, 14]),
  userSm: centered(require('@/assets/icons/sheet-user.svg'), [14, 14], [14, 14]),
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof registry;

type Props = {
  name: IconName;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, style }: Props) {
  const icon: IconDef = registry[name];
  return (
    <View pointerEvents="none" style={[{ width: icon.width, height: icon.height }, style]}>
      {icon.layers.map((layer, index) => (
        <Image
          key={index}
          source={layer.source}
          contentFit="fill"
          style={{ position: 'absolute', left: layer.x, top: layer.y, width: layer.width, height: layer.height }}
        />
      ))}
    </View>
  );
}
