import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Copy, DollarSign, Eye, Package, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge, DsButton, EmptyState, PageHeader, StatTile } from '../../components/ds';
import { AnimatedNumber, Reveal } from '../../components/ds/motion';
import { ProductImage } from '../../components/shared/ProductImage';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { canPublishProduct } from '../../data/plans';
import { orderTone } from '../../design/status';
import { formatPrice, formatRelative } from '../../utils/format';
import { storefrontUrl } from '../../utils/whatsapp';

export function DashboardHome() {
  const navigate = useNavigate();
  const { user, store, orders, products, analytics } = useSellia();
  const [copied, setCopied] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);

  const stats = useMemo(() => {
    const todayKey = new Date().toDateString();
    return {
      today: orders.filter((order) => new Date(order.createdAt).toDateString() === todayKey).length,
      revenue: orders.filter((order) => order.status !== 'annulee').reduce((sum, order) => sum + order.total, 0),
      products: products.filter((product) => !product.hidden).length,
      pending: orders.filter((order) => order.status === 'nouvelle').length
    };
  }, [orders, products]);

  const orderedQuantities = useMemo(() => {
    const totals = new Map<string, number>();
    for (const order of orders) {
      if (order.status === 'annulee') continue;
      for (const item of order.items) totals.set(item.productId, (totals.get(item.productId) ?? 0) + item.quantity);
    }
    return totals;
  }, [orders]);

  const recentOrders = orders.slice(0, 5);
  const popular = products.filter((product) => !product.hidden).slice().sort((a, b) => b.views - a.views).slice(0, 4);
  const currentPlan = user?.plan ?? store.plan;
  const limitReached = !canPublishProduct(currentPlan, stats.products);
  const link = storefrontUrl(store.slug);

  function addProduct() {
    if (limitReached) {
      setPremiumDialogOpen(true);
      return;
    }
    navigate('/dashboard/produits/nouveau');
  }

  function copyLink() {
    void navigator.clipboard?.writeText(link);
    setCopied(true);
    toast.success('Lien de la boutique copié.');
    window.setTimeout(() => setCopied(false), 1800);
  }

  function shareOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Découvre ma boutique ${store.name} : ${link}`)}`, '_blank');
  }

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title={`Bonjour ${user?.firstName ?? ''}`.trim()}
        description={`Voici l’activité de ${store.name}.`}
        actions={<DsButton onClick={addProduct}><Plus className="size-4" />Ajouter un produit</DsButton>} />

      <Reveal>
        <div className="ds-card flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold ds-muted">Le lien de ta boutique</p>
            <p className="mt-0.5 truncate font-mono text-[14px] font-medium">{link.replace(/^https?:\/\//, '')}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex">
            <DsButton variant="outline" size="sm" onClick={copyLink}>
              <motion.span key={String(copied)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="grid place-items-center">{copied ? <Check className="size-4" style={{ color: 'var(--ds-accent)' }} /> : <Copy className="size-4" />}</motion.span>
              {copied ? 'Copié' : 'Copier'}
            </DsButton>
            <DsButton variant="soft" size="sm" onClick={shareOnWhatsApp}><WhatsAppIcon className="size-4" />Partager</DsButton>
            <DsButton variant="outline" size="sm" onClick={() => window.open(`/${store.slug}`, '_blank')}><Eye className="size-4" />Voir</DsButton>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Commandes aujourd’hui" icon={ShoppingBag} hint={stats.pending > 0 ? `${stats.pending} à traiter` : 'Tout est à jour'}><AnimatedNumber value={stats.today} /></StatTile>
        <StatTile label="Chiffre d’affaires" icon={DollarSign} tone="ink" hint="Hors commandes annulées"><AnimatedNumber value={stats.revenue} suffix={store.currency} /></StatTile>
        <StatTile label="Visiteurs (7 jours)" icon={Eye} tone="ink"><AnimatedNumber value={analytics.visitors7d} /></StatTile>
        <StatTile label="Produits en ligne" icon={Package} tone={limitReached ? 'warn' : 'accent'} hint={limitReached ? 'Limite du plan atteinte' : undefined}><AnimatedNumber value={stats.products} /></StatTile>
      </Reveal>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Reveal delay={0.1}>
          <section className="ds-card overflow-hidden">
            <div className="flex items-center justify-between px-4 pb-1 pt-4">
              <h2 className="ds-title text-[16px]">Commandes récentes</h2>
              <Link to="/dashboard/commandes" className="flex items-center gap-1 text-[13px] font-semibold" style={{ color: 'var(--ds-accent-strong)' }}>Tout voir <ArrowRight className="size-3.5" /></Link>
            </div>
            {recentOrders.length === 0 ?
            <EmptyState icon={ShoppingBag} title="Pas encore de commande" text="Partage le lien de ta boutique : les commandes de tes clients apparaîtront ici." /> :
            <div>
                {recentOrders.map((order) => {
                const meta = orderTone[order.status];
                return (
                  <Link key={order.id} to={`/dashboard/commandes/${order.id}`} className="ds-row">
                      <span className="size-11 shrink-0 overflow-hidden rounded-[11px]" style={{ background: 'var(--ds-subtle)' }}><ProductImage src={order.items[0]?.image} alt="" className="bg-transparent" imageClassName="p-1" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold">{order.customerName}</p>
                        <p className="ds-muted truncate text-[12px]">{order.reference} · {formatRelative(order.createdAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="ds-price text-[14px]">{formatPrice(order.total, store.currency)}</span>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      </div>
                    </Link>);
              })}
              </div>
            }
          </section>
        </Reveal>

        <Reveal delay={0.15}>
          <section className="ds-card overflow-hidden">
            <div className="flex items-center justify-between px-4 pb-1 pt-4">
              <h2 className="ds-title text-[16px]">Produits les plus vus</h2>
              <Link to="/dashboard/produits" className="flex items-center gap-1 text-[13px] font-semibold" style={{ color: 'var(--ds-accent-strong)' }}>Gérer <ArrowRight className="size-3.5" /></Link>
            </div>
            {popular.length === 0 ?
            <p className="ds-muted px-4 py-8 text-center text-[13.5px]">Ajoute ton premier produit pour le voir ici.</p> :
            popular.map((product) =>
            <Link key={product.id} to={`/dashboard/produits/${product.id}`} className="ds-row">
                <span className="size-11 shrink-0 overflow-hidden rounded-[11px]" style={{ background: 'var(--ds-subtle)' }}><ProductImage src={product.images[0]} alt="" className="bg-transparent" imageClassName="p-1" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{product.name}</p>
                  <p className="ds-muted text-[12px]">{product.views} vue{product.views > 1 ? 's' : ''} · {orderedQuantities.get(product.id) ?? 0} commandé{(orderedQuantities.get(product.id) ?? 0) > 1 ? 's' : ''}</p>
                </div>
                <span className="ds-price text-[14px]">{formatPrice(product.price, store.currency)}</span>
              </Link>
            )}
          </section>
        </Reveal>
      </div>
      <PremiumUpgradeDialog open={premiumDialogOpen} context="products" onClose={() => setPremiumDialogOpen(false)} />
    </div>);
}
