import type { Store, User } from '../types';

export const demoStore: Store = {
  name: 'Nova Market',
  slug: 'novamarket',
  category: 'Mode & accessoires',
  description:
  'Boutique lifestyle qui réunit sneakers tendance, t-shirts graphiques, sacs élégants et montres premium pour composer un look complet.',
  logo: "/nova-market-icon.png",
  cover: "/demo/nova-market-hero-desktop.webp",
  coverMobile: "/demo/nova-market-hero-mobile.webp",
  whatsapp: '+243 970 000 111',
  address: '24, avenue Kasa-Vubu',
  city: '',
  country: 'RD Congo',
  currency: '$',
  instagram: 'novamarket',
  tiktok: 'novamarket',
  facebook: 'novamarket',
  theme: 'emerald',
  layout: 'grid',
  font: 'Geist',
  heroTitle: 'Le dressing complet pour ton style',
  heroSubtitle: 'Sneakers iconiques, t-shirts graphiques, sacs élégants et montres premium. Choisis tes pièces, vérifie les détails et commande directement sur WhatsApp.',
  ctaLabel: 'Commander sur WhatsApp',
  showBranding: true,
  plan: 'basic',
  newsletterAvailable: false,
  verificationStatus: 'verified'
};

export const demoUser: User = {
  firstName: 'Grâce',
  lastName: 'Mukendi',
  email: 'grace@novamarket.demo',
  whatsapp: '+243 970 000 111',
  plan: 'basic'
};

export const storeCategoryOptions = [
  { value: 'Mode & vêtements', description: 'Prêt-à-porter et textile', icon: 'shirt' },
  { value: 'Chaussures & sneakers', description: 'Chaussures et streetwear', icon: 'sneaker' },
  { value: 'Sacs & accessoires', description: 'Sacs, lunettes et accessoires', icon: 'shopping-bag' },
  { value: 'Beauté & cosmétiques', description: 'Soins, maquillage et parfums', icon: 'sparkles' },
  { value: 'Bijoux & montres', description: 'Bijoux, montres et joaillerie', icon: 'gem' },
  { value: 'Maison & décoration', description: 'Mobilier, déco et équipement', icon: 'house' },
  { value: 'Restauration', description: 'Plats, boissons et livraison', icon: 'utensils' },
  { value: 'Alimentation', description: 'Épicerie et produits frais', icon: 'basket' },
  { value: 'Électronique', description: 'Téléphones et accessoires tech', icon: 'smartphone' },
  { value: 'Sport & fitness', description: 'Équipement et vêtements sportifs', icon: 'dumbbell' },
  { value: 'Enfants & bébé', description: 'Mode, jouets et puériculture', icon: 'baby' },
  { value: 'Automobile & pièces', description: 'Pièces, accessoires et entretien', icon: 'car' },
  { value: 'Livres & papeterie', description: 'Livres, fournitures et cadeaux', icon: 'book' },
  { value: 'Art & artisanat', description: 'Créations et produits faits main', icon: 'palette' },
  { value: 'Services professionnels', description: 'Prestations et accompagnement', icon: 'briefcase' },
  { value: 'Autres', description: 'Une activité différente', icon: 'shapes' }
] as const;


export const countryOptions = [
'RD Congo',
'Côte d’Ivoire',
'Sénégal',
'Cameroun',
'France',
'Bénin',
'Togo',
'Maroc'];


export const currencyOptions = ['$', '€', 'FCFA', 'FC', 'MAD'];
