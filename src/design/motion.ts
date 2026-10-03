/** Réglages d'animation communs (storefront, dashboard, landing). */
export const ease = [0.22, 1, 0.36, 1] as const;
export const spring = { type: 'spring', stiffness: 420, damping: 30 } as const;
export const springSoft = { type: 'spring', stiffness: 300, damping: 28 } as const;
export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease }
} as const;
