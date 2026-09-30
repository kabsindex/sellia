import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../shared/Logo';

const columns = [
{
  title: 'Produit',
  links: [
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Boutique exemple', href: '#demo-boutique' },
  { label: 'FAQ', href: '#faq' }]

},
{
  title: 'Ressources',
  links: [
  { label: 'Guide du vendeur', href: '#fonctionnement' },
  { label: 'Centre d’aide', href: '#faq' },
  { label: 'Nous contacter', href: '#faq' }]

},
{
  title: 'Légal',
  links: [
  { label: 'Conditions', href: '#' },
  { label: 'Confidentialité', href: '#' }]

}];


export function MarketingFooter() {
  return (
    <footer className="bg-background py-12">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-muted-foreground">
              Transforme ton WhatsApp en machine de vente.
            </p>
          </div>
          {columns.map((column) =>
          <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold text-foreground">
                {column.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) =>
              <li key={link.label}>
                    {link.href.startsWith('/') ?
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  
                        {link.label}
                      </Link> :

                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  
                        {link.label}
                      </a>
                }
                  </li>
              )}
              </ul>
            </nav>
          )}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground">© 2026 SELLIA</p>
          <p className="text-xs text-muted-foreground">Fait pour les vendeurs WhatsApp.</p>
        </div>
      </div>
    </footer>);

}
