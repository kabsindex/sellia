import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { DsButton, DsLinkButton, EmptyState, IconButton, Stepper } from '../../components/ds';
import { DesktopTitle, MobileBar } from '../../components/store/StoreParts';
import { ProductImage } from '../../components/shared/ProductImage';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { AnimatedNumber } from '../../components/ds/motion';
import { themeVars } from '../../design/theme';
import { getTheme } from '../../utils/themes';
import { formatPrice } from '../../utils/format';
import { buildCartMessage, openWhatsApp } from '../../utils/whatsapp';

export function StoreCart() {
  const location = useLocation();
  const { store, cart, updateCartQuantity, removeCartLine, clearCart } = useSellia();
  const storeTheme = useStoreTheme(store.theme);
  const isPremiumDemo = location.pathname.startsWith('/demo/premium/');
  const theme = isPremiumDemo ? getTheme('noir') : storeTheme;
  const basePath = isPremiumDemo ? '/demo/premium' : `/${store.slug}`;
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const rootStyle = { ...themeVars(theme), ...(isPremiumDemo ? { minHeight: '100vh' } : {}) };

  function orderOnWhatsApp() {
    if (!cart.length) return;
    openWhatsApp(store.whatsapp, buildCartMessage(store, cart));
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1200px]" style={rootStyle}>
        <MobileBar title="Mon panier" />
        <EmptyState icon={ShoppingBag} title="Ton panier est vide" text="Ajoute des produits, puis envoie ta commande au vendeur directement sur WhatsApp.">
          <DsLinkButton to={`${basePath}/catalogue`}>Voir le catalogue</DsLinkButton>
        </EmptyState>
      </div>);
  }

  const summary =
  <div className="ds-card p-4 lg:p-5">
      <h2 className="ds-title text-[17px]">Résumé</h2>
      <dl className="mt-3 space-y-2 text-[14px]">
        <div className="flex justify-between"><dt className="ds-muted">Sous-total ({count} article{count > 1 ? 's' : ''})</dt><dd className="font-medium tabular-nums">{formatPrice(subtotal, store.currency)}</dd></div>
        <div className="flex justify-between"><dt className="ds-muted">Livraison</dt><dd className="font-medium">À confirmer</dd></div>
        <div className="ds-divider my-1" />
        <div className="flex items-baseline justify-between"><dt className="font-semibold">Total</dt><dd className="ds-title text-[22px]"><AnimatedNumber value={subtotal} suffix={store.currency} /></dd></div>
      </dl>
      <DsButton block size="lg" className="mt-4 hidden lg:inline-flex" onClick={orderOnWhatsApp}>
        <WhatsAppIcon className="size-5" />Commander sur WhatsApp
      </DsButton>
      <p className="ds-muted mt-3 text-center text-[12px] leading-relaxed">Le message de commande est prérempli. Livraison et paiement se règlent avec le vendeur.</p>
    </div>;

  return (
    <div className="mx-auto w-full max-w-[1200px] pb-[112px] lg:px-6 lg:pb-12 lg:pt-6" style={rootStyle}>
      <MobileBar title="Mon panier" right={<IconButton label="Vider le panier" small onClick={() => window.confirm('Vider tout le panier ?') && clearCart()}><Trash2 className="size-4" /></IconButton>} />
      <DesktopTitle title="Mon panier" hint={`${count} article${count > 1 ? 's' : ''} de ${store.name}`} />
      <div className="px-4 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-8 lg:px-0">
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {cart.map((line) =>
            <motion.li
              key={line.lineId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.24 }}
              className="ds-card flex gap-3 p-3">
                <Link to={`${basePath}/catalogue`} className="size-[84px] shrink-0 overflow-hidden rounded-[14px]" style={{ background: 'var(--ds-subtle)' }} aria-hidden="true" tabIndex={-1}>
                  <ProductImage src={line.image} alt="" className="bg-transparent" imageClassName="p-1.5" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[14px] font-semibold leading-snug">{line.name}</p>
                      {(line.size || line.color) && <p className="ds-muted mt-0.5 text-[12px]">{[line.color, line.size].filter(Boolean).join(' · ')}</p>}
                    </div>
                    <IconButton label={`Retirer ${line.name}`} small className="!border-transparent !shadow-none" onClick={() => removeCartLine(line.lineId)}><Trash2 className="size-4" style={{ color: 'var(--ds-danger)' }} /></IconButton>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-2">
                    <p className="ds-price text-[15px]">{formatPrice(line.price * line.quantity, store.currency)}</p>
                    <Stepper value={line.quantity} onChange={(value) => updateCartQuantity(line.lineId, value)} min={0} />
                  </div>
                </div>
              </motion.li>
            )}
          </AnimatePresence>
        </ul>
        <div className="mt-5 lg:sticky lg:top-24 lg:mt-0">{summary}</div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden" style={{ ...themeVars(theme), background: 'color-mix(in srgb, var(--ds-card) 95%, transparent)', borderColor: 'var(--ds-border)' }}>
        <DsButton block size="lg" onClick={orderOnWhatsApp}>
          <WhatsAppIcon className="size-5" />
          Commander sur WhatsApp · {formatPrice(subtotal, store.currency)}
        </DsButton>
      </div>
    </div>);
}
