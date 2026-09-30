import { BarChart3, BellRing, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardMock } from './DashboardMock';
import { sceneProducts } from './PhoneScreens';
import { Reveal, useScript } from './motion';

const durations = [1400, 2200, 2200, 2200, 3200];
const allOrders = [
{ id: 1024, label: '2 produits', total: 140 },
{ id: 1025, label: '1 produit', total: 65 },
{ id: 1026, label: '3 produits', total: 95 }];

const points = [
{ icon: BellRing, title: 'Chaque commande est enregistrée', text: 'Produits, taille, couleur, total et coordonnées du client.' },
{ icon: Users, title: 'Tes clients au même endroit', text: 'Retrouve qui a commandé, combien et quand relancer.' },
{ icon: BarChart3, title: 'Tes chiffres, sans tableur', text: 'Visites de ta boutique et chiffre d’affaires d’un coup d’œil.' }];

export function DashboardPreview() {
  const { ref, step } = useScript(durations);
  const orders = allOrders.slice(0, Math.min(step, 3));
  const latest = orders[orders.length - 1];

  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1160px] gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <Reveal>
          <h2 className="font-heading text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[36px]">
            Ton tableau de bord garde tout au même endroit.
          </h2>
          <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-muted-foreground">
            Ajoute et modifie tes produits, suis tes commandes et tes clients. Le tout depuis ton
            téléphone comme depuis ton ordinateur.
          </p>
          <ul className="mt-8 space-y-5">
            {points.map((point) =>
            <li key={point.title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-strong">
                  <point.icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{point.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{point.text}</p>
                </div>
              </li>
            )}
          </ul>
        </Reveal>

        <div ref={ref} className="relative min-w-0">
          <DashboardMock
            mode="list"
            products={[sceneProducts.airForce, sceneProducts.jordan]}
            orders={orders} />
          <AnimatePresence mode="wait">
            {latest &&
            <motion.div
              key={latest.id}
              role="status"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              className="absolute -top-3 right-2 z-10 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 shadow-lift sm:-right-3">
                <span className="grid size-7 place-items-center rounded-lg bg-brand text-brand-foreground">
                  <BellRing className="size-3.5" />
                </span>
                <p className="text-[12px] font-semibold">Nouvelle commande #{latest.id}</p>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </section>);
}
