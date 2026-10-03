import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, Check, Grid2X2, Heart, Home as HomeIcon, Plus, Search, ShoppingBag, Store as StoreIcon } from 'lucide-react';
import { CategoryIcon } from '../shared/CategoryIcon';
import { ProductImage } from '../shared/ProductImage';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { AnimatedNumber } from '../ds/motion';
import { discountPercent } from '../ds';
import { themeVars } from '../../design/theme';
import { spring } from '../../design/motion';
import { formatPrice } from '../../utils/format';
import { getTheme } from '../../utils/themes';
import type { Category, Product, Store } from '../../types';

/**
 * Reproduction fidèle (à l'échelle d'un téléphone) de la vraie boutique SELLIA.
 * Utilisée par l'aperçu de l'Apparence et par les mockups de la landing : un seul design.
 */
export interface MiniStorefrontProps {
  store: Store;
  products: Product[];
  categories: Category[];
  view?: 'home' | 'product' | 'cart';
  cartCount?: number;
  addedIds?: string[];
  favoriteIds?: string[];
  activeCategory?: string;
  freshId?: string;
  /** Produit affiché sur la fiche (vue « product »). */
  focus?: Product;
  /** Lignes du panier (vue « cart »). */
  lines?: {product: Product;quantity: number;}[];
  cartReady?: boolean;
}

const tabs = [HomeIcon, Grid2X2, Heart, ShoppingBag, StoreIcon];
const tabLabels = ['Accueil', 'Catégories', 'Favoris', 'Panier', 'Boutique'];

function CartBubble({ count }: {count: number;}) {
  return (
    <AnimatePresence initial={false}>
      {count > 0 &&
      <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0.4 }} transition={spring} className="absolute -right-1 -top-1 grid size-[13px] place-items-center rounded-full text-[7.5px] font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)', boxShadow: '0 0 0 1.5px var(--ds-bg)' }}>{count}</motion.span>
      }
    </AnimatePresence>);
}

function TabBar({ active, cartCount }: {active: number;cartCount: number;}) {
  return (
    <div className="grid grid-cols-5 border-t px-1 pb-2 pt-1" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-card)' }}>
      {tabs.map((Icon, index) =>
      <div key={index} className="flex flex-col items-center gap-px" style={{ color: index === active ? 'var(--ds-accent-strong)' : 'var(--ds-muted)' }}>
          <span className="relative grid h-[22px] w-9 place-items-center rounded-full" style={{ background: index === active ? 'var(--ds-accent-soft)' : 'transparent' }}>
            <Icon className="size-[13px]" strokeWidth={index === active ? 2.4 : 2} />
            {index === 3 && <CartBubble count={cartCount} />}
          </span>
          <span className="text-[6.5px] font-medium" style={{ color: index === active ? 'var(--ds-ink)' : 'var(--ds-muted)' }}>{tabLabels[index]}</span>
        </div>
      )}
    </div>);
}

function MiniCard({ product, added, favorite, fresh, currency }: {product: Product;added: boolean;favorite: boolean;fresh: boolean;currency: string;}) {
  const discount = discountPercent(product.price, product.oldPrice);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="ds-card relative overflow-hidden !rounded-[11px]" style={fresh ? { borderColor: 'var(--ds-accent)', boxShadow: '0 0 0 2px color-mix(in srgb, var(--ds-accent) 25%, transparent)' } : undefined}>
      <div className="relative aspect-[1/0.92]" style={{ background: 'var(--ds-subtle)' }}>
        <ProductImage src={product.images[0]} alt="" className="bg-transparent" imageClassName="p-1.5" />
        {(discount || fresh) && <span className="absolute left-1 top-1 rounded-[5px] px-1 py-px text-[6.5px] font-bold" style={fresh ? { background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' } : { background: 'var(--ds-danger-soft)', color: 'var(--ds-danger)' }}>{fresh ? 'NOUVEAU' : `-${discount}%`}</span>}
        <motion.span key={String(favorite)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring} className="absolute right-1 top-1 grid size-[17px] place-items-center rounded-full bg-white/95"><Heart className="size-[9px]" style={favorite ? { fill: '#ef4444', color: '#ef4444' } : { color: '#0f1a15' }} /></motion.span>
      </div>
      <div className="px-1.5 pb-1.5 pt-1 pr-7">
        <p className="truncate text-[8px] font-semibold leading-tight">{product.name}</p>
        <p className="mt-px text-[8.5px] font-bold">{formatPrice(product.price, currency)}</p>
      </div>
      <motion.span animate={{ scale: added ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.35 }} className="absolute bottom-1 right-1 grid size-[19px] place-items-center rounded-[6px]" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}>
        {added ? <Check className="size-[10px]" /> : <Plus className="size-[10px]" />}
      </motion.span>
    </motion.div>);
}

function Home({ store, products, categories, cartCount, addedIds = [], favoriteIds = [], activeCategory = 'tout', freshId }: MiniStorefrontProps) {
  const category = categories.find((item) => item.slug === activeCategory);
  const shown = products.filter((product) => !category || product.categoryId === category.id).slice(0, 4);
  const items = [{ slug: 'tout', name: 'Tous', emoji: 'grid', image: undefined as string | undefined }].concat(categories.slice(0, 4).map((item) => ({ slug: item.slug, name: item.name, emoji: item.emoji, image: products.find((product) => product.categoryId === item.id)?.images[0] })));
  const verified = store.plan === 'premium' && store.verificationStatus === 'verified';
  return (
    <>
      <div className="flex-1 overflow-hidden px-3 pt-6">
        <div className="flex items-center gap-1.5">
          {store.logo ? <img src={store.logo} alt="" className="size-[22px] rounded-full object-contain" style={{ background: 'var(--ds-subtle)' }} /> : <span className="grid size-[22px] place-items-center rounded-full text-[9px] font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}>{(store.name || 'M').slice(0, 1)}</span>}
          <p className="flex min-w-0 flex-1 items-center gap-0.5 text-[10px] font-bold"><span className="truncate">{store.name || 'Ma boutique'}</span>{verified && <BadgeCheck className="size-[10px] shrink-0" style={{ color: 'var(--ds-accent)' }} />}</p>
          <span className="grid size-[20px] place-items-center rounded-full border" style={{ borderColor: 'var(--ds-border)' }}><Search className="size-[9px]" /></span>
          <span className="relative grid size-[20px] place-items-center rounded-full border" style={{ borderColor: 'var(--ds-border)' }}><ShoppingBag className="size-[9px]" /><CartBubble count={cartCount ?? 0} /></span>
        </div>
        <div className="ds-search mt-2 !h-[24px] !gap-1.5 !px-2"><Search className="size-[9px]" /><span className="text-[8px]">Rechercher un produit…</span></div>
        <div className="relative mt-2 flex h-[78px] flex-col justify-center overflow-hidden rounded-[13px] px-2.5 text-white" style={{ background: 'var(--ds-accent)' }}>
          {(store.coverMobile || store.cover) && <img src={store.coverMobile || store.cover} alt="" className="absolute inset-0 size-full object-cover" />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(8,14,11,0.72), rgba(8,14,11,0.1))' }} />
          <p className="relative line-clamp-2 max-w-[70%] text-[10px] font-bold leading-tight">{store.heroTitle || store.name}</p>
          <span className="relative mt-1.5 w-fit rounded-[6px] px-1.5 py-[3px] text-[7px] font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}>{store.ctaLabel || 'Découvrir'}</span>
        </div>
        <div className="mt-2.5 flex justify-between">
          {items.map((item) => {
            const active = activeCategory === item.slug;
            return (
              <div key={item.slug} className="flex w-[40px] flex-col items-center gap-0.5">
                <span className="grid size-[32px] place-items-center overflow-hidden rounded-full transition-all" style={{ background: active ? 'var(--ds-accent-soft)' : 'var(--ds-subtle)', color: 'var(--ds-accent-strong)', boxShadow: active ? '0 0 0 1.5px var(--ds-accent)' : 'inset 0 0 0 1px var(--ds-border)' }}>
                  {item.image ? <img src={item.image} alt="" className="size-full object-contain p-0.5" /> : <CategoryIcon slug={item.slug} icon={item.emoji} className="size-[13px]" />}
                </span>
                <span className="max-w-full truncate text-[6.5px]" style={{ fontWeight: active ? 700 : 500, color: active ? 'var(--ds-ink)' : 'var(--ds-muted)' }}>{item.name}</span>
              </div>);
          })}
        </div>
        <div className="mt-2.5 flex items-center justify-between"><p className="text-[9.5px] font-bold">{category ? category.name : 'Produits populaires'}</p><p className="text-[7.5px] font-semibold" style={{ color: 'var(--ds-accent-strong)' }}>Voir tout</p></div>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {shown.map((product) => <MiniCard key={product.id} product={product} currency={store.currency} added={addedIds.includes(product.id)} favorite={favoriteIds.includes(product.id)} fresh={freshId === product.id} />)}
        </div>
      </div>
      <TabBar active={0} cartCount={cartCount ?? 0} />
    </>);
}

function ProductView({ store, focus, addedIds = [] }: MiniStorefrontProps) {
  if (!focus) return null;
  const discount = discountPercent(focus.price, focus.oldPrice);
  const added = addedIds.includes(focus.id);
  return (
    <>
      <div className="relative h-[190px] shrink-0" style={{ background: 'var(--ds-subtle)' }}>
        <ProductImage src={focus.images[0]} alt="" className="bg-transparent" imageClassName="p-5" />
        <span className="absolute left-2.5 top-9 grid size-[22px] place-items-center rounded-full bg-white/95"><ArrowLeft className="size-[10px] text-[#0f1a15]" /></span>
        <span className="absolute right-2.5 top-9 grid size-[22px] place-items-center rounded-full bg-white/95"><Heart className="size-[10px] text-[#0f1a15]" /></span>
      </div>
      <div className="relative -mt-3 flex-1 overflow-hidden rounded-t-[16px] px-3 pt-3" style={{ background: 'var(--ds-bg)' }}>
        <p className="text-[11px] font-bold leading-tight">{focus.name}</p>
        <div className="mt-1 flex items-center gap-1.5"><span className="text-[13px] font-bold">{formatPrice(focus.price, store.currency)}</span>{focus.oldPrice && <span className="text-[8px] line-through" style={{ color: 'var(--ds-muted)' }}>{formatPrice(focus.oldPrice, store.currency)}</span>}{discount && <span className="rounded-[5px] px-1 py-px text-[7px] font-bold" style={{ background: 'var(--ds-danger-soft)', color: 'var(--ds-danger)' }}>-{discount}%</span>}<span className="ml-auto rounded-[5px] px-1 py-px text-[7px] font-bold" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}>En stock</span></div>
        {focus.sizes.length > 0 && <><p className="mt-2.5 text-[8px] font-bold">Taille</p><div className="mt-1 flex gap-1">{focus.sizes.slice(0, 5).map((size, index) => <span key={size} className="grid h-[19px] min-w-[22px] place-items-center rounded-[6px] border px-1 text-[7.5px] font-semibold" style={index === 1 ? { background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)', borderColor: 'var(--ds-accent)' } : { borderColor: 'var(--ds-border)', color: 'var(--ds-muted)' }}>{size}</span>)}</div></>}
      </div>
      <div className="flex gap-1.5 border-t px-3 pb-3 pt-2" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-card)' }}>
        <motion.span animate={{ scale: added ? [1, 1.12, 1] : 1 }} className="grid h-[28px] w-[34px] place-items-center rounded-[9px] border" style={{ borderColor: 'var(--ds-border)' }}>{added ? <Check className="size-[11px]" style={{ color: 'var(--ds-accent)' }} /> : <ShoppingBag className="size-[11px]" />}</motion.span>
        <span className="flex h-[28px] flex-1 items-center justify-center gap-1 rounded-[9px] text-[8px] font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}><WhatsAppIcon className="size-[11px]" />Commander sur WhatsApp</span>
      </div>
    </>);
}

function CartView({ store, lines = [], cartReady = true }: MiniStorefrontProps) {
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return (
    <>
      <div className="flex-1 overflow-hidden px-3 pt-9">
        <p className="text-center text-[10px] font-bold">Mon panier</p>
        <div className="mt-2.5 space-y-1.5">
          {lines.map((line) =>
          <motion.div key={line.product.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="ds-card flex gap-2 !rounded-[11px] p-1.5">
              <span className="size-[38px] shrink-0 overflow-hidden rounded-[8px]" style={{ background: 'var(--ds-subtle)' }}><ProductImage src={line.product.images[0]} alt="" className="bg-transparent" imageClassName="p-1" /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-[8.5px] font-semibold">{line.product.name}</p><p className="mt-0.5 text-[9px] font-bold">{formatPrice(line.product.price * line.quantity, store.currency)}</p></div>
              <span className="self-end rounded-[6px] border px-1.5 py-0.5 text-[8px] font-semibold" style={{ borderColor: 'var(--ds-border)' }}>× {line.quantity}</span>
            </motion.div>
          )}
        </div>
        <div className="ds-card mt-2 !rounded-[11px] p-2">
          <div className="flex justify-between text-[8px]"><span style={{ color: 'var(--ds-muted)' }}>Livraison</span><span className="font-medium">À confirmer</span></div>
          <div className="mt-1 flex items-baseline justify-between"><span className="text-[9px] font-bold">Total</span><span className="text-[13px] font-bold"><AnimatedNumber value={total} suffix={store.currency} /></span></div>
        </div>
      </div>
      <div className="border-t px-3 pb-3 pt-2" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-card)' }}>
        <motion.span animate={{ opacity: cartReady ? 1 : 0.45, scale: cartReady ? [1, 1.03, 1] : 1 }} transition={{ duration: 0.4 }} className="flex h-[30px] items-center justify-center gap-1 rounded-[10px] text-[8.5px] font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}><WhatsAppIcon className="size-[12px]" />Commander sur WhatsApp · {formatPrice(total, store.currency)}</motion.span>
      </div>
    </>);
}

export function MiniStorefront(props: MiniStorefrontProps) {
  const theme = getTheme(props.store.theme);
  const { view = 'home' } = props;
  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ ...themeVars(theme), fontFamily: props.store.font === 'Georgia' ? 'Georgia, serif' : `"${props.store.font}", ui-sans-serif, system-ui, sans-serif` }}>
      {view === 'home' && <Home {...props} />}
      {view === 'product' && <ProductView {...props} />}
      {view === 'cart' && <CartView {...props} />}
    </div>);
}
