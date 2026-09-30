import { AnimatePresence, motion } from 'framer-motion';
import { Check, LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react';
import { ProductImage } from '../shared/ProductImage';
import { AnimatedNumber, easeOut } from './motion';
import { formatPrice } from '../../utils/format';
import type { Product } from '../../types';

export interface MockOrder {
  id: number;
  label: string;
  total: number;
}

interface DashboardMockProps {
  mode: 'form' | 'list';
  products: Product[];
  freshId?: string;
  /** Produit affiché dans le formulaire « Nouveau produit ». */
  draft?: Product;
  orders: MockOrder[];
  className?: string;
}

const nav = [
{ label: 'Accueil', icon: LayoutDashboard },
{ label: 'Produits', icon: Package },
{ label: 'Commandes', icon: ShoppingBag },
{ label: 'Clients', icon: Users }];

/** Fenêtre de dashboard vendeur (aperçu marketing, données fictives). */
export function DashboardMock({ mode, products, freshId, draft, orders, className }: DashboardMockProps) {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const fresh = draft ?? products.find((product) => product.id === freshId);

  return (
    <div className={`overflow-hidden rounded-2xl border border-border bg-card shadow-lift ${className ?? ''}`}>
      <div className="flex items-center gap-1.5 border-b border-border bg-secondary/60 px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff6259]/70" />
        <span className="size-2.5 rounded-full bg-[#ffbf2f]/70" />
        <span className="size-2.5 rounded-full bg-[#29ce42]/70" />
        <span className="ml-3 truncate rounded-md bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground">
          sellia.app/dashboard
        </span>
      </div>
      <div className="grid h-[380px] grid-cols-[52px_minmax(0,1fr)] sm:grid-cols-[150px_minmax(0,1fr)]">
        <aside className="border-r border-border bg-secondary/30 p-2">
          {nav.map((item, index) => {
            const active = mode === 'form' ? index === 1 : index === 2 && orders.length > 0 || index === 1 && orders.length === 0;
            return (
              <div
                key={item.label}
                className={`relative mb-1 flex items-center gap-2 rounded-lg px-2 py-2 text-[12px] ${active ? 'bg-card font-medium text-foreground shadow-soft' : 'text-muted-foreground'}`}>
                <item.icon className="size-4 shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
                {item.label === 'Commandes' && orders.length > 0 &&
                <motion.span
                  key={orders.length}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-brand text-[9px] font-bold text-brand-foreground sm:static sm:ml-auto">
                    {orders.length}
                  </motion.span>
                }
              </div>);
          })}
        </aside>

        <div className="min-w-0 space-y-3 overflow-hidden p-3.5 sm:p-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">Commandes</p>
              <p className="mt-0.5 font-heading text-[22px] font-semibold leading-none">
                <AnimatedNumber value={orders.length} />
              </p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">Chiffre d’affaires</p>
              <p className="mt-0.5 font-heading text-[22px] font-semibold leading-none">
                <AnimatedNumber value={revenue} suffix="$" />
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {mode === 'form' ?
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-border p-3.5">
                <p className="text-[12px] font-semibold">Nouveau produit</p>
                <div className="mt-3 flex gap-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    {fresh && <ProductImage src={fresh.images[0]} alt="" className="bg-secondary" imageClassName="p-1" />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[12px]">{fresh?.name}</div>
                    <div className="flex gap-2">
                      <div className="w-20 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[12px]">
                        {fresh ? formatPrice(fresh.price) : ''}
                      </div>
                      <motion.div
                      animate={{ boxShadow: ['0 0 0 0 rgba(16,160,92,0.4)', '0 0 0 6px rgba(16,160,92,0)'] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="flex-1 rounded-lg bg-brand py-1.5 text-center text-[12px] font-semibold text-brand-foreground">
                        Publier
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div> :

            <motion.div
              key="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
                <div className="rounded-xl border border-border p-2.5">
                  <p className="px-1 text-[11px] font-semibold text-muted-foreground">Produits</p>
                  <div className="mt-1.5 space-y-1">
                    {products.slice(0, 2).map((product) =>
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ease: easeOut, duration: 0.35 }}
                    className={`flex items-center gap-2 rounded-lg px-1.5 py-1 ${freshId === product.id ? 'bg-brand-soft' : ''}`}>
                        <div className="size-7 shrink-0 overflow-hidden rounded-md bg-secondary">
                          <ProductImage src={product.images[0]} alt="" className="bg-secondary" imageClassName="p-0.5" />
                        </div>
                        <p className="min-w-0 flex-1 truncate text-[12px]">{product.name}</p>
                        <p className="text-[12px] font-medium">{formatPrice(product.price)}</p>
                        {freshId === product.id && <Check className="size-3.5 text-brand" />}
                      </motion.div>
                  )}
                  </div>
                </div>
                <div className="rounded-xl border border-border p-2.5">
                  <p className="px-1 text-[11px] font-semibold text-muted-foreground">Commandes récentes</p>
                  <div className="mt-1.5 min-h-[92px] space-y-1">
                    {orders.length === 0 &&
                  <p className="px-1.5 py-3 text-[12px] text-muted-foreground">Aucune commande pour l’instant.</p>
                  }
                    <AnimatePresence initial={false}>
                      {orders.slice().reverse().slice(0, 3).map((order) =>
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: -14, backgroundColor: 'rgba(16,160,92,0.16)' }}
                      animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(16,160,92,0)' }}
                      transition={{ duration: 0.6, ease: easeOut }}
                      className="flex items-center gap-2 rounded-lg px-1.5 py-1.5">
                          <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand-strong">Nouvelle</span>
                          <p className="min-w-0 flex-1 truncate text-[12px]">Commande #{order.id} · {order.label}</p>
                          <p className="text-[12px] font-semibold">{formatPrice(order.total)}</p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);
}
