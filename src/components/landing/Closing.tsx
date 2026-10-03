import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { DsButton } from '../ds';
import { Reveal } from '../ds/motion';
import { Logo } from '../shared/Logo';
import { faq } from '../../data/landing';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-16 border-b py-14 lg:py-24" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-subtle)' }}>
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[minmax(0,1fr)] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
        <Reveal><h2 className="ds-title text-[30px] leading-[1.08] tracking-[-0.03em] sm:text-[40px]">Questions fréquentes</h2><p className="ds-muted mt-3 text-[15px]">Tout ce qu’il faut savoir avant de créer ta boutique.</p></Reveal>
        <div className="ds-card overflow-hidden">
          {faq.map((item, index) =>
          <div key={item.question} style={{ borderTop: index ? '1px solid var(--ds-border)' : 0 }}>
              <button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold">
                {item.question}
                <motion.span animate={{ rotate: open === index ? 45 : 0 }} className="grid size-7 shrink-0 place-items-center rounded-full" style={{ background: 'var(--ds-subtle)' }}><Plus className="size-4" /></motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden"><p className="ds-muted px-5 pb-4 text-[14.5px] leading-relaxed">{item.answer}</p></motion.div>}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>);
}

export function FinalCta() {
  const navigate = useNavigate();
  return (
    <section className="px-4 py-14 sm:px-6 lg:py-20">
      <Reveal>
        <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[28px] px-6 py-12 text-center sm:px-14 sm:py-16" style={{ background: 'var(--ds-ink)', color: '#fff' }}>
          <h2 className="ds-title mx-auto max-w-[640px] text-[30px] leading-[1.08] tracking-[-0.03em] sm:text-[42px]" style={{ color: '#fff' }}>Ta boutique peut être en ligne aujourd’hui.</h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[15.5px] leading-relaxed" style={{ color: 'rgb(255 255 255 / 0.68)' }}>Crée ton compte, ajoute tes premiers produits et partage ton lien. Tes clients commandent sur WhatsApp.</p>
          <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
            <DsButton size="lg" onClick={() => navigate('/inscription')}>Créer ma boutique gratuitement<ArrowRight className="size-4" /></DsButton>
            <DsButton size="lg" variant="outline" className="!border-white/20 !bg-transparent !text-white hover:!bg-white/10" onClick={() => navigate('/connexion')}>J’ai déjà un compte</DsButton>
          </div>
          <p className="mt-5 text-[12.5px]" style={{ color: 'rgb(255 255 255 / 0.5)' }}>0% de commission · 5 produits gratuits · Sans carte bancaire</p>
        </div>
      </Reveal>
    </section>);
}

const columns = [
{ title: 'Produit', links: [{ label: 'Fonctionnalités', href: '#fonctionnalites' }, { label: 'Tarifs', href: '#tarifs' }, { label: 'Boutique exemple', href: '#demo-boutique' }, { label: 'FAQ', href: '#faq' }] },
{ title: 'Ressources', links: [{ label: 'Guide du vendeur', href: '#demo' }, { label: 'Centre d’aide', href: '#faq' }, { label: 'Nous contacter', href: '#faq' }] },
{ title: 'Légal', links: [{ label: 'Conditions', href: '#' }, { label: 'Confidentialité', href: '#' }] }];

export function Footer() {
  return (
    <footer className="border-t pb-24 pt-12 lg:pb-12" style={{ borderColor: 'var(--ds-border)' }}>
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" aria-label="SELLIA"><Logo /></Link>
          <p className="ds-muted mt-3 max-w-[280px] text-[13.5px] leading-relaxed">La boutique en ligne des vendeurs WhatsApp.</p>
        </div>
        {columns.map((column) =>
        <nav key={column.title} aria-label={column.title}>
            <p className="text-[13px] font-semibold">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => <li key={link.label}><a href={link.href} className="ds-muted text-[13.5px] hover:underline">{link.label}</a></li>)}
            </ul>
          </nav>
        )}
      </div>
      <p className="ds-muted mx-auto mt-10 w-full max-w-[1200px] px-4 text-[12.5px] sm:px-6">© {new Date().getFullYear()} SELLIA. Tous droits réservés.</p>
    </footer>);
}
