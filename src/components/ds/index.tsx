import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/format';
import { spring } from '../../design/motion';

type Variant = 'primary' | 'soft' | 'outline' | 'ghost' | 'dark' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const btnClass = (variant: Variant, size: Size, block?: boolean, className?: string) =>
cn('ds-btn', `ds-btn--${variant}`, size !== 'md' && `ds-btn--${size}`, block && 'ds-btn--block', className);

interface DsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}
export function DsButton({ variant = 'primary', size = 'md', block, className, type = 'button', ...props }: DsButtonProps) {
  return <button type={type} className={btnClass(variant, size, block, className)} {...props} />;
}

interface DsLinkButtonProps extends LinkProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}
export function DsLinkButton({ variant = 'primary', size = 'md', block, className, ...props }: DsLinkButtonProps) {
  return <Link className={btnClass(variant, size, block, className)} {...props} />;
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  glass?: boolean;
  small?: boolean;
}
export function IconButton({ label, glass, small, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn('ds-icon-btn', glass && 'ds-icon-btn--glass', small && 'ds-icon-btn--sm', className)}
      {...props} />);
}

export function Chip({
  active,
  square,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {active?: boolean;square?: boolean;}) {
  return (
    <button
      type="button"
      data-active={Boolean(active)}
      aria-pressed={Boolean(active)}
      className={cn('ds-chip', square && 'ds-chip--square', className)}
      {...props} />);
}

type BadgeTone = 'neutral' | 'accent' | 'solid' | 'danger' | 'warn' | 'ink' | 'info' | 'violet';
export function Badge({ tone = 'neutral', className, ...props }: React.HTMLAttributes<HTMLSpanElement> & {tone?: BadgeTone;}) {
  return <span className={cn('ds-badge', tone !== 'neutral' && `ds-badge--${tone}`, className)} {...props} />;
}

/** Sélecteur de quantité (le nombre change avec une petite transition). */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 99
}: {value: number;onChange: (value: number) => void;min?: number;max?: number;}) {
  return (
    <div className="ds-stepper">
      <button type="button" aria-label="Retirer un" disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="size-4" />
      </button>
      <output aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="inline-block"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.14 }}>
            {value}
          </motion.span>
        </AnimatePresence>
      </output>
      <button type="button" aria-label="Ajouter un" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-4" />
      </button>
    </div>);
}

/** Prix courant, ancien prix barré et remise calculés à partir des vraies données. */
export function Price({
  price,
  oldPrice,
  currency,
  size = 'md'
}: {price: number;oldPrice?: number;currency?: string;size?: 'sm' | 'md' | 'lg';}) {
  const sizes = { sm: 'text-[14px]', md: 'text-[16px]', lg: 'text-[26px] leading-none' };
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
      <span className={cn('ds-price', sizes[size])}>{formatPrice(price, currency)}</span>
      {oldPrice && oldPrice > price &&
      <span className="ds-muted text-[12px] line-through">{formatPrice(oldPrice, currency)}</span>
      }
    </span>);
}

export function discountPercent(price: number, oldPrice?: number): number | null {
  return oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : null;
}

export function SectionHeader({
  title,
  to,
  action = 'Voir tout',
  className
}: {title: string;to?: string;action?: string;className?: string;}) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <h2 className="ds-title text-[17px]">{title}</h2>
      {to &&
      <Link to={to} className="text-[13px] font-semibold" style={{ color: 'var(--ds-accent-strong)' }}>
          {action}
        </Link>
      }
    </div>);
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  children
}: {icon: React.ComponentType<{className?: string;}>;title: string;text?: string;children?: React.ReactNode;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="mx-auto flex max-w-[360px] flex-col items-center px-6 py-16 text-center">
      <span className="grid size-16 place-items-center rounded-full" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}>
        <Icon className="size-7" />
      </span>
      <h2 className="ds-title mt-4 text-[18px]">{title}</h2>
      {text && <p className="ds-muted mt-1.5 text-[14px] leading-relaxed">{text}</p>}
      {children && <div className="mt-5">{children}</div>}
    </motion.div>);
}

/* ---------------------------------------------------------------------------
   Briques dashboard (même design system que le storefront)
   ------------------------------------------------------------------------- */

export function PageHeader({
  title,
  description,
  actions
}: {title: string;description?: string;actions?: React.ReactNode;}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="ds-title text-[22px] leading-tight lg:text-[26px]">{title}</h1>
        {description && <p className="ds-muted mt-1 text-[14px]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>);
}

export function StatTile({
  label,
  icon: Icon,
  children,
  hint,
  tone = 'accent'
}: {
  label: string;
  icon: React.ComponentType<{className?: string;}>;
  children: React.ReactNode;
  hint?: React.ReactNode;
  tone?: 'accent' | 'ink' | 'warn';
}) {
  const colors = {
    accent: { background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' },
    ink: { background: 'var(--ds-subtle)', color: 'var(--ds-ink)' },
    warn: { background: 'var(--ds-warn-soft)', color: 'var(--ds-warn)' }
  }[tone];
  return (
    <div className="ds-card p-3.5 lg:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="ds-muted text-[12.5px] font-medium leading-tight">{label}</p>
        <span className="grid size-7 shrink-0 place-items-center rounded-[9px]" style={colors}><Icon className="size-[15px]" /></span>
      </div>
      <p className="ds-title mt-2 text-[24px] leading-none lg:text-[28px]">{children}</p>
      {hint && <p className="ds-muted mt-1.5 text-[12px]">{hint}</p>}
    </div>);
}

/** Onglets segmentés (filtres de liste). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label
}: {value: T;options: {id: T;label: string;count?: number;}[];onChange: (value: T) => void;label: string;}) {
  return (
    <div role="tablist" aria-label={label} className="ds-seg max-w-full overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      {options.map((option) =>
      <button key={option.id} type="button" role="tab" aria-selected={value === option.id} onClick={() => onChange(option.id)}>
          {value === option.id &&
        <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-[9px]" style={{ background: 'var(--ds-card)', boxShadow: 'var(--ds-shadow-xs)' }} transition={{ type: 'spring', stiffness: 520, damping: 38 }} />
        }
          <span className="relative inline-flex items-center gap-1.5">
            {option.label}
            {option.count !== undefined && option.count > 0 && <span className="ds-badge ds-badge--accent !h-[18px] !px-1.5 !text-[10px]">{option.count}</span>}
          </span>
        </button>
      )}
    </div>);
}

export function Toggle({ checked, onChange, label }: {checked: boolean;onChange: (value: boolean) => void;label: string;}) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="ds-toggle" onClick={() => onChange(!checked)} />;
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className
}: {label: string;hint?: string;htmlFor?: string;children: React.ReactNode;className?: string;}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="ds-label">{label}</label>
      {children}
      {hint && <p className="ds-hint">{hint}</p>}
    </div>);
}

export function SearchField({
  value,
  onChange,
  placeholder,
  className
}: {value: string;onChange: (value: string) => void;placeholder: string;className?: string;}) {
  return (
    <label className={cn('ds-search', className)}>
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>);
}
