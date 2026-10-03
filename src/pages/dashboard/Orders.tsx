import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { Badge, EmptyState, PageHeader, SearchField, Segmented } from '../../components/ds';
import { AnimatedNumber } from '../../components/ds/motion';
import { ProductImage } from '../../components/shared/ProductImage';
import { useSellia } from '../../contexts/SelliaContext';
import { orderTone } from '../../design/status';
import { formatPrice, formatRelative } from '../../utils/format';
import type { OrderStatus } from '../../types';

type Tab = 'toutes' | OrderStatus;
const tabLabels: {id: Tab;label: string;}[] = [
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

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return orders.filter((order) =>
    (tab === 'toutes' || order.status === tab) && (
    order.customerName.toLowerCase().includes(needle) || order.reference.toLowerCase().includes(needle) || order.phone.includes(needle))
    );
  }, [orders, tab, query]);

  const revenue = filtered.filter((order) => order.status !== 'annulee').reduce((sum, order) => sum + order.total, 0);
  const options = tabLabels.map((item) => ({ ...item, count: item.id === 'nouvelle' ? orders.filter((order) => order.status === 'nouvelle').length : undefined }));

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader title="Commandes" description="Les commandes envoyées par tes clients sur WhatsApp." />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented label="Statut des commandes" value={tab} options={options} onChange={setTab} />
        <SearchField value={query} onChange={setQuery} placeholder="Client, référence, téléphone" className="lg:w-[300px]" />
      </div>
      <p className="ds-muted mt-3 text-[13px]" aria-live="polite">
        {filtered.length} commande{filtered.length > 1 ? 's' : ''} · <span className="font-semibold" style={{ color: 'var(--ds-ink)' }}><AnimatedNumber value={revenue} suffix={store.currency} /></span> encaissés ou à encaisser
      </p>

      <div className="ds-card mt-3 overflow-hidden">
        {filtered.length === 0 ?
        <EmptyState icon={ShoppingBag} title="Aucune commande ici" text="Les commandes de tes clients apparaîtront dans cette liste." /> :
        filtered.map((order) => {
          const meta = orderTone[order.status];
          return (
            <Link key={order.id} to={`/dashboard/commandes/${order.id}`} className="ds-row">
              <span className="flex -space-x-3">
                {order.items.slice(0, 2).map((item, index) =>
                <span key={index} className="size-11 overflow-hidden rounded-[11px] border-2" style={{ background: 'var(--ds-subtle)', borderColor: 'var(--ds-card)' }}><ProductImage src={item.image} alt="" className="bg-transparent" imageClassName="p-1" /></span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-semibold">{order.customerName}</p>
                  <Badge tone={meta.tone} className="hidden sm:inline-flex">{meta.label}</Badge>
                </div>
                <p className="ds-muted truncate text-[12px]">{order.reference} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} article{order.items.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 's' : ''} · {formatRelative(order.createdAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="ds-price text-[14px]">{formatPrice(order.total, store.currency)}</span>
                <Badge tone={meta.tone} className="sm:hidden">{meta.label}</Badge>
              </div>
              <ChevronRight className="ds-muted hidden size-4 sm:block" />
            </Link>);
        })}
      </div>
    </div>);
}
