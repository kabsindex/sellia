import React from 'react';
import {
  Baby,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Check,
  Dumbbell,
  Gem,
  House,
  Palette,
  Shapes,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { PiSneakerBold } from 'react-icons/pi';
import { cn } from '../../utils/cn';
import { storeCategoryOptions } from '../../data/store';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  shirt: Shirt,
  sneaker: PiSneakerBold,
  'shopping-bag': ShoppingBag,
  sparkles: Sparkles,
  gem: Gem,
  house: House,
  utensils: UtensilsCrossed,
  basket: ShoppingBasket,
  smartphone: Smartphone,
  dumbbell: Dumbbell,
  baby: Baby,
  car: CarFront,
  book: BookOpen,
  palette: Palette,
  briefcase: BriefcaseBusiness,
  shapes: Shapes
};

const legacyActivities: Record<string, string> = {
  'Mode & accessoires': 'Mode & vêtements',
  Mode: 'Mode & vêtements',
  Sneakers: 'Chaussures & sneakers',
  Beauté: 'Beauté & cosmétiques',
  Restaurant: 'Restauration',
  Services: 'Services professionnels'
};
interface StoreCategoryStepProps {
  category: string;
  onChange: (category: string) => void;
}
export function StoreCategoryStep({
  category,
  onChange
}: StoreCategoryStepProps) {
  const selectedCategories = category
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => legacyActivities[item] ?? item);

  function toggleCategory(option: string) {
    const next = selectedCategories.includes(option)
      ? selectedCategories.filter((item) => item !== option)
      : [...selectedCategories, option];
    onChange(next.join(', '));
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Choisis une ou plusieurs activités.</p>
        <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-strong">
          {selectedCategories.length} sélectionnée{selectedCategories.length > 1 ? 's' : ''}
        </span>
      </div>
      <div role="group" aria-label="Activités de la boutique" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {storeCategoryOptions.map((option) => {
          const Icon = icons[option.icon] ?? Shapes;
          const selected = selectedCategories.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleCategory(option.value)}
              className={cn(
                'relative flex min-h-[126px] flex-col items-start rounded-xl border p-3.5 text-left transition-all',
                selected
                  ? 'border-brand bg-brand-soft shadow-soft'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              )}>
              <span className={cn(
                'grid size-10 place-items-center rounded-lg',
                selected ? 'bg-brand text-brand-foreground' : 'bg-secondary text-muted-foreground'
              )}>
                <Icon className="size-[18px]" />
              </span>
              <span className="mt-3 text-sm font-semibold leading-snug">{option.value}</span>
              <span className="mt-1 text-[11px] leading-snug text-muted-foreground">
                {option.description}
              </span>
              {selected && <Check className="absolute right-2.5 top-2.5 size-4 text-brand-strong" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
