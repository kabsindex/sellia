import React from 'react';
import {
  Baby,
  BookOpen,
  BriefcaseBusiness,
  CakeSlice,
  CarFront,
  Coffee,
  Dumbbell,
  Flower2,
  Gamepad2,
  Gem,
  Glasses,
  Headphones,
  House,
  Laptop,
  Package,
  Palette,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tag,
  UtensilsCrossed,
  Watch
} from 'lucide-react';
import { PiSneakerBold } from 'react-icons/pi';

type IconComponent = React.ComponentType<{ className?: string }>;

export const categoryIconOptions: Array<{
  value: string;
  label: string;
  icon: IconComponent;
}> = [
  { value: 'sneaker', label: 'Chaussures', icon: PiSneakerBold },
  { value: 'shirt', label: 'Vêtements', icon: Shirt },
  { value: 'shopping-bag', label: 'Sacs', icon: ShoppingBag },
  { value: 'watch', label: 'Montres', icon: Watch },
  { value: 'sparkles', label: 'Beauté', icon: Sparkles },
  { value: 'gem', label: 'Bijoux', icon: Gem },
  { value: 'smartphone', label: 'Téléphones', icon: Smartphone },
  { value: 'laptop', label: 'Informatique', icon: Laptop },
  { value: 'headphones', label: 'Audio', icon: Headphones },
  { value: 'gamepad', label: 'Jeux', icon: Gamepad2 },
  { value: 'house', label: 'Maison', icon: House },
  { value: 'utensils', label: 'Restaurant', icon: UtensilsCrossed },
  { value: 'coffee', label: 'Boissons', icon: Coffee },
  { value: 'cake', label: 'Pâtisserie', icon: CakeSlice },
  { value: 'flower', label: 'Fleurs', icon: Flower2 },
  { value: 'glasses', label: 'Accessoires', icon: Glasses },
  { value: 'dumbbell', label: 'Sport', icon: Dumbbell },
  { value: 'baby', label: 'Bébé', icon: Baby },
  { value: 'car', label: 'Automobile', icon: CarFront },
  { value: 'book', label: 'Livres', icon: BookOpen },
  { value: 'palette', label: 'Art', icon: Palette },
  { value: 'briefcase', label: 'Services', icon: BriefcaseBusiness },
  { value: 'package', label: 'Produits', icon: Package },
  { value: 'tag', label: 'Autres', icon: Tag }
];

const iconMap = Object.fromEntries(
  categoryIconOptions.map((option) => [option.value, option.icon])
) as Record<string, IconComponent>;

const legacyIcons: Record<string, string> = {
  '👟': 'sneaker',
  '👕': 'shirt',
  '👜': 'shopping-bag',
  '⌚': 'watch',
  '💎': 'gem',
  '📱': 'smartphone'
};

function inferredIcon(slug: string): string {
  const value = slug.toLowerCase();
  if (/sneaker|chaussure|basket|shoe/.test(value)) return 'sneaker';
  if (/t-shirt|vetement|mode|habit|shirt/.test(value)) return 'shirt';
  if (/sac|bag/.test(value)) return 'shopping-bag';
  if (/montre|watch/.test(value)) return 'watch';
  if (/beaute|cosmetique|maquillage|parfum/.test(value)) return 'sparkles';
  if (/bijou|gem/.test(value)) return 'gem';
  if (/telephone|mobile|smartphone/.test(value)) return 'smartphone';
  if (/restaurant|repas|food|cuisine/.test(value)) return 'utensils';
  if (/maison|deco|mobilier/.test(value)) return 'house';
  if (/sport|fitness/.test(value)) return 'dumbbell';
  if (/bebe|enfant/.test(value)) return 'baby';
  if (/auto|voiture/.test(value)) return 'car';
  if (/livre|papeterie/.test(value)) return 'book';
  if (/service/.test(value)) return 'briefcase';
  if (/nouveau|produit/.test(value)) return 'package';
  return 'tag';
}

export function resolveCategoryIcon(slug: string, icon?: string): string {
  const selected = legacyIcons[icon || ''] || icon;
  return selected && iconMap[selected] ? selected : inferredIcon(slug);
}

interface CategoryIconProps {
  slug: string;
  icon?: string;
  className?: string;
}

export function CategoryIcon({ slug, icon, className }: CategoryIconProps) {
  const Icon = iconMap[resolveCategoryIcon(slug, icon)] || Tag;
  return <Icon className={className} />;
}
