import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { DsButton, IconButton } from '../ds';
import { Logo } from '../shared/Logo';

const links = [
{ href: '#demo', label: 'Parcours' },
{ href: '#fonctionnalites', label: 'Fonctionnalités' },
{ href: '#demo-boutique', label: 'Boutique' },
{ href: '#tarifs', label: 'Tarifs' },
{ href: '#faq', label: 'FAQ' }];

export function Nav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl transition-shadow" style={{ background: 'color-mix(in srgb, var(--ds-bg) 88%, transparent)', borderColor: scrolled ? 'var(--ds-border)' : 'transparent', boxShadow: scrolled ? 'var(--ds-shadow-xs)' : 'none' }}>
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <Link to="/" aria-label="SELLIA, accueil"><Logo /></Link>
        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Navigation principale">
          {links.map((link) => <a key={link.href} href={link.href} className="rounded-full px-3.5 py-2 text-[14px] font-medium ds-muted transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-ink)]">{link.label}</a>)}
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <DsButton variant="ghost" size="sm" onClick={() => navigate('/connexion')}>Connexion</DsButton>
          <DsButton size="sm" onClick={() => navigate('/inscription')}>Créer ma boutique</DsButton>
        </div>
        <div className="ml-auto lg:hidden"><IconButton label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}</IconButton></div>
      </div>
      <AnimatePresence initial={false}>
        {open &&
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden border-t lg:hidden" style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-bg)' }}>
            <nav className="flex flex-col px-4 pt-2" aria-label="Navigation mobile">{links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-3 text-[15px] font-medium">{link.label}</a>)}</nav>
            <div className="grid gap-2 px-4 pb-4 pt-2"><DsButton size="lg" onClick={() => navigate('/inscription')}>Créer ma boutique gratuitement</DsButton><DsButton size="lg" variant="outline" onClick={() => navigate('/connexion')}>Connexion</DsButton></div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);
}

/** Barre d'inscription fixe sur mobile, visible après le hero. */
export function MobileCta() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible &&
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-x-0 bottom-0 z-40 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden" style={{ background: 'color-mix(in srgb, var(--ds-card) 95%, transparent)', borderColor: 'var(--ds-border)' }}>
          <DsButton size="lg" block onClick={() => navigate('/inscription')}>Créer ma boutique gratuitement<ArrowRight className="size-4" /></DsButton>
        </motion.div>
      }
    </AnimatePresence>);
}
