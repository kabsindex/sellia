import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { ProductImage } from '../../components/shared/ProductImage';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { getTheme } from '../../utils/themes';
import { formatPrice } from '../../utils/format';
import { buildCartMessage, openWhatsApp } from '../../utils/whatsapp';

export function StoreCart() {
  const location = useLocation();
  const { store, cart, updateCartQuantity, removeCartLine } = useSellia();
  const storeTheme = useStoreTheme(store.theme);
  const isPremiumDemo = location.pathname.startsWith('/demo/premium/');
  const theme = isPremiumDemo ? getTheme('noir') : storeTheme;
  const basePath = isPremiumDemo ? '/demo/premium' : `/${store.slug}`;

  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);

  function orderOnWhatsApp() {
    if (!cart.length) return;
    openWhatsApp(store.whatsapp, buildCartMessage(store, cart));
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[520px] px-4 py-16 text-center">
        <span
          className="mx-auto grid size-14 place-items-center rounded-2xl"
          style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
          <ShoppingBag className="size-5" />
        </span>
        <h1 className="mt-4 font-heading text-[20px] font-semibold">Ton panier est vide</h1>
        <p className="mt-1.5 text-sm" style={{ color: theme.muted }}>
          Ajoute des produits puis envoie directement ta commande au vendeur sur WhatsApp.
        </p>
        <Link
          to={`${basePath}/catalogue`}
          className="mt-5 inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: theme.muted }}>SELLIA</p>
          <h1 className="mt-1 font-heading text-[24px] font-semibold tracking-[-0.03em]">Mon panier</h1>
        </div>
        <span className="text-xs" style={{ color: theme.muted }}>
          {cart.length} article{cart.length > 1 ? 's' : ''}
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {cart.map((line) =>
        <li
          key={line.lineId}
          className="flex gap-3 rounded-[20px] p-3"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
          <span
            className="size-20 shrink-0 overflow-hidden rounded-2xl"
            style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}>
            <ProductImage src={line.image} alt="" imageClassName="p-1.5" />
          </span>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start gap-2">
              <p className="min-w-0 flex-1 text-sm font-semibold leading-snug">{line.name}</p>
              <button
                type="button"
                onClick={() => removeCartLine(line.lineId)}
                aria-label={`Retirer ${line.name}`}
                className="grid size-8 place-items-center rounded-full"
                style={{ color: theme.muted }}>
                <Trash2 className="size-4" />
              </button>
            </div>

            <p className="mt-0.5 text-xs" style={{ color: theme.muted }}>
              {[line.size && `Taille ${line.size}`, line.color].filter(Boolean).join(' · ') || 'Taille unique'}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <div
                className="inline-flex items-center rounded-full"
                style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(line.lineId, line.quantity - 1)}
                  className="grid size-8 place-items-center"
                  aria-label="Diminuer la quantité">
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(line.lineId, line.quantity + 1)}
                  className="grid size-8 place-items-center"
                  aria-label="Augmenter la quantité">
                  <Plus className="size-3.5" />
                </button>
              </div>
              <span className="text-sm font-semibold" style={{ color: theme.accent }}>
                {formatPrice(line.price * line.quantity, store.currency)}
              </span>
            </div>
          </div>
        </li>
        )}
      </ul>

      <section
        className="mt-5 rounded-[22px] p-4"
        style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt style={{ color: theme.muted }}>Sous-total</dt>
            <dd>{formatPrice(subtotal, store.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt style={{ color: theme.muted }}>Livraison</dt>
            <dd>À convenir sur WhatsApp</dd>
          </div>
          <div className="flex justify-between pt-3 text-base font-semibold" style={{ borderTop: `1px solid ${theme.border}` }}>
            <dt>Total</dt>
            <dd style={{ color: theme.accent }}>{formatPrice(subtotal, store.currency)}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={orderOnWhatsApp}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          <WhatsAppIcon className="size-4.5" />
          Commander sur WhatsApp
        </button>

        <p className="mt-2 text-center text-[11px]" style={{ color: theme.muted }}>
          Aucun paiement n’est effectué sur SELLIA
        </p>

        <Link
          to={`${basePath}/catalogue`}
          className="mt-3 block text-center text-xs font-medium"
          style={{ color: theme.muted }}>
          Continuer mes achats
        </Link>
      </section>
    </div>
  );
}
