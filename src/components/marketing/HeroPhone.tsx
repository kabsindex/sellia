import { AnimatePresence, motion } from 'framer-motion';
import { BellRing } from 'lucide-react';
import { PhoneFrame } from './PhoneFrame';
import { PhoneCart, PhoneChat, PhoneShop, sceneProducts } from './PhoneScreens';
import { useScript } from './motion';

const { airForce, jordan } = sceneProducts;
const catalogue = [airForce, jordan, sceneProducts.newBalance, sceneProducts.bag];
/** catalogue → +1 produit → +2 produits → panier prêt → message WhatsApp */
const durations = [1500, 1300, 1300, 2200, 3200];

export function HeroPhone() {
  const { ref, step } = useScript(durations);
  const cartCount = step >= 3 ? 2 : step;
  const added = [step >= 1 ? airForce.id : '', step >= 2 ? jordan.id : ''].filter(Boolean);
  const lines = [{ product: airForce, quantity: 1 }, { product: jordan, quantity: 1 }];
  const screen = step <= 2 ? 'shop' : step === 3 ? 'cart' : 'chat';

  return (
    <div ref={ref} className="flex justify-center lg:justify-end">
      <div className="relative">
      <div aria-hidden="true" className="absolute -inset-x-5 bottom-6 top-14 rounded-[44px] bg-brand-soft" />
      <PhoneFrame className="relative" screenClassName="h-[600px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            className="h-full"
            initial={{ opacity: 0, x: screen === 'shop' ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}>
            {screen === 'shop' && <PhoneShop products={catalogue} addedIds={added} cartCount={cartCount} />}
            {screen === 'cart' && <PhoneCart lines={lines} ready />}
            {screen === 'chat' && <PhoneChat lines={lines} />}
          </motion.div>
        </AnimatePresence>
      </PhoneFrame>

      <AnimatePresence>
        {step === 4 &&
        <motion.div
          key="notification"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26, delay: 0.5 }}
          role="status"
          className="absolute inset-x-0 -bottom-2 z-10 mx-auto flex w-[272px] max-w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-lift sm:inset-x-auto sm:-left-6 sm:bottom-16 sm:mx-0 lg:-left-10">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-strong">
              <BellRing className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold">Nouvelle commande #1024</p>
              <p className="text-[11px] text-muted-foreground">2 produits · 140$</p>
            </div>
          </motion.div>
        }
      </AnimatePresence>
      </div>
    </div>);
}

