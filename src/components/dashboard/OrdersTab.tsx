import { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Search, MessageCircle, MoreVertical } from 'lucide-react';
import { Input } from '../ui/Input';
import { orders } from '../../utils/mockData';

type OrderFilter = 'all' | 'pending' | 'paid';

export function OrdersTab() {
  const [filter, setFilter] = useState<OrderFilter>('all');
  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'paid':
        return <Badge variant="info">PayÃ©</Badge>;
      case 'delivered':
        return <Badge variant="success">LivrÃ©</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Rechercher une commande, un client..."
            icon={<Search size={18} />}
            className="bg-white"
          />
        </div>
        <div className="flex w-full gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Toutes
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            En attente
          </Button>
          <Button
            variant={filter === 'paid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('paid')}
          >
            Payees
          </Button>
        </div>
      </div>

      <Card noPadding>
        <div className="divide-y divide-sellia-border">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-slate-50 md:flex-row md:items-center md:p-5"
            >
              <div className="flex justify-between md:w-1/3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-bold text-sellia-text">
                      {order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm font-medium text-sellia-text">
                    {order.customerName}
                  </div>
                  <div className="text-xs text-sellia-muted">{order.date}</div>
                </div>
              </div>

              <div className="md:w-1/3">
                <div className="text-sm text-sellia-text">
                  {order.productName}
                </div>
                <div className="font-bold text-sellia-text">
                  {order.amount.toFixed(2)} EUR
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 md:mt-0 md:w-1/3 md:border-none md:pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-200 text-green-600 hover:bg-green-50 md:flex-none"
                  icon={<MessageCircle size={16} />}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  aria-label={`Options pour ${order.id}`}
                >
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
