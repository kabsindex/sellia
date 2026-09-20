import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BadgePercent,
  BarChart3,
  Check,
  CircleDollarSign,
  CreditCard,
  Crown,
  Headphones,
  Loader2,
  MessageSquareText,
  PackagePlus,
  Palette,
  PanelsTopLeft,
  ShieldCheck,
  ShoppingBag,
  Store,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { PREMIUM_BENEFITS, type PremiumBenefitId } from '../../data/plans';
import { useSellia } from '../../contexts/SelliaContext';
import { Button } from '../ui/Button';

export type PremiumUpgradeContext =
  | 'general'
  | 'theme'
  | 'products'
  | 'promotions'
  | 'analytics'
  | 'customization'
  | 'branding';

interface PremiumUpgradeDialogProps {
  open: boolean;
  context?: PremiumUpgradeContext;
  featureName?: string;
  onClose: () => void;
}

const contextCopy: Record<PremiumUpgradeContext, {
  eyebrow: string;
  title: (featureName?: string) => string;
  description: string;
  cancelLabel: string;
}> = {
  general: {
    eyebrow: 'SELLIA PREMIUM',
    title: () => 'Fais passer ta boutique au niveau supérieur',
    description: 'Débloque les outils conçus pour développer une marque et vendre sans limite.',
    cancelLabel: 'Continuer avec Basic'
  },
  theme: {
    eyebrow: 'THÈME PREMIUM',
    title: (featureName) => `Active ${featureName || 'ce thème'} sur ta boutique`,
    description: 'Préserve cette identité visuelle et débloque toute la personnalisation SELLIA.',
    cancelLabel: 'Rester avec Emerald'
  },
  products: {
    eyebrow: 'LIMITE BASIC ATTEINTE',
    title: () => 'Passe à un catalogue sans limite',
    description: 'Ton plan Basic couvre 5 produits publiés. Premium te permet d’ajouter le 6e et tous les suivants.',
    cancelLabel: 'Rester avec 5 produits'
  },
  promotions: {
    eyebrow: 'VENTES PREMIUM',
    title: () => 'Crée des offres qui attirent l’attention',
    description: 'Active les promotions et les codes promo pour mieux convertir tes visiteurs.',
    cancelLabel: 'Continuer sans promotion'
  },
  analytics: {
    eyebrow: 'STATISTIQUES AVANCÉES',
    title: () => 'Comprends ce qui fait grandir ta boutique',
    description: 'Analyse 30 jours de données, tes meilleurs produits, tes canaux et tes revenus.',
    cancelLabel: 'Garder les statistiques essentielles'
  },
  customization: {
    eyebrow: 'PERSONNALISATION AVANCÉE',
    title: () => 'Construis une boutique vraiment unique',
    description: 'Débloque les dispositions et typographies avancées pour affirmer ta marque.',
    cancelLabel: 'Conserver le style Basic'
  },
  branding: {
    eyebrow: 'MARQUE BLANCHE',
    title: () => 'Laisse toute la place à ta propre marque',
    description: 'Retire la mention SELLIA de la boutique publique avec le plan Premium.',
    cancelLabel: 'Conserver la signature SELLIA'
  }
};

const benefitIcons: Record<PremiumBenefitId, React.ComponentType<{ className?: string }>> = {
  products: PackagePlus,
  commerce: ShoppingBag,
  themes: Palette,
  customization: PanelsTopLeft,
  promotions: BadgePercent,
  commission: CircleDollarSign,
  reviews: MessageSquareText,
  analytics: BarChart3,
  verification: ShieldCheck,
  branding: Store,
  support: Headphones
};

export function PremiumUpgradeDialog({
  open,
  context = 'general',
  featureName,
  onClose
}: PremiumUpgradeDialogProps) {
  const { startPremiumCheckout } = useSellia();
  const [loading, setLoading] = useState(false);
  const copy = contextCopy[context];

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [loading, onClose, open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-dialog-title"
        className="flex max-h-[94dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-background shadow-2xl sm:max-h-[90vh] sm:rounded-2xl">
        <header className="relative shrink-0 bg-[#11130f] px-5 pb-5 pt-5 text-white sm:px-7 sm:pb-6 sm:pt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 sm:right-5 sm:top-5"
            aria-label="Fermer">
            <X className="size-4" />
          </button>

          <div className="grid gap-5 pr-11 sm:grid-cols-[minmax(0,1fr)_150px] sm:items-end sm:pr-0">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase text-[#e2bd67]">
                <Crown className="size-4" /> {copy.eyebrow}
              </span>
              <h2 id="premium-dialog-title" className="mt-3 max-w-[520px] font-heading text-2xl font-semibold leading-tight sm:text-[28px]">
                {copy.title(featureName)}
              </h2>
              <p className="mt-2 max-w-[540px] text-sm leading-relaxed text-white/65">
                {copy.description}
              </p>
            </div>
            <div className="border-l-0 border-white/15 sm:border-l sm:pl-5">
              <p className="text-[10px] font-medium uppercase text-white/50">Abonnement</p>
              <p className="mt-1 flex items-end gap-1.5">
                <span className="font-heading text-4xl font-semibold text-[#e2bd67]">9$</span>
                <span className="pb-1 text-sm text-white/60">/ mois</span>
              </p>
              <p className="mt-1 text-[11px] text-white/50">0% de commission sur les ventes</p>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold">Tout ce qui est inclus</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Une seule offre pour développer toute ta boutique.</p>
            </div>
            <span className="hidden rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold text-brand-strong sm:inline-flex">
              Offre complète
            </span>
          </div>

          <ul className="mt-5 grid gap-x-7 gap-y-4 sm:grid-cols-2">
            {PREMIUM_BENEFITS.map((benefit) => {
              const Icon = benefitIcons[benefit.id];
              return (
                <li key={benefit.id} className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f2eee2] text-[#8a681e]">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      {benefit.label}
                      <Check className="size-3.5 shrink-0 text-brand" />
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="shrink-0 border-t border-border bg-secondary/50 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-7">
          <Button variant="ghost" className="w-full sm:w-auto" disabled={loading} onClick={onClose}>
            {copy.cancelLabel}
          </Button>
          <Button
            size="lg"
            className="mt-2 h-11 w-full bg-[#d7b45e] text-[#17140d] hover:bg-[#c9a64e] sm:mt-0 sm:w-auto sm:min-w-[238px]"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              void startPremiumCheckout()
                .catch((error) => {
                  toast.error(error instanceof Error ? error.message : 'Impossible d’activer Premium.');
                })
                .finally(() => setLoading(false));
            }}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
            {loading ? 'Redirection...' : 'Passer à Premium · 9$/mois'}
          </Button>
        </footer>
      </section>
    </div>,
    document.body
  );
}
