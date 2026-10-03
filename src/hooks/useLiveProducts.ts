import { useMemo } from 'react';
import { useSellia } from '../contexts/SelliaContext';
import { PLAN_FEATURES } from '../data/plans';

/** Produits visibles en boutique : non masqués, dans la limite du plan du vendeur. */
export function useLiveProducts() {
  const { products, store } = useSellia();
  return useMemo(
    () => products.filter((product) => !product.hidden).slice(0, PLAN_FEATURES[store.plan].maxProducts),
    [products, store.plan]
  );
}
