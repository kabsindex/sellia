import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Crown, LayoutGrid, Rows3, Save } from 'lucide-react';
import { DsButton, Field, PageHeader, Toggle } from '../../components/ds';
import { PhoneFrame } from '../../components/marketing/PhoneFrame';
import { MiniStorefront } from '../../components/store/MiniStorefront';
import { StoreThemePicker } from '../../components/store/StoreThemePicker';
import { PremiumUpgradeDialog, type PremiumUpgradeContext } from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { isPremiumTheme, storeThemes } from '../../utils/themes';
import type { ProductLayout, Store } from '../../types';

const fonts: Store['font'][] = ['Geist', 'Georgia', 'Trebuchet MS'];
const layouts: {id: ProductLayout;label: string;icon: typeof LayoutGrid;hint: string;premium: boolean;}[] = [
{ id: 'grid', label: 'Grille', icon: LayoutGrid, hint: '2 colonnes, visuel', premium: false },
{ id: 'list', label: 'Liste', icon: Rows3, hint: '1 par ligne, détaillé', premium: true }];

function Option({ active, onClick, children, style }: {active: boolean;onClick: () => void;children: React.ReactNode;style?: React.CSSProperties;}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} style={{ ...style, borderColor: active ? 'var(--ds-accent)' : 'var(--ds-border)', background: active ? 'var(--ds-accent-soft)' : 'var(--ds-card)' }} className="flex flex-col items-start gap-1.5 rounded-[14px] border p-3.5 text-left transition-colors">
      {children}
    </button>);
}

export function Appearance() {
  const { store, updateStore, products, categories } = useSellia();
  const [draft, setDraft] = useState<Store>(store);
  const [saving, setSaving] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [premiumContext, setPremiumContext] = useState<PremiumUpgradeContext>('theme');
  useEffect(() => setDraft(store), [store]);
  const patch = (value: Partial<Store>) => setDraft((current) => ({ ...current, ...value }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(store);

  function getPremiumContext(next: Store): PremiumUpgradeContext | null {
    if (next.plan === 'premium') return null;
    if (isPremiumTheme(next.theme)) return 'theme';
    if (next.layout !== 'grid' || next.font !== 'Geist') return 'customization';
    if (!next.showBranding) return 'branding';
    return null;
  }

  async function saveAppearance(next = draft) {
    const required = getPremiumContext(next);
    if (required) {
      setPremiumContext(required);
      setPremiumDialogOpen(true);
      return;
    }
    setSaving(true);
    try {
      const saved = await updateStore(next);
      setDraft(saved);
      toast.success('Apparence enregistrée.');
    } catch {
      // La notification d’erreur est centralisée dans le contexte.
    } finally {
      setSaving(false);
    }
  }

  const live = products.filter((product) => !product.hidden);

  return (
    <div className="mx-auto w-full max-w-[1100px] pb-24">
      <PageHeader title="Apparence" description="Personnalise ta boutique : l’aperçu se met à jour en direct." />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-4">
          <section className="ds-card p-4 sm:p-5">
            <h2 className="ds-title text-[16px]">Thème</h2>
            <p className="ds-muted mt-1 text-[12.5px]">Emerald est inclus. Les autres thèmes nécessitent SELLIA Premium.</p>
            <div className="mt-3"><StoreThemePicker value={draft.theme} plan={draft.plan} storeName={draft.name} logo={draft.logo} cover={draft.coverMobile || draft.cover} onChange={(theme) => patch({ theme })} /></div>
          </section>

          <section className="ds-card p-4 sm:p-5">
            <h2 className="ds-title text-[16px]">Disposition des produits</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {layouts.map((option) =>
              <Option key={option.id} active={draft.layout === option.id} onClick={() => patch({ layout: option.id })}>
                  <option.icon className="size-[18px]" />
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold">{option.label}{option.premium && draft.plan === 'basic' && <Crown className="size-3.5" style={{ color: '#a87b1f' }} aria-label="Option Premium" />}</span>
                  <span className="ds-muted text-[12px]">{option.hint}</span>
                </Option>
              )}
            </div>
          </section>

          <section className="ds-card p-4 sm:p-5">
            <h2 className="ds-title text-[16px]">Typographie</h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {fonts.map((font) =>
              <Option key={font} active={draft.font === font} onClick={() => patch({ font })} style={{ fontFamily: font }}>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold">{font}{font !== 'Geist' && draft.plan === 'basic' && <Crown className="size-3.5" style={{ color: '#a87b1f' }} aria-label="Option Premium" />}</span>
                  <span className="ds-muted text-[12px]">Aa Bb 123</span>
                </Option>
              )}
            </div>
          </section>

          <section className="ds-card space-y-4 p-4 sm:p-5">
            <h2 className="ds-title text-[16px]">Textes de la boutique</h2>
            <Field label="Titre de la bannière" htmlFor="heroTitle"><input id="heroTitle" className="ds-input" value={draft.heroTitle} onChange={(event) => patch({ heroTitle: event.target.value })} /></Field>
            <Field label="Sous-titre" htmlFor="heroSubtitle"><textarea id="heroSubtitle" className="ds-input ds-textarea" value={draft.heroSubtitle} onChange={(event) => patch({ heroSubtitle: event.target.value })} /></Field>
            <Field label="Texte du bouton de la bannière" htmlFor="ctaLabel"><input id="ctaLabel" className="ds-input" value={draft.ctaLabel} onChange={(event) => patch({ ctaLabel: event.target.value })} /></Field>
            <div className="flex items-start gap-3 pt-1" style={{ borderTop: '1px solid var(--ds-border)', paddingTop: 16 }}>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[14px] font-semibold">Afficher « Propulsé par SELLIA »{draft.plan === 'basic' && <Crown className="size-3.5" style={{ color: '#a87b1f' }} aria-label="Option Premium" />}</p>
                <p className="ds-muted mt-0.5 text-[12.5px]">Le retirer est une option Premium.</p>
              </div>
              <Toggle label="Afficher le badge SELLIA" checked={draft.showBranding} onChange={(checked) => patch({ showBranding: checked })} />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <p className="ds-muted mb-3 text-[12.5px] font-semibold">Aperçu en direct</p>
          <div className="flex justify-center">
            <PhoneFrame className="w-[264px]" screenClassName="h-[520px]">
              <MiniStorefront store={draft} products={live} categories={categories} cartCount={0} />
            </PhoneFrame>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[68px] z-30 border-t px-4 py-3 backdrop-blur-xl lg:bottom-0 lg:left-[264px] lg:px-8" style={{ background: 'color-mix(in srgb, var(--ds-card) 95%, transparent)', borderColor: 'var(--ds-border)' }}>
        <div className="mx-auto flex max-w-[1100px] gap-2">
          <DsButton variant="ghost" className="flex-1 sm:flex-none" disabled={!dirty} onClick={() => setDraft(store)}>Réinitialiser</DsButton>
          <DsButton className="flex-1 sm:ml-auto sm:flex-none" disabled={saving || !dirty} onClick={() => void saveAppearance()}><Save className="size-4" />{saving ? 'Enregistrement…' : 'Enregistrer'}</DsButton>
        </div>
      </div>

      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context={premiumContext}
        featureName={premiumContext === 'theme' ? storeThemes[draft.theme].name : undefined}
        onClose={() => {
          setPremiumDialogOpen(false);
          setDraft((current) => ({ ...current, theme: 'emerald', layout: 'grid', font: 'Geist', showBranding: true }));
        }} />
    </div>);
}
