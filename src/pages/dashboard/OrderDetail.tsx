import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Phone, StickyNote, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { ProductImage } from '../../components/shared/ProductImage';
import { cn } from '../../utils/cn';
import { Badge } from '../../components/ui/Badge';
import { Separator } from '../../components/ui/Separator';
import { useSellia } from '../../contexts/SelliaContext';
import { orderStatusFlow, orderStatusMeta } from '../../data/orders';
import { formatDateTime, formatPrice } from '../../utils/format';
import { openWhatsApp } from '../../utils/whatsapp';
import type { OrderStatus } from '../../types';

export function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, store, updateOrderStatus } = useSellia();
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <h2 className="font-heading text-base font-semibold">Commande introuvable</h2>
        <Button className="mt-4" onClick={() => navigate('/dashboard/commandes')}>
          Retour aux commandes
        </Button>
      </div>);

  }

  const meta = orderStatusMeta[order.status];
  const currentIndex = orderStatusFlow.indexOf(order.status);

  function setStatus(status: OrderStatus) {
    updateOrderStatus(order.id, status);
    toast.success(`Commande ${order.reference} : ${orderStatusMeta[status].label.toLowerCase()}.`);
  }

  function message() {
    const lines = [
    `Bonjour ${order.customerName} 👋`,
    `C'est ${store.name}. Ta commande ${order.reference} est ${meta.label.toLowerCase()}.`,
    '',
    ...order.items.map(
      (item) =>
      `• ${item.name}${item.size ? ` · ${item.size}` : ''}${
      item.color ? ` · ${item.color}` : ''} × ${
      item.quantity}`
    ),
    '',
    `Total : ${formatPrice(order.total, store.currency)}`];

    openWhatsApp(order.phone, lines.join('\n'));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/commandes')}>
          <ArrowLeft className="size-4" />
          Commandes
        </Button>
        <h2 className="font-heading text-[18px] font-semibold tracking-[-0.02em]">
          {order.reference}
        </h2>
        <Badge variant="outline" className={`${meta.className}`}>
          {meta.label}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <h3 className="font-heading text-sm font-semibold">Suivi de la commande</h3>
            <ol className="mt-4 space-y-0">
              {orderStatusFlow.map((status, index) => {
                const reached = order.status !== 'annulee' && index <= currentIndex;
                const isLast = index === orderStatusFlow.length - 1;
                return (
                  <li key={status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          'grid size-6 shrink-0 place-items-center rounded-full border text-[10px] font-semibold',
                          reached ?
                          'border-brand bg-brand text-brand-foreground' :
                          'border-border bg-card text-muted-foreground'
                        )}>
                        
                        {index + 1}
                      </span>
                      {!isLast &&
                      <span
                        className={cn('h-8 w-px', reached ? 'bg-brand/40' : 'bg-border')} />

                      }
                    </div>
                    <div className="pb-3">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          reached ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                        
                        {orderStatusMeta[status].label}
                      </p>
                      {index === currentIndex && order.status !== 'annulee' &&
                      <p className="text-xs text-muted-foreground">Statut actuel</p>
                      }
                    </div>
                  </li>);

              })}
            </ol>

            <Separator className="my-4" />

            <p className="text-xs font-medium text-muted-foreground">Changer le statut</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {orderStatusFlow.map((status) =>
              <Button
                key={status}
                size="sm"
                variant={order.status === status ? 'default' : 'outline'}
                onClick={() => setStatus(status)}>
                
                  {orderStatusMeta[status].label}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-destructive"
                onClick={() => setStatus('annulee')}>
                
                <XCircle className="size-3.5" />
                Annuler
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-soft">
            <header className="border-b border-border px-4 py-3.5">
              <h3 className="font-heading text-sm font-semibold">
                Articles ({order.items.length})
              </h3>
            </header>
            <ul className="divide-y divide-border">
              {order.items.map((item) =>
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 px-4 py-3">
                  <span className="size-14 shrink-0 overflow-hidden rounded-xl border border-border">
                    <ProductImage src={item.image} alt="" imageClassName="p-1" />
                  </span>
                
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {[item.size && `Taille ${item.size}`, item.color, `Qté ${item.quantity}`].
                    filter(Boolean).
                    join(' · ')}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">
                    {formatPrice(item.price * item.quantity, store.currency)}
                  </p>
                </li>
              )}
            </ul>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-sm font-medium">Total</span>
              <span className="font-heading text-lg font-semibold">
                {formatPrice(order.total, store.currency)}
              </span>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h3 className="font-heading text-sm font-semibold">Client</h3>
            <p className="mt-3 text-sm font-medium">{order.customerName}</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                {order.phone}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {order.address}, {order.city}
              </li>
              {order.note &&
              <li className="flex items-start gap-2">
                  <StickyNote className="mt-0.5 size-4 shrink-0" />
                  {order.note}
                </li>
              }
            </ul>
            <Button className="mt-4 w-full" onClick={message}>
              <WhatsAppIcon className="size-4" />
              Répondre sur WhatsApp
            </Button>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h3 className="font-heading text-sm font-semibold">Détails</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Référence</dt>
                <dd className="font-mono text-xs">{order.reference}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Reçue le</dt>
                <dd className="text-right">{formatDateTime(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Canal</dt>
                <dd className="capitalize">{order.channel}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>);

}
