import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, Copy, Save } from 'lucide-react';
import { Badge, DsButton, Field, PageHeader } from '../../components/ds';
import { StoreIdentityStep } from '../../components/onboarding/StoreIdentityStep';
import { StoreCategoryStep } from '../../components/onboarding/StoreCategoryStep';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { countryOptions, currencyOptions } from '../../data/store';
import { verificationLabels } from '../../data/plans';
import { slugify } from '../../utils/format';
import { storefrontUrl } from '../../utils/whatsapp';
import { isPremiumTheme, storeThemes } from '../../utils/themes';
import type { Store } from '../../types';

export function StoreProfile() {
  const { store, updateStore } = useSellia();
  const [draft, setDraft] = useState<Store>(store);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  useEffect(() => setDraft(store), [store]);
  const patch = (value: Partial<Store>) => setDraft((current) => ({ ...current, ...value }));
  const link = storefrontUrl(slugify(draft.name) || draft.slug);
  const dirty = JSON.stringify(draft) !== JSON.stringify(store);

  async function save(nextDraft = draft) {
    if (nextDraft.plan !== 'premium' && isPremiumTheme(nextDraft.theme)) {
      setPremiumDialogOpen(true);
      return;
    }
    setSaving(true);
    try {
      const saved = await updateStore({ ...nextDraft, slug: slugify(nextDraft.name) || nextDraft.slug });
      setDraft(saved);
      toast.success('Profil de la boutique mis à jour.');
    } catch {
      // La notification d’erreur est centralisée dans le contexte.
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] pb-24">
      <PageHeader title="Profil de la boutique" description="Ce que tes clients voient sur la page « La boutique »." />

      <div className="ds-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="ds-muted text-[12.5px] font-semibold">Adresse de ta boutique</p>
          <p className="mt-0.5 truncate font-mono text-[14px] font-medium" style={{ color: 'var(--ds-accent-strong)' }}>{link.replace(/^https?:\/\//, '')}</p>
          <p className="mt-1.5"><Badge tone={draft.verificationStatus === 'verified' ? 'accent' : 'neutral'}>Statut SELLIA : {verificationLabels[draft.verificationStatus]}</Badge></p>
        </div>
        <DsButton variant="outline" size="sm" onClick={() => { void navigator.clipboard?.writeText(link); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? 'Copié' : 'Copier le lien'}
        </DsButton>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2 lg:items-start">
        <section className="ds-card space-y-4 p-4 sm:p-5">
          <h2 className="ds-title text-[16px]">Informations générales</h2>
          <Field label="Nom de la boutique" htmlFor="storeName"><input id="storeName" className="ds-input" value={draft.name} onChange={(event) => patch({ name: event.target.value })} /></Field>
          <div>
            <p className="ds-label">Activités de la boutique</p>
            <StoreCategoryStep category={draft.category} onChange={(category) => patch({ category })} />
          </div>
          <Field label="Description" htmlFor="storeDescription"><textarea id="storeDescription" className="ds-input ds-textarea" value={draft.description} onChange={(event) => patch({ description: event.target.value })} /></Field>
          <Field label="Numéro WhatsApp" htmlFor="storeWhatsapp" hint="C’est ici que arrivent les commandes de tes clients."><input id="storeWhatsapp" type="tel" className="ds-input" value={draft.whatsapp} onChange={(event) => patch({ whatsapp: event.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ville" htmlFor="storeCity"><input id="storeCity" className="ds-input" value={draft.city} onChange={(event) => patch({ city: event.target.value })} /></Field>
            <Field label="Adresse" htmlFor="storeAddress"><input id="storeAddress" className="ds-input" value={draft.address} onChange={(event) => patch({ address: event.target.value })} /></Field>
            <Field label="Pays" htmlFor="storeCountry">
              <select id="storeCountry" className="ds-input" value={draft.country} onChange={(event) => patch({ country: event.target.value })}>{countryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
            </Field>
            <Field label="Devise" htmlFor="storeCurrency">
              <select id="storeCurrency" className="ds-input" value={draft.currency} onChange={(event) => patch({ currency: event.target.value })}>{currencyOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
            </Field>
          </div>
        </section>

        <div className="space-y-4">
          <section className="ds-card space-y-4 p-4 sm:p-5">
            <h2 className="ds-title text-[16px]">Réseaux sociaux</h2>
            <Field label="Instagram" htmlFor="storeInstagram"><input id="storeInstagram" className="ds-input" value={draft.instagram} onChange={(event) => patch({ instagram: event.target.value })} placeholder="@maboutique" /></Field>
            <Field label="TikTok" htmlFor="storeTiktok"><input id="storeTiktok" className="ds-input" value={draft.tiktok} onChange={(event) => patch({ tiktok: event.target.value })} placeholder="@maboutique" /></Field>
            <Field label="Facebook" htmlFor="storeFacebook"><input id="storeFacebook" className="ds-input" value={draft.facebook} onChange={(event) => patch({ facebook: event.target.value })} placeholder="maboutique" /></Field>
          </section>
          <section className="ds-card p-4 sm:p-5">
            <h2 className="ds-title mb-4 text-[16px]">Identité visuelle</h2>
            <StoreIdentityStep draft={draft} onPatch={patch} />
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[68px] z-30 border-t px-4 py-3 backdrop-blur-xl lg:bottom-0 lg:left-[264px] lg:px-8" style={{ background: 'color-mix(in srgb, var(--ds-card) 95%, transparent)', borderColor: 'var(--ds-border)' }}>
        <div className="mx-auto flex max-w-[1000px] gap-2">
          <DsButton variant="ghost" className="flex-1 sm:flex-none" disabled={!dirty} onClick={() => setDraft(store)}>Réinitialiser</DsButton>
          <DsButton className="flex-1 sm:ml-auto sm:flex-none" onClick={() => void save()} disabled={saving || !dirty}><Save className="size-4" />{saving ? 'Enregistrement…' : 'Enregistrer'}</DsButton>
        </div>
      </div>

      <PremiumUpgradeDialog open={premiumDialogOpen} context="theme" featureName={storeThemes[draft.theme].name} onClose={() => { setPremiumDialogOpen(false); patch({ theme: 'emerald' }); }} />
    </div>);
}
