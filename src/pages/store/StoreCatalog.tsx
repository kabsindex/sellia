import React, { useMemo, useState } from 'react';
import { LayoutGrid, Rows3, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/store/ProductCard';
import { CategoryIcon } from '../../components/shared/CategoryIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useQuickOrder } from '../../hooks/useQuickOrder';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { PLAN_FEATURES } from '../../data/plans';
import type { ProductLayout } from '../../types';

type Sort = 'recents' | 'prix-asc' | 'prix-desc';

const sorts: {id: Sort;label: string;}[] = [
  { id: 'recents', label: 'Nouveautés' },
  { id: 'prix-asc', label: 'Prix +' },
  { id: 'prix-desc', label: 'Prix -' }
];

export function StoreCatalog() {
  const { store, products, categories } = useSellia();
  const theme = useStoreTheme(store.theme);
  const quickOrder = useQuickOrder();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<Sort>('recents');
  const [layout, setLayout] = useState<ProductLayout>(store.layout);
  const activeCategory = params.get('categorie') ?? 'tout';

  const visible = useMemo(() => {
    const category = categories.find((item) => item.slug === activeCategory);
    const productLimit = PLAN_FEATURES[store.plan].maxProducts;
    const list = products
      .filter((product) => !product.hidden && (!category || product.categoryId === category.id))
      .slice(0, productLimit);

    return list.slice().sort((a, b) => {
      if (sort === 'prix-asc') return a.price - b.price;
      if (sort === 'prix-desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, categories, activeCategory, sort, store.plan]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: theme.muted }}>{store.name}</p>
        <h1 className="mt-1 font-heading text-[24px] font-semibold tracking-[-0.03em]">Catégories</h1>
      </div>

      <div className="no-scrollbar -mx-4 mt-5 flex gap-4 overflow-x-auto px-4 pb-2">
        <button
          type="button"
          onClick={() => setParams({})}
          className="flex w-[72px] shrink-0 flex-col items-center gap-2 text-center">
          <span
            className="grid size-14 place-items-center rounded-full"
            style={{
              backgroundColor: activeCategory === 'tout' ? theme.accent : theme.card,
              border: `1px solid ${activeCategory === 'tout' ? theme.accent : theme.border}`,
              color: activeCategory === 'tout' ? theme.accentText : theme.accent
            }}>
            <LayoutGrid className="size-5" />
          </span>
          <span className="text-[10px] font-semibold">Tous</span>
        </button>

        {categories.map((category) =>
        <button
          key={category.id}
          type="button"
          onClick={() => setParams({ categorie: category.slug })}
          className="flex w-[72px] shrink-0 flex-col items-center gap-2 text-center">
          <span
            className="grid size-14 place-items-center rounded-full"
            style={{
              backgroundColor: activeCategory === category.slug ? theme.accent : theme.card,
              border: `1px solid ${activeCategory === category.slug ? theme.accent : theme.border}`,
              color: activeCategory === category.slug ? theme.accentText : theme.accent
            }}>
            <CategoryIcon slug={category.slug} icon={category.emoji} className="size-5" />
          </span>
          <span className="line-clamp-2 text-[10px] font-medium leading-tight">{category.name}</span>
        </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <SlidersHorizontal className="size-4 shrink-0" style={{ color: theme.muted }} />
        <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {sorts.map((item) =>
          <button
            key={item.id}
            type="button"
            onClick={() => setSort(item.id)}
            className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold"
            style={
              sort === item.id
                ? { backgroundColor: theme.accent, color: theme.accentText }
                : { backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.muted }
            }>
            {item.label}
          </button>
          )}
        </div>

        <div className="flex shrink-0 gap-1">
          {[
            { id: 'grid' as ProductLayout, icon: LayoutGrid, label: 'Grille' },
            { id: 'list' as ProductLayout, icon: Rows3, label: 'Liste' }
          ].map((option) =>
          <button
            key={option.id}
            type="button"
            onClick={() => setLayout(option.id)}
            aria-label={option.label}
            className="grid size-8 place-items-center rounded-full"
            style={{
              backgroundColor: layout === option.id ? theme.accentSoft : theme.card,
              border: `1px solid ${layout === option.id ? theme.accent : theme.border}`,
              color: layout === option.id ? theme.accent : theme.muted
            }}>
            <option.icon className="size-4" />
          </button>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">
          {activeCategory === 'tout'
            ? 'Tous les produits'
            : categories.find((item) => item.slug === activeCategory)?.name || 'Produits'}
        </p>
        <span className="text-xs" style={{ color: theme.muted }}>
          {visible.length} produit{visible.length > 1 ? 's' : ''}
        </span>
      </div>

      {visible.length === 0 ?
      <div className="mt-8 rounded-2xl p-10 text-center" style={{ border: `1px dashed ${theme.border}` }}>
        <p className="text-sm font-medium">Aucun produit dans cette catégorie</p>
        <p className="mt-1 text-xs" style={{ color: theme.muted }}>Reviens bientôt pour découvrir les nouveautés.</p>
      </div> :
      <div className={`mt-3 grid gap-3 ${layout === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {visible.map((product) =>
        <ProductCard
          key={product.id}
          product={product}
          store={store}
          theme={theme}
          layout={layout}
          onOrder={quickOrder} />
        )}
      </div>
      }
    </div>
  );
}
