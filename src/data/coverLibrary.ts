export interface CoverSuggestion {
  id: string;
  label: string;
  description: string;
  desktop: string;
  mobile: string;
  activities: string[];
}

export const coverSuggestions: CoverSuggestion[] = [
  {
    id: 'fashion',
    label: 'Mode urbaine',
    description: 'Mode, chaussures et accessoires',
    desktop: '/demo/nova-market-hero-desktop.webp',
    mobile: '/demo/nova-market-hero-mobile.webp',
    activities: [
      'Mode & vêtements',
      'Chaussures & sneakers',
      'Sacs & accessoires',
      'Bijoux & montres'
    ]
  },
  {
    id: 'beauty',
    label: 'Beauté lumineuse',
    description: 'Soins, maquillage et parfums',
    desktop: '/uploads/glow-beauty-hero-desktop.webp',
    mobile: '/uploads/glow-beauty-hero-mobile.webp',
    activities: ['Beauté & cosmétiques', 'Bijoux & montres', 'Mode & vêtements']
  },
  {
    id: 'restaurant',
    label: 'Saveurs & restauration',
    description: 'Plats, boissons et produits frais',
    desktop: '/library/headers/restaurant-desktop.webp',
    mobile: '/library/headers/restaurant-mobile.webp',
    activities: ['Restauration', 'Alimentation']
  },
  {
    id: 'electronics',
    label: 'Tech & électronique',
    description: 'Téléphones et accessoires connectés',
    desktop: '/library/headers/electronics-desktop.webp',
    mobile: '/library/headers/electronics-mobile.webp',
    activities: ['Électronique', 'Services professionnels']
  },
  {
    id: 'home',
    label: 'Maison contemporaine',
    description: 'Mobilier, décoration et artisanat',
    desktop: '/library/headers/home-desktop.webp',
    mobile: '/library/headers/home-mobile.webp',
    activities: ['Maison & décoration', 'Art & artisanat', 'Autres']
  },
  {
    id: 'sport',
    label: 'Sport & mouvement',
    description: 'Fitness, équipement et chaussures',
    desktop: '/library/headers/sport-desktop.webp',
    mobile: '/library/headers/sport-mobile.webp',
    activities: ['Sport & fitness', 'Chaussures & sneakers']
  },
  {
    id: 'kids',
    label: 'Enfants & découvertes',
    description: 'Mode enfant, jouets et livres',
    desktop: '/library/headers/kids-desktop.webp',
    mobile: '/library/headers/kids-mobile.webp',
    activities: ['Enfants & bébé', 'Livres & papeterie']
  },
  {
    id: 'automotive',
    label: 'Univers automobile',
    description: 'Pièces, accessoires et entretien',
    desktop: '/library/headers/automotive-desktop.webp',
    mobile: '/library/headers/automotive-mobile.webp',
    activities: ['Automobile & pièces']
  },
  {
    id: 'services',
    label: 'Studio professionnel',
    description: 'Services, conseil et création',
    desktop: '/library/headers/services-desktop.webp',
    mobile: '/library/headers/services-mobile.webp',
    activities: ['Services professionnels', 'Art & artisanat', 'Livres & papeterie', 'Autres']
  }
];

const legacyActivities: Record<string, string> = {
  'Mode & accessoires': 'Mode & vêtements',
  Mode: 'Mode & vêtements',
  Sneakers: 'Chaussures & sneakers',
  Beauté: 'Beauté & cosmétiques',
  Restaurant: 'Restauration',
  Services: 'Services professionnels'
};

function selectedActivities(category: string) {
  return category
    .split(',')
    .map((activity) => activity.trim())
    .filter(Boolean)
    .map((activity) => legacyActivities[activity] ?? activity);
}

export function coverMatchesActivities(suggestion: CoverSuggestion, category: string) {
  const selected = selectedActivities(category);
  return selected.some((activity) => suggestion.activities.includes(activity));
}

export function orderedCoverSuggestions(category: string) {
  return coverSuggestions
    .map((suggestion, index) => ({
      suggestion,
      index,
      recommended: coverMatchesActivities(suggestion, category)
    }))
    .sort((left, right) => Number(right.recommended) - Number(left.recommended) || left.index - right.index);
}
