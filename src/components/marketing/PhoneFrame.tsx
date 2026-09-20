import React from 'react';
import { cn } from '../../utils/cn';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
}

export function PhoneFrame({ children, className, screenClassName }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative w-[288px] shrink-0 rounded-[38px] border border-black/10 bg-ink p-2 shadow-lift',
        className
      )}>
      
      <div className="absolute left-1/2 top-3.5 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
      <div className={cn('relative h-[560px] overflow-hidden rounded-[30px] bg-white', screenClassName)}>
        {children}
      </div>
    </div>);

}
