import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Reveal, useScript } from '../ds/motion';
import { PhoneFrame } from '../marketing/PhoneFrame';
import { MiniStorefront } from '../store/MiniStorefront';
import { ChaosChat, OrderChat } from './ChatScreens';
import { catalogue, sceneCategories, sceneProducts, sceneStore } from './scenes';

const { airForce } = sceneProducts;
// chat désorganisé (messages un à un) → lien envoyé → boutique → ajout → panier → commande WhatsApp
const durations = [900, 700, 700, 1500, 1700, 1600, 2000, 3400];
const lines = [{ product: airForce, quantity: 1 }];

const rows = [
{ before: 'Les mêmes photos et prix à renvoyer', after: 'Un catalogue permanent, toujours à jour', steps: [0, 1, 2, 3, 4] },
{ before: 'Les mêmes questions sur la taille, le stock', after: 'Tailles, couleurs et stock affichés', steps: [5, 6] },
{ before: 'Des commandes noyées dans les messages', after: 'Une commande prérempliée, suivie dans ton dashboard', steps: [7] }];

export function ProblemDemo() {
  const { ref, step, setStep } = useScript(durations);
  const screen = step <= 3 ? 'chat' : step === 4 ? 'shop' : step === 5 ? 'shop-added' : step === 6 ? 'cart' : 'order';
  const activeRow = rows.findIndex((row) => row.steps.includes(step));

  return (
    <section className="border-b py-14 lg:py-24" style={{ borderColor: 'var(--ds-border)' }}>
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal className="lg:order-2">
          <h2 className="ds-title text-[30px] leading-[1.08] tracking-[-0.03em] sm:text-[40px]">Tu vends déjà sur WhatsApp. Tout est juste dispersé.</h2>
          <p className="ds-muted mt-4 max-w-[480px] text-[15.5px] leading-relaxed">Garde WhatsApp pour la conversation. Laisse SELLIA porter le catalogue, le panier et le suivi.</p>
          <div className="ds-card mt-7 overflow-hidden">
            {rows.map((row, index) =>
            <button key={row.before} type="button" onClick={() => setStep(row.steps[0])} aria-pressed={activeRow === index} className="relative block w-full px-4 py-3.5 text-left" style={{ borderTop: index ? '1px solid var(--ds-border)' : 0 }}>
                {activeRow === index && <motion.span layoutId="problem-row" className="absolute inset-y-0 left-0 w-[3px]" style={{ background: 'var(--ds-accent)' }} />}
                <p className="ds-muted text-[13px] line-through decoration-[var(--ds-border)]">{row.before}</p>
                <p className="mt-1 flex items-center gap-2 text-[15px] font-semibold"><ArrowRight className="size-4 shrink-0" style={{ color: 'var(--ds-accent)' }} />{row.after}</p>
              </button>
            )}
          </div>
        </Reveal>

        <div ref={ref} className="flex justify-center lg:order-1 lg:justify-start">
          <div className="relative">
            <PhoneFrame className="w-[272px]" screenClassName="h-[540px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={screen === 'shop-added' ? 'shop' : screen} className="h-full" initial={{ opacity: 0, x: screen === 'chat' ? 0 : 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.28 }}>
                  {screen === 'chat' && <ChaosChat shown={Math.min(step + 2, 5)} linkSent={step === 3} />}
                  {(screen === 'shop' || screen === 'shop-added') && <MiniStorefront store={sceneStore} products={catalogue} categories={sceneCategories} cartCount={screen === 'shop-added' ? 1 : 0} addedIds={screen === 'shop-added' ? [airForce.id] : []} />}
                  {screen === 'cart' && <MiniStorefront store={sceneStore} products={catalogue} categories={sceneCategories} view="cart" lines={lines} cartCount={1} />}
                  {screen === 'order' && <OrderChat lines={lines} />}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
            <p className="ds-muted mt-3 text-center text-[12px]">Démonstration animée · données d’exemple</p>
          </div>
        </div>
      </div>
    </section>);
}
