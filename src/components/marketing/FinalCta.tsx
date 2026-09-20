import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function FinalCta() {
  const navigate = useNavigate();

  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-brand-soft px-6 py-14 text-center sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand/10 blur-2xl" />
          
          <h2 className="relative font-heading text-[28px] font-semibold leading-tight tracking-[-0.02em] text-brand-strong sm:text-[40px]">
            Ta boutique peut être en ligne aujourd’hui.
          </h2>
          <p className="relative mx-auto mt-4 max-w-[480px] text-[15px] leading-relaxed text-brand-strong/70">
            Crée ton catalogue, partage ton lien et laisse WhatsApp faire le reste.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="h-11 px-6" onClick={() => navigate('/inscription')}>
              Créer ma boutique
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 bg-card px-6"
              onClick={() => navigate('/connexion')}>
              
              J’ai déjà un compte
            </Button>
          </div>
        </div>
      </div>
    </section>);

}