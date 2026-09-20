import React from 'react';
import { ArrowRight, CheckCircle2, Heart, Search, ShoppingBag } from 'lucide-react';
import { CategoryIcon } from '../shared/CategoryIcon';
import { ProductImage } from '../shared/ProductImage';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { demoCategories } from '../../data/categories';
import { demoProducts } from '../../data/products';
import { demoStore } from '../../data/store';
import { formatPrice } from '../../utils/format';

const chips = [{ label: 'Tout', slug: 'tout', icon: '' }, ...demoCategories.slice(0, 3).map((category) => ({
  label: category.name,
  slug: category.slug,
  icon: category.emoji
}))];

/** Aperçu statique d'une boutique SELLIA, utilisé dans les mockups smartphone. */
export function MiniStorePreview() {
  const items = demoProducts.filter((product) => !product.hidden).slice(0, 4);

  return (
    <div className="flex h-full flex-col bg-white text-[#0f1a15]">
      <div className="flex items-center gap-2 border-b border-[#eceeed] px-4 pb-2.5 pt-5">
        <img src={demoStore.logo} alt="" className="size-8 rounded-lg object-contain" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold leading-tight">{demoStore.name}</p>
          <p className="truncate text-[9px] text-[#7c8a83]">Mode & accessoires</p>
        </div>
        <Search className="size-3.5 text-[#7c8a83]" />
        <span className="relative">
          <ShoppingBag className="size-3.5 text-[#7c8a83]" />
          <span className="absolute -right-1 -top-1 grid size-2.5 place-items-center rounded-full bg-[#10a05c] text-[6px] font-bold text-white">
            2
          </span>
        </span>
      </div>

      <div className="flex-1 overflow-hidden px-4 pt-3">
        <div className="relative h-[140px] overflow-hidden rounded-lg">
          <img src={demoStore.coverMobile || demoStore.cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[6px] font-semibold text-white backdrop-blur">
              <CheckCircle2 className="size-2" /> Collection sélectionnée
            </span>
            <p className="mt-1.5 max-w-[18ch] text-[12px] font-semibold leading-tight text-white">
              Le dressing complet pour ton style
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex h-5 items-center gap-1 rounded-md bg-[#10a05c] px-2 text-[7px] font-semibold text-white">
                Voir le catalogue <ArrowRight className="size-2.5" />
              </span>
              <span className="inline-flex h-5 items-center gap-1 rounded-md border border-white/50 bg-black/15 px-2 text-[7px] font-semibold text-white backdrop-blur">
                <WhatsAppIcon className="size-2.5" /> Nous écrire
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-1.5">
          {chips.map((chip, index) =>
          <span
            key={chip.slug}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-medium ${
            index === 0 ? 'bg-[#0f1a15] text-white' : 'bg-[#f2f4f3] text-[#5d6b64]'}`
            }>
            
              {chip.slug !== 'tout' && <CategoryIcon slug={chip.slug} icon={chip.icon} className="size-2.5" />}
              {chip.label}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5 pb-2">
          {items.map((product) =>
          <div key={product.id} className="overflow-hidden rounded-xl border border-[#eceeed]">
              <div className="relative aspect-square bg-[#f6f7f7]">
                <ProductImage src={product.images[0]} alt="" className="bg-[#f6f7f7]" imageClassName="p-1.5" />
                {product.promo &&
              <span className="absolute left-1.5 top-1.5 rounded-md bg-[#10a05c] px-1.5 py-0.5 text-[7px] font-bold text-white">
                    PROMO
                  </span>
              }
                <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-white/90">
                  <Heart className="size-2 text-[#7c8a83]" />
                </span>
              </div>
              <div className="p-2">
                <p className="truncate text-[8.5px] font-medium leading-tight">{product.name}</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="text-[9px] font-semibold text-[#10a05c]">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice &&
                <span className="text-[7px] text-[#a3aeaa] line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#eceeed] p-3">
        <div className="flex h-8 items-center justify-center gap-1.5 rounded-xl bg-[#10a05c] text-[10px] font-semibold text-white">
          <WhatsAppIcon className="size-3" />
          Commander sur WhatsApp
        </div>
      </div>
    </div>);

}
