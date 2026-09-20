import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, Copy, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../../components/ui/Select';
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
    <div className="space-y-4 pb-6">
      <div>
        <h2 className="font-heading text-[20px] font-semibold tracking-[-0.02em]">Ma boutique</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Ces informations apparaissent sur ta boutique publique.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">Adresse de ta boutique</p>
          <p className="mt-1 truncate font-mono text-sm font-medium text-brand-strong">
            {storefrontUrl(slugify(draft.name) || draft.slug)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Statut SELLIA : {verificationLabels[draft.verificationStatus]}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard?.writeText(storefrontUrl(slugify(draft.name) || draft.slug));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          }}>
          
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copié' : 'Copier le lien'}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
          <h3 className="font-heading text-sm font-semibold">Informations générales</h3>

          <div className="space-y-1.5">
            <Label htmlFor="storeName">Nom de la boutique</Label>
            <Input
              id="storeName"
              value={draft.name}
              onChange={(event) => patch({ name: event.target.value })} />
            
          </div>

          <div className="space-y-1.5">
            <Label>Activités de la boutique</Label>
            <StoreCategoryStep
              category={draft.category}
              onChange={(category) => patch({ category })} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="storeDescription">Description</Label>
            <Textarea
              id="storeDescription"
              value={draft.description}
              onChange={(event) => patch({ description: event.target.value })}
              rows={3} />
            
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="storeWhatsapp">Numéro WhatsApp</Label>
            <Input
              id="storeWhatsapp"
              type="tel"
              value={draft.whatsapp}
              onChange={(event) => patch({ whatsapp: event.target.value })} />
            
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="storeCity">Ville</Label>
              <Input
                id="storeCity"
                value={draft.city}
                onChange={(event) => patch({ city: event.target.value })} />
              
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="storeAddress">Adresse</Label>
              <Input
                id="storeAddress"
                value={draft.address}
                onChange={(event) => patch({ address: event.target.value })} />
              
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="storeCountry">Pays</Label>
              <Select value={draft.country} onValueChange={(value) => patch({ country: value })}>
                <SelectTrigger id="storeCountry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((option) =>
                  <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="storeCurrency">Devise</Label>
              <Select value={draft.currency} onValueChange={(value) => patch({ currency: value })}>
                <SelectTrigger id="storeCurrency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) =>
                  <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Réseaux sociaux</legend>
            <div className="space-y-1.5">
              <Label htmlFor="storeInstagram">Instagram</Label>
              <Input
                id="storeInstagram"
                value={draft.instagram}
                onChange={(event) => patch({ instagram: event.target.value })} />
              
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="storeTiktok">TikTok</Label>
              <Input
                id="storeTiktok"
                value={draft.tiktok}
                onChange={(event) => patch({ tiktok: event.target.value })} />
              
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="storeFacebook">Facebook</Label>
              <Input
                id="storeFacebook"
                value={draft.facebook}
                onChange={(event) => patch({ facebook: event.target.value })} />
              
            </div>
          </fieldset>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
          <h3 className="font-heading text-sm font-semibold">Identité visuelle</h3>
          <div className="mt-4">
            <StoreIdentityStep draft={draft} onPatch={patch} />
          </div>
        </section>
      </div>

      <div className="sticky bottom-16 z-20 flex gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-lift backdrop-blur lg:bottom-4">
        <Button variant="ghost" className="flex-1" onClick={() => setDraft(store)}>
          Réinitialiser
        </Button>
        <Button className="flex-1" onClick={() => void save()} disabled={saving}>
          <Save className="size-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>

      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context="theme"
        featureName={storeThemes[draft.theme].name}
        onClose={() => {
          setPremiumDialogOpen(false);
          patch({ theme: 'emerald' });
        }}
      />
    </div>);

}
