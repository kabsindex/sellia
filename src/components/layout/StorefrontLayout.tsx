import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Grid2X2,
  Heart,
  Home,
  MapPin,
  Search,
  SearchX,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  WifiOff } from
'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { Button } from '../ui/Button';
import { Logo } from '../shared/Logo';
import { BrandLoadingScreen } from '../shared/BrandLoadingScreen';
import { ProductImage } from '../shared/ProductImage';
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
    products,
    bootstrapStatus,
    bootstrapError,
    bootstrapSlug
  } = useSellia();
  const theme = useStoreTheme(store.theme);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [minimumLoadingDone, setMinimumLoadingDone] = useState(false);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const storefrontBase = `/${store.slug}`;
  const showMobileNav =
    !location.pathname.startsWith(`${storefrontBase}/produit/`) &&
    location.pathname !== `${storefrontBase}/panier`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const results = query ?
  products.filter(
    (product) => !product.hidden && product.name.toLowerCase().includes(query.toLowerCase())
  ) :
  [];

  const navLinks = [
  { to: `/${store.slug}`, label: 'Accueil', end: true },
  { to: `/${store.slug}/catalogue`, label: 'Catalogue' },
  { to: `/${store.slug}/contact`, label: 'Contact' }];


  return (
    <div
      className="flex min-h-screen w-full flex-col"
      style={{
        backgroundColor: theme.surface,
        color: theme.text,
        fontFamily: store.font,
        '--store-primary': theme.accent,
        '--store-primary-light': theme.accentSoft,
      } as React.CSSProperties}>
      
      <header
        className={`sticky top-0 z-40 backdrop-blur transition-shadow duration-200 ${scrolled ? 'shadow-soft' : ''}`}
        style={{ backgroundColor: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>

        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center gap-3 px-4 lg:px-6">
          <Link to="/" className="shrink-0" aria-label="Accueil SELLIA">
            <Logo />
          </Link>

          <nav className="ml-3 hidden items-center gap-1 md:flex">
            {navLinks.map((link) =>
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className="rounded-lg px-3 py-2 text-sm transition-colors"
              style={({ isActive }) => ({
                color: isActive ? theme.accent : theme.muted,
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? theme.accentSoft : 'transparent'
              })}>
              {link.label}
            </NavLink>
            )}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              to={`/${store.slug}/favoris`}
              aria-label="Favoris"
              className="hidden size-9 place-items-center rounded-full sm:grid"
              style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.muted }}>
              <Heart className="size-4" />
            </Link>
            <Link
              to={`/${store.slug}/panier`}
              aria-label={`Panier (${cartCount})`}
              className="relative grid size-10 place-items-center rounded-full"
              style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }}>
              <ShoppingBag className="size-4.5" />
              {cartCount > 0 &&
              <span
                className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold"
                style={{ backgroundColor: theme.accent, color: theme.accentText }}>
                {cartCount}
              </span>
              }
            </Link>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-2 px-4 pb-3 lg:px-6">
          <Link
            to={`/${store.slug}`}
            className="flex max-w-[44%] shrink-0 items-center gap-2 rounded-full px-2.5 py-1.5 sm:max-w-none"
            style={{ backgroundColor: theme.accentSoft }}>
            {store.logo &&
            <img src={store.logo} alt="" className="size-7 shrink-0 rounded-full object-contain" />
            }
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold">{store.name}</span>
              {store.plan === 'premium' && store.verificationStatus === 'verified' &&
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold" style={{ color: theme.accent }}>
                <ShieldCheck className="size-2.5" />
                Vérifiée
              </span>
              }
            </span>
          </Link>

          <div
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full px-3"
            style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card }}>
            <Search className="size-4 shrink-0" style={{ color: theme.muted }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un produit"
              aria-label="Rechercher un produit"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              style={{ color: theme.text }} />
          </div>
        </div>

        {query &&
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-3 lg:px-6">
          {results.length > 0 ?
          <ul className="overflow-hidden rounded-2xl shadow-lift" style={{ border: `1px solid ${theme.border}` }}>
            {results.slice(0, 5).map((product) =>
            <li key={product.id}>
              <Link
                to={`/${store.slug}/produit/${product.slug}`}
                onClick={() => setQuery('')}
                className="flex items-center gap-3 px-3 py-2.5"
                style={{ backgroundColor: theme.card }}>
                <span className="size-10 shrink-0 overflow-hidden rounded-xl">
                  <ProductImage src={product.images[0]} alt="" imageClassName="p-1" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{product.name}</span>
              </Link>
            </li>
            )}
          </ul> :
          <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: theme.card, color: theme.muted, border: `1px solid ${theme.border}` }}>
            Aucun produit trouvé
          </div>
          }
        </div>
        }
      </header>

      <main className={`flex-1 ${showMobileNav ? 'pb-24' : 'pb-5'} md:pb-0`}>
        <Outlet />
      </main>

      <footer className="mb-24 md:mb-0" style={{ borderTop: `1px solid ${theme.border}` }}>
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-6">
          <div>
            <div className="flex items-center gap-2">
              {store.logo && <img src={store.logo} alt="" className="size-8 rounded-lg object-contain" />}
              <div>
                <p className="text-sm font-semibold">{store.name}</p>
                <p className="text-xs" style={{ color: theme.muted }}>{store.category}</p>
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: theme.muted }}>
              {store.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: theme.muted }}>
              Contact
            </p>
            <ul className="mt-2.5 space-y-2 text-xs" style={{ color: theme.muted }}>
              <li className="flex items-start gap-2">
                <WhatsAppIcon className="mt-0.5 size-3.5 shrink-0" />
                {store.whatsapp}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                {[store.address, store.city, store.country].filter(Boolean).join(', ')}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: theme.muted }}>
              Suivre la boutique
            </p>
            <div className="mt-2.5 flex gap-2">
              {[
              { icon: SiInstagram, handle: store.instagram },
              { icon: SiTiktok, handle: store.tiktok },
              { icon: SiFacebook, handle: store.facebook }].

              filter((item) => item.handle).
              map((item, index) =>
              <span
                key={index}
                className="grid size-8 place-items-center rounded-lg"
                style={{ border: `1px solid ${theme.border}`, color: theme.muted }}>
                
                    <item.icon className="size-4" />
                  </span>
              )}
            </div>
            <p className="mt-3 font-mono text-[11px]" style={{ color: theme.muted }}>
              {storeUrl(store)}
            </p>
          </div>
          {store.showBranding &&
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: theme.muted }}>
              Propulsé par
            </p>
            <div className="mt-2.5">
              <Logo />
              <p className="mt-2 text-xs" style={{ color: theme.muted }}>
                Le commerce plus simple
              </p>
            </div>
          </div>
          }
        </div>
      </footer>

      {showMobileNav &&
      <nav
        aria-label="Navigation boutique"
        className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 items-end gap-1 px-2 pt-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-18px_rgba(0,0,0,0.35)] backdrop-blur md:hidden"
        style={{ backgroundColor: theme.headerBg, borderTop: `1px solid ${theme.border}` }}>
        <NavLink
          to={`/${store.slug}`}
          end
          className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium"
          style={({ isActive }) => ({ color: isActive ? theme.accent : theme.muted })}>
          <Home className="size-5" />
          Accueil
        </NavLink>
        <NavLink
          to={`/${store.slug}/catalogue`}
          className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium"
          style={({ isActive }) => ({ color: isActive ? theme.accent : theme.muted })}>
          <Grid2X2 className="size-5" />
          Catégories
        </NavLink>
        <NavLink
          to={`/${store.slug}/favoris`}
          className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium"
          style={({ isActive }) => ({ color: isActive ? theme.accent : theme.muted })}>
          <Heart className="size-5" />
          Favoris
        </NavLink>
        <NavLink
          to={`/${store.slug}/panier`}
          className="relative flex flex-col items-center gap-1 py-1 text-[10px] font-medium"
          style={({ isActive }) => ({ color: isActive ? theme.accent : theme.muted })}>
          <span className="relative">
            <ShoppingBag className="size-5" />
            {cartCount > 0 &&
            <span
              className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[8px] font-bold"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}>
              {cartCount}
            </span>
            }
          </span>
          Panier
        </NavLink>
        <NavLink
          to={`/${store.slug}/compte`}
          className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium"
          style={({ isActive }) => ({ color: isActive ? theme.accent : theme.muted })}>
          <UserRound className="size-5" />
          Compte
        </NavLink>
      </nav>
      }
    </div>);

}
