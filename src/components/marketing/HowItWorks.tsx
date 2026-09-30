import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link2, PackagePlus, Send, Store } from 'lucide-react';
import { Reveal, easeOut } from './motion';
import { howItWorks } from '../../data/landing';

const icons = [Store, PackagePlus, Link2, Send];

export function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <section id="fonctionnement" className="scroll-mt-16 border-b border-border bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal className="max-w-[620px]">
          <h2 className="font-heading text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[38px]">
            Crée ta boutique en quelques minutes.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Pas de configuration technique, pas d’hébergement, pas de thème à installer. Tu remplis,
            SELLIA construit.
          </p>
        </Reveal>

        <div className="relative mt-12">
          <div aria-hidden="true" className="absolute left-[7%] right-[7%] top-6 hidden h-px bg-border lg:block">
            <motion.div
              className="h-full origin-left bg-brand"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.4, ease: easeOut }} />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => {
              const Icon = icons[index] ?? Store;
              return (
                <li key={item.step} className="relative">
                  <Reveal delay={index * 0.08}>
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift">
                      <span className="relative z-10 grid size-12 place-items-center rounded-2xl border border-border bg-background text-brand-strong">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-4 font-heading text-base font-semibold">
                        <span className="mr-1.5 text-brand">{index + 1}.</span>
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </Reveal>
                </li>);
            })}
          </ol>
        </div>
      </div>
    </section>);
}
