import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, DollarSign, Eye, Home, LayoutGrid, Menu, Package, Plus, ShoppingBag, Store, Tags, Users } from 'lucide-react';
import { Badge, DsButton, StatTile } from '../ds';
import { AnimatedNumber } from '../ds/motion';
import { ProductImage } from '../shared/ProductImage';
import { Logo } from '../shared/Logo';
import { orderTone } from '../../design/status';
import { ease } from '../../design/motion';
import { formatPrice } from '../../utils/format';
import { sceneStore } from './scenes';
import type { Product } from '../../types';

export interface ShotOrder {
  id: number;
  customer: string;
  total: number;
  status: 'nouvelle' | 'confirmee' | 'livree';
  when: string;
}

export interface DashboardShotProps {
  view: 'form' | 'overview';
  /** Produits listés dans « Produits » (le plus récent en premier). */
  products: Product[];
  /** Produit en cours de création (vue « form »). */
  draft?: Product;
  published?: boolean;
  freshId?: string;
  orders: ShotOrder[];
}

const sidebar = [
{ label: 'Accueil', icon: Home },
{ label: 'Produits', icon: Package },
{ label: 'Commandes', icon: ShoppingBag },
{ label: 'Clients', icon: Users },
{ label: 'Catégories', icon: Tags },
{ label: 'Profil', icon: Store }];

function OrdersList({ orders }: {orders: ShotOrder[];}) {
  return (
    <section className="ds-card overflow-hidden">
      <div className="px-4 pb-1 pt-3.5"><h2 className="ds-title text-[15px]">Commandes récentes</h2></div>
      <div className="min-h-[150px]">
        {orders.length === 0 && <p className="ds-muted px-4 py-9 text-center text-[13px]">Les commandes de tes clients apparaîtront ici.</p>}
        <AnimatePresence initial={false}>
          {orders.slice().reverse().slice(0, 3).map((order) => {
            const meta = orderTone[order.status];
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: -16, backgroundColor: 'rgba(16,160,92,0.14)' }} animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(16,160,92,0)' }} transition={{ duration: 0.7, ease }} className="ds-row">
                <span className="grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-bold" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}>{order.customer.slice(0, 1)}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold">{order.customer}</p><p className="ds-muted text-[11.5px]">XG-{order.id} · {order.when}</p></div>
                <div className="flex flex-col items-end gap-0.5"><span className="ds-price text-[13.5px]">{formatPrice(order.total, sceneStore.currency)}</span><Badge tone={meta.tone}>{meta.label}</Badge></div>
              </motion.div>);
          })}
        </AnimatePresence>
      </div>
    </section>);
}

function ProductsList({ products, freshId }: {products: Product[];freshId?: string;}) {
  return (
    <section className="ds-card overflow-hidden">
      <div className="px-4 pb-1 pt-3.5"><h2 className="ds-title text-[15px]">Produits</h2></div>
      {products.slice(0, 3).map((product) =>
      <motion.div key={product.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease }} className="ds-row" style={freshId === product.id ? { background: 'var(--ds-accent-soft)' } : undefined}>
          <span className="size-10 shrink-0 overflow-hidden rounded-[10px]" style={{ background: 'var(--ds-subtle)' }}><ProductImage src={product.images[0]} alt="" className="bg-transparent" imageClassName="p-1" /></span>
          <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">{product.name}</p>
          {freshId === product.id ? <Badge tone="solid"><Check className="size-3" />Publié</Badge> : <Badge tone="accent">En ligne</Badge>}
          <span className="ds-price w-[44px] text-right text-[13px]">{formatPrice(product.price, sceneStore.currency)}</span>
        </motion.div>
      )}
    </section>);
}

/** Dashboard vendeur complet (taille logique 1040 × 600) — mêmes composants et styles que le vrai dashboard. */
export function DashboardDesktopShot({ view, products, draft, published, freshId, orders }: DashboardShotProps) {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  return (
    <div className="flex h-[600px] w-[1040px]" style={{ background: 'var(--ds-subtle)', color: 'var(--ds-ink)' }}>
      <aside className="flex w-[200px] shrink-0 flex-col gap-3 border-r p-3.5" style={{ background: 'var(--ds-card)', borderColor: 'var(--ds-border)' }}>
        <Logo className="origin-left scale-[0.8]" />
        <div className="flex items-center gap-2 rounded-[12px] p-2" style={{ background: 'var(--ds-subtle)' }}>
          <img src={sceneStore.logo} alt="" className="size-8 rounded-[9px] object-contain" style={{ background: 'var(--ds-card)' }} />
          <div className="min-w-0"><p className="truncate text-[12.5px] font-bold">{sceneStore.name}</p><p className="truncate font-mono text-[10px] ds-muted">sellia.app/novamarket</p></div>
        </div>
        <nav className="space-y-0.5">
          {sidebar.map((item) => {
            const active = view === 'form' ? item.label === 'Produits' : item.label === 'Accueil';
            return (
              <div key={item.label} className="relative flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px]" style={{ background: active ? 'var(--ds-accent-soft)' : 'transparent', color: active ? 'var(--ds-accent-strong)' : 'var(--ds-ink)', fontWeight: active ? 600 : 500 }}>
                <item.icon className="size-4" />{item.label}
                {item.label === 'Commandes' && orders.length > 0 && <motion.span key={orders.length} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="ds-badge ds-badge--solid ml-auto">{orders.length}</motion.span>}
              </div>);
          })}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[54px] items-center gap-3 border-b px-6" style={{ background: 'var(--ds-card)', borderColor: 'var(--ds-border)' }}>
          <p className="ds-title flex-1 text-[15px]">{view === 'form' ? 'Produits' : 'Accueil'}</p>
          <span className="ds-btn ds-btn--outline ds-btn--sm">Voir ma boutique</span>
          <span className="ds-icon-btn relative"><Bell className="size-[17px]" />{orders.length > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}>{orders.length}</span>}</span>
        </div>
        <div className="flex-1 overflow-hidden p-6">
          <AnimatePresence mode="wait" initial={false}>
            {view === 'form' ?
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
                <div className="mb-4 flex items-end justify-between"><div><h2 className="ds-title text-[22px]">Nouveau produit</h2><p className="ds-muted mt-0.5 text-[13px]">Photo, nom et prix suffisent pour publier.</p></div>
                  <motion.div animate={published ? { scale: [1, 1.06, 1] } : {}} transition={{ duration: 0.4 }}><DsButton>{published ? <><Check className="size-4" />Publié</> : 'Publier le produit'}</DsButton></motion.div>
                </div>
                <div className="grid grid-cols-[1fr_250px] gap-4">
                  <div className="ds-card space-y-3.5 p-4">
                    <div><p className="ds-label">Nom du produit</p><div className="ds-input flex items-center">{draft?.name}</div></div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><p className="ds-label">Prix ({sceneStore.currency})</p><div className="ds-input flex items-center">{draft?.price}</div></div>
                      <div><p className="ds-label">Ancien prix</p><div className="ds-input flex items-center ds-muted">—</div></div>
                      <div><p className="ds-label">Stock</p><div className="ds-input flex items-center">{draft?.stock}</div></div>
                    </div>
                    <div><p className="ds-label">Catégorie</p><div className="ds-input flex items-center">Sacs</div></div>
                    <div className="flex gap-2">{draft?.images.slice(0, 1).map((image) => <span key={image} className="size-[72px] overflow-hidden rounded-[12px]" style={{ background: 'var(--ds-subtle)' }}><ProductImage src={image} alt="" className="bg-transparent" imageClassName="p-1.5" /></span>)}<span className="grid size-[72px] place-items-center rounded-[12px] border border-dashed" style={{ borderColor: 'var(--ds-border)' }}><Plus className="size-4 ds-muted" /></span></div>
                  </div>
                  <div className="ds-card p-4"><p className="ds-title text-[14px]">Visibilité</p>{['Disponible à la commande', 'Produit vedette'].map((label, index) => <div key={label} className="flex items-center gap-3 py-3 text-[13px] font-medium" style={{ borderTop: '1px solid var(--ds-border)', marginTop: index === 0 ? 10 : 0 }}><span className="flex-1">{label}</span><span className="ds-toggle" aria-checked={index === 0} /></div>)}</div>
                </div>
              </motion.div> :

            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                <div className="mb-4 flex items-end justify-between"><div><h2 className="ds-title text-[22px]">Bonjour Grâce</h2><p className="ds-muted mt-0.5 text-[13px]">Voici l’activité de {sceneStore.name}.</p></div><DsButton><Plus className="size-4" />Ajouter un produit</DsButton></div>
                <div className="grid grid-cols-4 gap-3">
                  <StatTile label="Commandes" icon={ShoppingBag} hint={orders.length ? `${orders.length} à traiter` : 'Tout est à jour'}><AnimatedNumber value={orders.length} /></StatTile>
                  <StatTile label="Chiffre d’affaires" icon={DollarSign} tone="ink"><AnimatedNumber value={revenue} suffix="$" /></StatTile>
                  <StatTile label="Visiteurs (7 j)" icon={Eye} tone="ink">204</StatTile>
                  <StatTile label="Produits en ligne" icon={Package}><AnimatedNumber value={products.length} /></StatTile>
                </div>
                <div className="mt-3.5 grid grid-cols-[1.25fr_1fr] gap-3.5"><OrdersList orders={orders} /><ProductsList products={products} freshId={freshId} /></div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);
}

/** Dashboard mobile (taille logique 390 × 790) : barre du haut, statistiques, commandes, onglets. */
export function DashboardMobileShot({ products, orders }: Pick<DashboardShotProps, 'products' | 'orders'>) {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  return (
    <div className="flex h-[790px] w-[390px] flex-col" style={{ background: 'var(--ds-subtle)', color: 'var(--ds-ink)' }}>
      <div className="flex h-[60px] shrink-0 items-center gap-3 border-b px-4 pt-3" style={{ background: 'var(--ds-card)', borderColor: 'var(--ds-border)' }}>
        <Logo className="origin-left scale-[0.8]" /><p className="ds-title flex-1 text-[16px]">Accueil</p>
        <span className="ds-icon-btn relative"><Bell className="size-[18px]" />{orders.length > 0 && <motion.span key={orders.length} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="absolute -right-1 -top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full px-1 text-[10px] font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}>{orders.length}</motion.span>}</span>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden px-4 pt-4">
        <div><h2 className="ds-title text-[22px]">Bonjour Grâce</h2><p className="ds-muted text-[14px]">Voici l’activité de {sceneStore.name}.</p></div>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Commandes" icon={ShoppingBag}><AnimatedNumber value={orders.length} /></StatTile>
          <StatTile label="Chiffre d’affaires" icon={DollarSign} tone="ink"><AnimatedNumber value={revenue} suffix="$" /></StatTile>
        </div>
        <OrdersList orders={orders} />
        <ProductsList products={products} />
      </div>
      <div className="grid shrink-0 grid-cols-5 border-t px-1 pb-5 pt-1.5" style={{ background: 'var(--ds-card)', borderColor: 'var(--ds-border)' }}>
        {[[Home, 'Accueil'], [Package, 'Produits'], [ShoppingBag, 'Commandes'], [LayoutGrid, 'Stats'], [Menu, 'Menu']].map(([Icon, label], index) => {
          const I = Icon as typeof Home;
          return (
            <div key={label as string} className="flex flex-col items-center gap-0.5 text-[10.5px]" style={{ color: index === 0 ? 'var(--ds-accent-strong)' : 'var(--ds-muted)' }}>
              <span className="grid h-8 w-14 place-items-center rounded-full" style={{ background: index === 0 ? 'var(--ds-accent-soft)' : 'transparent' }}><I className="size-[21px]" /></span>{label as string}
            </div>);
        })}
      </div>
    </div>);
}
