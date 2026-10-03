import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal, useScript } from '../ds/motion';
import { PhoneFrame } from '../marketing/PhoneFrame';
import { MiniStorefront } from '../store/MiniStorefront';
import { OrderChat } from './ChatScreens';
import { BrowserFrame, Scaled } from './Scaled';
import { DashboardDesktopShot } from './DashboardShots';
import { sceneCategories, sceneProducts, sceneStore } from './scenes';

const { airForce, jordan, newBalance, tee, watch, bag } = sceneProducts;
const durations = [2400, 1500, 2300, 1800, 2000, 1800, 2600, 3800];
const steps = [
'Le vendeur ajoute un produit',
'Il le publie',
'Il apparaît dans la boutique',
'Le client clique sur +',
'Le total évolue dans le panier',
'Le bouton WhatsApp s’active',
'La commande part sur WhatsApp',
'Nouvelle commande dans le dashboard'];

const before = [airForce, newBalance, tee, watch, jordan];
const order = { id: 1024, customer: 'Jonathan K.', total: bag.price + airForce.price, status: 'nouvelle' as const, when: 'à l’instant' };

export function ProductDemo() {
  const { ref, step, setStep, reduce } = useScript(durations);
  const rail = useRef<HTMLOListElement>(null);
  const published = step >= 2;
  const storeProducts = published ? [bag, ...before] : before;
  const view = step <= 1 ? 'form' : 'overview';
  const lines = [{ product: bag, quantity: 1 }, { product: airForce, quantity: 1 }];
  const phoneScreen = step <= 3 ? 'shop' : step <= 5 ? 'cart' : 'chat';
  const cartCount = step === 3 ? 1 : step >= 4 ? 2 : 0;
  const dashProducts = published ? [bag, airForce, jordan] : [airForce, jordan, newBalance];

  useEffect(() => {
    const list = rail.current;
    const item = list?.children[step] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: item.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  }, [step, reduce]);

  return (
    <section id="demo" className="scroll-mt-16 border-b py-14 lg:py-24" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-subtle)' }}>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <Reveal className="max-w-[660px]">
          <h2 className="ds-title text-[30px] leading-[1.08] tracking-[-0.03em] sm:text-[40px]">Du produit à la commande, en un seul parcours.</h2>
          <p className="ds-muted mt-3 text-[15.5px] leading-relaxed">Ce que tu publies dans ton dashboard apparaît dans ta boutique. Ce que ton client commande revient dans ton dashboard.</p>
        </Reveal>

        <div ref={ref} className="mt-9 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[230px_minmax(0,1fr)_272px] lg:items-center">
          <ol ref={rail} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
            {steps.map((label, index) => {
              const active = step === index;
              const done = step > index;
              return (
                <li key={label} className="shrink-0 lg:shrink">
                  <button type="button" onClick={() => setStep(index)} aria-current={active ? 'step' : undefined} className="relative flex w-[200px] items-center gap-2.5 overflow-hidden rounded-[12px] border px-3 py-2.5 text-left text-[13px] leading-snug transition-colors lg:w-full" style={{ borderColor: active ? 'var(--ds-accent)' : 'var(--ds-border)', background: active ? 'var(--ds-card)' : 'transparent', color: active ? 'var(--ds-ink)' : 'var(--ds-muted)', fontWeight: active ? 600 : 500 }}>
                    <span className="grid size-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold" style={{ background: active || done ? 'var(--ds-accent)' : 'var(--ds-border)', color: active || done ? 'var(--ds-accent-fg)' : 'var(--ds-muted)' }}>{index + 1}</span>
                    {label}
                    {active && !reduce && <motion.span key={`${step}-bar`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: durations[step] / 1000, ease: 'linear' }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left" style={{ background: 'var(--ds-accent)' }} />}
                  </button>
                </li>);
            })}
          </ol>

          <BrowserFrame url="sellia.app/dashboard" className="min-w-0">
            <Scaled width={1040} height={600}>
              <DashboardDesktopShot view={view} products={dashProducts} draft={bag} published={step === 1} freshId={published ? bag.id : undefined} orders={step >= 7 ? [order] : []} />
            </Scaled>
          </BrowserFrame>

          <div className="flex justify-center">
            <PhoneFrame className="w-[272px]" screenClassName="h-[540px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={phoneScreen} className="h-full" initial={{ opacity: 0, x: phoneScreen === 'shop' ? 0 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.26 }}>
                  {phoneScreen === 'shop' && <MiniStorefront store={sceneStore} products={storeProducts} categories={sceneCategories} cartCount={cartCount} freshId={step === 2 ? bag.id : undefined} addedIds={step === 3 ? [bag.id] : []} />}
                  {phoneScreen === 'cart' && <MiniStorefront store={sceneStore} products={storeProducts} categories={sceneCategories} view="cart" lines={lines} cartCount={2} cartReady={step >= 5} />}
                  {phoneScreen === 'chat' && <OrderChat lines={lines} />}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </div>
        </div>
        <p className="ds-muted mt-6 text-center text-[12px]">Interfaces réelles de SELLIA, avec des données d’exemple.</p>
      </div>
    </section>);
}
