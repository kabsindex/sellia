import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, Rows3, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../../components/store/ProductCard';
import { CategoryIcon } from '../../components/shared/CategoryIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useQuickOrder } from '../../hooks/useQuickOrder';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { PLAN_FEATURES } from '../../data/plans';
import type { ProductLayout } from '../../types';

type Sort = 'recents' | 'prix-asc' | 'prix-desc';

const sorts: {id: Sort;label: string;}[] = [
{ id: 'recents', label: 'Plus récents' },
{ id: 'prix-asc', label: 'Prix croissant' },
{ id: 'prix-desc', label: 'Prix décroissant' }];


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
    const list = products.filter(
      (product) => !product.hidden && (!category || product.categoryId === category.id)
    ).slice(0, productLimit);
    return list.slice().sort((a, b) => {
      if (sort === 'prix-asc') return a.price - b.price;
      if (sort === 'prix-desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, categories, activeCategory, sort, store.plan]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <h1 className="font-heading text-[22px] font-semibold tracking-[-0.02em]">Catalogue</h1>
      <p className="mt-1 text-sm" style={{ color: theme.muted }}>
        {visible.length} produit{visible.length > 1 ? 's' : ''} disponible
        {visible.length > 1 ? 's' : ''}
      </p>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        <button
          type="button"
          onClick={() => setParams({})}
          className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold"
          style={
          activeCategory === 'tout' ?
          { backgroundColor: theme.accent, color: theme.accentText } :
          { backgroundColor: theme.accentSoft, color: theme.text }
          }>
          
          Tout
        </button>
        {categories.map((category) =>
        <button
          key={category.id}
          type="button"
          onClick={() => setParams({ categorie: category.slug })}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium"
          style={
          activeCategory === category.slug ?
          { backgroundColor: theme.accent, color: theme.accentText } :
          { backgroundColor: theme.accentSoft, color: theme.text }
          }>
          
            <CategoryIcon slug={category.slug} icon={category.emoji} className="size-3.5" />
            {category.name}
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <SlidersHorizontal className="size-4 shrink-0" style={{ color: theme.muted }} />
        <div className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
          {sorts.map((item) =>
          <button
            key={item.id}
            type="button"
            onClick={() => setSort(item.id)}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
            style={{
              border: `1px solid ${sort === item.id ? theme.accent : theme.border}`,
              color: sort === item.id ? theme.accent : theme.muted
            }}>
            
              {item.label}
            </button>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          {[
          { id: 'grid' as ProductLayout, icon: LayoutGrid, label: 'Affichage grille' },
          { id: 'list' as ProductLayout, icon: Rows3, label: 'Affichage liste' }].
          map((option) =>
          <button
            key={option.id}
            type="button"
            onClick={() => setLayout(option.id)}
            aria-label={option.label}
            aria-pressed={layout === option.id}
            className="grid size-8 place-items-center rounded-lg"
            style={{
              border: `1px solid ${layout === option.id ? theme.accent : theme.border}`,
              color: layout === option.id ? theme.accent : theme.muted
            }}>
            
              <option.icon className="size-4" />
            </button>
          )}
        </div>
      </div>

      {visible.length === 0 ?
      <div
        className="mt-8 rounded-2xl p-10 text-center"
        style={{ border: `1px dashed ${theme.border}` }}>
        
          <p className="text-sm font-medium">Aucun produit dans cette catégorie</p>
          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
            Reviens bientôt, de nouveaux articles arrivent chaque semaine.
          </p>
        </div> :

      <div
        className={`mt-5 grid gap-3 ${
        layout === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`
        }>
        
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
    </div>);

}
