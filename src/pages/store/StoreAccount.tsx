import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, Link2, MapPin, Share2 } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { toast } from 'sonner';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';
import { useLiveProducts } from '../../hooks/useLiveProducts';
import { ProductCard } from '../../components/store/ProductCard';
import { DsButton, IconButton } from '../../components/ds';
import { WhatsAppIcon } from '../../components/shared/WhatsAppIcon';
import { openWhatsApp, storeUrl } from '../../utils/whatsapp';

type Tab = 'produits' | 'apropos';

/** Profil de la boutique : identité, contact WhatsApp, produits et informations pratiques. */
export function StoreAccount({ initialTab = 'produits' }: {initialTab?: Tab;}) {
  const { store, categories } = useSellia();
  const theme = useStoreTheme(store.theme);
  const navigate = useNavigate();
  const live = useLiveProducts();
  const [tab, setTab] = useState<Tab>(initialTab);
  const cover = store.coverMobile || store.cover;
  const verified = store.plan === 'premium' && store.verificationStatus === 'verified';
  const address = [store.address, store.city, store.country].filter(Boolean).join(', ');
  const socials = [
  { icon: SiInstagram, label: 'Instagram', handle: store.instagram },
  { icon: SiTiktok, label: 'TikTok', handle: store.tiktok },
  { icon: SiFacebook, label: 'Facebook', handle: store.facebook }].
  filter((item) => item.handle);

  function share() {
    const url = storeUrl(store);
    if (navigator.share) {
      void navigator.share({ title: store.name, url }).catch(() => undefined);
      return;
    }
    void navigator.clipboard?.writeText(url);
    toast.success('Lien de la boutique copié.');
  }

  function contact() {
    openWhatsApp(store.whatsapp, `Bonjour ${store.name} 👋 Je vous contacte depuis votre boutique en ligne.`);
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] pb-8 lg:px-6 lg:pt-6">
      <div className="relative h-[148px] overflow-hidden lg:h-[240px] lg:rounded-[28px]" style={{ background: 'var(--ds-accent)' }}>
        {cover && <img src={cover} alt="" className="size-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0) 55%)' }} />
        <div className="absolute inset-x-0 top-0 flex justify-between p-4 lg:hidden" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <IconButton label="Retour" glass onClick={() => navigate(-1)}><ArrowLeft className="size-[18px]" /></IconButton>
          <IconButton label="Partager la boutique" glass onClick={share}><Share2 className="size-[17px]" /></IconButton>
        </div>
      </div>

      <div className="px-4 lg:px-2">
        <div className="-mt-10 flex items-end gap-3.5">
          <span className="grid size-[84px] shrink-0 place-items-center overflow-hidden rounded-full lg:size-[104px]" style={{ background: 'var(--ds-card)', boxShadow: '0 0 0 4px var(--ds-bg), var(--ds-shadow-sm)' }}>
            {store.logo ? <img src={store.logo} alt="" className="size-full object-contain p-1.5" /> : <span className="text-2xl font-bold" style={{ color: 'var(--ds-accent)' }}>{store.name.slice(0, 1)}</span>}
          </span>
          <div className="min-w-0 pb-1">
            <h1 className="ds-title flex items-center gap-1.5 text-[20px] lg:text-[26px]"><span className="truncate">{store.name}</span>{verified && <BadgeCheck className="size-5 shrink-0" style={{ color: 'var(--ds-accent)' }} aria-label="Boutique vérifiée" />}</h1>
            <p className="ds-muted truncate text-[13px]">{store.category}{store.city ? ` · ${store.city}` : ''}</p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] text-center" style={{ background: 'var(--ds-border)', border: '1px solid var(--ds-border)' }}>
          <div className="py-3" style={{ background: 'var(--ds-card)' }}><dd className="ds-title text-[18px]">{live.length}</dd><dt className="ds-muted text-[12px]">Produit{live.length > 1 ? 's' : ''}</dt></div>
          <div className="py-3" style={{ background: 'var(--ds-card)' }}><dd className="ds-title text-[18px]">{categories.length}</dd><dt className="ds-muted text-[12px]">Catégorie{categories.length > 1 ? 's' : ''}</dt></div>
        </dl>

        {store.description && <p className="mt-4 text-[14px] leading-relaxed" style={{ color: 'var(--ds-muted)' }}>{store.description}</p>}

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 lg:max-w-[460px]">
          <DsButton size="lg" onClick={contact}><WhatsAppIcon className="size-5" /><span className="sm:hidden">WhatsApp</span><span className="hidden sm:inline">Écrire sur WhatsApp</span></DsButton>
          <DsButton size="lg" variant="outline" onClick={share} aria-label="Partager la boutique"><Share2 className="size-[18px]" /><span className="hidden sm:inline">Partager</span></DsButton>
        </div>

        <div role="tablist" className="relative mt-6 grid grid-cols-2 border-b" style={{ borderColor: 'var(--ds-border)' }}>
          {([['produits', 'Produits'], ['apropos', 'À propos']] as [Tab, string][]).map(([id, label]) =>
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className="relative h-11 text-[14px] font-semibold" style={{ color: tab === id ? 'var(--ds-accent-strong)' : 'var(--ds-muted)' }}>
              {label}
              {tab === id && <motion.span layoutId="profile-tab" className="absolute inset-x-6 bottom-[-1px] h-0.5 rounded-full" style={{ background: 'var(--ds-accent)' }} />}
            </button>
          )}
        </div>

        {tab === 'produits' ?
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {live.map((product) => <ProductCard key={product.id} product={product} store={store} theme={theme} layout="grid" />)}
            {live.length === 0 && <p className="ds-muted col-span-full py-10 text-center text-[14px]">Aucun produit pour le moment.</p>}
          </div> :

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="ds-card divide-y p-1" style={{ borderColor: 'var(--ds-border)' }}>
              <button type="button" onClick={contact} className="flex w-full items-center gap-3 px-3 py-3 text-left">
                <span className="grid size-9 place-items-center rounded-full" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}><WhatsAppIcon className="size-[18px]" /></span>
                <span className="min-w-0"><span className="block text-[12px] ds-muted">WhatsApp</span><span className="block truncate text-[14px] font-medium">{store.whatsapp}</span></span>
              </button>
              {address &&
            <div className="flex items-center gap-3 px-3 py-3">
                  <span className="grid size-9 place-items-center rounded-full" style={{ background: 'var(--ds-subtle)' }}><MapPin className="size-[18px]" /></span>
                  <span className="min-w-0"><span className="block text-[12px] ds-muted">Adresse</span><span className="block text-[14px] font-medium">{address}</span></span>
                </div>
            }
              <div className="flex items-center gap-3 px-3 py-3">
                <span className="grid size-9 place-items-center rounded-full" style={{ background: 'var(--ds-subtle)' }}><Link2 className="size-[18px]" /></span>
                <span className="min-w-0"><span className="block text-[12px] ds-muted">Lien de la boutique</span><span className="block truncate font-mono text-[13px]">{storeUrl(store)}</span></span>
              </div>
            </div>
            {socials.length > 0 &&
          <div className="ds-card p-4">
                <p className="text-[14px] font-semibold">Suivre {store.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socials.map((item) =>
              <span key={item.label} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px]" style={{ border: '1px solid var(--ds-border)' }}>
                      <item.icon className="size-4" />{item.handle}
                    </span>
              )}
                </div>
              </div>
          }
          </div>
        }
      </div>
    </div>);
}
