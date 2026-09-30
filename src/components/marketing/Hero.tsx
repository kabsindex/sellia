import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { HeroPhone } from './HeroPhone';
import { easeOut } from './motion';
import { trustStats } from '../../data/landing';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-48 size-[560px] rounded-full bg-brand-soft blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-[1160px] gap-14 px-5 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-16">
        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-whatsapp" />
            Sans site web, sans code, sans commission
          </p>

          <h1 className="mt-5 max-w-[14ch] font-heading text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[54px] lg:max-w-none lg:text-[58px]">
            Transforme ton WhatsApp en machine de vente
          </h1>

          <p className="mt-6 max-w-[500px] text-[16px] leading-relaxed text-muted-foreground">
            Crée ta boutique, ajoute tes produits et partage ton lien. Tes clients choisissent,
            ajoutent au panier et t’envoient leur commande déjà rédigée sur WhatsApp.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-6 text-[15px] shadow-soft transition-transform hover:-translate-y-0.5"
              onClick={() => navigate('/inscription')}>
              Créer ma boutique gratuitement
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 text-[15px]"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
              <Play className="size-3.5 fill-current" />
              Voir comment ça marche
            </Button>
          </div>

          <dl className="mt-10 hidden max-w-[520px] sm:grid sm:grid-cols-3 gap-5 border-t border-border pt-6">
            {trustStats.map((stat) =>
            <div key={stat.label}>
                <dd className="font-heading text-[22px] font-semibold tracking-[-0.02em]">{stat.value}</dd>
                <dt className="mt-0.5 text-xs leading-snug text-muted-foreground">{stat.label}</dt>
              </div>
            )}
          </dl>
        </motion.div>

        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: easeOut }}>
          <HeroPhone />
        </motion.div>
      </div>
    </section>);
}
