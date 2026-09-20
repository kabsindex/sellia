import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface BrandLoadingScreenProps {
  logo?: string;
  name?: string;
  label?: string;
  delay?: number;
}

export function BrandLoadingScreen({
  logo,
  name,
  label = 'Chargement...',
  delay = 180
}: BrandLoadingScreenProps) {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="grid min-h-[100dvh] w-full place-items-center bg-background px-5 text-center"
      role="status"
      aria-live="polite"
      aria-label={label}>
      {visible &&
      <div className="flex animate-in flex-col items-center fade-in duration-300">
          <div className="storefront-loading-logo grid size-24 place-items-center overflow-hidden rounded-2xl border border-border bg-white p-2.5 shadow-soft">
            {logo ?
            <img src={logo} alt={name ? `Logo ${name}` : 'Logo'} className="h-full w-full object-contain" /> :
            <Logo showWordmark={false} />
            }
          </div>
          <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
            <span className="storefront-loading-dot size-1.5 rounded-full bg-brand" />
            <span className="storefront-loading-dot size-1.5 rounded-full bg-brand" />
            <span className="storefront-loading-dot size-1.5 rounded-full bg-brand" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{label}</p>
        </div>
      }
    </div>
  );
}
