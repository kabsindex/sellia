import { useCallback } from 'react';
import { useSellia } from '../contexts/SelliaContext';
import { buildProductMessage, openWhatsApp } from '../utils/whatsapp';
import type { Product } from '../types';

/**
 * Commande express : génère le message WhatsApp pré-rempli pour un produit
 * avec sa première variante disponible.
 */
export function useQuickOrder() {
  const { store } = useSellia();

  return useCallback(
    (product: Product) => {
      const message = buildProductMessage(store, {
        name: product.name,
        slug: product.slug,
        price: product.price,
        size: product.sizes[0],
        color: product.colors[0]?.name,
        quantity: 1
      });
      openWhatsApp(store.whatsapp, message);
    },
    [store]
  );
}