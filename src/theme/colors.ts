// Design System Color Tokens — Reportify v1.0
// Dark mode only · Fintech-inspired

export const Colors = {
  // Primary Palette
  primary: '#7C6FFF',
  accent: '#5B8DEF',
  primaryGhost: 'rgba(124,111,255,0.15)',
  primaryBorder: 'rgba(124,111,255,0.30)',

  // Backgrounds & Surfaces
  bg: '#0E0D18',
  surface: '#12111A',
  card: '#1A192A',
  overlay: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  borderSubtle: 'rgba(255,255,255,0.06)',

  // Semantic
  success: '#44DC96',
  warning: '#FFB044',
  error: '#FF5A6E',
  muted: '#6B6880',

  // Text
  textPrimary: 'rgba(255,255,255,0.90)',
  textSecondary: 'rgba(255,255,255,0.65)',
  textTertiary: 'rgba(255,255,255,0.40)',
  textMuted: '#6B6880',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#7C6FFF', '#5B8DEF'] as const,
  gradientBar: ['rgba(124,111,255,0.35)', '#7C6FFF'] as const,

  // Role Badge Colors
  roleBg: {
    employee: 'rgba(124,111,255,0.13)',
    admin: 'rgba(124,111,255,0.13)',
    superAdmin: 'rgba(91,141,239,0.15)',
    offline: 'rgba(255,90,110,0.13)',
  },
  roleText: {
    employee: '#9D94FF',
    admin: '#9D94FF',
    superAdmin: '#7EB0FF',
    offline: '#FF7A8A',
  },

  // Status Badges
  syncedBg: 'rgba(68,220,150,0.12)',
  pendingBg: 'rgba(255,176,68,0.13)',
  failedBg: 'rgba(255,90,110,0.13)',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Toast
  toastBg: '#1E1D29',
} as const;

export type ColorKey = keyof typeof Colors;
