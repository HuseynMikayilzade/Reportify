// 8pt spacing grid — Reportify Design System

export const Spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
  // Named aliases
  screenH: 20,        // horizontal screen padding
  cardPadV: 14,       // card vertical padding
  cardPadH: 16,       // card horizontal padding
  bottomNavH: 64,     // bottom nav height
  fabBottom: 24,      // FAB offset above nav
  sectionLabel: 8,    // section label margin-bottom
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 18,
  full: 999,
  card: 14,
  fab: 16,
  fabCompact: 13,
  button: 12,
  input: 12,
  badge: 6,
  avatar: 16,
} as const;
