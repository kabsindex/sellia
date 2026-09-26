import React from 'react';
import { CheckCircle2, MapPin, Package, Share2, ShieldCheck, Tags } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { openWhatsApp, storeUrl } from '../../utils/whatsapp';

export function StoreAccount() {
  const { store, products, categories } = useSellia();
  const theme = useStoreTheme(store.theme);
  const liveProducts = products.filter((product) => !product.hidden);
  const cover = store.coverMobile || store.cover;
  const socials = [
    { icon: SiInstagram, label: 'Instagram', value: store.instagram },
    { icon: SiTiktok, label: 'TikTok', value: store.tiktok },
    { icon: SiFacebook, label: 'Facebook', value: store.facebook }
  ].filter((item) => item.value);

  function shareStore() {
    const url = storeUrl(store);
    if (navigator.share) {
      void navigator.share({ title: store.name, text: store.description, url }).catch(() => undefined);
      return;
    }
    void navigator.clipboard?.writeText(url);
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-5">
      <section
        className="overflow-hidden rounded-[24px]"
        style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
        <div className="relative h-36 overflow-hidden sm:h-44" style={{ backgroundColor: theme.accentSoft }}>
          {cover &&
          <img src={cover} alt="" className="size-full object-cover" />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <p className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
            Profil boutique
          </p>
        </div>

        <div className="relative px-4 pb-5">
          <div className="-mt-10 flex items-end justify-between gap-3">
            <div
              className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border-4"
              style={{ backgroundColor: theme.card, borderColor: theme.card }}>
              {store.logo ?
              <img src={store.logo} alt="" className="size-full object-contain" /> :
              <span className="text-2xl font-bold" style={{ color: theme.accent }}>
                {store.name.slice(0, 1).toUpperCase()}
              </span>
              }
            </div>
            <button
              type="button"
              onClick={shareStore}
              className="mb-1 grid size-10 place-items-center rounded-full"
              style={{ border: `1px solid ${theme.border}`, color: theme.text }}
              aria-label="Partager la boutique">
              <Share2 className="size-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <h1 className="font-heading text-[22px] font-semibold tracking-[-0.03em]">{store.name}</h1>
            {store.plan === 'premium' && store.verificationStatus === 'verified' &&
            <ShieldCheck className="size-5 shrink-0" style={{ color: theme.accent }} />
            }
          </div>
          <p className="mt-1 text-sm" style={{ color: theme.muted }}>{store.category}</p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: theme.muted }}>{store.description}</p>

          <div className="mt-5 grid grid-cols-3 divide-x" style={{ borderColor: theme.border }}>
            <div className="text-center">
              <p className="text-lg font-semibold">{liveProducts.length}</p>
              <p className="text-[10px] uppercase tracking-[0.08em]" style={{ color: theme.muted }}>Produits</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{categories.length}</p>
              <p className="text-[10px] uppercase tracking-[0.08em]" style={{ color: theme.muted }}>Catégories</p>
            </div>
            <div className="text-center">
              <p className="inline-flex items-center gap-1 text-sm font-semibold">
                <CheckCircle2 className="size-4" style={{ color: theme.accent }} />
                Active
              </p>
              <p className="text-[10px] uppercase tracking-[0.08em]" style={{ color: theme.muted }}>Boutique</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openWhatsApp(store.whatsapp, `Bonjour 👋 J'ai une question sur ${store.name} (${storeUrl(store)}).`)}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: theme.accent, color: theme.accentText }}>
            <WhatsAppIcon className="size-4.5" />
            Contacter sur WhatsApp
          </button>
        </div>
      </section>

      <section className="mt-5 grid gap-3">
        {[
          { icon: Package, label: 'Catalogue', value: `${liveProducts.length} produits disponibles` },
          { icon: Tags, label: 'Catégories', value: `${categories.length} catégories` },
          { icon: MapPin, label: 'Localisation', value: [store.address, store.city, store.country].filter(Boolean).join(', ') || 'À demander au vendeur' }
        ].map((item) =>
        <div
          key={item.label}
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
            <item.icon className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: theme.muted }}>{item.label}</p>
            <p className="mt-0.5 text-sm font-medium">{item.value}</p>
          </div>
        </div>
        )}
      </section>

      {socials.length > 0 &&
      <section className="mt-5">
        <h2 className="text-sm font-semibold">Réseaux sociaux</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {socials.map((item) =>
          <span
            key={item.label}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
            <item.icon className="size-3.5" style={{ color: theme.accent }} />
            @{item.value}
          </span>
          )}
        </div>
      </section>
      }
    </div>
  );
}
