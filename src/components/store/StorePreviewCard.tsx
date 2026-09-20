import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { ProductImage } from '../shared/ProductImage';
import { getTheme } from '../../utils/themes';
import { formatPrice } from '../../utils/format';
import type { Category, Product, Store } from '../../types';

interface StorePreviewCardProps {
  store: Store;
  products: Product[];
  categories: Category[];
}

/** Rendu miniature de la boutique, utilisé pour l'aperçu en direct de l'Apparence. */
export function StorePreviewCard({ store, products, categories }: StorePreviewCardProps) {
  const theme = getTheme(store.theme);

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: theme.surface, color: theme.text, fontFamily: store.font }}>
      
      <div
        className="flex items-center gap-2 px-3.5 pb-2.5 pt-6"
        style={{ borderBottom: `1px solid ${theme.border}` }}>
        
        {store.logo && <img src={store.logo} alt="" className="size-6 rounded-md object-contain" />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold leading-tight">{store.name || 'Ma boutique'}</p>
          <p className="truncate text-[8px]" style={{ color: theme.muted }}>
            {[store.category, store.city].filter(Boolean).join(' · ')}
          </p>
        </div>
        <Search className="size-3" style={{ color: theme.muted }} />
        <ShoppingBag className="size-3" style={{ color: theme.muted }} />
      </div>

      <div className="flex-1 overflow-hidden px-3.5 pt-2.5">
        {(store.coverMobile || store.cover) &&
        <div className="relative h-[74px] overflow-hidden rounded-lg">
            <img src={store.coverMobile || store.cover} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-white">
                {store.heroTitle}
              </p>
            </div>
          </div>
        }

        <div className="mt-2.5 flex gap-1">
          {categories.slice(0, 3).map((category, index) =>
          <span
            key={category.id}
            className="rounded-full px-1.5 py-0.5 text-[7px] font-medium"
            style={
            index === 0 ?
            { backgroundColor: theme.accent, color: theme.accentText } :
            { backgroundColor: theme.accentSoft, color: theme.muted }
            }>
            
              {category.name}
            </span>
          )}
        </div>

        <div className={`mt-2.5 grid gap-2 ${store.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {products.map((product) =>
          <div
            key={product.id}
            className={`overflow-hidden rounded-lg ${store.layout === 'list' ? 'flex gap-2' : ''}`}
            style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card }}>
            
              <div className={store.layout === 'list' ? 'size-11 shrink-0' : 'aspect-square'}>
                <ProductImage src={product.images[0]} alt="" imageClassName="p-1" />
              </div>
              <div className="min-w-0 flex-1 p-1.5">
                <p className="truncate text-[8px] font-medium leading-tight">{product.name}</p>
                <p className="mt-0.5 text-[8.5px] font-semibold" style={{ color: theme.accent }}>
                  {formatPrice(product.price, store.currency)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
        <div
          className="flex h-7 items-center justify-center rounded-lg text-[9px] font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          
          {store.ctaLabel}
        </div>
        {store.showBranding &&
        <p className="mt-1.5 text-center text-[7px]" style={{ color: theme.muted }}>
            Propulsé par SELLIA
          </p>
        }
      </div>
    </div>);

}
