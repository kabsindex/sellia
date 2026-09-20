import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Crown, LayoutGrid, Rows3, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/CSwitch';
import { PhoneFrame } from '../../components/marketing/PhoneFrame';
import { StorePreviewCard } from '../../components/store/StorePreviewCard';
import { StoreThemePicker } from '../../components/store/StoreThemePicker';
import {
  PremiumUpgradeDialog,
  type PremiumUpgradeContext
} from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { isPremiumTheme, storeThemes } from '../../utils/themes';
import type { ProductLayout, Store } from '../../types';

const fonts: Store['font'][] = ['Geist', 'Georgia', 'Trebuchet MS'];

export function Appearance() {
  const { store, updateStore, products, categories } = useSellia();
  const [draft, setDraft] = useState<Store>(store);
  const [saving, setSaving] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [premiumContext, setPremiumContext] = useState<PremiumUpgradeContext>('theme');

  useEffect(() => setDraft(store), [store]);

  const patch = (value: Partial<Store>) => setDraft((current) => ({ ...current, ...value }));

  function getPremiumContext(nextDraft: Store): PremiumUpgradeContext | null {
    if (nextDraft.plan === 'premium') return null;
    if (isPremiumTheme(nextDraft.theme)) return 'theme';
    if (nextDraft.layout !== 'grid' || nextDraft.font !== 'Geist') return 'customization';
    if (!nextDraft.showBranding) return 'branding';
    return null;
  }

  async function saveAppearance(nextDraft = draft) {
    const requiredPremiumContext = getPremiumContext(nextDraft);
    if (requiredPremiumContext) {
      setPremiumContext(requiredPremiumContext);
      setPremiumDialogOpen(true);
      return;
    }
    setSaving(true);
    try {
      const saved = await updateStore(nextDraft);
      setDraft(saved);
      toast.success('Apparence enregistrée.');
    } catch {
      // La notification d’erreur est centralisée dans le contexte.
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h2 className="font-heading text-[20px] font-semibold tracking-[-0.02em]">Apparence</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Personnalise ta boutique et vois le résultat en direct.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <h3 className="font-heading text-sm font-semibold">Thème</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Emerald est inclus. Les autres thèmes nécessitent SELLIA Premium.
            </p>
            <div className="mt-3">
              <StoreThemePicker
                value={draft.theme}
                plan={draft.plan}
                storeName={draft.name}
                logo={draft.logo}
                cover={draft.coverMobile || draft.cover}
                onChange={(theme) => patch({ theme })}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <h3 className="font-heading text-sm font-semibold">Disposition des produits</h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {[
              { id: 'grid' as ProductLayout, label: 'Grille', icon: LayoutGrid, hint: '2 colonnes, visuel', premium: false },
              { id: 'list' as ProductLayout, label: 'Liste', icon: Rows3, hint: '1 par ligne, détaillé', premium: true }].
              map((option) =>
              <button
                key={option.id}
                type="button"
                onClick={() => patch({ layout: option.id })}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all',
                  draft.layout === option.id ?
                  'border-brand bg-brand-soft' :
                  'border-border bg-card hover:border-muted-foreground/30'
                )}>
                
                  <option.icon className="size-4" />
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                    {option.label}
                    {option.premium && draft.plan === 'basic' &&
                    <Crown className="size-3.5 text-[#a87b1f]" aria-label="Option Premium" />}
                  </span>
                  <span className="text-xs text-muted-foreground">{option.hint}</span>
                </button>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <h3 className="font-heading text-sm font-semibold">Typographie</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {fonts.map((font) =>
              <button
                key={font}
                type="button"
                onClick={() => patch({ font })}
                style={{ fontFamily: font }}
                className={cn(
                  'rounded-xl border px-4 py-2.5 text-sm transition-all',
                  draft.font === font ?
                  'border-brand bg-brand-soft text-brand-strong' :
                  'border-border bg-card'
                )}>
                
                  <span className="inline-flex items-center gap-1.5">
                    {font}
                    {font !== 'Geist' && draft.plan === 'basic' &&
                    <Crown className="size-3.5 text-[#a87b1f]" aria-label="Option Premium" />}
                  </span>
                </button>
              )}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <h3 className="font-heading text-sm font-semibold">Textes de la boutique</h3>
            <div className="space-y-1.5">
              <Label htmlFor="heroTitle">Titre de la bannière</Label>
              <Input
                id="heroTitle"
                value={draft.heroTitle}
                onChange={(event) => patch({ heroTitle: event.target.value })} />
              
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="heroSubtitle">Sous-titre</Label>
              <Textarea
                id="heroSubtitle"
                value={draft.heroSubtitle}
                onChange={(event) => patch({ heroSubtitle: event.target.value })}
                rows={2} />
              
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ctaLabel">Texte du bouton de commande</Label>
              <Input
                id="ctaLabel"
                value={draft.ctaLabel}
                onChange={(event) => patch({ ctaLabel: event.target.value })} />
              
            </div>
            <div className="flex items-start gap-3 border-t border-border pt-4">
              <div className="min-w-0 flex-1">
                <Label htmlFor="branding" className="text-sm">
                  Afficher « Propulsé par SELLIA »
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Retirable avec SELLIA Premium.
                </p>
              </div>
              <Switch
                id="branding"
                checked={draft.showBranding}
                onCheckedChange={(checked: boolean) => patch({ showBranding: checked })} />
              
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-3 text-xs font-medium text-muted-foreground">Aperçu en direct</p>
          <div className="flex justify-center">
            <PhoneFrame className="w-[264px]">
              <StorePreviewCard
                store={draft}
                products={products.filter((product) => !product.hidden).slice(0, 4)}
                categories={categories} />
              
            </PhoneFrame>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-16 z-20 flex gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-lift backdrop-blur lg:bottom-4">
        <Button variant="ghost" className="flex-1" onClick={() => setDraft(store)}>
          Réinitialiser
        </Button>
        <Button
          className="flex-1"
          disabled={saving}
          onClick={() => void saveAppearance()}>
          
          <Save className="size-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>

      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context={premiumContext}
        featureName={premiumContext === 'theme' ? storeThemes[draft.theme].name : undefined}
        onClose={() => {
          setPremiumDialogOpen(false);
          setDraft((current) => ({
            ...current,
            theme: 'emerald',
            layout: 'grid',
            font: 'Geist',
            showBranding: true
          }));
        }}
      />
    </div>);

}
