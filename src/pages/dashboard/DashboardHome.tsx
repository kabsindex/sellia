import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Copy,
  DollarSign,
  Eye,
  Package,
  Plus,
  ShoppingBag,
  Timer,
  TrendingUp } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/dashboard/StatCard';
import { ProductImage } from '../../components/shared/ProductImage';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { orderStatusMeta } from '../../data/orders';
import { canPublishProduct } from '../../data/plans';
import { formatPrice, formatRelative } from '../../utils/format';
import { storefrontUrl } from '../../utils/whatsapp';

export function DashboardHome() {
  const navigate = useNavigate();
  const { user, store, orders, products, analytics } = useSellia();
  const [copied, setCopied] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);

  const stats = useMemo(() => {
    const today = orders.filter(
      (order) => new Date(order.createdAt).toDateString() === new Date().toDateString()
    );
    const revenue = orders.
    filter((order) => order.status !== 'annulee').
    reduce((sum, order) => sum + order.total, 0);
    return {
      today: today.length,
      revenue,
      visitors: analytics.visitors7d,
      products: products.filter((product) => !product.hidden).length,
      pending: orders.filter((order) => order.status === 'nouvelle').length
    };
  }, [analytics.visitors7d, orders, products]);

  const orderedQuantities = useMemo(() => {
    const totals = new Map<string, number>();
    for (const order of orders) {
      if (order.status === 'annulee') continue;
      for (const item of order.items) {
        totals.set(item.productId, (totals.get(item.productId) ?? 0) + item.quantity);
      }
    }
    return totals;
  }, [orders]);

  const recentOrders = orders.slice(0, 5);
  const popular = products.
  filter((product) => !product.hidden).
  slice().
  sort((a, b) => b.views - a.views).
  slice(0, 4);
  const currentPlan = user?.plan ?? store.plan;
  const productLimitReached = !canPublishProduct(
    currentPlan,
    products.filter((product) => !product.hidden).length
  );

  function addProduct() {
    if (productLimitReached) {
      setPremiumDialogOpen(true);
      return;
    }
    navigate('/dashboard/produits/nouveau');
  }

  function copyLink() {
    navigator.clipboard?.writeText(storefrontUrl(store.slug));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-[22px] font-semibold tracking-[-0.02em]">
            Bonjour {user?.firstName} 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Voici ce qui s’est passé sur {store.name} aujourd’hui.
          </p>
        </div>
        <Button onClick={addProduct}>
          <Plus className="size-4" />
          Ajouter un produit
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">Le lien de ta boutique</p>
          <p className="mt-1 truncate font-mono text-sm font-medium text-brand-strong">
            {storefrontUrl(store.slug)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? 'Copié' : 'Copier'}
          </Button>
          <Button size="sm" onClick={() => navigate(`/${store.slug}`)}>
            Voir la boutique
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-5">
        <StatCard label="Commandes aujourd’hui" value={String(stats.today)} icon={ShoppingBag} />
        <StatCard
          label="Chiffre d’affaires"
          value={formatPrice(stats.revenue, store.currency)}
          icon={DollarSign}
          hint="Hors commandes annulées" />
        
        <StatCard label="Visiteurs (7j)" value={stats.visitors.toLocaleString('fr-FR')} icon={Eye} />
        <StatCard label="Produits en ligne" value={String(stats.products)} icon={Package} hint="Produits publiés" />
        <StatCard
          label="Commandes en attente"
          value={String(stats.pending)}
          icon={Timer}
          hint="À confirmer"
          className="col-span-2 lg:col-span-1" />
        
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-border bg-card shadow-soft">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
            <h3 className="font-heading text-sm font-semibold">Commandes récentes</h3>
            <Link
              to="/dashboard/commandes"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
              
              Tout voir
              <ArrowRight className="size-3.5" />
            </Link>
          </header>

          <ul className="divide-y divide-border">
            {recentOrders.map((order) => {
              const meta = orderStatusMeta[order.status];
              return (
                <li key={order.id}>
                  <Link
                    to={`/dashboard/commandes/${order.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/60">
                    
                    <span className="size-10 shrink-0 overflow-hidden rounded-lg border border-border">
                      <ProductImage src={order.items[0]?.image} alt="" imageClassName="p-1" />
                    </span>
                    
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{order.customerName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {order.items[0]?.name}
                        {order.items.length > 1 ? ` +${order.items.length - 1}` : ''} ·{' '}
                        {formatRelative(order.createdAt)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold">
                        {formatPrice(order.total, store.currency)}
                      </p>
                      <Badge variant="outline" className={`mt-1 text-[10px] ${meta.className}`}>
                        {meta.label}
                      </Badge>
                    </div>
                  </Link>
                </li>);

            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-soft">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
            <h3 className="font-heading text-sm font-semibold">Produits populaires</h3>
            <TrendingUp className="size-4 text-muted-foreground" />
          </header>
          <ul className="divide-y divide-border">
            {popular.map((product) => {
              const ordered = orderedQuantities.get(product.id) ?? 0;
              return (
                <li key={product.id}>
                  <Link
                    to={`/dashboard/produits/${product.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/60">
                    
                    <span className="size-10 shrink-0 overflow-hidden rounded-lg border border-border">
                      <ProductImage src={product.images[0]} alt="" imageClassName="p-1" />
                    </span>
                    
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.views.toLocaleString('fr-FR')} vues ·{' '}
                        {ordered > 0 ? `${ordered} commandé${ordered > 1 ? 's' : ''}` : 'aucune commande'}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatPrice(product.price, store.currency)}
                    </span>
                  </Link>
                </li>);

            })}
          </ul>
        </section>
      </div>

      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context="products"
        onClose={() => setPremiumDialogOpen(false)}
      />
    </div>);

}
