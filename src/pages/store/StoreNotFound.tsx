import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { useSellia } from '../../contexts/SelliaContext';
import { useStoreTheme } from '../../hooks/useStoreTheme';

export function StoreNotFound() {
  const { store } = useSellia();
  const theme = useStoreTheme(store.theme);

  return (
    <div className="mx-auto grid min-h-[60vh] w-full max-w-lg place-items-center px-5 py-16 text-center">
      <div>
        <span
          className="mx-auto grid size-12 place-items-center rounded-xl"
          style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
          <FileQuestion className="size-5" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
          Erreur 404
        </p>
        <h1 className="mt-2 font-heading text-[22px] font-semibold">Page introuvable</h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.muted }}>
          Cette page n’existe pas ou a été déplacée.
        </p>
        <Link
          to={`/${store.slug}`}
          className="mt-6 inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.accentText }}>
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
