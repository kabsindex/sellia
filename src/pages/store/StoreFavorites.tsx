import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { useLiveProducts } from '../../hooks/useLiveProducts';
import { ProductCard } from '../../components/store/ProductCard';
import { DesktopTitle, MobileBar } from '../../components/store/StoreParts';
import { DsLinkButton, EmptyState } from '../../components/ds';

export function StoreFavorites() {
  const { store, favorites } = useSellia();
  const theme = useStoreTheme(store.theme);
  const live = useLiveProducts();
  const items = live.filter((product) => favorites.includes(product.id));

  return (
    <div className="mx-auto w-full max-w-[1200px] pb-8 lg:px-6 lg:pt-6">
      <MobileBar title="Mes favoris" back={false} />
      <DesktopTitle title="Mes favoris" hint={items.length ? `${items.length} produit${items.length > 1 ? 's' : ''} enregistré${items.length > 1 ? 's' : ''}` : undefined} />
      {items.length === 0 ?
      <EmptyState icon={Heart} title="Aucun favori pour l’instant" text="Touche le cœur d’un produit pour le retrouver ici. Les favoris restent sur cet appareil.">
          <DsLinkButton to={`/${store.slug}/catalogue`}>Découvrir les produits</DsLinkButton>
        </EmptyState> :

      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4 lg:px-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((product) =>
          <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.22 }}>
                <ProductCard product={product} store={store} theme={theme} layout="grid" />
              </motion.div>
          )}
          </AnimatePresence>
        </div>
      }
    </div>);
}
