import { useMemo, useState } from 'react';
import { DollarSign, Repeat, Users } from 'lucide-react';
import { EmptyState, PageHeader, SearchField, StatTile } from '../../components/ds';
import { AnimatedNumber } from '../../components/ds/motion';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { formatDate, formatPrice, initials } from '../../utils/format';
import { openWhatsApp } from '../../utils/whatsapp';

export function Customers() {
  const { customers, store } = useSellia();
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => customers.filter((customer) => customer.name.toLowerCase().includes(query.toLowerCase()) || customer.phone.includes(query)),
    [customers, query]
  );
  const totalSpent = customers.reduce((sum, customer) => sum + customer.spent, 0);
  const repeat = customers.filter((customer) => customer.ordersCount > 1).length;

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader title="Clients" description="Les personnes qui t’ont déjà commandé." />
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatTile label="Clients" icon={Users}><AnimatedNumber value={customers.length} /></StatTile>
        <StatTile label="Fidèles" icon={Repeat} tone="ink"><AnimatedNumber value={repeat} /></StatTile>
        <StatTile label="Dépensé" icon={DollarSign} tone="ink"><AnimatedNumber value={totalSpent} suffix={store.currency} /></StatTile>
      </div>
      <SearchField value={query} onChange={setQuery} placeholder="Nom ou téléphone" className="mt-4 lg:max-w-[360px]" />
      <div className="ds-card mt-3 overflow-hidden">
        {filtered.length === 0 ?
        <EmptyState icon={Users} title="Aucun client trouvé" text="Tes clients apparaîtront ici après leur première commande." /> :
        filtered.map((customer) =>
        <div key={customer.id} className="ds-row">
            <span className="grid size-11 shrink-0 place-items-center rounded-full text-[13px] font-bold" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}>{initials(customer.name)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold">{customer.name}</p>
              <p className="ds-muted truncate text-[12px]">{customer.phone}{customer.city ? ` · ${customer.city}` : ''}</p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="ds-price text-[14px]">{formatPrice(customer.spent, store.currency)}</p>
              <p className="ds-muted text-[12px]">{customer.ordersCount} commande{customer.ordersCount > 1 ? 's' : ''} · {formatDate(customer.lastOrder)}</p>
            </div>
            <p className="ds-muted text-[12px] sm:hidden">{customer.ordersCount} cmd.</p>
            <button type="button" aria-label={`Écrire à ${customer.name} sur WhatsApp`} onClick={() => openWhatsApp(customer.phone, `Bonjour ${customer.name} 👋`)} className="ds-icon-btn ds-icon-btn--sm" style={{ color: 'var(--ds-accent-strong)' }}><WhatsAppIcon className="size-4" /></button>
          </div>
        )}
      </div>
    </div>);
}
