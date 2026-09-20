import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowRight,
  Heart,
  Mail,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { CategoryIcon } from '../../components/shared/CategoryIcon';
import { ProductCard } from '../../components/store/ProductCard';
import { ProductImage } from '../../components/shared/ProductImage';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { productImageLibrary } from '../../data/products';
import { useQuickOrder } from '../../hooks/useQuickOrder';
import { getTheme } from '../../utils/themes';
import { openWhatsApp, storeUrl } from '../../utils/whatsapp';
import { useSellia } from '../../contexts/SelliaContext';
import { NewsletterSignup } from '../../components/store/NewsletterSignup';
import { StoreCart } from './StoreCart';
import { StoreCheckout } from './StoreCheckout';

const collectionTiles = [
  { title: 'Sneakers', text: 'Icones du quotidien', image: productImageLibrary.airForce, slug: 'sneakers' },
  { title: 'T-shirts graphiques', text: 'Exprime ton style', image: productImageLibrary.tshirt, slug: 't-shirts' },
  { title: 'Sacs élégants', text: 'Allure et praticité', image: productImageLibrary.bag, slug: 'sacs' },
  { title: 'Montres premium', text: 'Le détail qui fait la différence', image: productImageLibrary.rolex, slug: 'montres' }
];

const reviews = [
  ['Kevin M.', 'Qualité incroyable. Livraison rapide et service sur WhatsApp vraiment pratique.'],
  ['Sarah L.', 'Les sneakers sont 100% authentiques, exactement comme sur les photos.'],
  ['Mike T.', 'Très belle sélection et un service client au top.']
];

export function StorePremiumDemo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, categories, favorites, products, store, toggleFavorite } = useSellia();
  const quickOrder = useQuickOrder();
  const theme = getTheme('noir');
  const [activeCategory, setActiveCategory] = useState('tout');
  const [query, setQuery] = useState('');
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const live = products.filter((product) => !product.hidden);
  const premiumStore = { ...store, slug: 'demo/premium', theme: 'noir' as const, plan: 'premium' as const, showBranding: false };
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const palette = {
    page: theme.surface,
    surface: theme.surface,
    card: theme.card,
    soft: theme.accentSoft,
    border: theme.border,
    text: theme.text,
    muted: theme.muted,
    accent: theme.accent,
    accentText: theme.accentText,
    image: '#f5f5f3'
  };
  const activePage = location.pathname.endsWith('/panier') ?
  'panier' :
  location.pathname.endsWith('/commande') ?
  'commande' :
  location.pathname.endsWith('/catalogue') ?
  'catalogue' :
  location.pathname.endsWith('/contact') ?
  'contact' :
  'accueil';

  const filteredProducts = useMemo(() => {
    return live.filter((product) => {
      const category = categories.find((item) => item.id === product.categoryId);
      const matchesCategory = activeCategory === 'tout' || category?.slug === activeCategory;
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, categories, live, query]);

  const featured = filteredProducts.slice(0, 4);
  const favoriteProducts = live.filter((product) => favorites.includes(product.id));

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  useEffect(() => {
    if (activePage === 'panier' || activePage === 'commande') return;
    if (location.pathname.endsWith('/catalogue')) {
      window.setTimeout(() => scrollTo('catalogue'), 80);
      return;
    }
    if (location.pathname.endsWith('/contact')) {
      window.setTimeout(() => scrollTo('contact'), 80);
      return;
    }
    window.setTimeout(() => scrollTo('accueil'), 80);
  }, [activePage, location.pathname]);

  function contactSeller() {
    openWhatsApp(
      store.whatsapp,
      `Bonjour, je viens de visiter ${store.name} (${storeUrl(store)}) et j'ai une question.`
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0" style={{ backgroundColor: palette.page, color: palette.text, colorScheme: 'dark' }}>
      <div className="hidden border-b py-2 text-xs font-medium md:block" style={{ backgroundColor: palette.soft, borderColor: palette.border, color: palette.accent }}>
        <div className="mx-auto flex max-w-[1320px] justify-between px-6">
          <span>Livraison flexible partout en RDC | Commande facilement sur WhatsApp | Des pièces 100% authentiques</span>
          <span>La mode qui te ressemble</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ backgroundColor: theme.headerBg, borderColor: palette.border }}>
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-2 px-3 md:gap-4 md:px-6">
          <img src={store.logo} alt="" className="size-10 rounded-xl object-contain" />
          <div className="min-w-0 flex-1 md:flex-none">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-lg font-semibold leading-tight">{store.name}</p>
              {store.verificationStatus === 'verified' &&
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: palette.soft, color: palette.accent }}>
                  <ShieldCheck className="size-3" />
                  Vérifiée
                </span>}
            </div>
            <p className="truncate text-xs" style={{ color: palette.muted }}>Mode & accessoires</p>
          </div>
          <nav className="ml-8 hidden items-center gap-8 text-sm font-medium md:flex">
            {[
              { id: 'accueil', label: 'Accueil', path: '/demo/premium' },
              { id: 'catalogue', label: 'Catalogue', path: '/demo/premium/catalogue' },
              { id: 'contact', label: 'Contact', path: '/demo/premium/contact' }
            ].map((item) =>
            <button
              key={item.id}
              className="border-b-2 py-5 transition-colors"
              style={{
                borderColor: activePage === item.id ? palette.accent : 'transparent',
                color: activePage === item.id ? palette.accent : palette.text
              }}
              onClick={() => navigate(item.path)}>
              {item.label}
            </button>
            )}
          </nav>
          <div className="ml-auto hidden h-10 w-[320px] items-center gap-2 rounded-xl border px-3 text-sm md:flex" style={{ borderColor: palette.border, color: palette.muted }}>
            <Search className="size-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none"
              placeholder="Rechercher un produit, une marque..."
              aria-label="Rechercher un produit" />
          </div>
          <button className="ml-auto hidden sm:block md:ml-0" onClick={() => activePage === 'panier' || activePage === 'commande' ? navigate('/demo/premium/catalogue') : scrollTo('catalogue')} aria-label="Rechercher">
            <Search className="size-6" />
          </button>
          <button className="relative" onClick={() => setFavoritesOpen(true)} aria-label="Favoris">
            <Heart className={`size-6 ${favorites.length > 0 ? 'fill-current' : ''}`} style={{ color: favorites.length > 0 ? palette.accent : palette.text }} />
            {favorites.length > 0 &&
            <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full text-[11px] font-bold" style={{ backgroundColor: palette.accent, color: palette.accentText }}>
                {favorites.length}
              </span>
            }
          </button>
          <button className="relative" onClick={() => navigate('/demo/premium/panier')} aria-label="Panier">
            <ShoppingBag className="size-6" />
            {cartCount > 0 &&
            <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full text-[11px] font-bold" style={{ backgroundColor: palette.accent, color: palette.accentText }}>
                {cartCount}
              </span>
            }
          </button>
        </div>
      </header>

      <main id="accueil" className="mx-auto max-w-[1320px] px-4 py-4 md:px-6">
        {activePage === 'panier' ? <StoreCart /> : activePage === 'commande' ? <StoreCheckout /> : <>
        <section className="relative min-h-[430px] overflow-hidden rounded-2xl sm:min-h-[390px] md:min-h-[380px] md:rounded-3xl" style={{ backgroundColor: palette.card }}>
          <img src={store.cover} alt="" className="absolute inset-0 size-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/25 md:from-black/80 md:via-black/35 md:to-transparent" />
          <div className="relative flex min-h-[430px] max-w-[560px] flex-col justify-end p-5 text-white sm:min-h-[390px] sm:justify-center sm:p-6 md:min-h-[380px] md:p-12">
            <span className="mb-3 w-fit rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs font-semibold backdrop-blur md:mb-4">
              Nouvelle collection
            </span>
            <h1 className="max-w-[16ch] font-heading text-[30px] font-semibold leading-[1.08] md:text-5xl">
              {store.heroTitle}
            </h1>
            <p className="mt-3 line-clamp-4 max-w-[52ch] text-sm leading-relaxed text-white/90 md:mt-4 md:text-base">
              {store.heroSubtitle}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 md:mt-6 md:gap-3">
              <button onClick={() => scrollTo('catalogue')} className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold md:h-12 md:px-5 md:text-base" style={{ backgroundColor: palette.accent, color: palette.accentText }}>
                Voir le catalogue <ArrowRight className="size-4" />
              </button>
              <button onClick={contactSeller} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/40 bg-black/15 px-4 text-sm font-semibold backdrop-blur md:h-12 md:px-5 md:text-base">
                <WhatsAppIcon className="size-5" /> Nous écrire
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-4">
          {collectionTiles.map((item) =>
          <button
            key={item.slug}
            onClick={() => {
              setActiveCategory(item.slug);
              scrollTo('catalogue');
            }}
            className="flex items-center gap-3 rounded-2xl p-3 text-left"
            style={{ backgroundColor: palette.soft }}>
              <ProductImage src={item.image} alt="" className="size-16 shrink-0 rounded-xl" style={{ backgroundColor: palette.image }} imageClassName="p-1.5" />
              <div className="min-w-0">
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs" style={{ color: palette.muted }}>{item.text}</p>
              </div>
              <ArrowRight className="ml-auto size-4" style={{ color: palette.accent }} />
            </button>
          )}
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-3">
          {[
          [Truck, 'Livraison flexible', 'Coordonnée avec le vendeur'],
          [WhatsAppIcon, 'Commande directe', 'Discussion rapide sur WhatsApp'],
          [ShieldCheck, 'Sélection variée', 'Sneakers, sacs, montres et mode']
          ].map(([Icon, title, text]) =>
          <div key={String(title)} className="flex items-center gap-4 rounded-2xl p-4" style={{ backgroundColor: palette.soft }}>
              <span className="grid size-12 place-items-center rounded-full" style={{ backgroundColor: palette.card, color: palette.accent }}>
                <Icon className="size-6" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm" style={{ color: palette.muted }}>{text}</p>
              </div>
            </div>
          )}
        </section>

        <section className="mt-4 rounded-2xl border p-5" style={{ borderColor: palette.border, backgroundColor: palette.card }}>
          <div className="grid gap-4 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Nova Market</h2>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: palette.muted }}>{store.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><b className="text-xl">7</b><p className="text-xs uppercase" style={{ color: palette.muted }}>Produits</p></div>
              <div><b className="text-xl">4</b><p className="text-xs uppercase" style={{ color: palette.muted }}>Catégories</p></div>
              <div><WhatsAppIcon className="mx-auto size-5" style={{ color: palette.accent }} /><p className="mt-1 text-xs uppercase" style={{ color: palette.muted }}>Commande</p></div>
            </div>
          </div>
        </section>

        <section id="catalogue" className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Catégories</h2>
            <button onClick={() => setActiveCategory('tout')} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: palette.accent }}>Tout voir <ArrowRight className="size-4" /></button>
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('tout')}
              className="shrink-0 rounded-full px-5 py-3 text-sm font-semibold"
              style={activeCategory === 'tout' ? { backgroundColor: palette.accent, color: palette.accentText } : { backgroundColor: palette.soft, color: palette.text }}>
              Tout voir
            </button>
            {categories.map((category) =>
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.slug)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
              style={activeCategory === category.slug ? { backgroundColor: palette.accent, color: palette.accentText } : { backgroundColor: palette.soft, color: palette.text }}>
                <CategoryIcon slug={category.slug} icon={category.emoji} className="size-4" />
                {category.name}
              </button>
            )}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sélection coup de coeur</h2>
            <button onClick={() => setActiveCategory('tout')} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: palette.accent }}>Tout voir <ArrowRight className="size-4" /></button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {featured.map((product) =>
            <ProductCard key={product.id} product={product} store={premiumStore} theme={theme} onOrder={quickOrder} />
            )}
          </div>
          {featured.length === 0 &&
          <div className="mt-3 rounded-2xl border border-dashed p-8 text-center text-sm" style={{ borderColor: palette.border, color: palette.muted }}>
              Aucun produit trouvé.
            </div>
          }
        </section>

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          {[
          ['Sneakers iconiques', 'Les incontournables du moment', productImageLibrary.airForce],
          ['T-shirts graphiques', 'Affirme ta personnalité', productImageLibrary.tshirt],
          ['Montres Premium', 'Pour chaque occasion', productImageLibrary.rolex]
          ].map(([title, text, image]) =>
          <div key={title} className="relative min-h-[150px] overflow-hidden rounded-2xl p-5 text-white" style={{ backgroundColor: '#1d1a15' }}>
              <ProductImage src={image} alt="" className="absolute inset-y-0 right-0 w-1/2 opacity-70" style={{ backgroundColor: palette.image }} />
              <div className="relative max-w-[190px]">
                <p className="text-xs text-white/70">Nouvelle collection</p>
                <h3 className="mt-1 text-xl font-semibold leading-tight">{title}</h3>
                <p className="mt-1 text-sm text-white/80">{text}</p>
                <button onClick={() => scrollTo('catalogue')} className="mt-4 rounded-full px-4 py-2 text-xs font-semibold" style={{ backgroundColor: palette.accent, color: palette.accentText }}>Découvrir</button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          {reviews.map(([name, text]) =>
          <div key={name} className="rounded-2xl border p-4" style={{ borderColor: palette.border, backgroundColor: palette.card }}>
              <div className="flex gap-0.5" style={{ color: palette.accent }}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}</div>
              <p className="mt-2 text-sm" style={{ color: palette.muted }}>"{text}"</p>
              <p className="mt-3 text-sm font-semibold">{name}</p>
            </div>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">Notre style en images</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-6">
            {[productImageLibrary.airForce, productImageLibrary.tshirt, productImageLibrary.bag, productImageLibrary.rolex, productImageLibrary.newBalance, productImageLibrary.jordan4].map((image) =>
            <ProductImage key={image} src={image} alt="" className="aspect-square rounded-2xl border" style={{ borderColor: palette.border, backgroundColor: palette.image }} />
            )}
          </div>
        </section>

        <NewsletterSignup storeSlug={store.slug} storeName={store.name} theme={theme} demo />

        <section id="contact" className="mt-6 rounded-2xl border p-5 shadow-soft md:p-6" style={{ borderColor: palette.border, backgroundColor: palette.card }}>
          <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: palette.soft, color: palette.accent }}>
                <WhatsAppIcon className="size-4" />
                Réponse rapide
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em]">Contacte Nova Market</h2>
              <p className="mt-2 max-w-[520px] text-sm leading-relaxed" style={{ color: palette.muted }}>
                Une question sur une taille, une couleur, une livraison ou une commande ? Écris directement au vendeur et reçois une réponse personnalisée.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={contactSeller}
                  className="inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-semibold" style={{ backgroundColor: palette.accent, color: palette.accentText }}>
                  <WhatsAppIcon className="size-5" />
                  Écrire sur WhatsApp
                </button>
                <a
                  href="mailto:contact@novamarket.com"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-semibold" style={{ borderColor: palette.border }}>
                  <Mail className="size-5" />
                  Envoyer un e-mail
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { icon: WhatsAppIcon, label: 'WhatsApp', value: '+243 970 000 111' },
                { icon: Mail, label: 'Email', value: 'contact@novamarket.com' },
                { icon: MapPin, label: 'Adresse', value: '24, avenue Kasa-Vubu, RD Congo' }
              ].map((item) =>
              <div key={item.label} className="flex items-center gap-4 rounded-2xl p-4" style={{ backgroundColor: palette.soft }}>
                  <span className="grid size-11 place-items-center rounded-full" style={{ backgroundColor: palette.card, color: palette.accent }}>
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: palette.muted }}>{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between rounded-2xl p-4" style={{ backgroundColor: palette.soft }}>
                <p className="text-sm font-semibold">Suivre la boutique</p>
                <div className="flex gap-2">
                  <button className="grid size-9 place-items-center rounded-full" style={{ backgroundColor: palette.surface, color: palette.text }} aria-label="Instagram"><SiInstagram className="size-4" /></button>
                  <button className="grid size-9 place-items-center rounded-full" style={{ backgroundColor: palette.surface, color: palette.text }} aria-label="Facebook"><SiFacebook className="size-4" /></button>
                  <button className="grid size-9 place-items-center rounded-full" style={{ backgroundColor: palette.surface, color: palette.text }} aria-label="TikTok"><SiTiktok className="size-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>}
      </main>

      <footer className="border-t py-8" style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
        <div className="mx-auto grid max-w-[1320px] gap-6 px-4 text-sm md:grid-cols-4 md:px-6">
          <div>
            <div className="flex items-center gap-2"><img src={store.logo} alt="" className="size-9 rounded-lg" /><b>{store.name}</b></div>
            <p className="mt-2" style={{ color: palette.muted }}>Le dressing complet pour ton style.</p>
          </div>
          <div>
            <b>Liens rapides</b>
            <div className="mt-2 grid gap-1" style={{ color: palette.muted }}>
              <button className="w-fit text-left hover:underline" onClick={() => navigate('/demo/premium')}>Accueil</button>
              <button className="w-fit text-left hover:underline" onClick={() => navigate('/demo/premium/catalogue')}>Catalogue</button>
              <button className="w-fit text-left hover:underline" onClick={() => navigate('/demo/premium/contact')}>Contact</button>
            </div>
          </div>
          <div><b>Catégories</b><p className="mt-2" style={{ color: palette.muted }}>Sneakers<br />T-shirts<br />Sacs<br />Montres</p></div>
          <div>
            <b>Nous contacter</b>
            <p className="mt-2" style={{ color: palette.muted }}>Écrire sur WhatsApp<br />contact@novamarket.com<br />Kinshasa, RDC</p>
            <div className="mt-3 flex gap-2"><SiInstagram /><SiFacebook /><SiTiktok /></div>
          </div>
        </div>
      </footer>

      {favoritesOpen &&
      <div className="fixed inset-0 z-[70] bg-black/35 p-4" onClick={() => setFavoritesOpen(false)}>
          <aside
            className="ml-auto flex h-full w-full max-w-[390px] flex-col overflow-hidden rounded-2xl shadow-lift"
            style={{ backgroundColor: palette.surface, color: palette.text }}
            onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-4" style={{ borderColor: palette.border }}>
              <div>
                <p className="text-lg font-semibold">Mes favoris</p>
                <p className="text-xs" style={{ color: palette.muted }}>
                  {favoriteProducts.length} produit{favoriteProducts.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setFavoritesOpen(false)}
                className="grid size-9 place-items-center rounded-full border"
                style={{ borderColor: palette.border }}
                aria-label="Fermer les favoris">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {favoriteProducts.length === 0 ?
              <div className="grid h-full place-items-center text-center">
                  <div>
                    <Heart className="mx-auto size-10" style={{ color: palette.accent }} />
                    <p className="mt-3 font-semibold">Aucun favori pour le moment</p>
                    <p className="mt-1 text-sm" style={{ color: palette.muted }}>
                      Clique sur le coeur d’un produit pour le retrouver ici.
                    </p>
                  </div>
                </div> :
              <ul className="space-y-3">
                  {favoriteProducts.map((product) =>
                <li key={product.id} className="flex gap-3 rounded-2xl border p-3" style={{ borderColor: palette.border, backgroundColor: palette.card }}>
                      <ProductImage src={product.images[0]} alt="" className="size-16 shrink-0 rounded-xl" style={{ backgroundColor: palette.image }} imageClassName="p-1.5" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <p className="text-sm font-semibold" style={{ color: palette.accent }}>{product.price}$</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => {
                              setFavoritesOpen(false);
                              navigate(`/demo/premium/produit/${product.slug}`);
                            }}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: palette.accent, color: palette.accentText }}>
                            Voir
                          </button>
                          <button
                            onClick={() => {
                              toggleFavorite(product.id);
                              toast.success('Retiré des favoris.');
                            }}
                            className="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                            style={{ borderColor: palette.border }}>
                            Retirer
                          </button>
                        </div>
                      </div>
                    </li>
                )}
                </ul>
              }
            </div>
          </aside>
        </div>
      }

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 text-[11px] font-medium md:hidden" style={{ backgroundColor: palette.surface, borderColor: palette.border }}>
        {[
          { icon: ShoppingBag, label: 'Accueil', action: () => navigate('/demo/premium') },
          { icon: Search, label: 'Catégories', action: () => navigate('/demo/premium/catalogue') },
          { icon: WhatsAppIcon, label: 'WhatsApp', action: contactSeller },
          { icon: Heart, label: 'Favoris', action: () => setFavoritesOpen(true) },
          { icon: PhoneCall, label: 'Contact', action: () => navigate('/demo/premium/contact') }
        ].map(({ icon: Icon, label, action }, index) =>
        <button key={label} onClick={action} className={index === 2 ? '-mt-7 flex flex-col items-center gap-1' : 'flex flex-col items-center gap-1'} style={{ color: index === 2 ? palette.accent : palette.muted }}>
            <span className={index === 2 ? 'grid size-16 place-items-center rounded-full shadow-lift' : ''} style={index === 2 ? { backgroundColor: palette.accent, color: palette.accentText } : undefined}>
              <Icon className="size-6" />
            </span>
            {label}
          </button>
        )}
      </nav>
    </div>
  );
}
