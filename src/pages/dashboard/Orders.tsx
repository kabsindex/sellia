import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, ShoppingBag } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ProductImage } from '../../components/shared/ProductImage';
import { useSellia } from '../../contexts/SelliaContext';
import { orderStatusMeta } from '../../data/orders';
import { formatPrice, formatRelative } from '../../utils/format';
import type { OrderStatus } from '../../types';

type Tab = 'toutes' | OrderStatus;

const tabs: {id: Tab;label: string;}[] = [
{ id: 'toutes', label: 'Toutes' },
{ id: 'nouvelle', label: 'Nouvelles' },
{ id: 'confirmee', label: 'Confirmées' },
{ id: 'preparation', label: 'En préparation' },
{ id: 'expediee', label: 'Expédiées' },
{ id: 'livree', label: 'Livrées' },
{ id: 'annulee', label: 'Annulées' }];


export function Orders() {
  const { orders, store } = useSellia();
  const [tab, setTab] = useState<Tab>('toutes');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
    orders.filter((order) => {
      const matchesTab = tab === 'toutes' || order.status === tab;
      const needle = query.toLowerCase();
      const matchesQuery =
      order.customerName.toLowerCase().includes(needle) ||
      order.reference.toLowerCase().includes(needle) ||
      order.phone.includes(needle);
      return matchesTab && matchesQuery;
    }),
    [orders, tab, query]
  );

  const revenue = filtered.
  filter((order) => order.status !== 'annulee').
  reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-[20px] font-semibold tracking-[-0.02em]">
            {filtered.length} commande{filtered.length > 1 ? 's' : ''}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Total affiché : {formatPrice(revenue, store.currency)}
          </p>
        </div>
        <div className="relative sm:w-[280px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Client, référence, téléphone…"
            className="pl-9"
            aria-label="Rechercher une commande" />
          
        </div>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        {tabs.map((item) => {
          const count =
          item.id === 'toutes' ?
          orders.length :
          orders.filter((order) => order.status === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                tab === item.id ?
                'border-brand bg-brand-soft text-brand-strong' :
                'border-border bg-card text-muted-foreground hover:text-foreground'
              )}>
              
              {item.label}
              <span className="text-[10px] opacity-60">{count}</span>
            </button>);

        })}
      </div>

      {filtered.length === 0 ?
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-secondary">
            <ShoppingBag className="size-5 text-muted-foreground" />
          </span>
          <h3 className="mt-4 font-heading text-base font-semibold">Aucune commande ici</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Partage le lien de ta boutique pour recevoir tes premières commandes.
          </p>
        </div> :

      <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {filtered.map((order) => {
          const meta = orderStatusMeta[order.status];
          return (
            <li key={order.id} className="border-b border-border last:border-0">
                <Link
                to={`/dashboard/commandes/${order.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/60">
                
                  <span className="relative">
                    <span className="block size-11 shrink-0 overflow-hidden rounded-xl border border-border">
                      <ProductImage src={order.items[0]?.image} alt="" imageClassName="p-1" />
                    </span>
                  
                    {order.items.length > 1 &&
                  <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">
                        {order.items.length}
                      </span>
                  }
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{order.customerName}</p>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        {order.reference}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {order.items.map((item) => item.name).join(', ')}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] ${meta.className}`}>
                        <span className={`mr-1 size-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {formatRelative(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">
                      {formatPrice(order.total, store.currency)}
                    </p>
                    <ChevronRight className="ml-auto mt-1 size-4 text-muted-foreground" />
                  </div>
                </Link>
              </li>);

        })}
        </ul>
      }
    </div>);

}
