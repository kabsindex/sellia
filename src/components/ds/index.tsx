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

type BadgeTone = 'neutral' | 'accent' | 'solid' | 'danger' | 'warn' | 'ink';
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
