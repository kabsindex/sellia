import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  ExternalLink,
  Home,
  LogOut,
  Mail,
  Menu,
  Package,
  Palette,
  Settings as SettingsIcon,
  ShoppingBag,
  Store,
  Tags,
  Users,
  X,
  type LucideIcon } from
'lucide-react';
import { Logo } from '../shared/Logo';
import { Badge, DsButton, IconButton } from '../ds';
import { useSellia } from '../../contexts/SelliaContext';
import { PLAN_FEATURES, plans } from '../../data/plans';
import { initials } from '../../utils/format';
import { storefrontUrl } from '../../utils/whatsapp';
import { ease } from '../../design/motion';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const groups: {label?: string;items: NavItem[];}[] = [
{
  items: [
  { to: '/dashboard', label: 'Accueil', icon: Home, end: true },
  { to: '/dashboard/produits', label: 'Produits', icon: Package },
  { to: '/dashboard/commandes', label: 'Commandes', icon: ShoppingBag },
  { to: '/dashboard/clients', label: 'Clients', icon: Users }]
},
{
  label: 'Ma boutique',
  items: [
  { to: '/dashboard/categories', label: 'Catégories', icon: Tags },
  { to: '/dashboard/boutique', label: 'Profil', icon: Store },
  { to: '/dashboard/apparence', label: 'Apparence', icon: Palette },
  { to: '/dashboard/abonnes', label: 'Abonnés', icon: Mail }]
},
{
  label: 'Analyse',
  items: [
  { to: '/dashboard/statistiques', label: 'Statistiques', icon: BarChart3 },
  { to: '/dashboard/parametres', label: 'Paramètres', icon: SettingsIcon }]
}];

const allItems = groups.flatMap((group) => group.items);
const tabs: NavItem[] = [allItems[0], allItems[1], allItems[2], allItems.find((item) => item.label === 'Statistiques')!];

export function DashboardLayout() {
  const { store, user, orders, products, logout } = useSellia();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const newOrders = orders.filter((order) => order.status === 'nouvelle').length;
  const planId = user?.plan ?? store.plan;
  const currentPlan = plans.find((plan) => plan.id === planId);
  const limit = PLAN_FEATURES[planId].maxProducts;
  const published = products.filter((product) => !product.hidden).length;
  const activeItem =
  allItems.
  filter((item) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)).
  sort((a, b) => b.to.length - a.to.length)[0] ?? allItems[0];

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  function signOut() {
    logout();
    navigate('/');
  }

  const storeCard =
  <div className="flex items-center gap-2.5 rounded-[14px] p-2.5" style={{ background: 'var(--ds-subtle)' }}>
      {store.logo ?
    <img src={store.logo} alt="" className="size-10 shrink-0 rounded-[11px] object-contain" style={{ background: 'var(--ds-card)' }} /> :
    <span className="grid size-10 shrink-0 place-items-center rounded-[11px] text-sm font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}>{initials(store.name)}</span>
    }
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold">{store.name}</p>
        <p className="truncate font-mono text-[11px] ds-muted">{storefrontUrl(store.slug).replace(/^https?:\/\//, '')}</p>
      </div>
      <Link to={`/${store.slug}`} target="_blank" rel="noreferrer" aria-label="Ouvrir ma boutique" className="ds-icon-btn ds-icon-btn--sm"><ExternalLink className="size-3.5" /></Link>
    </div>;

  const planCard = planId !== 'premium' ?
  <div className="ds-card p-3.5">
      <div className="flex items-center justify-between text-[12.5px]">
        <span className="font-semibold">Plan {currentPlan?.name ?? 'Basic'}</span>
        <span className="ds-muted tabular-nums">{published}/{Number.isFinite(limit) ? limit : '∞'} produits</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--ds-subtle)' }}>
        <motion.div className="h-full rounded-full" style={{ background: published >= limit ? 'var(--ds-warn)' : 'var(--ds-accent)' }} initial={{ width: 0 }} animate={{ width: `${Math.min(100, published / limit * 100)}%` }} transition={{ duration: 0.8, ease }} />
      </div>
      <DsButton size="sm" variant="soft" block className="mt-3" onClick={() => navigate('/dashboard/parametres')}>Passer en Premium</DsButton>
    </div> :
  <div className="ds-card flex items-center gap-2 p-3.5 text-[13px] font-semibold"><Badge tone="solid">Premium</Badge>Produits illimités</div>;

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--ds-subtle)', color: 'var(--ds-ink)' }}>
      <div className="mx-auto flex w-full max-w-[1480px]">
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col gap-4 border-r p-4 lg:flex" style={{ background: 'var(--ds-card)', borderColor: 'var(--ds-border)' }}>
          <Link to="/" className="px-1"><Logo /></Link>
          {storeCard}
          <nav className="flex-1 space-y-4 overflow-y-auto" aria-label="Navigation du dashboard">
            {groups.map((group, index) =>
            <div key={index}>
                {group.label && <p className="ds-muted mb-1.5 px-3 text-[12px] font-semibold">{group.label}</p>}
                <div className="space-y-0.5">
                  {group.items.map((item) =>
                <NavLink key={item.to} to={item.to} end={item.end} className="relative flex h-10 items-center gap-2.5 rounded-[11px] px-3 text-[14px] font-medium transition-colors hover:bg-[var(--ds-subtle)]">
                      {({ isActive }) =>
                  <>
                          {isActive && <motion.span layoutId="dash-nav" className="absolute inset-0 rounded-[11px]" style={{ background: 'var(--ds-accent-soft)' }} transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                          <item.icon className="relative size-[18px]" />
                          <span className="relative flex-1" style={{ color: isActive ? 'var(--ds-accent-strong)' : 'inherit', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                          {item.to === '/dashboard/commandes' && newOrders > 0 && <Badge tone="solid" className="relative">{newOrders}</Badge>}
                        </>
                  }
                    </NavLink>
                )}
                </div>
              </div>
            )}
          </nav>
          {planCard}
          <button type="button" onClick={signOut} className="flex h-10 items-center gap-2.5 rounded-[11px] px-3 text-[14px] font-medium ds-muted hover:bg-[var(--ds-subtle)]"><LogOut className="size-[18px]" />Se déconnecter</button>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b px-4 backdrop-blur-md lg:h-[68px] lg:px-8" style={{ background: 'color-mix(in srgb, var(--ds-card) 92%, transparent)', borderColor: 'var(--ds-border)' }}>
            <Link to="/" className="shrink-0 lg:hidden" aria-label="SELLIA"><Logo className="origin-left scale-[0.8]" /></Link>
            <p className="ds-title min-w-0 flex-1 truncate text-[16px] lg:text-[17px]">{activeItem.label}</p>
            <DsButton variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => window.open(`/${store.slug}`, '_blank')}>
              Voir ma boutique <ExternalLink className="size-3.5" />
            </DsButton>
            <Link to="/dashboard/commandes" aria-label={`Commandes, ${newOrders} nouvelle${newOrders > 1 ? 's' : ''}`} className="ds-icon-btn relative">
              <Bell className="size-[18px]" />
              <AnimatePresence initial={false}>
                {newOrders > 0 &&
                <motion.span key={newOrders} initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0.4 }} className="absolute -right-1 -top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full px-1 text-[10px] font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)', boxShadow: '0 0 0 2px var(--ds-card)' }}>{newOrders}</motion.span>
                }
              </AnimatePresence>
            </Link>
          </header>

          <main className="flex-1 px-4 pb-[96px] pt-5 lg:px-8 lg:pb-10 lg:pt-7">
            <Outlet />
          </main>
        </div>
      </div>

      <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden" style={{ background: 'color-mix(in srgb, var(--ds-card) 94%, transparent)', borderColor: 'var(--ds-border)' }}>
        {tabs.map((item) =>
        <NavLink key={item.to} to={item.to} end={item.end} className="flex flex-col items-center gap-0.5 py-0.5 text-[10.5px]">
            {({ isActive }) =>
          <>
                <span className="relative grid h-8 w-14 place-items-center" style={{ color: isActive ? 'var(--ds-accent-strong)' : 'var(--ds-muted)' }}>
                  {isActive && <motion.span layoutId="dash-tab" className="absolute inset-0 rounded-full" style={{ background: 'var(--ds-accent-soft)' }} transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                  <item.icon className="relative size-[21px]" strokeWidth={isActive ? 2.4 : 2} />
                  {item.to === '/dashboard/commandes' && newOrders > 0 && <span className="absolute right-2 top-0.5 size-2 rounded-full" style={{ background: 'var(--ds-accent)', boxShadow: '0 0 0 2px var(--ds-card)' }} />}
                </span>
                <span style={{ color: isActive ? 'var(--ds-ink)' : 'var(--ds-muted)', fontWeight: isActive ? 600 : 500 }}>{item.label === 'Statistiques' ? 'Stats' : item.label}</span>
              </>
          }
          </NavLink>
        )}
        <button type="button" onClick={() => setMenuOpen(true)} className="flex flex-col items-center gap-0.5 py-0.5 text-[10.5px]" aria-label="Ouvrir le menu">
          <span className="grid h-8 w-14 place-items-center" style={{ color: 'var(--ds-muted)' }}><Menu className="size-[21px]" /></span>
          <span className="font-medium ds-muted">Menu</span>
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen &&
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
            <motion.div className="absolute inset-0 bg-black/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />
            <motion.div role="dialog" aria-modal="true" aria-label="Menu" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3, ease }} className="relative max-h-[88vh] w-full overflow-y-auto rounded-t-[24px] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]" style={{ background: 'var(--ds-card)' }}>
              <div className="mb-3 flex items-center justify-between">
                <p className="ds-title text-[17px]">Menu</p>
                <IconButton label="Fermer" small onClick={() => setMenuOpen(false)}><X className="size-4" /></IconButton>
              </div>
              {storeCard}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {allItems.map((item) =>
              <Link key={item.to} to={item.to} className="relative flex flex-col items-center gap-1.5 rounded-[14px] px-2 py-3 text-center text-[12.5px] font-medium" style={{ background: activeItem.to === item.to ? 'var(--ds-accent-soft)' : 'var(--ds-subtle)', color: activeItem.to === item.to ? 'var(--ds-accent-strong)' : 'var(--ds-ink)' }}>
                    <item.icon className="size-5" />
                    {item.label}
                    {item.to === '/dashboard/commandes' && newOrders > 0 && <Badge tone="solid" className="absolute right-2 top-2">{newOrders}</Badge>}
                  </Link>
              )}
              </div>
              <div className="mt-4">{planCard}</div>
              <DsButton variant="ghost" block className="mt-2 !justify-start ds-muted" onClick={signOut}><LogOut className="size-[18px]" />Se déconnecter</DsButton>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);
}
