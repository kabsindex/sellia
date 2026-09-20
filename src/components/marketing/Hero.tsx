import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { PhoneFrame } from './PhoneFrame';
import { MiniStorePreview } from './MiniStorePreview';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { trustStats } from '../../data/landing';

export function Hero() {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 size-[520px] rounded-full bg-brand-soft blur-3xl" />
      
      <div className="relative mx-auto grid w-full max-w-[1160px] gap-12 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}>
          
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-brand" />
            Sans site web · Sans code · Sans commission
          </span>

          <h1 className="mt-5 font-heading text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[48px] lg:text-[58px]">
            Transforme ton WhatsApp en{' '}
            <span className="relative whitespace-nowrap text-brand">
              machine de vente
              <svg
                aria-hidden="true"
                viewBox="0 0 300 12"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-brand/30"
                preserveAspectRatio="none">
                
                <path d="M2 9C60 3 240 2 298 6" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-[520px] text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Crée ta boutique, ajoute tes produits et commence à recevoir des commandes en quelques
            minutes. Aucun code. Aucun site à construire.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-11 px-5 text-sm" onClick={() => navigate('/inscription')}>
              Créer ma boutique gratuitement
              <ArrowRight className="size-4" />
            </Button>
            <div className="relative">
              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full px-5 text-sm sm:w-auto"
                onClick={() => setDemoOpen((value) => !value)}>
                
                Voir démo boutique
                <ChevronDown className="size-4" />
              </Button>
              {demoOpen &&
              <div className="absolute left-0 top-full z-30 mt-2 grid w-full min-w-[260px] gap-2 rounded-2xl border border-border bg-card p-2 shadow-lift sm:w-[300px]">
                  <button
                    type="button"
                    onClick={() => {
                      setDemoOpen(false);
                      navigate('/demo/basic');
                    }}
                    className="rounded-xl border border-border px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-secondary">
                    Boutique Basic
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDemoOpen(false);
                      navigate('/demo/premium');
                    }}
                    className="rounded-xl border border-border px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-secondary">
                    Boutique Premium
                  </button>
                </div>
              }
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-brand" />
            SELLIA Basic est gratuit jusqu’à 5 produits. Aucune carte bancaire.
          </div>

          <dl className="mt-10 grid max-w-[480px] grid-cols-3 gap-4 border-t border-border pt-6">
            {trustStats.map((stat) =>
            <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-heading text-xl font-semibold tracking-[-0.02em]">
                    {stat.value}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {stat.label}
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </motion.div>

        <motion.div
          className="relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}>
          
          <PhoneFrame screenClassName="h-[680px]">
            <MiniStorePreview />
          </PhoneFrame>

          <motion.div
            className="absolute -left-2 bottom-14 w-[236px] rounded-2xl border border-border bg-card p-3 shadow-lift sm:-left-8"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}>
            
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-whatsapp/20">
                <WhatsAppIcon className="size-4 text-whatsapp" />
              </span>
              <p className="text-[11px] font-medium">Nouvelle commande WhatsApp</p>
            </div>
            <p className="mt-2 whitespace-pre-line font-mono text-[10px] leading-relaxed text-muted-foreground">
              {'Produit : Nike Air Jordan 4\nTaille : 42 · Noir\nTotal : 65$'}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>);

}
