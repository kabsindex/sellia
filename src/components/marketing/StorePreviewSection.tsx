import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Crown, Link2, Smartphone, Store } from 'lucide-react';
import { Button } from '../ui/Button';
import { PhoneFrame } from './PhoneFrame';
import { MiniStorePreview } from './MiniStorePreview';

const highlights = [
{
  icon: Smartphone,
  title: 'Pensée pour le téléphone',
  description: 'Tes clients naviguent avec le pouce, comme sur Instagram.'
},
{
  icon: Link2,
  title: 'Un seul lien à partager',
  description: 'sellia.app/tonnom dans ta bio, tes statuts et tes groupes.'
}];


export function StorePreviewSection() {
  const navigate = useNavigate();

  return (
    <section id="demo-boutique" className="scroll-mt-16 border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1160px] gap-12 px-5 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Aperçu d’une boutique
          </p>
          <h2 className="mt-3 font-heading text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[36px]">
            Voilà ce que voient tes clients.
          </h2>
          <p className="mt-3 max-w-[480px] text-[15px] leading-relaxed text-muted-foreground">
            Une boutique propre, rapide et rassurante. Photos nettes, prix clairs, tailles
            disponibles, et un bouton pour commander directement sur WhatsApp.
          </p>

          <div className="mt-8 space-y-4">
            {highlights.map((item) =>
            <div key={item.title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-strong">
                  <item.icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <Store className="size-5 text-brand" />
              <h3 className="mt-3 text-sm font-semibold">SELLIA Basic</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Découvrez la boutique simple et efficace proposée gratuitement.
              </p>
              <Button className="mt-4 w-full" onClick={() => navigate('/demo/basic')}>
                Voir la démo Basic
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
            <div className="rounded-2xl border border-brand bg-card p-4 shadow-lift">
              <Crown className="size-5 text-brand" />
              <h3 className="mt-3 text-sm font-semibold">SELLIA Premium</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Découvrez une boutique avancée, personnalisable et pensée pour développer votre marque.
              </p>
              <Button className="mt-4 w-full" onClick={() => navigate('/demo/premium')}>
                Voir la démo Premium
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/inscription')}>
              Créer la mienne
            </Button>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-x-6 bottom-6 top-10 rounded-[40px] bg-brand-soft" />
            
            <PhoneFrame className="relative" screenClassName="h-[680px]">
              <MiniStorePreview />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>);

}
