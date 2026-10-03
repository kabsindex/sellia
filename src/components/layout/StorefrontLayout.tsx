import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Grid2X2, Heart, Home, MapPin, Search, SearchX, ShoppingBag as ShoppingBagIcon, Store as StoreIcon, WifiOff } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { Button } from '../ui/Button';
import { Logo } from '../shared/Logo';
import { BrandLoadingScreen } from '../shared/BrandLoadingScreen';
import { CartBadge, CartLink } from '../store/StoreParts';
import { themeVars } from '../../design/theme';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { storeUrl } from '../../utils/whatsapp';

export function StorefrontLayout() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    store,
    cart,
    bootstrapStatus,
    bootstrapError,
    bootstrapSlug
  } = useSellia();
  const theme = useStoreTheme(store.theme);
  const [query, setQuery] = useState('');
  const [minimumLoadingDone, setMinimumLoadingDone] = useState(false);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const storefrontBase = `/${store.slug}`;
  const showMobileNav =
    !location.pathname.startsWith(`${storefrontBase}/produit/`) &&
    location.pathname !== `${storefrontBase}/panier`;
  const isHome = location.pathname === storefrontBase || location.pathname === `${storefrontBase}/`;

  useEffect(() => {
    setMinimumLoadingDone(false);
    if (bootstrapStatus === 'loading' || bootstrapSlug !== slug) return;

    const hasStoreBrand = bootstrapStatus === 'ready' && store.slug === slug;
    const timer = window.setTimeout(() => setMinimumLoadingDone(true), hasStoreBrand ? 650 : 180);
    return () => window.clearTimeout(timer);
  }, [bootstrapSlug, bootstrapStatus, slug, store.slug]);

  const waitingForRequestedStore =
  bootstrapSlug !== slug || bootstrapStatus === 'loading' || !minimumLoadingDone;

  if (waitingForRequestedStore) {
    const requestedStoreIsLoaded = store.slug === slug;
    return (
      <BrandLoadingScreen
        logo={requestedStoreIsLoaded ? store.logo : undefined}
        name={requestedStoreIsLoaded ? store.name : undefined}
        label="Chargement de la boutique..." />
    );
  }

  if (bootstrapStatus === 'error') {
    return (
      <div className="grid min-h-screen w-full place-items-center bg-background px-5 py-12 text-center">
        <div className="w-full max-w-sm">
          <Logo className="justify-center" />
          <span className="mx-auto mt-7 grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <WifiOff className="size-5" />
          </span>
          <h1 className="mt-5 font-heading text-[24px] font-semibold">Impossible de charger la boutique</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {bootstrapError}
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (bootstrapStatus === 'not-found' || slug !== store.slug) {
    return (
      <div className="grid min-h-screen w-full place-items-center bg-background px-5 py-12 text-center">
        <div className="w-full max-w-sm">
          <Logo className="justify-center" />
          <span className="mx-auto mt-7 grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground">
            <SearchX className="size-5" />
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand">Erreur 404</p>
          <h1 className="mt-2 font-heading text-[24px] font-semibold">Boutique introuvable</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Le lien « {slug} » ne correspond à aucune boutique publiée sur SELLIA.
          </p>
          <div className="mt-6 grid gap-2">
            <Button onClick={() => navigate('/')}>Retour à l’accueil SELLIA</Button>
            <Button variant="outline" onClick={() => navigate('/inscription')}>
              Créer ma boutique
            </Button>
          </div>
        </div>
      </div>);

  }

  const verified = store.plan === 'premium' && store.verificationStatus === 'verified';
  const base = `/${store.slug}`;
  const navLinks = [
  { to: base, label: 'Accueil', end: true },
  { to: `${base}/catalogue`, label: 'Catalogue' },
  { to: `${base}/compte`, label: 'La boutique' }];
  const tabs = [
  { to: base, label: 'Accueil', icon: Home, end: true },
  { to: `${base}/catalogue`, label: 'Catégories', icon: Grid2X2 },
  { to: `${base}/favoris`, label: 'Favoris', icon: Heart },
  { to: `${base}/panier`, label: 'Panier', icon: ShoppingBagIcon, badge: true },
  { to: `${base}/compte`, label: 'Boutique', icon: StoreIcon }];

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `${base}/recherche?q=${encodeURIComponent(value)}` : `${base}/recherche`);
    setQuery('');
  }

  const brand =
  <Link to={base} className="flex min-w-0 items-center gap-2.5" aria-label={`Accueil ${store.name}`}>
      {store.logo ?
    <img src={store.logo} alt="" className="size-9 shrink-0 rounded-full object-contain" style={{ background: 'var(--ds-subtle)' }} /> :
    <span className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}>{store.name.slice(0, 1)}</span>
    }
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-[15px] font-bold leading-tight">
          <span className="truncate">{store.name}</span>
          {verified && <BadgeCheck className="size-4 shrink-0" style={{ color: 'var(--ds-accent)' }} aria-label="Boutique vérifiée" />}
        </span>
        <span className="block truncate text-[11px] leading-tight" style={{ color: 'var(--ds-muted)' }}>{store.category}</span>
      </span>
    </Link>;

  return (
    <div
      className="flex min-h-screen w-full flex-col"
      style={{ ...themeVars(theme), fontFamily: store.font === 'Georgia' ? 'Georgia, "Times New Roman", serif' : `"${store.font}", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`, '--store-primary': theme.accent, '--store-primary-light': theme.accentSoft } as React.CSSProperties}>
      {isHome &&
      <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between gap-3 px-4 backdrop-blur-md lg:hidden" style={{ background: 'color-mix(in srgb, var(--ds-bg) 92%, transparent)' }}>
          {brand}
          <div className="flex items-center gap-2">
            <Link to={`${base}/recherche`} aria-label="Rechercher" className="ds-icon-btn"><Search className="size-[18px]" /></Link>
            <CartLink to={`${base}/panier`} count={cartCount} />
          </div>
        </header>
      }

      <header className="sticky top-0 z-40 hidden border-b backdrop-blur-md lg:block" style={{ background: 'color-mix(in srgb, var(--ds-bg) 92%, transparent)', borderColor: 'var(--ds-border)' }}>
        <div className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center gap-6 px-6">
          {brand}
          <nav className="flex items-center gap-1" aria-label="Navigation boutique">
            {navLinks.map((link) =>
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className="rounded-full px-3.5 py-2 text-[14px] transition-colors"
              style={({ isActive }) => ({
                color: isActive ? 'var(--ds-accent-strong)' : 'var(--ds-muted)',
                background: isActive ? 'var(--ds-accent-soft)' : 'transparent',
                fontWeight: isActive ? 600 : 500
              })}>
                {link.label}
              </NavLink>
            )}
          </nav>
          <form onSubmit={submitSearch} className="ds-search ml-auto w-[320px]" role="search">
            <Search className="size-4 shrink-0" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un produit" aria-label="Rechercher un produit" />
          </form>
          <Link to={`${base}/favoris`} aria-label="Favoris" className="ds-icon-btn"><Heart className="size-[18px]" /></Link>
          <CartLink to={`${base}/panier`} count={cartCount} />
        </div>
      </header>

      <main className={`flex-1 ${showMobileNav ? 'pb-[84px]' : ''} lg:pb-0`}>
        <Outlet />
      </main>

      <footer className="hidden border-t lg:block" style={{ borderColor: 'var(--ds-border)' }}>
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-6 py-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            {brand}
            <p className="mt-3 max-w-[340px] text-[13px] leading-relaxed" style={{ color: 'var(--ds-muted)' }}>{store.description}</p>
          </div>
          <div>
            <p className="text-[13px] font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-[13px]" style={{ color: 'var(--ds-muted)' }}>
              <li className="flex items-start gap-2"><WhatsAppIcon className="mt-0.5 size-3.5 shrink-0" />{store.whatsapp}</li>
              {[store.address, store.city, store.country].filter(Boolean).length > 0 &&
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-3.5 shrink-0" />{[store.address, store.city, store.country].filter(Boolean).join(', ')}</li>
              }
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-semibold">Suivre la boutique</p>
            <div className="mt-3 flex gap-2">
              {[{ icon: SiInstagram, handle: store.instagram }, { icon: SiTiktok, handle: store.tiktok }, { icon: SiFacebook, handle: store.facebook }].
              filter((item) => item.handle).
              map((item, index) =>
              <span key={index} className="grid size-9 place-items-center rounded-full" style={{ border: '1px solid var(--ds-border)', color: 'var(--ds-muted)' }}>
                  <item.icon className="size-4" />
                </span>
              )}
            </div>
            <p className="mt-3 font-mono text-[11px]" style={{ color: 'var(--ds-muted)' }}>{storeUrl(store)}</p>
          </div>
        </div>
      </footer>
      {store.showBranding &&
      <p className={`py-4 text-center text-[11px] ${showMobileNav ? 'mb-[84px]' : ''} lg:mb-0`} style={{ color: 'var(--ds-muted)' }}>
          Boutique propulsée par <Link to="/" className="font-semibold" style={{ color: 'var(--ds-ink)' }}>SELLIA</Link>
        </p>
      }

      {showMobileNav &&
      <nav
        aria-label="Navigation boutique"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden"
        style={{ background: 'color-mix(in srgb, var(--ds-card) 94%, transparent)', borderColor: 'var(--ds-border)' }}>
          {tabs.map((tab) =>
        <NavLink key={tab.to} to={tab.to} end={tab.end} className="flex flex-col items-center gap-0.5 py-0.5 text-[10.5px] font-medium">
              {({ isActive }) =>
          <>
                  <span className="relative grid h-8 w-14 place-items-center" style={{ color: isActive ? 'var(--ds-accent-strong)' : 'var(--ds-muted)' }}>
                    {isActive &&
              <motion.span layoutId="store-tab" className="absolute inset-0 rounded-full" style={{ background: 'var(--ds-accent-soft)' }} transition={{ type: 'spring', stiffness: 500, damping: 36 }} />
              }
                    <span className="relative">
                      <tab.icon className="size-[21px]" strokeWidth={isActive ? 2.4 : 2} />
                      {tab.badge && <CartBadge count={cartCount} />}
                    </span>
                  </span>
                  <span style={{ color: isActive ? 'var(--ds-ink)' : 'var(--ds-muted)', fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
                </>
          }
            </NavLink>
        )}
        </nav>
      }
    </div>);
}
