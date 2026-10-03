import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { CategoryIcon } from '../shared/CategoryIcon';
import { IconButton } from '../ds';
import { cn } from '../../utils/cn';
import { spring } from '../../design/motion';
import type { Category, Product } from '../../types';

/** Pastille panier : le compteur « rebondit » à chaque changement (0 → 1, 1 → 2…). */
export function CartBadge({ count, className }: {count: number;className?: string;}) {
  return (
    <AnimatePresence initial={false}>
      {count > 0 &&
      <motion.span
        key={count}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={spring}
        className={cn(
          'absolute -right-1.5 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full px-1 text-[10px] font-bold tabular-nums',
          className
        )}
        style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)', boxShadow: '0 0 0 2px var(--ds-bg)' }}>
          {count}
        </motion.span>
      }
    </AnimatePresence>);
}

export function CartLink({ to, count }: {to: string;count: number;}) {
  return (
    <Link to={to} aria-label={`Panier (${count})`} className="ds-icon-btn relative">
      <ShoppingBag className="size-[18px]" />
      <CartBadge count={count} />
    </Link>);
}

/** Barre de page mobile : retour, titre centré, action à droite. */
export function MobileBar({
  title,
  right,
  back = true,
  className
}: {title: string;right?: React.ReactNode;back?: boolean;className?: string;}) {
  const navigate = useNavigate();
  return (
    <div className={cn('sticky top-0 z-30 flex h-14 items-center gap-2 px-4 backdrop-blur-md lg:hidden', className)} style={{ background: 'color-mix(in srgb, var(--ds-bg) 90%, transparent)' }}>
      <div className="w-10">
        {back && <IconButton label="Retour" onClick={() => navigate(-1)}><ArrowLeft className="size-[18px]" /></IconButton>}
      </div>
      <h1 className="ds-title min-w-0 flex-1 truncate text-center text-[16px]">{title}</h1>
      <div className="flex min-w-10 justify-end">{right}</div>
    </div>);
}

/** Titre de page desktop (sur mobile c'est la MobileBar qui s'en charge). */
export function DesktopTitle({ title, hint }: {title: string;hint?: string;}) {
  return (
    <div className="mb-5 hidden lg:block">
      <h1 className="ds-title text-[28px]">{title}</h1>
      {hint && <p className="ds-muted mt-1 text-[14px]">{hint}</p>}
    </div>);
}

export function FavoriteButton({
  active,
  onToggle,
  className,
  glass = true
}: {active: boolean;onToggle: () => void;className?: string;glass?: boolean;}) {
  return (
    <IconButton
      label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      glass={glass}
      small
      aria-pressed={active}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}>
      <motion.span
        key={String(active)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={spring}
        className="grid place-items-center">
        <Heart className="size-[15px]" style={active ? { fill: '#ef4444', color: '#ef4444' } : undefined} />
      </motion.span>
    </IconButton>);
}

/** Catégories rondes : image du premier produit de la catégorie, sinon icône. */
export function CategoryBubbles({
  categories,
  products,
  activeSlug,
  onSelect,
  allLabel = 'Tous',
  wrap = false
}: {
  categories: Category[];
  products: Product[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  allLabel?: string;
  wrap?: boolean;
}) {
  const items = [{ slug: 'tout', name: allLabel, emoji: 'grid', image: undefined as string | undefined }].concat(
    categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      emoji: category.emoji,
      image: products.find((product) => product.categoryId === category.id)?.images[0]
    }))
  );
  return (
    <div className={wrap ? 'grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 lg:grid-cols-8' : 'ds-scroll-x -mx-4 gap-3.5 px-4 pb-1 lg:mx-0 lg:px-0'}>
      {items.map((item) => {
        const active = activeSlug === item.slug;
        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect(item.slug)}
            aria-pressed={active}
            className={cn('group flex shrink-0 flex-col items-center gap-1.5 text-center', wrap ? '' : 'w-[68px]')}>
            <span
              className="relative grid size-[60px] place-items-center overflow-hidden rounded-full transition-transform duration-200 group-active:scale-95"
              style={{
                background: active ? 'var(--ds-accent-soft)' : 'var(--ds-subtle)',
                color: 'var(--ds-accent-strong)',
                boxShadow: active ? '0 0 0 2px var(--ds-accent)' : 'inset 0 0 0 1px var(--ds-border)'
              }}>
              {item.image ?
              <img src={item.image} alt="" loading="lazy" className="size-full object-contain p-1.5" /> :
              <CategoryIcon slug={item.slug} icon={item.emoji} className="size-[22px]" />
              }
            </span>
            <span className={cn('max-w-full truncate text-[12px]', active ? 'font-semibold' : 'font-medium')} style={{ color: active ? 'var(--ds-ink)' : 'var(--ds-muted)' }}>
              {item.name}
            </span>
          </button>);
      })}
    </div>);
}
