import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, CheckCircle2, Sparkles, Truck } from 'lucide-react';
import { ProductCard } from '../../components/store/ProductCard';
import { NewsletterSignup } from '../../components/store/NewsletterSignup';
import { CategoryIcon } from '../../components/shared/CategoryIcon';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useQuickOrder } from '../../hooks/useQuickOrder';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { PLAN_FEATURES } from '../../data/plans';

export function StoreHome() {
  const { store, products, categories } = useSellia();
  const theme = useStoreTheme(store.theme);
  const quickOrder = useQuickOrder();
  const desktopCover = store.cover || store.coverMobile;
  const mobileCover = store.coverMobile || store.cover;

  const allLive = products.filter((product) => !product.hidden);
  const productLimit = PLAN_FEATURES[store.plan].maxProducts;
  const live = allLive.slice(0, productLimit);
  const featured = live.filter((product) => product.featured).slice(0, 4);
  const promos = live.filter((product) => product.promo).slice(0, 4);
  const newest = live.
  slice().
  sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).
  slice(0, 4);

  const sections = [
  { title: 'Sélection coup de coeur', icon: Sparkles, items: featured },
  { title: 'Dernières arrivées', icon: ArrowRight, items: newest },
  { title: 'Offres du moment', icon: BadgePercent, items: promos }].
  filter((section) => section.items.length > 0);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-4 lg:px-6">
      <section className="relative overflow-hidden rounded-2xl md:rounded-3xl">
        <div className="relative aspect-[4/5] bg-black lg:aspect-[2/1]">
          {mobileCover &&
          <picture>
              <source media="(min-width: 1024px)" srcSet={desktopCover} />
              <img
              src={mobileCover}
              alt=""
              className="absolute inset-0 size-full object-cover object-center"
              loading="eager" />
            </picture>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 lg:from-black/80 lg:via-black/30 lg:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <CheckCircle2 className="size-3.5" />
              Collection sélectionnée
            </span>
            <h1 className="max-w-[620px] font-heading text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[30px]">
              {store.heroTitle}
            </h1>
            <p className="mt-2 line-clamp-3 max-w-[560px] text-xs leading-relaxed text-white/85 sm:text-sm">
              {store.heroSubtitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/${store.slug}/catalogue`}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
                style={{ backgroundColor: theme.accent, color: theme.accentText }}>
                
                Voir le catalogue
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to={`/${store.slug}/contact`}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/30 px-4 text-sm font-medium text-white backdrop-blur">
                
                <WhatsAppIcon className="size-4" />
                Nous écrire
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
        {[
        { icon: Truck, title: 'Livraison flexible', text: 'Coordonnée avec le vendeur' },
        { icon: WhatsAppIcon, title: 'Commande directe', text: 'Discussion rapide sur WhatsApp' },
        { icon: BadgePercent, title: 'Sélection variée', text: 'Sneakers, sacs, montres et mode' }].
        map((item) =>
        <div
          key={item.title}
          className="flex min-w-[210px] items-center gap-2.5 rounded-2xl p-3 sm:min-w-0"
          style={{ backgroundColor: theme.accentSoft }}>
          
            <item.icon className="size-4 shrink-0" style={{ color: theme.accent }} />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{item.title}</p>
              <p className="truncate text-[11px]" style={{ color: theme.muted }}>
                {item.text}
              </p>
            </div>
          </div>
        )}
      </section>

      <section
        className="mt-4 rounded-2xl p-4"
        style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
              {store.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.muted }}>
              {store.description}
            </p>
          </div>
        <dl className="grid grid-cols-3 gap-3 text-center md:border-l md:pl-5" style={{ borderColor: theme.border }}>
          {[
          { value: live.length, label: 'produits' },
          { value: categories.length, label: 'catégories' },
          { value: 'WhatsApp', label: 'commande' }].
          map((item) =>
          <div key={item.label}>
              <dt className="font-heading text-lg font-semibold" style={{ color: theme.text }}>
                {item.value}
              </dt>
              <dd className="mt-0.5 text-[10px] uppercase tracking-[0.08em]" style={{ color: theme.muted }}>
                {item.label}
              </dd>
            </div>
          )}
        </dl>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Catégories</h2>
          <Link
            to={`/${store.slug}/catalogue`}
            className="inline-flex items-center gap-1 text-xs font-semibold"
            style={{ color: theme.accent }}>
            Tout voir
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          <Link
            to={`/${store.slug}/catalogue`}
            className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold"
            style={{ backgroundColor: theme.accent, color: theme.accentText }}>
            
            Tout voir
          </Link>
          {categories.map((category) =>
          <Link
            key={category.id}
            to={`/${store.slug}/catalogue?categorie=${category.slug}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium"
            style={{ backgroundColor: theme.accentSoft, color: theme.text }}>
            
              <CategoryIcon slug={category.slug} icon={category.emoji} className="size-3.5" />
              {category.name}
            </Link>
          )}
        </div>
      </section>

      {sections.map((section) =>
      <section key={section.title} className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">{section.title}</h2>
            <Link
            to={`/${store.slug}/catalogue`}
            className="inline-flex items-center gap-1 text-xs font-medium"
            style={{ color: theme.accent }}>
            
              Tout voir
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {section.items.map((product) =>
          <ProductCard
            key={product.id}
            product={product}
            store={store}
            theme={theme}
            onOrder={quickOrder} />

          )}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Tout le catalogue</h2>
          <span className="text-xs" style={{ color: theme.muted }}>
            {live.length} produits
          </span>
        </div>
        <div
          className={`mt-3 grid gap-3 ${
          store.layout === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`
          }>
          
          {live.map((product) =>
          <ProductCard
            key={product.id}
            product={product}
            store={store}
            theme={theme}
            layout={store.layout}
            onOrder={quickOrder} />

          )}
        </div>
      </section>
      {store.plan === 'premium' &&
        <NewsletterSignup storeSlug={store.slug} storeName={store.name} theme={theme} available={store.newsletterAvailable} />}
    </div>);

}
