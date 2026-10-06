import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Crown, DollarSign, Eye, MousePointerClick, ShoppingBag } from 'lucide-react';
import { PageHeader, StatTile } from '../../components/ds';
import { AnimatedNumber } from '../../components/ds/motion';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { formatPrice } from '../../utils/format';

type Range = '7' | '30';
const axis = { fontSize: 11, fill: 'var(--ds-muted)' };
const tooltipStyle = { borderRadius: 12, border: '1px solid var(--ds-border)', boxShadow: 'var(--ds-shadow-sm)', fontSize: 12 };

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
    (acc, point) => ({ visiteurs: acc.visiteurs + point.visiteurs, commandes: acc.commandes + point.commandes, revenus: acc.revenus + point.revenus }),
    { visiteurs: 0, commandes: 0, revenus: 0 }
  );
  const views = products.reduce((sum, product) => sum + product.views, 0);

  const channelStats = useMemo(() => {
    const active = orders.filter((order) => order.status !== 'annulee');
    return [
    { label: 'WhatsApp', count: active.filter((order) => order.channel === 'whatsapp').length },
    { label: 'Catalogue', count: active.filter((order) => order.channel === 'catalogue').length }].
    map((item) => ({ ...item, share: active.length ? Math.round(item.count / active.length * 100) : 0 }));
  }, [orders]);

  const productStats = useMemo(() => products.map((product) => {
    const items = orders.filter((order) => order.status !== 'annulee').flatMap((order) => order.items).filter((item) => item.productId === product.id);
    return {
      id: product.id,
      name: product.name,
      vues: product.views,
      commandes: items.reduce((sum, item) => sum + item.quantity, 0),
      revenus: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }).sort((a, b) => b.commandes - a.commandes || b.vues - a.vues).slice(0, 5), [orders, products]);

  function pickRange(value: Range) {
    if (value === '30' && currentPlan === 'basic') {
      setPremiumDialogOpen(true);
      return;
    }
    setRange(value);
  }

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="Statistiques"
        description={`Activité de ${store.name} sur les ${range} derniers jours.`}
        actions={
        <div role="tablist" aria-label="Période" className="ds-seg">
            {(['7', '30'] as Range[]).map((value) =>
          <button key={value} type="button" role="tab" aria-selected={range === value} onClick={() => pickRange(value)} style={range === value ? { background: 'var(--ds-card)', boxShadow: 'var(--ds-shadow-xs)' } : undefined}>
                <span className="inline-flex items-center gap-1">{value} jours{value === '30' && currentPlan === 'basic' && <Crown className="size-3" style={{ color: '#a87b1f' }} aria-label="Premium" />}</span>
              </button>
          )}
          </div>
        } />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Visiteurs" icon={Eye}><AnimatedNumber value={totals.visiteurs} /></StatTile>
        <StatTile label="Vues produits" icon={MousePointerClick} tone="ink"><AnimatedNumber value={views} /></StatTile>
        <StatTile label="Commandes" icon={ShoppingBag} tone="ink"><AnimatedNumber value={totals.commandes} /></StatTile>
        <StatTile label="Chiffre d’affaires" icon={DollarSign} hint={`Sur ${range} jours`}><AnimatedNumber value={totals.revenus} suffix={store.currency} /></StatTile>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
        <section className="ds-card p-4">
          <h2 className="ds-title text-[16px]">Visiteurs</h2>
          <div className="mt-3 h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10a05c" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#10a05c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--ds-border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axis} interval="preserveStartEnd" />
                <YAxis tickLine={false} axisLine={false} tick={axis} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="visiteurs" name="Visiteurs" stroke="#10a05c" strokeWidth={2} fill="url(#visitorsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="ds-card p-4">
          <h2 className="ds-title text-[16px]">Chiffre d’affaires</h2>
          <div className="mt-3 h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--ds-border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axis} interval="preserveStartEnd" />
                <YAxis tickLine={false} axisLine={false} tick={axis} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatPrice(value, store.currency)} />
                <Bar dataKey="revenus" name="Revenus" fill="#0f1a15" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="ds-card overflow-hidden">
          <h2 className="ds-title px-4 pb-1 pt-4 text-[16px]">Produits les plus performants</h2>
          {productStats.length === 0 ? <p className="ds-muted px-4 py-8 text-center text-[13.5px]">Aucune donnée pour le moment.</p> :
          productStats.map((product) =>
          <div key={product.id} className="ds-row">
              <p className="min-w-0 flex-1 truncate text-[14px] font-semibold">{product.name}</p>
              <p className="ds-muted hidden text-[12.5px] sm:block">{product.vues} vues</p>
              <p className="w-[84px] text-right text-[12.5px]">{product.commandes} cmd.</p>
              <p className="ds-price w-[72px] text-right text-[13.5px]">{formatPrice(product.revenus, store.currency)}</p>
            </div>
          )}
        </section>
        <section className="ds-card p-4">
          <h2 className="ds-title text-[16px]">Origine des commandes</h2>
          <div className="mt-4 space-y-4">
            {channelStats.map((item) =>
            <div key={item.label}>
                <div className="flex justify-between text-[13.5px]"><span className="font-semibold">{item.label}</span><span className="ds-muted">{item.count} · {item.share}%</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: 'var(--ds-subtle)' }}><div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.share}%`, background: 'var(--ds-accent)' }} /></div>
              </div>
            )}
          </div>
        </section>
      </div>
      <PremiumUpgradeDialog open={premiumDialogOpen} context="analytics" onClose={() => setPremiumDialogOpen(false)} />
    </div>);
}
