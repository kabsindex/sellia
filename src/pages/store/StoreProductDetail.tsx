import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Heart, Share2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { useQuickOrder } from '../../hooks/useQuickOrder';
import { ProductCard } from '../../components/store/ProductCard';
import { Badge, Chip, DsButton, DsLinkButton, IconButton, Price, SectionHeader, Stepper, discountPercent } from '../../components/ds';
import { ProductImage } from '../../components/shared/ProductImage';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { themeVars } from '../../design/theme';
import { spring } from '../../design/motion';
import { getTheme } from '../../utils/themes';
import { buildProductMessage, openWhatsApp } from '../../utils/whatsapp';

const colorImageKeywords: Record<string, string[]> = {
  blanc: ['blanc', 'white', 'air-force-1-07'],
  noir: ['noir', 'black']
};

export function StoreProductDetail() {
  const { productSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { store, products, categories, addToCart, favorites, toggleFavorite } = useSellia();
  const storeTheme = useStoreTheme(store.theme);
  const isPremiumDemo = location.pathname.startsWith('/demo/premium/');
  const theme = isPremiumDemo ? getTheme('noir') : storeTheme;
  const displayedStore = isPremiumDemo ? { ...store, slug: 'demo/premium', theme: 'noir' as const } : store;
  const quickOrder = useQuickOrder();
  const product = products.find((item) => item.slug === productSlug && !item.hidden);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState<string | undefined>(product?.sizes[0]);
  const [color, setColor] = useState<string | undefined>(product?.colors[0]?.name);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const favorite = product ? favorites.includes(product.id) : false;
  const rootStyle = { ...themeVars(theme), ...(isPremiumDemo ? { minHeight: '100vh' } : {}) };

  if (!product) {
    return (
      <div className="px-4 py-20 text-center" style={rootStyle}>
        <h1 className="ds-title text-[20px]">Produit introuvable</h1>
        <p className="ds-muted mt-1.5 text-[14px]">Ce produit n’est plus disponible dans la boutique.</p>
        <DsLinkButton to={`/${displayedStore.slug}/catalogue`} className="mt-5">Retour au catalogue</DsLinkButton>
      </div>);
  }

  const category = categories.find((item) => item.id === product.categoryId);
  const related = products.filter((item) => !item.hidden && item.id !== product.id && item.categoryId === product.categoryId).slice(0, 4);
  const discount = discountPercent(product.price, product.oldPrice);
  const soldOut = product.stock === 0 || !product.available;
  const lowStock = !soldOut && product.stock > 0 && product.stock <= 5;
  const images = product.images.length ? product.images : [''];

  function goTo(index: number) {
    setImageIndex(index);
    const el = track.current;
    if (el) el.scrollTo({ left: el.clientWidth * index, behavior: 'smooth' });
  }

  function shareProduct() {
    const url = window.location.href;
    if (navigator.share) {
      void navigator.share({ title: product!.name, text: product!.name, url }).catch(() => undefined);
      return;
    }
    void navigator.clipboard?.writeText(url);
    toast.success('Lien du produit copié.');
  }

  function onFavorite() {
    const on = toggleFavorite(product!.id);
    toast.success(on ? 'Ajouté aux favoris.' : 'Retiré des favoris.');
  }

  function handleAddToCart() {
    addToCart({ productId: product!.id, name: product!.name, image: images[imageIndex], price: product!.price, quantity, size, color });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
    toast.success('Ajouté au panier.');
  }

  function handleWhatsAppOrder() {
    openWhatsApp(store.whatsapp, buildProductMessage(store, { name: product!.name, slug: product!.slug, price: product!.price, size, color, quantity }));
  }

  function handleColorSelect(name: string) {
    setColor(name);
    const keywords = colorImageKeywords[name.toLowerCase()] ?? [name.toLowerCase()];
    const match = product!.images.findIndex((image) => keywords.some((keyword) => image.toLowerCase().includes(keyword)));
    if (match >= 0) goTo(match);
  }

  const actions =
  <div className="flex items-center gap-2.5">
      <motion.div whileTap={{ scale: 0.94 }} transition={spring}>
        <DsButton variant="outline" size="lg" className="!px-4" disabled={soldOut} onClick={handleAddToCart} aria-label="Ajouter au panier">
          <motion.span key={String(added)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring} className="grid place-items-center">
            {added ? <Check className="size-5" style={{ color: 'var(--ds-accent)' }} /> : <ShoppingBag className="size-5" />}
          </motion.span>
          <span className="hidden sm:inline">{added ? 'Ajouté' : 'Ajouter'}</span>
        </DsButton>
      </motion.div>
      <DsButton size="lg" className="min-w-0 flex-1" disabled={soldOut} onClick={handleWhatsAppOrder}>
        <WhatsAppIcon className="size-5" />
        {soldOut ? 'Indisponible' : 'Commander sur WhatsApp'}
      </DsButton>
    </div>;

  return (
    <div className="mx-auto w-full max-w-[1200px] pb-[110px] lg:px-6 lg:pb-12 lg:pt-6" style={rootStyle}>
      <nav aria-label="Fil d’Ariane" className="mb-4 hidden items-center gap-1.5 text-[13px] lg:flex" style={{ color: 'var(--ds-muted)' }}>
        <Link to={`/${displayedStore.slug}/catalogue`} className="hover:underline">Catalogue</Link>
        {category && <><ChevronRight className="size-3.5" /><Link to={`/${displayedStore.slug}/catalogue?categorie=${category.slug}`} className="hover:underline">{category.name}</Link></>}
        <ChevronRight className="size-3.5" /><span className="truncate font-medium" style={{ color: 'var(--ds-ink)' }}>{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <section aria-label="Photos du produit" className="relative lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden lg:rounded-[24px]" style={{ background: 'var(--ds-subtle)' }}>
            <div
              ref={track}
              onScroll={(event) => {
                const el = event.currentTarget;
                setImageIndex(Math.round(el.scrollLeft / el.clientWidth));
              }}
              className="flex aspect-[4/4.3] snap-x snap-mandatory overflow-x-auto sm:aspect-[4/3] lg:aspect-square [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}>
              {images.map((image, index) =>
              <div key={index} className="size-full shrink-0 snap-center">
                  <ProductImage src={image} alt={index === 0 ? product.name : ''} className="bg-transparent" imageClassName="p-8 lg:p-12" loading={index === 0 ? 'eager' : 'lazy'} />
                </div>
              )}
            </div>
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 lg:hidden" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
              <IconButton label="Retour" glass onClick={() => navigate(-1)}><ArrowLeft className="size-[18px]" /></IconButton>
              <div className="flex gap-2">
                <IconButton label="Partager" glass onClick={shareProduct}><Share2 className="size-[17px]" /></IconButton>
                <IconButton label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} glass aria-pressed={favorite} onClick={onFavorite}>
                  <motion.span key={String(favorite)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring} className="grid place-items-center">
                    <Heart className="size-[18px]" style={favorite ? { fill: '#ef4444', color: '#ef4444' } : undefined} />
                  </motion.span>
                </IconButton>
              </div>
            </div>
            {images.length > 1 &&
            <div className="absolute inset-x-0 bottom-9 flex justify-center gap-1.5 lg:bottom-4">
                {images.map((_, index) =>
              <button key={index} type="button" aria-label={`Photo ${index + 1}`} onClick={() => goTo(index)} className="h-1.5 rounded-full transition-all duration-300" style={{ width: imageIndex === index ? 18 : 6, background: imageIndex === index ? 'var(--ds-accent)' : 'var(--ds-border)' }} />
              )}
              </div>
            }
          </div>
          {images.length > 1 &&
          <div className="mt-3 hidden gap-2 lg:flex">
              {images.map((image, index) =>
            <button key={index} type="button" onClick={() => goTo(index)} aria-label={`Voir la photo ${index + 1}`} className="size-[72px] overflow-hidden rounded-[14px]" style={{ background: 'var(--ds-subtle)', boxShadow: imageIndex === index ? '0 0 0 2px var(--ds-accent)' : 'inset 0 0 0 1px var(--ds-border)' }}>
                  <ProductImage src={image} alt="" className="bg-transparent" imageClassName="p-1.5" />
                </button>
            )}
            </div>
          }
        </section>

        <section className="relative -mt-6 rounded-t-[28px] px-4 pt-5 lg:mt-0 lg:rounded-none lg:px-0 lg:pt-0" style={{ background: 'var(--ds-bg)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {category && <p className="ds-muted mb-1 text-[12px] font-medium">{category.name}</p>}
              <h1 className="ds-title text-[22px] leading-tight lg:text-[30px]">{product.name}</h1>
            </div>
            <div className="hidden gap-2 lg:flex">
              <IconButton label="Partager" onClick={shareProduct}><Share2 className="size-[17px]" /></IconButton>
              <IconButton label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} aria-pressed={favorite} onClick={onFavorite}>
                <Heart className="size-[18px]" style={favorite ? { fill: '#ef4444', color: '#ef4444' } : undefined} />
              </IconButton>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <Price price={product.price} oldPrice={product.oldPrice} currency={store.currency} size="lg" />
            {discount && <Badge tone="danger" className="!h-6 !text-[12px]">-{discount}%</Badge>}
            <span className="ml-auto">
              {soldOut ? <Badge tone="ink">Épuisé</Badge> :
              lowStock ? <Badge tone="warn">Plus que {product.stock}</Badge> :
              <Badge tone="accent"><Check className="size-3" />En stock</Badge>}
            </span>
          </div>

          {product.description && <p className="ds-muted mt-4 text-[14px] leading-relaxed">{product.description}</p>}

          {product.sizes.length > 0 &&
          <fieldset className="mt-5">
              <legend className="mb-2 text-[13px] font-semibold">Taille</legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((item) => <Chip key={item} square active={size === item} onClick={() => setSize(item)}>{item}</Chip>)}
              </div>
            </fieldset>
          }
          {product.colors.length > 0 &&
          <fieldset className="mt-5">
              <legend className="mb-2 text-[13px] font-semibold">Couleur{color ? <span className="ds-muted font-normal"> · {color}</span> : null}</legend>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((item) =>
              <button key={item.name} type="button" aria-label={item.name} aria-pressed={color === item.name} onClick={() => handleColorSelect(item.name)} className="grid size-9 place-items-center rounded-full transition-transform active:scale-90" style={{ background: item.hex, boxShadow: color === item.name ? '0 0 0 2px var(--ds-bg), 0 0 0 4px var(--ds-accent)' : 'inset 0 0 0 1px var(--ds-border)' }}>
                    {color === item.name && <Check className="size-4" style={{ color: item.hex.toLowerCase() === '#ffffff' ? '#0f1a15' : '#fff' }} />}
                  </button>
              )}
              </div>
            </fieldset>
          }

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[13px] font-semibold">Quantité</span>
            <Stepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stock || 99)} />
          </div>

          <Link to={`/${displayedStore.slug}`} className="ds-card mt-6 flex items-center gap-3 p-3">
            {store.logo ? <img src={store.logo} alt="" className="size-11 shrink-0 rounded-full object-contain" style={{ background: 'var(--ds-subtle)' }} /> : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold">{store.name}</p>
              <p className="flex items-center gap-0.5 text-[12px] font-medium" style={{ color: 'var(--ds-accent-strong)' }}>Voir la boutique <ChevronRight className="size-3.5" /></p>
            </div>
            <span className="grid size-10 place-items-center rounded-full" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}><WhatsAppIcon className="size-5" /></span>
          </Link>

          <div className="mt-6 hidden lg:block">{actions}</div>
          <p className="ds-muted mt-3 text-center text-[12px] lg:text-left">Tu confirmes la commande et le paiement directement avec le vendeur sur WhatsApp.</p>
        </section>
      </div>

      {related.length > 0 &&
      <section className="mt-9 px-4 lg:mt-14 lg:px-0">
          <SectionHeader title="Dans la même catégorie" to={category ? `/${displayedStore.slug}/catalogue?categorie=${category.slug}` : undefined} />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {related.map((item) => <ProductCard key={item.id} product={item} store={displayedStore} theme={theme} layout="grid" onOrder={quickOrder} />)}
          </div>
        </section>
      }

      <div className="fixed inset-x-0 bottom-0 z-40 border-t px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden" style={{ ...themeVars(theme), background: 'color-mix(in srgb, var(--ds-card) 95%, transparent)', borderColor: 'var(--ds-border)' }}>
        {actions}
      </div>
    </div>);
}
