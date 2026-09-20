import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { Crown, DollarSign, Eye, MousePointerClick, ShoppingBag } from 'lucide-react';
import { cn } from '../../utils/cn';
import { StatCard } from '../../components/dashboard/StatCard';
import { Button } from '../../components/ui/Button';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { formatPrice } from '../../utils/format';

type Range = '7' | '30';

export function Analytics() {
  const { store, user, orders, products, analytics } = useSellia();
  const [range, setRange] = useState<Range>('7');
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const currentPlan = user?.plan ?? store.plan;

  const data30Days = useMemo(() => {
    const visits = new Map(analytics.daily.map((item) => [item.date, item.visitors]));
    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (29 - index));
      const key = date.toISOString().slice(0, 10);
      const dayOrders = orders.filter((order) => order.createdAt.slice(0, 10) === key && order.status !== 'annulee');
      return {
        date: key,
        label: new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' }).format(date),
        visiteurs: visits.get(key) ?? 0,
        commandes: dayOrders.length,
        revenus: dayOrders.reduce((sum, order) => sum + order.total, 0)
      };
    });
  }, [analytics.daily, orders]);

  const data = range === '7' ? data30Days.slice(-7) : data30Days;

  const totals = data.reduce(
    (acc, point) => ({
      visiteurs: acc.visiteurs + point.visiteurs,
      commandes: acc.commandes + point.commandes,
      revenus: acc.revenus + point.revenus,
      vues: acc.vues
    }),
    { visiteurs: 0, commandes: 0, revenus: 0, vues: products.reduce((sum, product) => sum + product.views, 0) }
  );

  const channelStats = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== 'annulee');
    const total = activeOrders.length;
    return [
      { label: 'WhatsApp', count: activeOrders.filter((order) => order.channel === 'whatsapp').length },
      { label: 'Catalogue', count: activeOrders.filter((order) => order.channel === 'catalogue').length }
    ].map((item) => ({ ...item, share: total ? Math.round(item.count / total * 100) : 0 }));
  }, [orders]);

  const productStats = useMemo(() => products.map((product) => {
    const items = orders
      .filter((order) => order.status !== 'annulee')
      .flatMap((order) => order.items)
      .filter((item) => item.productId === product.id);
    return {
      id: product.id,
      name: product.name,
      vues: product.views,
      commandes: items.reduce((sum, item) => sum + item.quantity, 0),
      revenus: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }).sort((a, b) => b.commandes - a.commandes || b.vues - a.vues).slice(0, 5), [orders, products]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-[20px] font-semibold tracking-[-0.02em]">Statistiques</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Évolution de {store.name} sur les {range} derniers jours.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
          {(['7', '30'] as Range[]).map((value) =>
          <button
            key={value}
            type="button"
            onClick={() => {
              if (value === '30' && currentPlan === 'basic') {
                setPremiumDialogOpen(true);
                return;
              }
              setRange(value);
            }}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              range === value ? 'bg-brand-soft text-brand-strong' : 'text-muted-foreground'
            )}>
            
              <span className="inline-flex items-center gap-1">
                {value} jours
                {value === '30' && currentPlan === 'basic' &&
                <Crown className="size-3 text-[#a87b1f]" aria-label="Premium" />}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Visiteurs" value={totals.visiteurs.toLocaleString('fr-FR')} icon={Eye} />
        <StatCard label="Vues produits" value={String(totals.vues)} icon={MousePointerClick} />
        <StatCard label="Commandes" value={String(totals.commandes)} icon={ShoppingBag} />
        <StatCard
          label="Chiffre d’affaires"
          value={formatPrice(totals.revenus, store.currency)}
          icon={DollarSign}
          hint={`Sur ${range} jours`} />
        
      </div>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-heading text-sm font-semibold">Visiteurs et commandes</h3>
          <span className="text-xs text-muted-foreground">{totals.commandes} commandes</span>
        </div>
        <div className="mt-4 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                interval="preserveStartEnd" />
              
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  background: 'var(--popover)'
                }} />
              
              <Area
                type="monotone"
                dataKey="visiteurs"
                stroke="var(--brand)"
                strokeWidth={2}
                fill="url(#visitorsFill)"
                name="Visiteurs" />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {currentPlan === 'premium' ? <>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
          <h3 className="font-heading text-sm font-semibold">Commandes par jour</h3>
          <div className="mt-4 h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  interval="preserveStartEnd" />
                
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    fontSize: 12,
                    background: 'var(--popover)'
                  }} />
                
                <Bar dataKey="commandes" fill="var(--brand)" radius={[6, 6, 0, 0]} name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
          <h3 className="font-heading text-sm font-semibold">Canaux de commande</h3>
          <ul className="mt-4 space-y-3.5">
            {channelStats.map((source) =>
            <li key={source.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{source.label}</span>
                  <span className="text-muted-foreground">{source.share}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${source.share}%` }} />
                </div>
              </li>
          )}
          </ul>
          {orders.length === 0 &&
            <p className="mt-4 text-sm text-muted-foreground">Les canaux apparaîtront après la première commande.</p>}
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-soft">
        <header className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <h3 className="font-heading text-sm font-semibold">Meilleurs produits</h3>
          <ShoppingBag className="size-4 text-muted-foreground" />
        </header>
        <ul className="divide-y divide-border">
          {productStats.map((item, index) =>
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary font-mono text-xs">
                {index + 1}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</p>
              <div className="flex gap-5 text-right text-xs">
                <span className="text-muted-foreground">{item.vues} vues</span>
                <span className="text-muted-foreground">{item.commandes} cmd</span>
                <span className="w-16 font-semibold text-foreground">
                  {formatPrice(item.revenus, store.currency)}
                </span>
              </div>
            </li>
          )}
        </ul>
        {productStats.length === 0 &&
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun produit à analyser pour le moment.</p>}
      </section>
      </> :
      <section className="overflow-hidden rounded-2xl border border-[#d9c17d]/45 bg-card shadow-soft">
        <div className="grid gap-5 bg-[#11130f] p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase text-[#e2bd67]">
              <Crown className="size-4" /> Statistiques Premium
            </span>
            <h3 className="mt-2 font-heading text-xl font-semibold">Va au-delà des chiffres essentiels</h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/65">
              Analyse 30 jours, les canaux de commande et les produits qui génèrent le plus de ventes.
            </p>
          </div>
          <Button
            className="bg-[#d7b45e] text-[#17140d] hover:bg-[#c9a64e]"
            onClick={() => setPremiumDialogOpen(true)}>
            <Crown className="size-4" /> Débloquer les analyses
          </Button>
        </div>
        <div className="grid gap-3 p-5 text-sm text-muted-foreground sm:grid-cols-3 sm:p-6">
          <p>Historique sur 30 jours</p>
          <p>Canaux de conversion</p>
          <p>Classement des produits</p>
        </div>
      </section>}

      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context="analytics"
        onClose={() => setPremiumDialogOpen(false)}
      />
    </div>);

}
