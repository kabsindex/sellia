import React from 'react';
import { BarChart3, Package, Palette, Store, Users } from 'lucide-react';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { Reveal } from './motion';
import { features } from '../../data/landing';

const iconMap: Record<string, React.ComponentType<{className?: string;}>> = {
  Store,
  MessageCircle: WhatsAppIcon,
  Package,
  BarChart3,
  Palette,
  Users
};

export function Features() {
  return (
    <section id="fonctionnalites" className="scroll-mt-16 border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal className="max-w-[620px]">
          <h2 className="font-heading text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[38px]">
            Tout ce qu’il faut pour vendre, rien de plus.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] ?? Store;
            return (
              <Reveal key={feature.title} delay={(index % 3) * 0.07}>
                <article className="group h-full rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand-strong transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon className="size-[18px]" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </article>
              </Reveal>);
          })}
        </div>
      </div>
    </section>);
}
