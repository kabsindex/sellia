import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Heart, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { ProductImage } from '../shared/ProductImage';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { formatPrice } from '../../utils/format';
import type { StoreTheme } from '../../utils/themes';
import type { Product, ProductLayout, Store } from '../../types';

interface ProductCardProps {
  product: Product;
  store: Store;
  theme: StoreTheme;
  layout?: ProductLayout;
  onOrder: (product: Product) => void;
}

export function ProductCard({ product, store, theme, layout = 'grid', onOrder }: ProductCardProps) {
  const { addToCart, favorites, toggleFavorite: toggleFavoriteInStore } = useSellia();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [quantity, setQuantity] = useState(1);
  const favorite = favorites.includes(product.id);
  const discount =
  product.oldPrice && product.oldPrice > product.price ?
  Math.round((1 - product.price / product.oldPrice) * 100) :
  null;

  const href = `/${store.slug}/produit/${product.slug}`;
  const disabled = product.stock === 0 || !product.available;
  const colorImageKeywords: Record<string, string[]> = {
    blanc: ['blanc', 'white', 'air-force-1-07'],
    noir: ['noir', 'black'],
  };

  function selectedImage() {
    const keywords = selectedColor ?
    colorImageKeywords[selectedColor.toLowerCase()] ?? [selectedColor.toLowerCase()] :
    [];
    const matchingImage = product.images.find((image) =>
    keywords.some((keyword) => image.toLowerCase().includes(keyword))
    );
    return matchingImage ?? product.images[0];
  }

  function confirmAddToCart() {
    addToCart({
      productId: product.id,
      name: product.name,
      image: selectedImage(),
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    toast.success(`${product.name} ajouté au panier.`);
    setPickerOpen(false);
  }

  function toggleFavorite() {
    const added = toggleFavoriteInStore(product.id);
    toast.success(added ? 'Ajouté aux favoris.' : 'Retiré des favoris.');
  }

  const picker = pickerOpen ? createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4">
      <div
        className="max-h-[calc(100vh-2rem)] w-full max-w-[360px] overflow-y-auto rounded-2xl p-4 shadow-lift sm:max-w-[420px]"
        style={{ backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}>
        <div className="flex items-start gap-3">
          <div className="size-20 shrink-0 overflow-hidden rounded-xl" style={{ border: `1px solid ${theme.border}` }}>
            <ProductImage src={selectedImage()} alt={product.name} imageClassName="p-1.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug">{product.name}</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: theme.accent }}>
              {formatPrice(product.price, store.currency)}
            </p>
          </div>
          <button type="button" onClick={() => setPickerOpen(false)} className="grid size-8 place-items-center rounded-lg" aria-label="Fermer">
            <X className="size-4" />
          </button>
        </div>

        {product.sizes.length > 0 && (
          <fieldset className="mt-4">
            <legend className="text-xs font-semibold">Pointure / taille</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className="min-w-10 rounded-xl px-3 py-2 text-xs font-semibold"
                  style={
                    selectedSize === size
                      ? { backgroundColor: theme.accent, color: theme.accentText }
                      : { border: `1px solid ${theme.border}`, color: theme.text }
                  }>
                  {size}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {product.colors.length > 0 && (
          <fieldset className="mt-4">
            <legend className="text-xs font-semibold">Couleur</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold"
                  style={{
                    border: `1px solid ${selectedColor === color.name ? theme.accent : theme.border}`,
                    color: theme.text,
                  }}>
                  <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold">Quantité</p>
          <div className="inline-flex items-center rounded-xl" style={{ border: `1px solid ${theme.border}` }}>
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid size-9 place-items-center" aria-label="Diminuer">
              <Minus className="size-3.5" />
            </button>
            <span className="w-9 text-center text-sm font-semibold">{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => value + 1)} className="grid size-9 place-items-center" aria-label="Augmenter">
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={confirmAddToCart}
          className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-semibold leading-tight"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          <ShoppingCart className="size-4" />
          <span>Valider et ajouter au panier</span>
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  if (layout === 'list') {
    return (
      <article
        className="flex gap-3 overflow-hidden rounded-2xl p-2.5"
        style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
        
        <Link to={href} className="relative size-24 shrink-0 overflow-hidden rounded-xl">
          <ProductImage src={product.images[0]} alt={product.name} />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <Link to={href} className="text-sm font-medium leading-snug hover:underline">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs" style={{ color: theme.muted }}>
            {product.description}
          </p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div>
              <span className="text-sm font-semibold" style={{ color: theme.accent }}>
                {formatPrice(product.price, store.currency)}
              </span>
              {product.oldPrice &&
              <span className="ml-1.5 text-[11px] line-through" style={{ color: theme.muted }}>
                  {formatPrice(product.oldPrice, store.currency)}
                </span>
              }
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                disabled={disabled}
                className="grid size-8 place-items-center rounded-lg disabled:opacity-45"
                style={{ border: `1px solid ${theme.border}`, color: theme.text }}
                aria-label={`Ajouter ${product.name} au panier`}>
                <ShoppingCart className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onOrder(product)}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold disabled:opacity-45"
                style={{ backgroundColor: theme.accent, color: theme.accentText }}>
                
                <WhatsAppIcon className="size-3.5" />
                Commander
              </button>
              <button
                type="button"
                onClick={toggleFavorite}
                className="grid size-8 place-items-center rounded-lg"
                style={{ border: `1px solid ${theme.border}`, color: favorite ? theme.accent : theme.muted }}
                aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                <Heart className={`size-3.5 ${favorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        {picker}
      </article>);

  }

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[20px] transition-transform duration-200 hover:-translate-y-0.5"
      style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
      
      <Link to={href} className="relative block aspect-[1/1.05] overflow-hidden">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          imageClassName="p-2 transition-transform duration-300 group-hover:scale-[1.03]" />
        
        {discount &&
        <span
          className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          
            -{discount}%
          </span>
        }
        {product.stock === 0 &&
        <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[10px] font-medium text-white">
            Bientôt de retour
          </span>
        }
      </Link>
      <button
        type="button"
        onClick={toggleFavorite}
        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full transition-transform duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.surface === '#ffffff' ? 'rgba(255,255,255,0.95)' : theme.card,
          color: favorite ? theme.accent : theme.text,
          border: `1px solid ${theme.border}`
        }}
        aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
        <Heart className={`size-4 ${favorite ? 'fill-current' : ''}`} />
      </button>

      <div className="flex flex-1 flex-col p-3">
        <Link to={href} className="line-clamp-2 text-[13px] font-medium leading-snug hover:underline">
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-semibold" style={{ color: theme.accent }}>
            {formatPrice(product.price, store.currency)}
          </span>
          {product.oldPrice &&
          <span className="text-[11px] line-through" style={{ color: theme.muted }}>
              {formatPrice(product.oldPrice, store.currency)}
            </span>
          }
        </div>

        {product.sizes.length > 0 &&
        <p className="mt-1 truncate text-[10px] md:text-[11px]" style={{ color: theme.muted }}>
            Tailles : {product.sizes.slice(0, 6).join(' · ')}{product.sizes.length > 6 ? ' · …' : ''}
          </p>
        }

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="text-[10px]" style={{ color: theme.muted }}>
            {product.stock > 0 ? 'Disponible' : 'Indisponible'}
          </span>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            disabled={disabled}
            className="grid size-9 shrink-0 place-items-center rounded-full transition-transform hover:scale-105 disabled:opacity-45"
            style={{ backgroundColor: theme.accent, color: theme.accentText }}
            aria-label={`Ajouter ${product.name} au panier`}>
            <Plus className="size-4" />
          </button>
        </div>
      </div>
      {picker}
    </article>);

}
