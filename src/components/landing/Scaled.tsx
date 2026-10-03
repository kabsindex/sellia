import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * Affiche une interface à sa taille réelle (width × height logiques) puis la met à l'échelle
 * pour qu'elle tienne dans son conteneur : les mockups gardent les vraies proportions du produit.
 */
export function Scaled({ width, height, children, className }: {width: number;height: number;children: React.ReactNode;className?: string;}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setScale(el.clientWidth / width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={ref} className={className} style={{ height: height * scale, position: 'relative', overflow: 'hidden' }} aria-hidden="true">
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0 }}>{children}</div>
    </div>);
}

export function BrowserFrame({ children, url, className }: {children: React.ReactNode;url: string;className?: string;}) {
  return (
    <div className={`overflow-hidden rounded-[18px] ${className ?? ''}`} style={{ background: 'var(--ds-card)', boxShadow: '0 0 0 1px var(--ds-border), 0 30px 60px -28px rgb(15 26 21 / 0.4)' }}>
      <div className="flex items-center gap-1.5 border-b px-3.5 py-2.5" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-subtle)' }}>
        <span className="size-2.5 rounded-full bg-[#ff6259]/70" /><span className="size-2.5 rounded-full bg-[#ffbf2f]/70" /><span className="size-2.5 rounded-full bg-[#29ce42]/70" />
        <span className="ml-3 truncate rounded-md px-2.5 py-0.5 font-mono text-[11px]" style={{ background: 'var(--ds-card)', color: 'var(--ds-muted)' }}>{url}</span>
      </div>
      {children}
    </div>);
}
