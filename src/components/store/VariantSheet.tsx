import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShoppingBag, X } from 'lucide-react';
import { toast } from 'sonner';
import { Chip, DsButton, IconButton, Price, Stepper } from '../ds';
import { ProductImage } from '../shared/ProductImage';
import { useSellia } from '../../contexts/SelliaContext';
import { themeVars } from '../../design/theme';
import { ease } from '../../design/motion';
import type { StoreTheme } from '../../utils/themes';
import type { Product } from '../../types';

interface VariantSheetProps {
  product: Product | null;
  theme: StoreTheme;
  currency: string;
  onClose: () => void;
}

/** Choix taille / couleur / quantité avant ajout au panier (bottom sheet sur mobile). */
export function VariantSheet({ product, theme, currency, onClose }: VariantSheetProps) {
  const { addToCart } = useSellia();
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0]);
    setColor(product.colors[0]?.name);
    setQuantity(1);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [product, onClose]);

  function confirm() {
    if (!product) return;
    addToCart({ productId: product.id, name: product.name, image: product.images[0], price: product.price, quantity, size, color });
    toast.success(`${product.name} ajouté au panier.`);
    onClose();
  }

  return createPortal(
    <AnimatePresence>
      {product &&
      <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" style={themeVars(theme)}>
          <motion.div
          className="absolute inset-0 bg-black/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} />
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Choisir les options de ${product.name}`}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.32, ease }}
          className="relative max-h-[88vh] w-full max-w-[460px] overflow-y-auto rounded-t-[24px] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-[24px]"
          style={{ background: 'var(--ds-card)', color: 'var(--ds-ink)', boxShadow: 'var(--ds-shadow-md)' }}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full sm:hidden" style={{ background: 'var(--ds-border)' }} />
            <div className="flex items-start gap-3">
              <div className="size-[72px] shrink-0 overflow-hidden rounded-[14px]" style={{ background: 'var(--ds-subtle)' }}>
                <ProductImage src={product.images[0]} alt="" className="bg-transparent" imageClassName="p-1.5" />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="ds-title line-clamp-2 text-[15px] leading-snug">{product.name}</p>
                <div className="mt-1"><Price price={product.price} oldPrice={product.oldPrice} currency={currency} /></div>
              </div>
              <IconButton label="Fermer" small onClick={onClose}><X className="size-4" /></IconButton>
            </div>

            {product.sizes.length > 0 &&
            <fieldset className="mt-5">
                <legend className="mb-2 text-[13px] font-semibold">Taille</legend>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((item) =>
                <Chip key={item} square active={size === item} onClick={() => setSize(item)}>{item}</Chip>
                )}
                </div>
              </fieldset>
            }
            {product.colors.length > 0 &&
            <fieldset className="mt-4">
                <legend className="mb-2 text-[13px] font-semibold">Couleur{color ? ` : ${color}` : ''}</legend>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((item) =>
                <button
                  key={item.name}
                  type="button"
                  aria-label={item.name}
                  aria-pressed={color === item.name}
                  onClick={() => setColor(item.name)}
                  className="grid size-9 place-items-center rounded-full transition-transform active:scale-90"
                  style={{ background: item.hex, boxShadow: color === item.name ? '0 0 0 2px var(--ds-card), 0 0 0 4px var(--ds-accent)' : 'inset 0 0 0 1px var(--ds-border)' }}>
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
            <DsButton block size="lg" className="mt-5" onClick={confirm}>
              <ShoppingBag className="size-[18px]" />
              Ajouter au panier
            </DsButton>
          </motion.div>
        </div>
      }
    </AnimatePresence>,
    document.body
  );
}
