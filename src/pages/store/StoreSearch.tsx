import { useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SearchX, X } from 'lucide-react';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { useLiveProducts } from '../../hooks/useLiveProducts';
import { ProductCard } from '../../components/store/ProductCard';
import { CategoryBubbles, MobileBar } from '../../components/store/StoreParts';
import { Chip, EmptyState } from '../../components/ds';

type Scope = 'tout' | 'produits' | 'categories';

export function StoreSearch() {
  const { store, categories } = useSellia();
  const theme = useStoreTheme(store.theme);
  const live = useLiveProducts();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const query = params.get('q') ?? '';
  const scope = (params.get('portee') as Scope | null) ?? 'tout';
  const needle = query.trim().toLowerCase();

  function update(next: Record<string, string | null>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => value ? merged.set(key, value) : merged.delete(key));
    setParams(merged, { replace: true });
  }

  const { products, matchedCategories } = useMemo(() => {
    if (!needle) return { products: [], matchedCategories: [] };
    const cats = categories.filter((category) => category.name.toLowerCase().includes(needle));
    const catIds = new Set(cats.map((category) => category.id));
    const found = live.filter((product) =>
    product.name.toLowerCase().includes(needle) ||
    product.description.toLowerCase().includes(needle) ||
    (scope !== 'produits' && catIds.has(product.categoryId))
    );
    return { products: found, matchedCategories: cats };
  }, [needle, live, categories, scope]);

  return (
    <div className="mx-auto w-full max-w-[1200px] pb-8 lg:px-6 lg:pt-8">
      <MobileBar title="Recherche" />
      <div className="px-4 lg:px-0">
        <label className="ds-search mt-1 lg:mt-0 lg:max-w-[520px]">
          <Search className="size-4 shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            type="search"
            value={query}
            onChange={(event) => update({ q: event.target.value || null })}
            placeholder="Rechercher un produit, une catégorie…"
            aria-label="Rechercher" />
          {query &&
          <button type="button" aria-label="Effacer" onClick={() => { update({ q: null }); inputRef.current?.focus(); }}>
              <X className="size-4" />
            </button>
          }
        </label>

        {!needle ?
        <div className="mt-6">
            <p className="text-[14px] font-semibold">Parcourir par catégorie</p>
            <div className="mt-3">
              <CategoryBubbles categories={categories} products={live} activeSlug="" allLabel="Tout" wrap onSelect={(slug) => navigate(slug === 'tout' ? `/${store.slug}/catalogue` : `/${store.slug}/catalogue?categorie=${slug}`)} />
            </div>
          </div> :

        <>
            <div className="ds-scroll-x -mx-4 mt-4 px-4 lg:mx-0 lg:px-0">
              {([['tout', 'Tous'], ['produits', 'Produits'], ['categories', 'Catégories']] as [Scope, string][]).map(([id, label]) =>
            <Chip key={id} active={scope === id} onClick={() => update({ portee: id === 'tout' ? null : id })}>{label}</Chip>
            )}
            </div>
            <p className="ds-muted mt-4 text-[13px]" aria-live="polite">
              {products.length} résultat{products.length > 1 ? 's' : ''} pour « {query.trim()} »
            </p>
            {scope !== 'produits' && matchedCategories.length > 0 &&
          <div className="mt-3">
                <CategoryBubbles categories={matchedCategories} products={live} activeSlug="" onSelect={(slug) => navigate(`/${store.slug}/catalogue?categorie=${slug}`)} allLabel="Tout" />
              </div>
          }
            {scope !== 'categories' && products.length > 0 &&
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                {products.map((product) => <ProductCard key={product.id} product={product} store={store} theme={theme} layout="grid" />)}
              </div>
          }
            {products.length === 0 &&
          <EmptyState icon={SearchX} title="Aucun résultat" text="Vérifie l’orthographe ou essaie un mot plus court." />
          }
          </>
        }
      </div>
    </div>);
}
