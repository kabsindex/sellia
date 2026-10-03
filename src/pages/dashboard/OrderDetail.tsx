import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge, DsButton, IconButton, PageHeader } from '../../components/ds';
import { ProductImage } from '../../components/shared/ProductImage';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { orderStatusFlow } from '../../data/orders';
import { orderTone } from '../../design/status';
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
      <div className="mx-auto max-w-[480px] py-16 text-center">
        <h1 className="ds-title text-[20px]">Commande introuvable</h1>
        <DsButton className="mt-4" onClick={() => navigate('/dashboard/commandes')}>Retour aux commandes</DsButton>
      </div>);
  }

  const meta = orderTone[order.status];
  const currentIndex = orderStatusFlow.indexOf(order.status);
  const cancelled = order.status === 'annulee';

  function setStatus(status: OrderStatus) {
    updateOrderStatus(order!.id, status);
    toast.success(`Commande ${order!.reference} : ${orderTone[status].label.toLowerCase()}.`);
  }

  function message() {
    const lines = [
    `Bonjour ${order!.customerName} 👋`,
    `C'est ${store.name}. Ta commande ${order!.reference} est ${meta.label.toLowerCase()}.`,
    '',
    ...order!.items.map((item) => `• ${item.name}${item.size ? ` · ${item.size}` : ''}${item.color ? ` · ${item.color}` : ''} × ${item.quantity}`),
    '',
    `Total : ${formatPrice(order!.total, store.currency)}`];
    openWhatsApp(order!.phone, lines.join('\n'));
  }

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-3"><IconButton label="Retour aux commandes" onClick={() => navigate('/dashboard/commandes')}><ArrowLeft className="size-[18px]" /></IconButton></div>
      <PageHeader
        title={order.reference}
        description={`Reçue le ${formatDateTime(order.createdAt)} · ${order.channel === 'whatsapp' ? 'WhatsApp' : 'Catalogue'}`}
        actions={<><Badge tone={meta.tone} className="!h-7 !px-3 !text-[12px]">{meta.label}</Badge><DsButton onClick={message}><WhatsAppIcon className="size-[18px]" />Écrire au client</DsButton></>} />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <section className="ds-card p-4">
            <h2 className="ds-title text-[16px]">Suivi de la commande</h2>
            {cancelled ?
            <p className="ds-muted mt-3 text-[14px]">Cette commande a été annulée.</p> :
            <ol className="mt-4 flex items-start">
                {orderStatusFlow.map((status, index) => {
                const done = index <= currentIndex;
                return (
                  <li key={status} className="relative flex flex-1 flex-col items-center gap-1.5 text-center">
                      {index > 0 && <span className="absolute right-1/2 top-[13px] h-0.5 w-full" style={{ background: 'var(--ds-border)' }}><motion.span className="block h-full origin-left" style={{ background: 'var(--ds-accent)' }} initial={false} animate={{ scaleX: index <= currentIndex ? 1 : 0 }} transition={{ duration: 0.4 }} /></span>}
                      <motion.span animate={{ background: done ? 'var(--ds-accent)' : 'var(--ds-card)', borderColor: done ? 'var(--ds-accent)' : 'var(--ds-border)' }} className="relative z-10 grid size-7 place-items-center rounded-full border-2">
                        {done && <Check className="size-3.5" style={{ color: 'var(--ds-accent-fg)' }} />}
                      </motion.span>
                      <span className="text-[11px] leading-tight sm:text-[12px]" style={{ color: done ? 'var(--ds-ink)' : 'var(--ds-muted)', fontWeight: index === currentIndex ? 700 : 500 }}>{orderTone[status].label}</span>
                    </li>);
              })}
              </ol>
            }
            <div className="mt-5">
              <p className="ds-label">Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {[...orderStatusFlow, 'annulee' as OrderStatus].map((status) =>
                <button key={status} type="button" onClick={() => setStatus(status)} disabled={order.status === status} className="ds-chip" data-active={order.status === status}>{orderTone[status].label}</button>
                )}
              </div>
            </div>
          </section>

          <section className="ds-card overflow-hidden">
            <h2 className="ds-title px-4 pt-4 text-[16px]">Articles ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</h2>
            <div className="mt-1">
              {order.items.map((item, index) =>
              <div key={index} className="ds-row">
                  <span className="size-14 shrink-0 overflow-hidden rounded-[12px]" style={{ background: 'var(--ds-subtle)' }}><ProductImage src={item.image} alt="" className="bg-transparent" imageClassName="p-1" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{item.name}</p>
                    <p className="ds-muted text-[12px]">{[item.color, item.size].filter(Boolean).join(' · ') || 'Standard'} · × {item.quantity}</p>
                  </div>
                  <span className="ds-price text-[14px]">{formatPrice(item.price * item.quantity, store.currency)}</span>
                </div>
              )}
            </div>
            <div className="flex items-baseline justify-between px-4 py-3.5" style={{ background: 'var(--ds-subtle)' }}>
              <span className="text-[14px] font-semibold">Total</span>
              <span className="ds-title text-[20px]">{formatPrice(order.total, store.currency)}</span>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="ds-card p-4">
            <h2 className="ds-title text-[16px]">Client</h2>
            <p className="mt-3 text-[15px] font-semibold">{order.customerName}</p>
            <a href={`tel:${order.phone}`} className="mt-2 flex items-center gap-2 text-[14px]"><Phone className="size-4 ds-muted" />{order.phone}</a>
            <p className="mt-2 flex items-start gap-2 text-[14px]"><MapPin className="mt-0.5 size-4 shrink-0 ds-muted" />{[order.address, order.city].filter(Boolean).join(', ') || 'Adresse non renseignée'}</p>
            {order.note && <p className="mt-3 rounded-[12px] p-3 text-[13px] leading-relaxed" style={{ background: 'var(--ds-warn-soft)', color: 'var(--ds-warn)' }}>{order.note}</p>}
          </section>
          <Link to="/dashboard/clients" className="ds-btn ds-btn--outline ds-btn--block">Voir tous les clients</Link>
        </aside>
      </div>
    </div>);
}
