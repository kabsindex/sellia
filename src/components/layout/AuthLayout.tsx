import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Logo } from '../shared/Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const perks = [
'Ta boutique en ligne en moins de 5 minutes',
'Les commandes arrivent directement sur WhatsApp',
'0% de commission sur tes ventes'];


export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex w-full flex-col px-5 py-6 lg:w-1/2 lg:px-16 lg:py-10">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            
            <ArrowLeft className="size-4" />
            Retour
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          <h1 className="font-heading text-[26px] font-semibold tracking-[-0.02em] lg:text-[30px]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-ink lg:block">
        <div className="flex h-full flex-col justify-between p-14">
          <Logo inverted />
          <div>
            <p className="max-w-[420px] font-heading text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
              Transforme ton WhatsApp en machine de vente.
            </p>
            <ul className="mt-8 space-y-3">
              {perks.map((perk) =>
              <li key={perk} className="flex items-center gap-3 text-sm text-white/75">
                  <span className="grid size-5 place-items-center rounded-full bg-whatsapp/20">
                    <Check className="size-3 text-whatsapp" />
                  </span>
                  {perk}
                </li>
              )}
            </ul>
          </div>
          <p className="font-mono text-xs text-white/40">sellia.app</p>
        </div>
        <div className="pointer-events-none absolute -right-24 top-1/3 size-[420px] rounded-full bg-brand/20 blur-3xl" />
      </div>
    </div>);

}