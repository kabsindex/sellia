import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BellRing, Play } from 'lucide-react';
import { DsButton } from '../ds';
import { useScript } from '../ds/motion';
import { PhoneFrame } from '../marketing/PhoneFrame';
import { MiniStorefront } from '../store/MiniStorefront';
import { OrderChat } from './ChatScreens';
import { BrowserFrame, Scaled } from './Scaled';
import { DashboardDesktopShot } from './DashboardShots';
import { catalogue, sceneCategories, sceneProducts, sceneStore } from './scenes';
import { ease, spring } from '../../design/motion';

const { airForce, jordan } = sceneProducts;
// catalogue → +1 → +2 → panier prêt → message WhatsApp → commande reçue côté dashboard
const durations = [1600, 1300, 1300, 2200, 2600, 3600];
const lines = [{ product: airForce, quantity: 1 }, { product: jordan, quantity: 1 }];
const order = { id: 1024, customer: 'Jonathan K.', total: 140, status: 'nouvelle' as const, when: 'à l’instant' };

const points = ['0% de commission', '5 produits gratuits', 'Prête en quelques minutes'];

export function Hero() {
  const navigate = useNavigate();
  const { ref, step } = useScript(durations);
  const cartCount = step >= 3 ? 2 : step;
  const added = [step >= 1 ? airForce.id : '', step >= 2 ? jordan.id : ''].filter(Boolean);
  const screen = step <= 2 ? 'shop' : step === 3 ? 'cart' : 'chat';
  const orders = step >= 5 ? [order] : [];

  return (
    <section className="relative overflow-hidden border-b" style={{ borderColor: 'var(--ds-border)' }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--ds-border) 1px, transparent 1px)', backgroundSize: '22px 22px', maskImage: 'radial-gradient(ellipse 70% 60% at 70% 40%, #000 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 70% 40%, #000 30%, transparent 75%)' }} />
      <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-10 lg:pb-20 lg:pt-14">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <span className="ds-badge ds-badge--ink !h-7 !px-3 !text-[12px]">Boutique en ligne pour vendeurs WhatsApp</span>
          <h1 className="ds-title mt-5 text-[38px] leading-[1.03] tracking-[-0.035em] sm:text-[52px] lg:text-[58px]">
            Transforme ton WhatsApp en machine de vente
          </h1>
          <p className="ds-muted mt-5 max-w-[470px] text-[16px] leading-relaxed">
            Crée ta boutique, ajoute tes produits, partage ton lien. Tes clients choisissent, remplissent leur panier et t’envoient une commande déjà rédigée sur WhatsApp.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <DsButton size="lg" className="w-full sm:w-auto" onClick={() => navigate('/inscription')}>Créer ma boutique gratuitement<ArrowRight className="size-4" /></DsButton>
            <DsButton size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}><Play className="size-3.5 fill-current" />Voir la démo</DsButton>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium ds-muted">
            {points.map((point) => <li key={point} className="flex items-center gap-1.5"><span className="size-1.5 rounded-full" style={{ background: 'var(--ds-accent)' }} />{point}</li>)}
          </ul>
        </motion.div>

        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }} className="relative mx-auto w-full max-w-[640px] lg:max-w-none">
          <div className="relative hidden pb-12 sm:block">
            <BrowserFrame url="sellia.app/dashboard">
              <Scaled width={1040} height={600}><DashboardDesktopShot view="overview" products={[sceneProducts.airForce, sceneProducts.jordan, sceneProducts.newBalance]} orders={orders} /></Scaled>
            </BrowserFrame>
          </div>
          <div className="relative z-10 flex justify-center sm:absolute sm:-bottom-6 sm:-right-3 sm:block lg:-bottom-10 lg:-right-4">
            <PhoneFrame className="w-[250px] sm:w-[220px] lg:w-[236px]" screenClassName="h-[510px] sm:h-[440px] lg:h-[480px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={screen} className="h-full" initial={{ opacity: 0, x: screen === 'shop' ? 0 : 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.26 }}>
                  {screen === 'shop' && <MiniStorefront store={sceneStore} products={catalogue} categories={sceneCategories} cartCount={cartCount} addedIds={added} />}
                  {screen === 'cart' && <MiniStorefront store={sceneStore} products={catalogue} categories={sceneCategories} view="cart" lines={lines} cartCount={2} />}
                  {screen === 'chat' && <OrderChat lines={lines} />}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </div>
          <AnimatePresence>
            {step === 5 &&
            <motion.div key="notif" role="status" initial={{ opacity: 0, y: -10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ ...spring, delay: 0.35 }} className="ds-card absolute left-2 top-[-14px] z-20 flex items-center gap-2.5 px-3 py-2 sm:left-[-8px]" style={{ boxShadow: 'var(--ds-shadow-md)' }}>
                <span className="grid size-8 place-items-center rounded-[10px]" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}><BellRing className="size-4" /></span>
                <div><p className="text-[12.5px] font-bold leading-tight">Nouvelle commande #1024</p><p className="ds-muted text-[11px]">2 produits · 140$</p></div>
              </motion.div>
            }
          </AnimatePresence>
        </motion.div>
      </div>
    </section>);
}
