import React from 'react';
import { Heart } from 'lucide-react';
import { ProductCard } from '../../components/store/ProductCard';
import { useSellia } from '../../contexts/SelliaContext';
import { useQuickOrder } from '../../hooks/useQuickOrder';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { PLAN_FEATURES } from '../../data/plans';

export function StoreFavorites() {
  const { store, products, favorites } = useSellia();
  const theme = useStoreTheme(store.theme);
  const quickOrder = useQuickOrder();
  const productLimit = PLAN_FEATURES[store.plan].maxProducts;
  const visible = products
    .filter((product) => !product.hidden && favorites.includes(product.id))
    .slice(0, productLimit);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: theme.muted }}>{store.name}</p>
      <h1 className="mt-1 font-heading text-[24px] font-semibold tracking-[-0.03em]">Mes favoris</h1>
      <p className="mt-1 text-sm" style={{ color: theme.muted }}>
        {visible.length} produit{visible.length > 1 ? 's' : ''} enregistré{visible.length > 1 ? 's' : ''}
      </p>

      {visible.length === 0 ? (
        <div
          className="mt-8 rounded-2xl p-10 text-center"
          style={{ border: `1px dashed ${theme.border}` }}>
          <span
            className="mx-auto grid size-12 place-items-center rounded-full"
            style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
            <Heart className="size-5" />
          </span>
          <p className="mt-4 text-sm font-medium">Aucun favori pour le moment</p>
          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
            Appuie sur le cœur d’un produit pour le retrouver ici.
          </p>
        </div>
      ) : (
        <div
          className={`mt-5 grid gap-3 ${
            store.layout === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'
          }`}>
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              store={store}
              theme={theme}
              layout={store.layout}
              onOrder={quickOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
