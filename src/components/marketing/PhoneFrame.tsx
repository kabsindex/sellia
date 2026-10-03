import React from 'react';
import { cn } from '../../utils/cn';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
}

/** Cadre de téléphone commun (aperçu Apparence + landing). */
export function PhoneFrame({ children, className, screenClassName }: PhoneFrameProps) {
  return (
    <div
      className={cn('relative w-[280px] max-w-full shrink-0 rounded-[40px] p-[7px]', className)}
      style={{ background: '#0f1a15', boxShadow: '0 0 0 1px rgb(255 255 255 / 0.08) inset, 0 28px 60px -22px rgb(15 26 21 / 0.55)' }}>
      <div className="absolute left-1/2 top-[13px] z-20 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-[#0f1a15]" aria-hidden="true" />
      <div className={cn('relative h-[560px] overflow-hidden rounded-[33px] bg-white', screenClassName)}>{children}</div>
    </div>);
}
