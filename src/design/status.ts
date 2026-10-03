import type { OrderStatus } from '../types';

export type StatusTone = 'neutral' | 'accent' | 'solid' | 'danger' | 'warn' | 'ink' | 'info' | 'violet';

/** Libellé + couleur de badge pour chaque statut de commande (une seule source). */
export const orderTone: Record<OrderStatus, {label: string;tone: StatusTone;}> = {
  nouvelle: { label: 'Nouvelle', tone: 'solid' },
  confirmee: { label: 'Confirmée', tone: 'info' },
  preparation: { label: 'En préparation', tone: 'warn' },
  expediee: { label: 'Expédiée', tone: 'violet' },
  livree: { label: 'Livrée', tone: 'accent' },
  annulee: { label: 'Annulée', tone: 'danger' }
};
