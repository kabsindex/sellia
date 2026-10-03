import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, SearchX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { useLiveProducts } from '../../hooks/useLiveProducts';
import { ProductCard } from '../../components/store/ProductCard';
import { CategoryBubbles, DesktopTitle, MobileBar } from '../../components/store/StoreParts';
import { Chip, DsButton, EmptyState } from '../../components/ds';
import type { ProductLayout } from '../../types';

type Filter = 'tous' | 'nouveautes' | 'populaires' | 'promo';
type Sort = 'recents' | 'prix-asc' | 'prix-desc';

const filters: {id: Filter;label: string;}[] = [
{ id: 'tous', label: 'Tous' },
{ id: 'nouveautes', label: 'Nouveautés' },
{ id: 'populaires', label: 'Populaires' },
{ id: 'promo', label: 'Promo' }];

const sorts: {id: Sort;label: string;}[] = [
{ id: 'recents', label: 'Récents' },
{ id: 'prix-asc', label: 'Prix croissant' },
{ id: 'prix-desc', label: 'Prix décroissant' }];

const NEW_DAYS = 30;

export function StoreCatalog() {
  const { store, categories } = useSellia();
  const theme = useStoreTheme(store.theme);
  const navigate = useNavigate();
  const live = useLiveProducts();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<Sort>('recents');
  const [layout, setLayout] = useState<ProductLayout>(store.layout);
  const activeCategory = params.get('categorie') ?? 'tout';
  const filter = (params.get('filtre') as Filter | null) ?? 'tous';

  function update(next: Record<string, string | null>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => value ? merged.set(key, value) : merged.delete(key));
    setParams(merged, { replace: true });
  }

  const visible = useMemo(() => {
    const category = categories.find((item) => item.slug === activeCategory);
    const now = Date.now();
    let list = live.filter((product) => !category || product.categoryId === category.id);
    if (filter === 'promo') list = list.filter((product) => product.promo || (product.oldPrice ?? 0) > product.price);
    if (filter === 'nouveautes') list = list.filter((product) => now - new Date(product.createdAt).getTime() < NEW_DAYS * 864e5);
    const sorted = list.slice().sort((a, b) => {
      if (sort === 'prix-asc') return a.price - b.price;
      if (sort === 'prix-desc') return b.price - a.price;
      if (filter === 'populaires') return b.views - a.views;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted;
  }, [live, categories, activeCategory, filter, sort]);

  const activeName = categories.find((item) => item.slug === activeCategory)?.name;
  const gridClass = layout === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="mx-auto w-full max-w-[1200px] pb-8 lg:px-6 lg:pt-6">
      <MobileBar
        title="Catégories"
        right={<DsButton variant="ghost" size="sm" aria-label="Rechercher" onClick={() => navigate(`/${store.slug}/recherche`)}><Search className="size-[18px]" /></DsButton>} />
      <DesktopTitle title={activeName ?? 'Catalogue'} hint={`${visible.length} produit${visible.length > 1 ? 's' : ''}`} />

      <div className="px-4 lg:px-0">
        {categories.length > 0 &&
        <CategoryBubbles
          categories={categories}
          products={live}
          activeSlug={activeCategory}
          onSelect={(slug) => update({ categorie: slug === 'tout' ? null : slug })} />
        }

        <div className="ds-scroll-x -mx-4 mt-4 px-4 lg:mx-0 lg:px-0">
          {filters.map((item) =>
          <Chip key={item.id} active={filter === item.id} onClick={() => update({ filtre: item.id === 'tous' ? null : item.id })}>{item.label}</Chip>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="ds-muted text-[13px]" aria-live="polite">{visible.length} produit{visible.length > 1 ? 's' : ''}{activeName ? ` · ${activeName}` : ''}</p>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              aria-label="Trier les produits"
              className="ds-input !h-9 !w-auto !rounded-full !px-3 text-[13px]">
              {sorts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <div className="hidden items-center gap-1 sm:flex">
              <button type="button" aria-label="Affichage grille" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')} className="ds-icon-btn ds-icon-btn--sm" style={layout === 'grid' ? { background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' } : undefined}><LayoutGrid className="size-4" /></button>
              <button type="button" aria-label="Affichage liste" aria-pressed={layout === 'list'} onClick={() => setLayout('list')} className="ds-icon-btn ds-icon-btn--sm" style={layout === 'list' ? { background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' } : undefined}><List className="size-4" /></button>
            </div>
          </div>
        </div>

        {visible.length === 0 ?
        <EmptyState icon={SearchX} title="Aucun produit ici" text="Essaie une autre catégorie ou retire un filtre.">
            <DsButton variant="soft" onClick={() => setParams({}, { replace: true })}>Voir tous les produits</DsButton>
          </EmptyState> :

        <motion.div layout className={`mt-3 grid gap-3 lg:gap-4 ${gridClass}`}>
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((product) =>
            <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22 }}>
                  <ProductCard product={product} store={store} theme={theme} layout={layout} />
                </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        }
      </div>
    </div>);
}
