import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  ArrowRight,
  MessageCircle,
  Package,
  Zap,
  AlertCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  orders,
  products,
  businessMetrics,
  aiInsights,
} from '../../utils/mockData';
import { getInsightColorClasses } from '../../utils/insightStyles';

export function OverviewTab() {
  const recentOrders = orders.slice(0, 5);
  const topProducts = [...products]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);
  const revenueGrowth = Number(
    (
      ((businessMetrics.todayRevenue - businessMetrics.yesterdayRevenue) /
        businessMetrics.yesterdayRevenue) *
      100
    ).toFixed(1),
  );

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sellia-primary via-slate-800 to-sellia-primary p-6 text-white">
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={24} className="text-sellia-accent" />
            <h2 className="text-2xl font-bold">Bonjour, Alex</h2>
          </div>
          <p className="mb-4 max-w-md text-slate-300">
            Ton assistant IA a recupere{' '}
            <span className="font-bold text-white">
              {businessMetrics.recoveredCarts} paniers abandonnes
            </span>{' '}
            aujourd'hui. Tu as genere{' '}
            <span className="font-bold text-sellia-accent">
              {businessMetrics.todayRevenue} EUR
            </span>{' '}
            dont{' '}
            <span className="font-bold text-sellia-accent">127 EUR en auto</span>
            .
          </p>
          <Button
            variant="primary"
            className="border-none bg-sellia-accent text-white hover:bg-sellia-accentHover"
          >
            Voir les details
          </Button>
        </div>
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-sellia-accent/20 blur-3xl" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-3 text-sellia-muted">
            <TrendingUp size={18} />
            <span className="text-sm font-medium">Revenus (Auj.)</span>
          </div>
          <div className="text-2xl font-bold text-sellia-text">
            {businessMetrics.todayRevenue} EUR
          </div>
          <div
            className={`mt-1 flex items-center gap-1 text-xs ${
              revenueGrowth > 0 ? 'text-sellia-success' : 'text-sellia-error'
            }`}
          >
            <TrendingUp size={12} /> {revenueGrowth > 0 ? '+' : ''}
            {revenueGrowth}% vs hier
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-3 text-sellia-muted">
            <ShoppingBag size={18} />
            <span className="text-sm font-medium">Commandes</span>
          </div>
          <div className="text-2xl font-bold text-sellia-text">
            {businessMetrics.todayOrders}
          </div>
          <div className="mt-1 text-xs text-sellia-muted">
            {businessMetrics.monthOrders} ce mois
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-3 text-sellia-muted">
            <Users size={18} />
            <span className="text-sm font-medium">Nouveaux clients</span>
          </div>
          <div className="text-2xl font-bold text-sellia-text">
            {businessMetrics.newCustomers}
          </div>
          <div className="mt-1 text-xs text-sellia-muted">Derniers 7 jours</div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-3 text-sellia-muted">
            <MessageCircle size={18} />
            <span className="text-sm font-medium">Messages auto</span>
          </div>
          <div className="text-2xl font-bold text-sellia-text">
            {businessMetrics.automatedMessages}
          </div>
          <div className="mt-1 text-xs text-sellia-success">Envoyes par l'IA</div>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-sellia-text">
          <Target className="text-sellia-accent" size={20} />
          Insights IA - Actions prioritaires
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {aiInsights.slice(0, 2).map((insight, index) => {
            const insightClasses = getInsightColorClasses(insight.color);

            return (
              <Card key={index} className={insightClasses.card}>
                <div className="mb-3 flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${insightClasses.icon}`}
                  >
                    {insight.type === 'opportunity' && <Sparkles size={20} />}
                    {insight.type === 'success' && <TrendingUp size={20} />}
                    {(insight.type === 'warning' || insight.type === 'alert') && (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`mb-1 font-bold ${insightClasses.title}`}>
                      {insight.title}
                    </h4>
                    <p className={`text-sm ${insightClasses.text}`}>
                      {insight.message}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full ${insightClasses.button}`}
                >
                  {insight.action} -&gt;
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-sellia-text">
              Commandes recentes
            </h3>
            <button className="flex items-center gap-1 text-sm font-medium text-sellia-accent">
              Tout voir <ArrowRight size={16} />
            </button>
          </div>
          <Card noPadding>
            <div className="divide-y divide-sellia-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      {order.productImage}
                    </div>
                    <div>
                      <div className="font-medium text-sellia-text">
                        {order.productName}
                      </div>
                      <div className="text-sm text-sellia-muted">
                        {order.customerName} - {order.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sellia-text">
                      {order.amount.toFixed(2)} EUR
                    </div>
                    {order.status === 'pending' && (
                      <Badge variant="warning">En attente</Badge>
                    )}
                    {order.status === 'paid' && <Badge variant="info">Paye</Badge>}
                    {order.status === 'delivered' && (
                      <Badge variant="success">Livre</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-sellia-text">Top produits</h3>
          <Card className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="text-2xl">{product.image}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-sellia-text">
                    {product.name}
                  </div>
                  <div className="text-xs text-sellia-muted">
                    {product.sales} ventes - {product.revenue} EUR
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sellia-accent/10 text-sm font-bold text-sellia-accent">
                  #{index + 1}
                </div>
              </div>
            ))}
          </Card>

          <h3 className="pt-2 text-lg font-bold text-sellia-text">
            Actions rapides
          </h3>
          <Card className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              className="justify-start"
              icon={<Package size={18} />}
            >
              Ajouter un produit
            </Button>
            <Button
              variant="outline"
              fullWidth
              className="justify-start"
              icon={<MessageCircle size={18} />}
            >
              Creer une promo WhatsApp
            </Button>
            <Button
              variant="outline"
              fullWidth
              className="justify-start"
              icon={<Zap size={18} />}
            >
              Configurer relance auto
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
