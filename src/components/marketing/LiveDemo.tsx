import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardMock } from './DashboardMock';
import { PhoneFrame } from './PhoneFrame';
import { PhoneCart, PhoneChat, PhoneShop, sceneProducts } from './PhoneScreens';
import { Reveal, useScript } from './motion';

const { airForce, jordan, newBalance, bag } = sceneProducts;
const durations = [2600, 2400, 2200, 2800, 3600];
const steps = [
'Le vendeur ajoute un produit',
'Il apparaît aussitôt dans la boutique',
'Le client l’ajoute au panier',
'Il envoie sa commande sur WhatsApp',
'Le vendeur reçoit la commande'];

export function LiveDemo() {
  const { ref, step, setStep, reduce } = useScript(durations);
  const rail = useRef<HTMLOListElement>(null);

  // Sur mobile le rail défile horizontalement : garde l'étape active visible (sans scroller la page).
  useEffect(() => {
    const list = rail.current;
    const item = list?.children[step] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: item.offsetLeft - 20, behavior: reduce ? 'auto' : 'smooth' });
  }, [step, reduce]);
  const published = step >= 1;
  const products = published ? [bag, airForce, jordan, newBalance] : [airForce, jordan, newBalance];
  const dashboardProducts = published ? [bag, airForce, jordan] : [airForce, jordan];
  const lines = [{ product: bag, quantity: 1 }];
  const screen = step <= 2 ? 'shop' : step === 3 ? 'cart' : 'chat';
  const orders = step >= 4 ? [{ id: 1024, label: '1 produit', total: bag.price }] : [];

  return (
    <section id="demo" className="scroll-mt-16 border-b border-border bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal className="max-w-[640px]">
          <h2 className="font-heading text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[38px]">
            Du produit à la commande, sans rien coder.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Ce que le vendeur publie dans son tableau de bord apparaît dans sa boutique. Ce que le
            client commande arrive dans sa conversation WhatsApp.
          </p>
        </Reveal>

        <div ref={ref} className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[250px_minmax(0,1fr)_288px] lg:items-center">
          <ol ref={rail} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {steps.map((label, index) => {
              const active = step === index;
              return (
                <li key={label} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setStep(index)}
                    aria-current={active ? 'step' : undefined}
                    className={`relative w-[210px] overflow-hidden rounded-xl border px-3.5 py-3 text-left text-[13px] leading-snug transition-colors lg:w-full ${active ? 'border-brand bg-card font-medium shadow-soft' : 'border-border bg-card/60 text-muted-foreground hover:bg-card'}`}>
                    <span className="mr-2 font-heading text-[12px] text-brand">{index + 1}</span>
                    {label}
                    {active && !reduce &&
                    <motion.span
                      key={`${step}-bar`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: durations[step] / 1000, ease: 'linear' }}
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand" />
                    }
                  </button>
                </li>);
            })}
          </ol>

          <DashboardMock
            mode={step === 0 ? 'form' : 'list'}
            products={dashboardProducts}
            freshId={bag.id}
            draft={bag}
            orders={orders}
            className="min-w-0" />

          <div className="flex justify-center">
            <PhoneFrame screenClassName="h-[560px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={screen}
                  className="h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}>
                  {screen === 'shop' &&
                  <PhoneShop
                    products={products}
                    freshId={step === 1 ? bag.id : undefined}
                    addedIds={step >= 2 ? [bag.id] : []}
                    cartCount={step >= 2 ? 1 : 0} />
                  }
                  {screen === 'cart' && <PhoneCart lines={lines} ready />}
                  {screen === 'chat' && <PhoneChat lines={lines} />}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>);
}
