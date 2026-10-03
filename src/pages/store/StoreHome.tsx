import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, PackageOpen, Search } from 'lucide-react';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { useLiveProducts } from '../../hooks/useLiveProducts';
import { ProductCard } from '../../components/store/ProductCard';
import { CategoryBubbles } from '../../components/store/StoreParts';
import { NewsletterSignup } from '../../components/store/NewsletterSignup';
import { DsLinkButton, EmptyState, SectionHeader } from '../../components/ds';
import { Reveal } from '../../components/ds/motion';

const grid = 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4';

export function StoreHome() {
  const { store, categories } = useSellia();
  const theme = useStoreTheme(store.theme);
  const navigate = useNavigate();
  const live = useLiveProducts();
  const base = `/${store.slug}`;
  const desktopCover = store.cover || store.coverMobile;
  const mobileCover = store.coverMobile || store.cover;

  const { popular, promos, newest } = useMemo(() => {
    const byDate = live.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const popularList = live.
    slice().
    sort((a, b) => Number(b.featured) - Number(a.featured) || b.views - a.views).
    slice(0, 8);
    return { popular: popularList, promos: live.filter((product) => product.promo), newest: byDate.slice(0, 4) };
  }, [live]);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-8 pt-1 lg:px-6 lg:pt-6">
      <Link to={`${base}/recherche`} className="ds-search lg:hidden" aria-label="Rechercher un produit">
        <Search className="size-4 shrink-0" />
        <span className="text-[14px]">Rechercher un produit, une catégorie…</span>
      </Link>

      <Reveal className="mt-3 lg:mt-0">
        <section className="relative isolate h-[176px] overflow-hidden rounded-[20px] sm:h-[220px] lg:h-[400px] lg:rounded-[28px]" style={{ background: 'var(--ds-accent)' }}>
          {mobileCover && <img src={mobileCover} alt="" className="absolute inset-0 -z-10 size-full object-cover md:hidden" />}
          {desktopCover && <img src={desktopCover} alt="" className="absolute inset-0 -z-10 hidden size-full object-cover md:block" />}
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(8,14,11,0.72) 0%, rgba(8,14,11,0.35) 55%, rgba(8,14,11,0.05) 100%)' }} />
          <div className="flex h-full max-w-[78%] flex-col justify-center gap-2 p-5 text-white sm:max-w-[60%] sm:p-8 lg:max-w-[540px] lg:gap-4 lg:p-12">
            <h1 className="ds-title line-clamp-3 shrink-0 text-[20px] leading-[1.15] !text-white sm:text-[28px] lg:text-[40px]">{store.heroTitle || store.name}</h1>
            {store.heroSubtitle && <p className="line-clamp-2 shrink-0 text-[12.5px] leading-snug text-white/85 sm:text-[15px] lg:text-[17px]">{store.heroSubtitle}</p>}
            <DsLinkButton to={`${base}/catalogue`} size="sm" className="mt-1 w-fit lg:!h-12 lg:!px-6 lg:!text-[15px]">
              {store.ctaLabel || 'Découvrir'}
              <ArrowRight className="size-4" />
            </DsLinkButton>
          </div>
        </section>
      </Reveal>

      {live.length === 0 ?
      <EmptyState icon={PackageOpen} title="Les produits arrivent bientôt" text="Cette boutique prépare son catalogue. Reviens dans un instant." /> :

      <>
          {categories.length > 0 &&
        <section className="mt-5 lg:mt-8">
              <CategoryBubbles
            categories={categories}
            products={live}
            activeSlug=""
            onSelect={(slug) => navigate(slug === 'tout' ? `${base}/catalogue` : `${base}/catalogue?categorie=${slug}`)} />
            </section>
        }

          <Reveal className="mt-6 lg:mt-10">
            <SectionHeader title="Produits populaires" to={`${base}/catalogue`} />
            <div className={`mt-3 ${grid}`}>
              {popular.map((product) => <ProductCard key={product.id} product={product} store={store} theme={theme} layout="grid" />)}
            </div>
          </Reveal>

          {promos.length > 0 &&
        <Reveal className="mt-8 lg:mt-12">
              <SectionHeader title="Promotions" to={`${base}/catalogue?filtre=promo`} />
              <div className="ds-scroll-x -mx-4 mt-3 px-4 pb-1 lg:mx-0 lg:px-0">
                {promos.map((product) =>
            <div key={product.id} className="w-[168px] shrink-0 snap-start sm:w-[200px]">
                    <ProductCard product={product} store={store} theme={theme} layout="grid" />
                  </div>
            )}
              </div>
            </Reveal>
        }

          <Reveal className="mt-8 lg:mt-12">
            <SectionHeader title="Nouveautés" to={`${base}/catalogue`} />
            <div className={`mt-3 ${grid}`}>
              {newest.map((product) => <ProductCard key={product.id} product={product} store={store} theme={theme} layout="grid" />)}
            </div>
          </Reveal>
        </>
      }

      {store.plan === 'premium' &&
      <div className="mt-8">
          <NewsletterSignup storeSlug={store.slug} storeName={store.name} theme={theme} available={store.newsletterAvailable} />
        </div>
      }
    </div>);
}
