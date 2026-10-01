import type React from 'react';
import type { StoreTheme } from '../utils/themes';

/** Applique un thème de boutique au design system (variables --ds-*). */
export function themeVars(theme: StoreTheme): React.CSSProperties {
  return {
    '--ds-accent': theme.accent,
    '--ds-accent-strong': theme.accent,
    '--ds-accent-soft': theme.accentSoft,
    '--ds-accent-fg': theme.accentText,
    '--ds-bg': theme.surface,
    '--ds-card': theme.card,
    '--ds-ink': theme.text,
    '--ds-muted': theme.muted,
    '--ds-border': theme.border,
    '--ds-subtle': `color-mix(in srgb, ${theme.text} 4.5%, ${theme.surface})`,
    backgroundColor: theme.surface,
    color: theme.text
  } as React.CSSProperties;
}
