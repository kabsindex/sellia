import React, { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { Input } from '../../components/ui/Input';
import { Avatar, AvatarFallback } from '../../components/ui/Avatar';
import { StatCard } from '../../components/dashboard/StatCard';
import { useSellia } from '../../contexts/SelliaContext';
import { formatDate, formatPrice, initials } from '../../utils/format';
import { buildCustomerFollowUp, openWhatsApp } from '../../utils/whatsapp';

export function Customers() {
  const { customers, store } = useSellia();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
    customers.filter(
      (customer) =>
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.phone.includes(query)
    ),
    [customers, query]
  );

  const totalSpent = customers.reduce((sum, customer) => sum + customer.spent, 0);
  const repeat = customers.filter((customer) => customer.ordersCount > 1).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Clients" value={String(customers.length)} icon={Users} delta={14} />
        <StatCard
          label="Panier moyen"
          value={formatPrice(Math.round(totalSpent / Math.max(customers.length, 1)), store.currency)}
          icon={WhatsAppIcon} />
        
        <StatCard label="Clients fidèles" value={String(repeat)} icon={Users} hint="2 commandes ou +" />
        <StatCard
          label="Total dépensé"
          value={formatPrice(totalSpent, store.currency)}
          icon={WhatsAppIcon}
          delta={22} />
        
      </div>

      <div className="relative sm:max-w-[320px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un client…"
          className="pl-9"
          aria-label="Rechercher un client" />
        
      </div>

      {filtered.length === 0 ?
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <h3 className="font-heading text-base font-semibold">Aucun client trouvé</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Tes clients apparaissent ici dès leur première commande.
          </p>
        </div> :

      <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {filtered.map((customer) =>
        <li
          key={customer.id}
          className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3.5 last:border-0">
          
              <Avatar className="size-10">
                <AvatarFallback className="text-xs">{initials(customer.name)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{customer.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {customer.phone} · {customer.city}
                </p>
              </div>

              <dl className="flex gap-5 text-right">
                <div>
                  <dt className="text-[11px] text-muted-foreground">Commandes</dt>
                  <dd className="text-sm font-semibold">{customer.ordersCount}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground">Dépensé</dt>
                  <dd className="text-sm font-semibold">
                    {formatPrice(customer.spent, store.currency)}
                  </dd>
                </div>
                <div className="hidden sm:block">
                  <dt className="text-[11px] text-muted-foreground">Dernière</dt>
                  <dd className="text-sm">{formatDate(customer.lastOrder)}</dd>
                </div>
              </dl>

              <Button
            variant="outline"
            size="sm"
            onClick={() => openWhatsApp(customer.phone, buildCustomerFollowUp(store, customer.name))}>
            
                <WhatsAppIcon className="size-3.5" />
                Contacter
              </Button>
            </li>
        )}
        </ul>
      }
    </div>);

}
