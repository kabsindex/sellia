import type { PlanId, VerificationStatus } from '../types';

export interface PlanFeatureFlags {
  maxProducts: number;
  premiumThemes: boolean;
  advancedCustomization: boolean;
  reviews: boolean;
  advancedAnalytics: boolean;
  removeBranding: boolean;
  verification: boolean;
  promotions: boolean;
  promoCodes: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  tagline: string;
  highlight?: string;
  features: string[];
  cta: string;
  demoHref: string;
}

export type PremiumBenefitId =
  | 'products'
  | 'commerce'
  | 'themes'
  | 'customization'
  | 'promotions'
  | 'commission'
  | 'reviews'
  | 'analytics'
  | 'verification'
  | 'branding'
  | 'support';

export interface PremiumBenefit {
  id: PremiumBenefitId;
  label: string;
  description: string;
}

export const PREMIUM_BENEFITS: PremiumBenefit[] = [
  { id: 'products', label: 'Produits illimités', description: 'Publie tout ton catalogue sans plafond.' },
  { id: 'commerce', label: 'Commandes WhatsApp et panier', description: 'Transforme les visites en commandes simplement.' },
  { id: 'themes', label: 'Tous les thèmes Premium', description: 'Accède à chaque identité visuelle.' },
  { id: 'customization', label: 'Personnalisation complète', description: 'Polices, dispositions et finitions avancées.' },
  { id: 'promotions', label: 'Promotions et codes promo', description: 'Crée des offres qui accélèrent les ventes.' },
  { id: 'commission', label: '0% de commission', description: 'Tes ventes restent entièrement à toi.' },
  { id: 'reviews', label: 'Avis clients', description: 'Renforce la confiance autour de ta boutique.' },
  { id: 'analytics', label: 'Statistiques avancées', description: 'Comprends les visites, commandes et revenus.' },
  { id: 'verification', label: 'Vérification SELLIA', description: 'Affiche un repère de confiance sur ta boutique.' },
  { id: 'branding', label: 'Branding SELLIA retirable', description: 'Présente une boutique entièrement à ton nom.' },
  { id: 'support', label: 'Support prioritaire', description: 'Obtiens une assistance plus rapidement.' }
];

export const PLAN_FEATURES: Record<PlanId, PlanFeatureFlags> = {
  basic: {
    maxProducts: 5,
    premiumThemes: false,
    advancedCustomization: false,
    reviews: false,
    advancedAnalytics: false,
    removeBranding: false,
    verification: false,
    promotions: false,
    promoCodes: false
  },
  premium: {
    maxProducts: Infinity,
    premiumThemes: true,
    advancedCustomization: true,
    reviews: true,
    advancedAnalytics: true,
    removeBranding: true,
    verification: true,
    promotions: true,
    promoCodes: true
  }
};

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'SELLIA Basic',
    price: '0$',
    period: 'Gratuit',
    tagline: 'Pour commencer à vendre simplement avec WhatsApp.',
    features: [
      "Jusqu'à 5 produits",
      'Catalogue professionnel',
      'Commandes WhatsApp',
      'Panier',
      'Catégories',
      'Personnalisation de base',
      'Statistiques essentielles'
    ],
    cta: 'Commencer gratuitement',
    demoHref: '/demo/basic'
  },
  {
    id: 'premium',
    name: 'SELLIA Premium',
    price: '9$',
    period: 'par mois',
    tagline: 'Pour les vendeurs qui veulent construire une véritable marque en ligne.',
    highlight: 'Le plus choisi',
    features: PREMIUM_BENEFITS.map((benefit) => benefit.label),
    cta: 'Passer en Premium',
    demoHref: '/demo/premium'
  }
];

export const planLimits: Record<PlanId, number> = {
  basic: PLAN_FEATURES.basic.maxProducts,
  premium: PLAN_FEATURES.premium.maxProducts
};

export function canPublishProduct(plan: PlanId, publishedProductsCount: number): boolean {
  return publishedProductsCount < PLAN_FEATURES[plan].maxProducts;
}

export function getPlanLimitLabel(plan: PlanId): string {
  const limit = PLAN_FEATURES[plan].maxProducts;
  return Number.isFinite(limit) ? String(limit) : 'Illimités';
}

export const verificationLabels: Record<VerificationStatus, string> = {
  unverified: 'Non vérifiée',
  pending: 'Vérification en cours',
  verified: 'Boutique vérifiée',
  rejected: 'Vérification refusée'
};

export const comparisonRows = [
  ['Prix', 'Gratuit', '9$/mois'],
  ['Produits', '5', 'Illimités'],
  ['Boutique', '✓', '✓'],
  ['WhatsApp', '✓', '✓'],
  ['Panier', '✓', '✓'],
  ['Vérification SELLIA', '—', '✓'],
  ['Thème Basic', '✓', '✓'],
  ['Thèmes Premium', '—', '✓'],
  ['Personnalisation avancée', '—', '✓'],
  ['Promotions', '—', '✓'],
  ['Codes promo', '—', '✓'],
  ['Avis clients', '—', '✓'],
  ['Stats avancées', '—', '✓'],
  ['Branding SELLIA', 'Oui', 'Optionnel'],
  ['Support prioritaire', '—', '✓']
];
