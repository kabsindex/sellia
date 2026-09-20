import React from 'react';
import { howItWorks } from '../../data/landing';

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="border-b border-border bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <div className="max-w-[620px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Comment ça marche
          </p>
          <h2 className="mt-3 font-heading text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[36px]">
            Quatre étapes, et tu vends.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Pas de configuration technique, pas d’hébergement, pas de thème à installer. Tu remplis,
            SELLIA construit.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((item) =>
          <li
            key={item.step}
            className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
            
              <span className="font-mono text-xs font-medium text-brand">{item.step}</span>
              <h3 className="mt-3 font-heading text-base font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}