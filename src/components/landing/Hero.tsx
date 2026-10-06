import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { DsButton } from '../ds';

export function Hero() {
  const navigate = useNavigate();

  function openMotionVideo() {
    window.dispatchEvent(new CustomEvent('sellia:open-motion-video'));
  }

  return (
    <section className="relative overflow-hidden border-b" style={{ borderColor: 'var(--ds-border)' }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(var(--ds-border) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 35%, #000 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 35%, #000 20%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[900px] flex-col items-center px-4 pb-16 pt-12 text-center sm:px-6 lg:pb-24 lg:pt-20">
        <span className="ds-badge ds-badge--ink !h-7 !px-3 !text-[12px]">
          Boutique en ligne pour vendeurs WhatsApp
        </span>

        <h1 className="ds-title mt-5 text-[40px] leading-[1.03] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]">
          Transforme ton WhatsApp en machine de vente
        </h1>

        <p className="ds-muted mt-5 max-w-[610px] text-[16px] leading-relaxed sm:text-[17px]">
          Crée ta boutique, présente tes produits clairement et laisse tes clients préparer leur commande avant de poursuivre la conversation sur WhatsApp.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-2.5 sm:w-auto sm:flex-row">
          <DsButton size="lg" className="w-full sm:w-auto" onClick={() => navigate('/inscription')}>
            Créer ma boutique gratuitement
            <ArrowRight className="size-4" />
          </DsButton>

          <DsButton
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={openMotionVideo}
            data-sellia-video-trigger
          >
            <Play className="size-3.5 fill-current" />
            Voir comment SELLIA fonctionne
          </DsButton>
        </div>

        <p className="ds-muted mt-5 max-w-[560px] text-[12.5px]">
          La démonstration complète du parcours SELLIA sera présentée dans la vidéo motion design.
        </p>
      </div>
    </section>
  );
}
