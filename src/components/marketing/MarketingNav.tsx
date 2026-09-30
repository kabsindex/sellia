import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../shared/Logo';

const links = [
{ href: '#demo', label: 'Démo' },
{ href: '#fonctionnement', label: 'Fonctionnement' },
{ href: '#fonctionnalites', label: 'Fonctionnalités' },
{ href: '#tarifs', label: 'Tarifs' },
{ href: '#faq', label: 'FAQ' }];

export function MarketingNav() {
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
    <header
      className={`sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl transition-shadow ${
      scrolled ? 'border-border shadow-soft' : 'border-transparent'}`}>
      <div className="mx-auto flex h-16 w-full max-w-[1160px] items-center gap-6 px-5">
        <Link to="/" aria-label="SELLIA, accueil">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Navigation principale">
          {links.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              {link.label}
            </a>
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button variant="ghost" onClick={() => navigate('/connexion')}>
            Connexion
          </Button>
          <Button className="h-9 px-4" onClick={() => navigate('/inscription')}>
            Créer ma boutique
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto lg:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden border-t border-border bg-background lg:hidden">
            <nav className="flex flex-col px-5 pt-2" aria-label="Navigation mobile">
              {links.map((link) =>
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg py-3 text-[15px] font-medium text-foreground">
                  {link.label}
                </a>
            )}
            </nav>
            <div className="grid gap-2 px-5 pb-5 pt-2">
              <Button className="h-11" onClick={() => navigate('/inscription')}>
                Créer ma boutique gratuitement
              </Button>
              <Button variant="outline" className="h-11" onClick={() => navigate('/connexion')}>
                Connexion
              </Button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);
}
