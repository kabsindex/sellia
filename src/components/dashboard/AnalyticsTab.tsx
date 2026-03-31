import { Card } from '../ui/Card';
import {
  ArrowUpRight,
  DollarSign,
  Percent,
  ShoppingCart,
} from 'lucide-react';
import {
  products,
  salesData,
  businessMetrics,
  aiInsights,
} from '../../utils/mockData';
import { getInsightColorClasses } from '../../utils/insightStyles';

export function AnalyticsTab() {
  const topProducts = [...products]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const maxRevenue = Math.max(...salesData.map((day) => day.revenue));
  const totalTopRevenue = topProducts.reduce(
    (sum, product) => sum + product.revenue,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-sellia-text">Performances</h2>
        <select className="rounded-lg border border-sellia-border bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sellia-accent">
          <option>7 derniers jours</option>
          <option>30 derniers jours</option>
          <option>Ce mois-ci</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <DollarSign size={20} />
            </div>
            <span className="flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-sellia-success">
              <ArrowUpRight size={16} className="mr-1" /> +15.3%
            </span>
          </div>
          <div className="mb-1 text-sm font-medium text-sellia-muted">
            CA (7 jours)
          </div>
          <div className="text-3xl font-bold text-sellia-text">3,734 EUR</div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <ShoppingCart size={20} />
            </div>
            <span className="flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-sellia-success">
              <ArrowUpRight size={16} className="mr-1" /> +8.1%
            </span>
          </div>
          <div className="mb-1 text-sm font-medium text-sellia-muted">
            Commandes
          </div>
          <div className="text-3xl font-bold text-sellia-text">88</div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Percent size={20} />
            </div>
            <span className="flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-sellia-success">
              <ArrowUpRight size={16} className="mr-1" /> +2.1%
            </span>
          </div>
          <div className="mb-1 text-sm font-medium text-sellia-muted">
            Taux conversion
          </div>
          <div className="text-3xl font-bold text-sellia-text">
            {businessMetrics.conversionRate}%
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <ShoppingCart size={20} />
            </div>
            <span className="rounded-md bg-slate-50 px-2 py-1 text-sm font-medium text-sellia-muted">
              Stable
            </span>
          </div>
          <div className="mb-1 text-sm font-medium text-sellia-muted">
            Panier moyen
          </div>
          <div className="text-3xl font-bold text-sellia-text">
            {businessMetrics.averageBasket.toFixed(2)} EUR
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-6 font-bold text-sellia-text">Ventes sur 7 jours</h3>
        <div className="space-y-4">
          {salesData.map((day) => (
            <div key={day.day}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-sellia-text">{day.day}</span>
                <div className="text-right">
                  <span className="font-bold text-sellia-text">
                    {day.revenue} EUR
                  </span>
                  <span className="ml-2 text-sellia-muted">
                    ({day.orders} cmd)
                  </span>
                </div>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-sellia-accent to-emerald-400 transition-all duration-500"
                  style={{
                    width: `${(day.revenue / maxRevenue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h3 className="pt-4 text-lg font-bold text-sellia-text">
          Insights de l'IA
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {aiInsights.map((insight, index) => {
            const insightClasses = getInsightColorClasses(insight.color);

            return (
              <Card key={index} className={insightClasses.card}>
                <h4 className={`mb-2 font-bold ${insightClasses.title}`}>
                  {insight.title}
                </h4>
                <p className={`mb-3 text-sm ${insightClasses.text}`}>
                  {insight.message}
                </p>
                <button className={`text-sm font-bold ${insightClasses.action}`}>
                  {insight.action} -&gt;
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <h3 className="mb-4 font-bold text-sellia-text">
          Produits les plus vendus
        </h3>
        <div className="space-y-4">
          {topProducts.map((product) => {
            const progress = (product.revenue / topProducts[0].revenue) * 100;
            const revenueShare = ((product.revenue / totalTopRevenue) * 100).toFixed(1);

            return (
              <div key={product.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{product.image}</span>
                    <span className="font-medium text-sellia-text">
                      {product.name}
                    </span>
                  </div>
                  <span className="font-bold text-sellia-text">
                    {product.revenue} EUR
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-sellia-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-sellia-muted">
                  {product.sales} ventes - {revenueShare}% du CA
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
