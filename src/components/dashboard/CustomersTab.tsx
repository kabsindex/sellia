import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MessageCircle, Phone, Search } from 'lucide-react';
import { customers } from '../../utils/mockData';

export function CustomersTab() {
  const getTagBadge = (tag: string) => {
    switch (tag) {
      case 'FidÃ¨le':
      case 'Gros acheteur':
        return <Badge variant="success">{tag}</Badge>;
      case 'Nouveau':
        return <Badge variant="info">{tag}</Badge>;
      case 'Inactif':
        return <Badge variant="warning">{tag}</Badge>;
      default:
        return <Badge>{tag}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Rechercher un client..."
            icon={<Search size={18} />}
          />
        </div>
        <Button
          variant="outline"
          icon={<MessageCircle size={18} />}
          className="w-full sm:w-auto"
        >
          Message groupe
        </Button>
      </div>

      <Card noPadding>
        <div className="divide-y divide-sellia-border">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="p-4 transition-colors hover:bg-slate-50 md:p-5"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4 md:w-2/5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sellia-primary/10 text-lg font-bold text-sellia-primary">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sellia-text">
                      {customer.name}
                      {getTagBadge(customer.tag)}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-sellia-muted">
                      <Phone size={12} /> {customer.phone}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-sm md:w-2/5">
                  <div>
                    <div className="text-sellia-muted">Commandes</div>
                    <div className="font-bold text-sellia-text">
                      {customer.orders}
                    </div>
                  </div>
                  <div>
                    <div className="text-sellia-muted">Total depense</div>
                    <div className="font-bold text-sellia-text">
                      {customer.totalSpent.toLocaleString('fr-FR')} EUR
                    </div>
                  </div>
                  <div>
                    <div className="text-sellia-muted">Derniere activite</div>
                    <div className="font-medium text-sellia-text">
                      {customer.lastActive}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 md:w-1/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:bg-green-50"
                    aria-label={`Envoyer un message a ${customer.name}`}
                  >
                    <MessageCircle size={18} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    Voir profil
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
