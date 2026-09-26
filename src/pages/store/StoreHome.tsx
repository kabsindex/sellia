import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Sparkles } from 'lucide-react';
import { ProductCard } from '../../components/store/ProductCard';
import { NewsletterSignup } from '../../components/store/NewsletterSignup';
import { CategoryIcon } from '../../components/shared/CategoryIcon';
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
  const newest = live
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const sections = [
    { title: 'Meilleures sélections', icon: Sparkles, items: featured.length ? featured : newest },
    { title: 'Nouveautés', icon: ArrowRight, items: newest },
    { title: 'Promotions', icon: BadgePercent, items: promos }
  ].filter((section, index, list) =>
    section.items.length > 0 &&
    list.findIndex((candidate) => candidate.title === section.title) === index
  );

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-4 lg:px-6">
      <section
        className="relative overflow-hidden rounded-[24px]"
        style={{ backgroundColor: theme.accentSoft }}>
        <div className="relative aspect-[16/8.2] min-h-[190px] sm:aspect-[16/6]">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/38 to-black/5" />
          <div className="absolute inset-y-0 left-0 flex max-w-[78%] flex-col justify-center p-5 sm:max-w-[620px] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
              {store.name}
            </p>
            <h1 className="mt-2 font-heading text-[24px] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[34px]">
              {store.heroTitle || store.name}
            </h1>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/85 sm:text-sm">
              {store.heroSubtitle || store.description}
            </p>
            <Link
              to={`/${store.slug}/catalogue`}
              className="mt-4 inline-flex h-10 w-fit items-center gap-1.5 rounded-full px-4 text-sm font-semibold"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}>
              Découvrir
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-[18px] font-semibold tracking-[-0.02em]">Catégories</h2>
          <Link to={`/${store.slug}/catalogue`} className="text-xs font-semibold" style={{ color: theme.accent }}>
            Tout voir
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-4 overflow-x-auto px-4 pb-1">
          {categories.map((category) =>
          <Link
            key={category.id}
            to={`/${store.slug}/catalogue?categorie=${category.slug}`}
            className="flex w-[72px] shrink-0 flex-col items-center gap-2 text-center">
            <span
              className="grid size-14 place-items-center rounded-full"
              style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.accent }}>
              <CategoryIcon slug={category.slug} icon={category.emoji} className="size-5" />
            </span>
            <span className="line-clamp-2 text-[10px] font-medium leading-tight" style={{ color: theme.muted }}>
              {category.name}
            </span>
          </Link>
          )}
        </div>
      </section>

      {sections.map((section) =>
      <section key={section.title} className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-[18px] font-semibold tracking-[-0.02em]">{section.title}</h2>
          <Link to={`/${store.slug}/catalogue`} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: theme.accent }}>
            Voir tout
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

      <section className="mt-9">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-[18px] font-semibold tracking-[-0.02em]">Tous les produits</h2>
          <span className="text-xs" style={{ color: theme.muted }}>{live.length} produits</span>
        </div>
        <div className={`mt-3 grid gap-3 ${store.layout === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
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
      <NewsletterSignup
        storeSlug={store.slug}
        storeName={store.name}
        theme={theme}
        available={store.newsletterAvailable} />
      }
    </div>
  );
}
