import React from 'react';
import { Check, X } from 'lucide-react';

const before = [
'Tes produits disparaissent après 24h de statut',
'Tu renvoies les mêmes photos 30 fois par jour',
'Les clients demandent « c’est combien ? » sans arrêt',
'Aucune trace de tes commandes ni de tes clients'];


const after = [
'Un catalogue permanent, toujours accessible',
'Un lien unique que tu partages partout',
'Prix, tailles et couleurs affichés clairement',
'Commandes, clients et stats centralisés'];


export function WhySellia() {
  return (
    <section className="border-b border-border bg-secondary py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <div className="max-w-[660px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-whatsapp">
            Pourquoi SELLIA ?
          </p>
          <h2 className="mt-3 font-heading text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[36px]">
            Tes clients ne devraient pas parcourir 50 statuts WhatsApp pour trouver tes produits.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Avec SELLIA, ils découvrent ton catalogue, choisissent leurs produits et passent commande
            facilement.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="text-sm font-medium text-muted-foreground">Sans SELLIA</h3>
            <ul className="mt-4 space-y-3">
              {before.map((item) =>
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                    <X className="size-3" />
                  </span>
                  {item}
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-whatsapp/25 bg-brand-soft p-6 shadow-soft">
            <h3 className="text-sm font-medium text-foreground">Avec SELLIA</h3>
            <ul className="mt-4 space-y-3">
              {after.map((item) =>
              <li key={item} className="flex gap-3 text-sm text-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-whatsapp/25">
                    <Check className="size-3 text-whatsapp" />
                  </span>
                  {item}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);

}
