import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  ExternalLink,
  Home,
  LayoutGrid,
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
  X } from
'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Sheet, SheetContent } from '../ui/Sheet';
import { Logo } from '../shared/Logo';
import { useSellia } from '../../contexts/SelliaContext';
import { initials } from '../../utils/format';
import { plans } from '../../data/plans';
import { storefrontUrl } from '../../utils/whatsapp';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{className?: string;}>;
  end?: boolean;
}

const navItems: NavItem[] = [
{ to: '/dashboard', label: 'Tableau de bord', icon: Home, end: true },
{ to: '/dashboard/produits', label: 'Produits', icon: Package },
{ to: '/dashboard/categories', label: 'Catégories', icon: Tags },
{ to: '/dashboard/commandes', label: 'Commandes', icon: ShoppingBag },
{ to: '/dashboard/clients', label: 'Clients', icon: Users },
{ to: '/dashboard/abonnes', label: 'Abonnés', icon: Mail },
{ to: '/dashboard/boutique', label: 'Boutique', icon: Store },
{ to: '/dashboard/apparence', label: 'Apparence', icon: Palette },
{ to: '/dashboard/statistiques', label: 'Statistiques', icon: BarChart3 },
{ to: '/dashboard/parametres', label: 'Paramètres', icon: SettingsIcon }];


const mobileNav: NavItem[] = [
{ to: '/dashboard', label: 'Accueil', icon: Home, end: true },
{ to: '/dashboard/produits', label: 'Produits', icon: Package },
{ to: '/dashboard/commandes', label: 'Commandes', icon: ShoppingBag },
{ to: '/dashboard/statistiques', label: 'Stats', icon: BarChart3 }];


function navClasses(isActive: boolean): string {
  return cn(
    'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
    isActive ?
    'bg-brand-soft text-brand-strong' :
    'text-muted-foreground hover:bg-secondary hover:text-foreground'
  );
}

export function DashboardLayout() {
  const { store, user, orders } = useSellia();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const newOrders = orders.filter((order) => order.status === 'nouvelle').length;
  const currentPlan = plans.find((plan) => plan.id === user?.plan);

  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width
    };
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  const activeItem =
  navItems.
  filter((item) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)).
  sort((a, b) => b.to.length - a.to.length)[0] ?? navItems[0];

  return (
    <div className="min-h-screen w-full bg-secondary/50">
      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border bg-sidebar px-3 py-4 lg:flex">
          <Link to="/" className="px-2 py-1">
            <Logo />
          </Link>

          <div className="mt-5 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src={store.logo} alt="" className="rounded-lg" />
                <AvatarFallback className="rounded-lg text-xs">
                  {initials(store.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{store.name}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {storefrontUrl(store.slug)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => navigate(`/${store.slug}`)}>
              Voir ma boutique
              <ExternalLink className="size-3.5" />
            </Button>
          </div>

          <nav className="mt-5 flex-1 space-y-0.5 overflow-y-auto">
            {navItems.map((item) =>
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navClasses(isActive)}>
                <item.icon className="size-4" />
                <span className="flex-1">{item.label}</span>
                {item.to === '/dashboard/commandes' && newOrders > 0 &&
              <Badge className="h-5 min-w-5 justify-center px-1.5 text-[11px]">{newOrders}</Badge>
              }
              </NavLink>
            )}
          </nav>

          <div className="mt-3 rounded-xl border border-border bg-card p-3">
            <p className="text-xs font-medium">
              Plan {currentPlan?.name ?? 'SELLIA Basic'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Passe en Premium pour des produits illimités et les stats avancées.
            </p>
            <Button size="sm" className="mt-2.5 w-full" onClick={() => navigate('/dashboard/parametres')}>
              Voir les plans
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
            <div className="flex h-14 items-center gap-2 px-4 lg:px-7">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Ouvrir le menu">
                <Menu className="size-5" />
              </Button>

              <h1 className="truncate font-heading text-[15px] font-semibold lg:text-base">
                {activeItem.label}
              </h1>

              <div className="ml-auto flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex"
                  aria-label="Voir la boutique"
                  onClick={() => navigate(`/${store.slug}`)}>
                  <Store className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="size-4" />
                  {newOrders > 0 &&
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand" />
                  }
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {initials(`${user?.firstName ?? 'S'} ${user?.lastName ?? ''}`)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-24 pt-5 lg:px-7 lg:pb-10">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Kept outside the blurred header so the fixed panel uses the full viewport. */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="!h-[100dvh] !w-[min(86vw,320px)] !max-w-none !touch-pan-y !gap-0 !overflow-hidden !overscroll-contain !border-r !border-border !bg-white !p-0 !text-foreground !shadow-2xl lg:hidden"
          showCloseButton={false}>
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu">
              <X className="size-5" />
            </Button>
          </div>

          <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain bg-white px-3 py-3">
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-secondary/60 p-3">
              <Avatar className="h-10 w-10 shrink-0 rounded-lg">
                <AvatarImage src={store.logo} alt="" className="rounded-lg" />
                <AvatarFallback className="rounded-lg text-xs">{initials(store.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-5">{store.name}</p>
                <p className="truncate font-mono text-[10px] leading-4 text-muted-foreground">
                  {storefrontUrl(store.slug)}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) =>
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                cn(
                  'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium leading-none transition-colors',
                  isActive ?
                  'bg-brand-soft text-brand-strong' :
                  'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
                }>
                <item.icon className="size-[18px] shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.to === '/dashboard/commandes' && newOrders > 0 &&
                <Badge className="h-5 min-w-5 shrink-0 justify-center px-1.5 text-[11px]">{newOrders}</Badge>
                }
              </NavLink>
              )}
            </nav>
          </div>

          <div className="shrink-0 border-t border-border bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setMenuOpen(false);
                navigate(`/${store.slug}`);
              }}>
              <LayoutGrid className="size-4" />
              Voir ma boutique
            </Button>
            <Button
              variant="ghost"
              className="mt-1 w-full justify-start text-muted-foreground"
              onClick={() => {
                setMenuOpen(false);
                navigate('/');
              }}>
              <LogOut className="size-4" />
              Se déconnecter
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile bottom navigation */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden',
          menuOpen && 'invisible pointer-events-none'
        )}>
        <div className="grid grid-cols-5">
          {mobileNav.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
              isActive ? 'text-brand-strong' : 'text-muted-foreground'
            )
            }>
              <span className="relative">
                <item.icon className="size-5" />
                {item.to === '/dashboard/commandes' && newOrders > 0 &&
              <span className="absolute -right-1.5 -top-1 size-2 rounded-full bg-brand" />
              }
              </span>
              {item.label}
            </NavLink>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground">
            <Menu className="size-5" />
            Menu
          </button>
        </div>
      </nav>
    </div>);

}
