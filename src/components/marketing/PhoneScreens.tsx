import { AnimatePresence, motion } from 'framer-motion';
import { Check, CheckCheck, Plus, Search, ShoppingBag } from 'lucide-react';
import { ProductImage } from '../shared/ProductImage';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { AnimatedNumber, easeOut } from './motion';
import { demoProducts } from '../../data/products';
import { demoStore } from '../../data/store';
import { formatPrice } from '../../utils/format';
import type { Product } from '../../types';

const bySlug = (slug: string, fallback: number): Product =>
demoProducts.find((product) => product.slug === slug) ?? demoProducts[fallback];

/** Produits utilisés dans les scénarios animés de la landing. */
export const sceneProducts = {
  airForce: bySlug('nike-air-force-1-07', 0),
  jordan: bySlug('air-jordan-4-bred', 5),
  newBalance: bySlug('new-balance-530-silver', 1),
  bag: bySlug('sac-femme-taupe', 3)
};

interface ShopProps {
  products: Product[];
  addedIds?: string[];
  cartCount?: number;
  /** Produit qui vient d'apparaître (mis en avant). */
  freshId?: string;
}

/** Écran catalogue d'une boutique SELLIA (public). */
export function PhoneShop({ products, addedIds = [], cartCount = 0, freshId }: ShopProps) {
  return (
    <div className="flex h-full flex-col bg-white text-[#0f1a15]">
      <div className="flex items-center gap-2 border-b border-[#eceeed] px-4 pb-2.5 pt-6">
        <img src={demoStore.logo} alt="" className="size-8 rounded-lg object-contain" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold leading-tight">{demoStore.name}</p>
          <p className="truncate text-[9px] text-[#7c8a83]">sellia.app/novamarket</p>
        </div>
        <Search className="size-3.5 text-[#7c8a83]" />
        <span className="relative">
          <ShoppingBag className="size-4 text-[#0f1a15]" />
          <AnimatePresence>
            {cartCount > 0 &&
            <motion.span
              key={cartCount}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="absolute -right-1.5 -top-1.5 grid size-3.5 place-items-center rounded-full bg-[#10a05c] text-[8px] font-bold text-white">
                {cartCount}
              </motion.span>
            }
          </AnimatePresence>
        </span>
      </div>
      <div className="flex-1 overflow-hidden px-3.5 pt-3">
        <p className="text-[11px] font-semibold">Nouveautés</p>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {products.map((product) => {
            const added = addedIds.includes(product.id);
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className={`overflow-hidden rounded-xl border bg-white ${freshId === product.id ? 'border-[#10a05c] shadow-[0_0_0_3px_rgba(16,160,92,0.14)]' : 'border-[#eceeed]'}`}>
                <div className="relative aspect-square bg-[#f6f7f7]">
                  <ProductImage src={product.images[0]} alt="" className="bg-[#f6f7f7]" imageClassName="p-1.5" />
                  {freshId === product.id &&
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-[#10a05c] px-1.5 py-0.5 text-[7px] font-bold text-white">
                      NOUVEAU
                    </span>
                  }
                </div>
                <div className="flex items-center justify-between gap-1 p-2">
                  <div className="min-w-0">
                    <p className="truncate text-[8.5px] font-medium leading-tight">{product.name}</p>
                    <p className="mt-0.5 text-[9px] font-semibold text-[#10a05c]">{formatPrice(product.price)}</p>
                  </div>
                  <motion.span
                    animate={{ backgroundColor: added ? '#10a05c' : '#0f1a15' }}
                    className="grid size-5 shrink-0 place-items-center rounded-full text-white">
                    {added ? <Check className="size-3" /> : <Plus className="size-3" />}
                  </motion.span>
                </div>
              </motion.div>);
          })}
        </div>
      </div>
    </div>);
}

interface CartProps {
  lines: {product: Product;quantity: number;}[];
  ready: boolean;
}

/** Écran panier : le total se met à jour, le bouton WhatsApp s'active. */
export function PhoneCart({ lines, ready }: CartProps) {
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return (
    <div className="flex h-full flex-col bg-white text-[#0f1a15]">
      <div className="border-b border-[#eceeed] px-4 pb-2.5 pt-6">
        <p className="text-[12px] font-semibold">Mon panier</p>
        <p className="text-[9px] text-[#7c8a83]">{lines.length} produit{lines.length > 1 ? 's' : ''}</p>
      </div>
      <div className="flex-1 space-y-2 px-3.5 pt-3">
        {lines.map((line) =>
        <motion.div
          key={line.product.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          className="flex items-center gap-2.5 rounded-xl border border-[#eceeed] p-2">
            <div className="size-11 shrink-0 overflow-hidden rounded-lg bg-[#f6f7f7]">
              <ProductImage src={line.product.images[0]} alt="" className="bg-[#f6f7f7]" imageClassName="p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-medium">{line.product.name}</p>
              <p className="text-[9px] text-[#7c8a83]">Quantité : {line.quantity}</p>
            </div>
            <p className="text-[10px] font-semibold">{formatPrice(line.product.price * line.quantity)}</p>
          </motion.div>
        )}
      </div>
      <div className="border-t border-[#eceeed] p-3">
        <div className="mb-2.5 flex items-center justify-between text-[11px]">
          <span className="text-[#5d6b64]">Total</span>
          <span className="text-[14px] font-semibold"><AnimatedNumber value={total} suffix="$" /></span>
        </div>
        <motion.div
          animate={{
            backgroundColor: ready ? '#10a05c' : '#e4e8e6',
            color: ready ? '#ffffff' : '#8b9791',
            scale: ready ? [1, 1.03, 1] : 1
          }}
          transition={{ duration: 0.45 }}
          className="flex h-9 items-center justify-center gap-1.5 rounded-xl text-[10.5px] font-semibold">
          <WhatsAppIcon className="size-3.5" />
          Commander sur WhatsApp
        </motion.div>
      </div>
    </div>);
}

/** Écran WhatsApp : le message de commande arrive déjà rédigé, le vendeur répond. */
export function PhoneChat({ lines }: {lines: {product: Product;quantity: number;}[];}) {
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return (
    <div className="flex h-full flex-col bg-[#efeae2] text-[#0f1a15]">
      <div className="flex items-center gap-2 bg-[#0b6b4c] px-3.5 pb-2.5 pt-6 text-white">
        <img src={demoStore.logo} alt="" className="size-7 rounded-full bg-white object-contain p-0.5" />
        <div>
          <p className="text-[11px] font-semibold leading-tight">{demoStore.name}</p>
          <p className="text-[8px] text-white/75">en ligne</p>
        </div>
      </div>
      <div className="flex-1 space-y-2 px-3 pt-3">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: easeOut }}
          className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-2.5 py-2 text-[9px] leading-relaxed shadow-sm">
          <p>Bonjour 👋 Je souhaite passer une commande.</p>
          {lines.map((line, index) =>
          <p key={line.product.id} className="mt-1">
              {index + 1}. {line.product.name} : {formatPrice(line.product.price * line.quantity)}
            </p>
          )}
          <p className="mt-1 font-semibold">Total : {formatPrice(total)}</p>
          <p className="mt-1 flex items-center justify-end gap-0.5 text-[7px] text-[#667781]">
            14:32 <CheckCheck className="size-2.5 text-[#53bdeb]" />
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 1.1, ease: easeOut }}
          className="max-w-[80%] rounded-xl rounded-tl-sm bg-white px-2.5 py-2 text-[9px] leading-relaxed shadow-sm">
          Commande bien reçue ✅ Je te confirme la livraison dans un instant.
        </motion.div>
      </div>
    </div>);
}
