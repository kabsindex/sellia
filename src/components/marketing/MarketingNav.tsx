import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../shared/Logo';

const links = [
{ href: '#fonctionnement', label: 'Fonctionnement' },
{ href: '#fonctionnalites', label: 'Fonctionnalités' },
{ href: '#tarifs', label: 'Tarifs' },
{ href: '#faq', label: 'FAQ' }];


export function MarketingNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1160px] items-center gap-6 px-5">
        <Link to="/" aria-label="SELLIA — accueil">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {links.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            
              {link.label}
            </a>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDemoOpen((value) => !value)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Voir la démo
              <ChevronDown className="size-3.5" />
            </button>
            {demoOpen &&
            <div className="absolute left-0 top-full z-50 mt-2 w-[260px] rounded-2xl border border-border bg-card p-3 shadow-lift">
                <button
                  type="button"
                  onClick={() => {
                    setDemoOpen(false);
                    navigate('/demo/basic');
                  }}
                  className="block w-full rounded-xl p-3 text-left hover:bg-secondary">
                  <span className="block text-sm font-semibold">Boutique Basic</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    Démo simple, gratuite, jusqu'à 5 produits.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDemoOpen(false);
                    navigate('/demo/premium');
                  }}
                  className="mt-1 block w-full rounded-xl p-3 text-left hover:bg-secondary">
                  <span className="block text-sm font-semibold">Boutique Premium</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    Démo avancée avec sections, avis et personnalisation.
                  </span>
                </button>
              </div>
            }
          </div>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" onClick={() => navigate('/connexion')}>
            Connexion
          </Button>
          <Button size="sm" onClick={() => navigate('/inscription')}>
            Créer ma boutique
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}>
          
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open &&
      <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <nav className="flex flex-col">
            {links.map((link) =>
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="rounded-lg px-1 py-2.5 text-sm font-medium text-muted-foreground">
            
                {link.label}
              </a>
          )}
          </nav>
          <div className="mt-3 grid gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                navigate('/demo/basic');
              }}>
              Voir la boutique Basic
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                navigate('/demo/premium');
              }}>
              Voir la boutique Premium
            </Button>
            <Button variant="outline" onClick={() => navigate('/connexion')}>
              Connexion
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                navigate('/inscription');
              }}>
              Créer ma boutique
            </Button>
          </div>
        </div>
      }
    </header>);

}
