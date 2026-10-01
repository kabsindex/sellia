import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, Price, discountPercent } from '../ds';
import { FavoriteButton } from './StoreParts';
import { VariantSheet } from './VariantSheet';
import { ProductImage } from '../shared/ProductImage';
import { useSellia } from '../../contexts/SelliaContext';
import { themeVars } from '../../design/theme';
import { spring } from '../../design/motion';
import type { StoreTheme } from '../../utils/themes';
import type { Product, ProductLayout, Store } from '../../types';

interface ProductCardProps {
  product: Product;
  store: Store;
  theme: StoreTheme;
  layout?: ProductLayout;
  /** Conservé pour compatibilité (démo premium) : la carte propose désormais l'ajout au panier. */
  onOrder?: (product: Product) => void;
}

export function ProductCard({ product, store, theme, layout = 'grid' }: ProductCardProps) {
  const { addToCart, favorites, toggleFavorite } = useSellia();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const favorite = favorites.includes(product.id);
  const discount = discountPercent(product.price, product.oldPrice);
  const soldOut = product.stock === 0 || !product.available;
  const needsChoice = product.sizes.length > 0 || product.colors.length > 0;
  const href = `/${store.slug}/produit/${product.slug}`;
  const isList = layout === 'list';

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1100);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  function quickAdd() {
    if (soldOut) return;
    if (needsChoice) {
      setSheetOpen(true);
      return;
    }
    addToCart({ productId: product.id, name: product.name, image: product.images[0], price: product.price, quantity: 1 });
    setJustAdded(true);
    toast.success(`${product.name} ajouté au panier.`);
  }

  function onFavorite() {
    const added = toggleFavorite(product.id);
    toast.success(added ? 'Ajouté aux favoris.' : 'Retiré des favoris.');
  }

  const addButton =
  <motion.button
    type="button"
    whileTap={{ scale: 0.88 }}
    transition={spring}
    onClick={quickAdd}
    disabled={soldOut}
    aria-label={soldOut ? 'Produit indisponible' : `Ajouter ${product.name} au panier`}
    className="absolute bottom-2.5 right-2.5 grid size-[34px] place-items-center rounded-[11px] disabled:opacity-40"
    style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)', boxShadow: 'var(--ds-shadow-sm)' }}>
      <motion.span key={String(justAdded)} initial={{ scale: 0.5, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={spring} className="grid place-items-center">
        {justAdded ? <Check className="size-[18px]" /> : <Plus className="size-[18px]" />}
      </motion.span>
    </motion.button>;

  const badges =
  <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
      {discount && <Badge tone="danger">-{discount}%</Badge>}
      {soldOut && <Badge tone="ink">Épuisé</Badge>}
      {!soldOut && !discount && product.featured && <Badge tone="solid">Top</Badge>}
    </div>;

  return (
    <article className="ds-card group relative overflow-hidden" style={themeVars(theme)}>
      <Link to={href} className={isList ? 'flex items-stretch' : 'block'} aria-label={product.name}>
        <div
          className={`relative shrink-0 overflow-hidden ${isList ? 'w-[112px]' : 'aspect-square w-full'}`}
          style={{ background: 'var(--ds-subtle)' }}>
          <ProductImage
            src={product.images[0]}
            alt=""
            className="bg-transparent"
            imageClassName="p-3 transition-transform duration-300 group-hover:scale-[1.04]"
            style={soldOut ? { opacity: 0.55 } : undefined} />
          {badges}
        </div>
        <div className={`min-w-0 flex-1 ${isList ? 'flex flex-col justify-center p-3 pr-12' : 'px-3 pb-3 pt-2.5 pr-12'}`}>
          <h3 className={`text-[13.5px] font-semibold leading-snug ${isList ? 'line-clamp-2' : 'truncate'}`}>{product.name}</h3>
          <div className="mt-1"><Price price={product.price} oldPrice={product.oldPrice} currency={store.currency} /></div>
        </div>
      </Link>
      <FavoriteButton active={favorite} onToggle={onFavorite} className={`absolute right-2 ${isList ? 'top-2' : 'top-2'}`} />
      {addButton}
      <VariantSheet product={sheetOpen ? product : null} theme={theme} currency={store.currency} onClose={() => setSheetOpen(false)} />
    </article>);
}
