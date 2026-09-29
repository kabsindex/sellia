import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  /** Rend le mot-symbole en blanc pour les fonds sombres. */
  inverted?: boolean;
  showWordmark?: boolean;
}

export function Logo({ className, inverted = false, showWordmark = true }: LogoProps) {
  const wrapperClassName = showWordmark ?
  'relative h-12 w-24 sm:w-28' :
  'relative h-10 w-10 overflow-hidden rounded-xl';
  const imageClassName = showWordmark ?
  'h-full w-full object-contain' :
  'absolute left-1/2 top-1/2 h-[82px] w-[82px] max-w-none -translate-x-1/2 -translate-y-[56%] object-contain';

  return (
    <span className={cn('inline-flex items-center leading-none', className)}>
      <span className={wrapperClassName}>
      <img
        src={showWordmark ? '/sellia-logo-cropped.png' : '/sellia-logo.png'}
        alt="SELLIA"
        className={imageClassName} />
      {inverted && showWordmark &&
      <img
        src="/sellia-logo-cropped.png"
        alt=""
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 brightness-0 invert', imageClassName)}
        style={{ clipPath: 'inset(58% 0 0 0)' }} />
      }
      {inverted && !showWordmark &&
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/15" />
      }
      </span>
    </span>);

}
