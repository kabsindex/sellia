import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, BellRing, Check, Copy, Users } from 'lucide-react';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { toast } from 'sonner';
import { DsButton } from '../ds';
import { Reveal, useScript } from '../ds/motion';
import { PhoneFrame } from '../marketing/PhoneFrame';
import { MiniStorefront } from '../store/MiniStorefront';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { BrowserFrame, Scaled } from './Scaled';
import { DashboardDesktopShot, DashboardMobileShot } from './DashboardShots';
import { catalogue, sceneCategories, sceneProducts, sceneStore } from './scenes';
import { spring } from '../../design/motion';

const { airForce, jordan, newBalance, bag } = sceneProducts;

/* ---------------- Storefront : 3 écrans réels, avec filtre de catégorie et favori animés ---------------- */
const catCycle = ['tout', 'sneakers', 'sacs', 'tout'];

export function StorefrontShowcase() {
  const navigate = useNavigate();
  const { ref, step } = useScript([1700, 1700, 1700, 1700]);
  const slugs = sceneCategories.map((category) => category.slug);
  const active = catCycle[step] === 'tout' ? 'tout' : slugs.find((slug) => slug.includes(catCycle[step].slice(0, 4))) ?? 'tout';
  const lines = [{ product: bag, quantity: 1 }, { product: airForce, quantity: 1 }];
  const phones = [
  { caption: 'Catalogue et catégories', node: <MiniStorefront store={sceneStore} products={catalogue} categories={sceneCategories} activeCategory={active} favoriteIds={step >= 2 ? [newBalance.id] : []} cartCount={0} /> },
  { caption: 'Fiche produit', node: <MiniStorefront store={sceneStore} products={catalogue} categories={sceneCategories} view="product" focus={jordan} /> },
  { caption: 'Panier et commande WhatsApp', node: <MiniStorefront store={sceneStore} products={catalogue} categories={sceneCategories} view="cart" lines={lines} cartCount={2} /> }];

  return (
    <section id="demo-boutique" className="scroll-mt-16 border-b py-14 lg:py-24" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-subtle)' }}>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="max-w-[620px]">
            <h2 className="ds-title text-[30px] leading-[1.08] tracking-[-0.03em] sm:text-[40px]">Ce que voient tes clients.</h2>
            <p className="ds-muted mt-3 text-[15.5px] leading-relaxed">Une vraie boutique mobile : rapide à parcourir, simple à commander.</p>
          </Reveal>
          <div className="flex gap-2"><DsButton variant="outline" onClick={() => navigate('/demo/basic')}>Boutique Basic</DsButton><DsButton onClick={() => navigate('/demo/premium')}>Boutique Premium</DsButton></div>
        </div>
        <div ref={ref} className="ds-scroll-x -mx-4 mt-10 snap-x gap-5 px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:justify-center lg:overflow-visible lg:px-0">
          {phones.map((phone, index) =>
          <div key={phone.caption} className={`shrink-0 snap-center ${index === 1 ? 'lg:-translate-y-6' : ''}`}>
              <PhoneFrame className="w-[272px]" screenClassName="h-[540px]">{phone.node}</PhoneFrame>
              <p className="mt-4 text-center text-[13.5px] font-semibold">{phone.caption}</p>
            </div>
          )}
        </div>
      </div>
    </section>);
}

/* ---------------- Dashboard : commandes qui arrivent, compteurs, notification, version mobile ---------------- */
const allOrders = [
{ id: 1024, customer: 'Jonathan K.', total: 140, status: 'nouvelle' as const, when: 'il y a 1 min' },
{ id: 1025, customer: 'Sarah I.', total: 65, status: 'nouvelle' as const, when: 'il y a 1 min' },
{ id: 1026, customer: 'Patrick N.', total: 95, status: 'nouvelle' as const, when: 'à l’instant' }];

const dashPoints = [
{ icon: BellRing, title: 'Chaque commande est enregistrée', text: 'Produits, tailles, total et coordonnées, avec un statut à faire avancer.' },
{ icon: Users, title: 'Tes clients au même endroit', text: 'Retrouve qui a commandé, combien, et réponds en un clic sur WhatsApp.' },
{ icon: BarChart3, title: 'Tes chiffres, sans tableur', text: 'Visiteurs, commandes et chiffre d’affaires, sur téléphone comme sur ordinateur.' }];

export function DashboardShowcase() {
  const { ref, step } = useScript([1400, 2000, 2000, 2000, 3200]);
  const orders = allOrders.slice(0, Math.min(step, 3));
  const latest = orders[orders.length - 1];
  const list = [airForce, jordan, newBalance];
  return (
    <section className="border-b py-14 lg:py-24" style={{ borderColor: 'var(--ds-border)' }}>
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-12">
        <Reveal>
          <h2 className="ds-title text-[30px] leading-[1.08] tracking-[-0.03em] sm:text-[40px]">Un dashboard pour tout piloter.</h2>
          <p className="ds-muted mt-3 max-w-[460px] text-[15.5px] leading-relaxed">Ajoute tes produits, suis tes commandes et tes clients. Le tout est pensé pour être utilisable d’une main sur téléphone.</p>
          <ul className="ds-card mt-7 overflow-hidden">
            {dashPoints.map((point, index) =>
            <li key={point.title} className="flex gap-3 p-4" style={{ borderTop: index ? '1px solid var(--ds-border)' : 0 }}>
                <span className="grid size-9 shrink-0 place-items-center rounded-[11px]" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}><point.icon className="size-[17px]" /></span>
                <div><h3 className="text-[14.5px] font-semibold">{point.title}</h3><p className="ds-muted mt-0.5 text-[13.5px] leading-relaxed">{point.text}</p></div>
              </li>
            )}
          </ul>
        </Reveal>
        <div ref={ref} className="relative pb-6 lg:pb-10">
          <BrowserFrame url="sellia.app/dashboard" className="lg:mr-14">
            <Scaled width={1040} height={600}><DashboardDesktopShot view="overview" products={list} orders={orders} /></Scaled>
          </BrowserFrame>
          <div className="absolute -bottom-2 right-0 hidden w-[196px] sm:block lg:-right-2">
            <PhoneFrame className="w-full !rounded-[30px] !p-[5px]" screenClassName="!h-auto !rounded-[25px]">
              <Scaled width={390} height={790}><DashboardMobileShot products={list} orders={orders} /></Scaled>
            </PhoneFrame>
          </div>
          <AnimatePresence mode="wait">
            {latest &&
            <motion.div key={latest.id} role="status" initial={{ opacity: 0, y: -12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={spring} className="ds-card absolute right-2 top-[-14px] z-10 flex items-center gap-2.5 px-3 py-2 lg:right-16" style={{ boxShadow: 'var(--ds-shadow-md)' }}>
                <span className="grid size-8 place-items-center rounded-[10px]" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}><BellRing className="size-4" /></span>
                <p className="text-[12.5px] font-bold">Nouvelle commande #{latest.id}</p>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </section>);
}

/* ---------------- Lien de la boutique : copier puis partager ---------------- */
const channels = [
{ label: 'Message WhatsApp', hint: 'Envoie-le à tes clients', icon: WhatsAppIcon },
{ label: 'Statut WhatsApp', hint: 'Visible 24 h par tes contacts', icon: WhatsAppIcon },
{ label: 'Bio Instagram', hint: 'Un lien permanent', icon: SiInstagram },
{ label: 'Bio TikTok', hint: 'Sous tes vidéos produit', icon: SiTiktok }];

export function LinkShare() {
  const { ref, step, setStep } = useScript([1800, 1700, 4200]);
  const copied = step >= 1;
  const on = step >= 2;
  function copy() {
    void navigator.clipboard?.writeText(`https://sellia.app/${sceneStore.slug}`);
    setStep(1);
    toast.success('Lien copié. Colle-le où tu veux.');
  }
  return (
    <section className="border-b py-14 lg:py-20" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-subtle)' }}>
      <div ref={ref} className="mx-auto grid w-full max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <Reveal>
          <h2 className="ds-title text-[28px] leading-[1.1] tracking-[-0.03em] sm:text-[36px]">Un seul lien, partout où tu vends déjà.</h2>
          <p className="ds-muted mt-3 max-w-[430px] text-[15.5px] leading-relaxed">Copie l’adresse de ta boutique une fois : elle fonctionne dans tes statuts, tes groupes et tes bios.</p>
          <div className="ds-card mt-6 flex max-w-[460px] items-center gap-2 p-1.5 pl-4">
            <span className="min-w-0 flex-1 truncate font-mono text-[14px]">sellia.app/{sceneStore.slug}</span>
            <DsButton size="sm" onClick={copy}>
              <AnimatePresence mode="wait" initial={false}><motion.span key={String(copied)} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.14 }} className="inline-flex items-center gap-1.5">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? 'Copié' : 'Copier'}</motion.span></AnimatePresence>
            </DsButton>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3">
          {channels.map((channel, index) =>
          <motion.div key={channel.label} animate={{ opacity: on ? 1 : 0.45, y: on ? 0 : 6 }} transition={{ duration: 0.4, delay: on ? index * 0.12 : 0 }} className="ds-card flex items-start gap-3 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-[11px]" style={{ background: 'var(--ds-subtle)' }}><channel.icon className="size-[18px]" /></span>
              <div><p className="text-[13.5px] font-semibold">{channel.label}</p><p className="ds-muted mt-0.5 text-[12px] leading-snug">{channel.hint}</p></div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);
}
