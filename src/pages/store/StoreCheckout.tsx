import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { getTheme } from '../../utils/themes';
import { formatPrice } from '../../utils/format';
import { buildCartMessage, openWhatsApp } from '../../utils/whatsapp';
import type { CheckoutDetails } from '../../types';

export function StoreCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { store, cart, checkout, setCheckout, placeOrder, clearCart } = useSellia();
  const storeTheme = useStoreTheme(store.theme);
  const isPremiumDemo = location.pathname.startsWith('/demo/premium/');
  const theme = isPremiumDemo ? getTheme('noir') : storeTheme;
  const basePath = isPremiumDemo ? '/demo/premium' : `/${store.slug}`;
  const [errors, setErrors] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);

  const fields: {key: keyof CheckoutDetails;label: string;placeholder: string;type?: string;}[] = [
  { key: 'name', label: 'Nom complet', placeholder: 'Jonathan Kabeya' },
  { key: 'phone', label: 'Téléphone', placeholder: '+243 971 223 004', type: 'tel' },
  { key: 'address', label: 'Adresse de livraison', placeholder: '12, avenue de la Paix' },
  { key: 'city', label: 'Ville', placeholder: store.city },
  { key: 'note', label: 'Note (optionnel)', placeholder: 'Livrer avant 18h si possible' }];


  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!checkout.name.trim() || checkout.phone.trim().length < 6) {
      setErrors('Ton nom et ton numéro de téléphone sont nécessaires pour la livraison.');
      return;
    }
    setErrors(null);
    const whatsappMessage = buildCartMessage(store, cart, checkout);
    const order = placeOrder(checkout);
    setMessage(whatsappMessage);
    setReference(order.reference);
    openWhatsApp(store.whatsapp, whatsappMessage);
    clearCart();
  }

  if (reference) {
    return (
      <div className="mx-auto w-full max-w-[520px] px-4 py-14 text-center">
        <span
          className="mx-auto grid size-12 place-items-center rounded-2xl"
          style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
          
          <CheckCircle2 className="size-6" />
        </span>
        <h1 className="mt-4 font-heading text-[22px] font-semibold">Commande envoyée 🎉</h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.muted }}>
          Ta commande <span className="font-mono">{reference}</span> a été transmise à {store.name}{' '}
          sur WhatsApp. Tu recevras une confirmation dans quelques minutes.
        </p>

        <pre
          className="mt-5 whitespace-pre-wrap rounded-2xl p-4 text-left font-mono text-[11px] leading-relaxed"
          style={{ backgroundColor: theme.accentSoft, color: theme.text }}>
          
          {message}
        </pre>

        <button
          type="button"
          onClick={() => openWhatsApp(store.whatsapp, message)}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          
          <WhatsAppIcon className="size-4" />
          Rouvrir WhatsApp
        </button>
        <Link
          to={basePath}
          className="mt-3 block text-center text-xs"
          style={{ color: theme.muted }}>
          
          Retour à la boutique
        </Link>
      </div>);

  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[520px] px-4 py-16 text-center">
        <h1 className="font-heading text-[20px] font-semibold">Aucun article à commander</h1>
        <Link
          to={`${basePath}/catalogue`}
          className="mt-4 inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          
          Voir le catalogue
        </Link>
      </div>);

  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(`${basePath}/panier`)}
        className="inline-flex items-center gap-1.5 text-sm"
        style={{ color: theme.muted }}>
        
        <ArrowLeft className="size-4" />
        Panier
      </button>

      <h1 className="mt-3 font-heading text-[22px] font-semibold tracking-[-0.02em]">
        Finaliser ma commande
      </h1>
      <p className="mt-1 text-sm" style={{ color: theme.muted }}>
        Ces informations seront envoyées avec ta commande sur WhatsApp.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
        {fields.map((field) =>
        <div key={field.key} className="space-y-1.5">
            <label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </label>
            {field.key === 'note' ?
          <textarea
            id={field.key}
            value={checkout.note}
            onChange={(event) => setCheckout({ note: event.target.value })}
            placeholder={field.placeholder}
            rows={3}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              color: theme.text
            }} /> :


          <input
            id={field.key}
            type={field.type ?? 'text'}
            value={checkout[field.key]}
            onChange={(event) =>
            setCheckout({ [field.key]: event.target.value } as Partial<CheckoutDetails>)
            }
            placeholder={field.placeholder}
            className="h-11 w-full rounded-xl px-3 text-sm outline-none"
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              color: theme.text
            }} />

          }
          </div>
        )}

        {errors &&
        <p role="alert" className="rounded-xl px-3 py-2 text-xs" style={{ backgroundColor: '#fdecea', color: '#b3261e' }}>
            {errors}
          </p>
        }

        <section
          className="rounded-2xl p-4"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
          
          <h2 className="text-sm font-semibold">Récapitulatif</h2>
          <ul className="mt-3 space-y-2">
            {cart.map((line) =>
            <li key={line.lineId} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate" style={{ color: theme.muted }}>
                  {line.name} × {line.quantity}
                </span>
                <span>{formatPrice(line.price * line.quantity, store.currency)}</span>
              </li>
            )}
          </ul>
          <div
            className="mt-3 flex justify-between pt-3 text-base font-semibold"
            style={{ borderTop: `1px solid ${theme.border}` }}>
            
            <span>Total</span>
            <span style={{ color: theme.accent }}>{formatPrice(total, store.currency)}</span>
          </div>
        </section>

        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          
          <WhatsAppIcon className="size-4" />
          Envoyer la commande sur WhatsApp
        </button>
        <p className="text-center text-[11px]" style={{ color: theme.muted }}>
          Aucun paiement en ligne. Tu règles directement avec le vendeur.
        </p>
      </form>
    </div>);

}
