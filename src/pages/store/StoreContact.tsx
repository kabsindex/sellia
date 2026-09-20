import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { openWhatsApp, storeUrl } from '../../utils/whatsapp';

export function StoreContact() {
  const { store } = useSellia();
  const theme = useStoreTheme(store.theme);

  const socials = [
  { icon: SiInstagram, label: 'Instagram', handle: store.instagram },
  { icon: SiTiktok, label: 'TikTok', handle: store.tiktok },
  { icon: SiFacebook, label: 'Facebook', handle: store.facebook }].
  filter((item) => item.handle);

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-8">
      <h1 className="font-heading text-[22px] font-semibold tracking-[-0.02em]">Nous contacter</h1>
      <p className="mt-1.5 text-sm" style={{ color: theme.muted }}>
        Une question sur un produit, une taille ou une livraison ? Écris-nous, on répond vite.
      </p>

      <button
        type="button"
        onClick={() =>
        openWhatsApp(
          store.whatsapp,
          `Bonjour 👋 J'ai une question sur ${store.name} (${storeUrl(store)}).`
        )
        }
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold"
        style={{ backgroundColor: theme.accent, color: theme.accentText }}>
        
        <WhatsAppIcon className="size-4" />
        Écrire sur WhatsApp
      </button>

      <dl className="mt-6 space-y-3">
        {[
        { icon: WhatsAppIcon, label: 'WhatsApp', value: store.whatsapp },
        { icon: MapPin, label: 'Adresse', value: [store.address, store.city, store.country].filter(Boolean).join(', ') },
        { icon: Clock, label: 'Horaires', value: 'Tous les jours de 9h à 20h' }].
        map((item) =>
        <div
          key={item.label}
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
          
            <span
            className="grid size-9 shrink-0 place-items-center rounded-xl"
            style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
            
              <item.icon className="size-4" />
            </span>
            <div>
              <dt className="text-xs" style={{ color: theme.muted }}>
                {item.label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium">{item.value}</dd>
            </div>
          </div>
        )}
      </dl>

      {socials.length > 0 &&
      <section className="mt-6">
          <h2 className="text-sm font-semibold">Suivre {store.name}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {socials.map((item) =>
          <li key={item.label}>
                <span
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
              style={{ border: `1px solid ${theme.border}` }}>
              
                  <item.icon className="size-4" style={{ color: theme.accent }} />
                  @{item.handle}
                </span>
              </li>
          )}
          </ul>
        </section>
      }
    </div>);

}
