import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Check, Heart, Minus, Plus, Share2, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { ProductCard } from '../../components/store/ProductCard';
import { CategoryIcon } from '../../components/shared/CategoryIcon';
import { ProductImage } from '../../components/shared/ProductImage';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useQuickOrder } from '../../hooks/useQuickOrder';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { getTheme } from '../../utils/themes';
import { formatPrice } from '../../utils/format';
import { buildProductMessage, openWhatsApp } from '../../utils/whatsapp';

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
  const favorite = product ? favorites.includes(product.id) : false;

  function shareProduct() {
    if (!product) return;
    const url = window.location.href;
    if (navigator.share) {
      void navigator.share({ title: product.name, text: product.name, url }).catch(() => undefined);
      return;
    }
    void navigator.clipboard?.writeText(url);
    toast.success('Lien du produit copié.');
  }

  if (!product) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[720px] px-4 py-16 text-center" style={isPremiumDemo ? { backgroundColor: theme.surface, color: theme.text } : undefined}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
          Erreur 404
        </p>
        <h1 className="mt-2 font-heading text-[20px] font-semibold">Produit introuvable</h1>
        <Link
          to={`/${displayedStore.slug}/catalogue`}
          className="mt-4 inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          
          Retour au catalogue
        </Link>
      </div>);

  }

  const category = categories.find((item) => item.id === product.categoryId);
  const related = products.
  filter((item) => !item.hidden && item.id !== product.id && item.categoryId === product.categoryId).
  slice(0, 4);
  const discount =
  product.oldPrice && product.oldPrice > product.price ?
  Math.round((1 - product.price / product.oldPrice) * 100) :
  null;

  function handleAddToCart() {
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[imageIndex],
      price: product.price,
      quantity,
      size,
      color
    });
    toast.success('Ajouté au panier.');
  }

  function handleWhatsAppOrder() {
    openWhatsApp(
      store.whatsapp,
      buildProductMessage(store, {
        name: product.name,
        slug: product.slug,
        price: product.price,
        size,
        color,
        quantity
      })
    );
  }

  function handleColorSelect(colorName: string) {
    setColor(colorName);

    const colorImageKeywords: Record<string, string[]> = {
      blanc: ['blanc', 'white', 'air-force-1-07'],
      noir: ['noir', 'black'],
    };
    const keywords = colorImageKeywords[colorName.toLowerCase()] ?? [colorName.toLowerCase()];
    const matchingImageIndex = product.images.findIndex((image) =>
    keywords.some((keyword) => image.toLowerCase().includes(keyword))
    );

    if (matchingImageIndex >= 0) {
      setImageIndex(matchingImageIndex);
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1100px] px-4 py-4" style={isPremiumDemo ? { backgroundColor: theme.surface, color: theme.text } : undefined}>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="grid size-10 place-items-center rounded-full"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }}
          aria-label="Retour">
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const added = toggleFavorite(product.id);
              toast.success(added ? 'Ajouté aux favoris.' : 'Retiré des favoris.');
            }}
            className="grid size-10 place-items-center rounded-full"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: favorite ? theme.accent : theme.text }}
            aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            <Heart className={`size-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={shareProduct}
            className="grid size-10 place-items-center rounded-full"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }}
            aria-label="Partager">
            <Share2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-6 lg:grid-cols-2">
        <div>
          <div
            className="relative overflow-hidden rounded-[24px]"
            style={{ border: `1px solid ${theme.border}` }}>
            
            <div className="aspect-square">
              <ProductImage
                src={product.images[imageIndex]}
                alt={product.name}
                imageClassName="p-6" />
              
            </div>
            {discount &&
            <span
              className="absolute left-3 top-3 rounded-lg px-2 py-1 text-xs font-bold"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}>
              
                -{discount}%
              </span>
            }
          </div>

          {product.images.length > 1 &&
          <div className="mt-3 flex gap-2">
              {product.images.map((image, index) =>
            <button
              key={image}
              type="button"
              onClick={() => setImageIndex(index)}
              aria-label={`Photo ${index + 1}`}
              className="size-16 overflow-hidden rounded-xl"
              style={{
                border: `2px solid ${index === imageIndex ? theme.accent : theme.border}`
              }}>
              
                  <ProductImage src={image} alt="" imageClassName="p-1.5" />
                </button>
            )}
            </div>
          }
        </div>

        <div>
          {category &&
          <p className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: theme.muted }}>
              <CategoryIcon slug={category.slug} icon={category.emoji} className="size-3.5" />
              {category.name}
            </p>
          }
          <h1 className="mt-1.5 font-heading text-[24px] font-semibold leading-tight tracking-[-0.02em]">
            {product.name}
          </h1>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-[26px] font-semibold" style={{ color: theme.accent }}>
              {formatPrice(product.price, store.currency)}
            </span>
            {product.oldPrice &&
            <span className="text-sm line-through" style={{ color: theme.muted }}>
                {formatPrice(product.oldPrice, store.currency)}
              </span>
            }
          </div>

          <p className="mt-3 text-sm leading-relaxed" style={{ color: theme.muted }}>
            {product.description}
          </p>

          <div
            className="mt-4 flex items-center gap-3 rounded-2xl p-3"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
            {store.logo ?
            <img src={store.logo} alt="" className="size-11 rounded-xl object-contain" /> :
            <span className="grid size-11 place-items-center rounded-xl text-sm font-bold" style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
              {store.name.slice(0, 1).toUpperCase()}
            </span>
            }
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: theme.muted }}>Vendu par</p>
              <p className="truncate text-sm font-semibold">{store.name}</p>
            </div>
            {store.plan === 'premium' && store.verificationStatus === 'verified' &&
            <ShieldCheck className="size-4 shrink-0" style={{ color: theme.accent }} />
            }
          </div>

          <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: product.stock > 0 ? theme.accentSoft : theme.border,
            color: product.stock > 0 ? theme.accent : theme.muted
          }}>
            
            <Check className="size-3.5" />
            {product.stock > 0 ? `En stock — ${product.stock} disponibles` : 'Rupture de stock'}
          </p>

          {product.sizes.length > 0 &&
          <fieldset className="mt-6">
              <legend className="text-sm font-medium">Taille</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((option) =>
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                aria-pressed={size === option}
                className="min-w-11 rounded-xl px-3 py-2 text-sm font-medium"
                style={
                size === option ?
                { backgroundColor: theme.accent, color: theme.accentText } :
                { border: `1px solid ${theme.border}`, color: theme.text }
                }>
                
                    {option}
                  </button>
              )}
              </div>
            </fieldset>
          }

          {product.colors.length > 0 &&
          <fieldset className="mt-5">
              <legend className="text-sm font-medium">Couleur</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((option) =>
              <button
                key={option.name}
                type="button"
                onClick={() => handleColorSelect(option.name)}
                aria-pressed={color === option.name}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium"
                style={{
                  border: `1px solid ${color === option.name ? theme.accent : theme.border}`,
                  color: theme.text
                }}>
                
                    <span
                  className="size-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: option.hex }} />
                
                    {option.name}
                  </button>
              )}
              </div>
            </fieldset>
          }

          <div className="mt-5">
            <p className="text-sm font-medium">Quantité</p>
            <div
              className="mt-2 inline-flex items-center rounded-xl"
              style={{ border: `1px solid ${theme.border}` }}>
              
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="grid size-10 place-items-center"
                aria-label="Retirer un article">
                
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="grid size-10 place-items-center"
                aria-label="Ajouter un article">
                
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="sticky bottom-3 z-20 mt-6 grid gap-2 rounded-[20px] p-2 shadow-lift backdrop-blur sm:static sm:grid-cols-[1fr_1.4fr] sm:p-0 sm:shadow-none" style={{ backgroundColor: theme.headerBg }}>
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold"
              style={{ border: `1px solid ${theme.border}`, color: theme.text, backgroundColor: theme.card }}>
              <ShoppingBag className="size-4" />
              Ajouter
            </button>
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}>
              <WhatsAppIcon className="size-4" />
              Commander sur WhatsApp
            </button>
          </div>

          <ul className="mt-5 space-y-2 text-xs" style={{ color: theme.muted }}>
            <li className="flex items-center gap-2">
              <Truck className="size-3.5" />
              Livraison rapide selon ta localisation · paiement à la réception
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-3.5" />
              Échange possible sous 48h si la taille ne convient pas
            </li>
          </ul>

        </div>
      </div>

      {related.length > 0 &&
      <section className="mt-10">
          <h2 className="text-sm font-semibold">Tu aimeras aussi</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {related.map((item) =>
          <ProductCard
            key={item.id}
            product={item}
            store={displayedStore}
            theme={theme}
            onOrder={quickOrder} />

          )}
          </div>
        </section>
      }
    </div>);

}
