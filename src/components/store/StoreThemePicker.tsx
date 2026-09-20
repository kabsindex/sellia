import React from 'react';
import { Check, Crown, LockKeyhole, Search, ShoppingBag, Store as StoreIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { storeThemes } from '../../utils/themes';
import type { PlanId, ThemeId } from '../../types';

interface StoreThemePickerProps {
  value: ThemeId;
  plan: PlanId;
  storeName?: string;
  logo?: string;
  cover?: string;
  onChange: (theme: ThemeId) => void;
  showPreview?: boolean;
}

export function StoreThemePicker({
  value,
  plan,
  storeName,
  logo,
  cover,
  onChange,
  showPreview = false
}: StoreThemePickerProps) {
  const selectedTheme = storeThemes[value] ?? storeThemes.emerald;
  const selectedThemeLocked = selectedTheme.premium && plan !== 'premium';

  return (
    <div className="space-y-4">
      <div className="grid gap-2.5 sm:grid-cols-2">
        {(Object.keys(storeThemes) as ThemeId[]).map((id) => {
          const theme = storeThemes[id];
          const selected = value === id;
          const locked = theme.premium && plan !== 'premium';

          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={cn(
                'group overflow-hidden rounded-xl border bg-card p-2 text-left transition-all hover:shadow-soft',
                selected ? 'ring-1' : 'border-border hover:border-muted-foreground/40'
              )}
              style={selected ? { borderColor: theme.accent, boxShadow: `0 0 0 1px ${theme.accent}` } : undefined}>
              <span
                className="relative block h-[76px] overflow-hidden rounded-lg border"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <span
                  className="flex h-5 items-center gap-1.5 border-b px-2"
                  style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}>
                  <span className="size-2 rounded-sm" style={{ backgroundColor: theme.accent }} />
                  <span className="h-1 w-12 rounded-full" style={{ backgroundColor: theme.text, opacity: 0.8 }} />
                  <span className="ml-auto size-1.5 rounded-full" style={{ backgroundColor: theme.muted }} />
                </span>
                <span className="grid grid-cols-[1.2fr_0.8fr] gap-1.5 p-2">
                  <span className="h-10 rounded-md p-1.5" style={{ backgroundColor: theme.accentSoft }}>
                    <span className="block h-1 w-10 rounded-full" style={{ backgroundColor: theme.text, opacity: 0.75 }} />
                    <span className="mt-1 block h-1 w-7 rounded-full" style={{ backgroundColor: theme.muted, opacity: 0.7 }} />
                    <span className="mt-2 block h-2.5 w-9 rounded" style={{ backgroundColor: theme.accent }} />
                  </span>
                  <span className="grid grid-cols-2 gap-1">
                    {[0, 1, 2, 3].map((item) => (
                      <span
                        key={item}
                        className="rounded-sm border"
                        style={{ backgroundColor: theme.card, borderColor: theme.border }}
                      />
                    ))}
                  </span>
                </span>
                <span
                  className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-semibold"
                  style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
                  {theme.premium ? <Crown className="size-2.5" /> : <Check className="size-2.5" />}
                  {theme.premium ? 'Premium' : 'Inclus'}
                </span>
              </span>

              <span className="flex items-start gap-2 px-1 pb-1 pt-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{theme.name}</span>
                  <span className="mt-0.5 block min-h-8 text-[11px] leading-4 text-muted-foreground">
                    {theme.description}
                  </span>
                </span>
                <span
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border"
                  style={selected
                    ? { backgroundColor: theme.accent, borderColor: theme.accent, color: theme.accentText }
                    : { borderColor: theme.border, color: theme.muted }}>
                  {selected ? (
                    <Check className="size-3.5" />
                  ) : locked ? (
                    <LockKeyhole className="size-3.5" />
                  ) : theme.premium ? (
                    <Crown className="size-3.5" />
                  ) : (
                    <span className="size-2 rounded-full" style={{ backgroundColor: theme.accent }} />
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {showPreview && (
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">Aperçu de la boutique</p>
            <span
              className="rounded-full px-2 py-1 text-[10px] font-semibold"
              style={{ backgroundColor: selectedTheme.accentSoft, color: selectedTheme.accent }}>
              {selectedTheme.name}
            </span>
          </div>
          <div
            className="mx-auto w-full max-w-[430px] overflow-hidden rounded-xl border shadow-soft"
            style={{
              backgroundColor: selectedTheme.surface,
              borderColor: selectedTheme.border,
              color: selectedTheme.text
            }}>
            <div
              className="flex h-12 items-center gap-2 border-b px-3"
              style={{ backgroundColor: selectedTheme.headerBg, borderColor: selectedTheme.border }}>
              {logo ? (
                <img src={logo} alt="" className="size-7 rounded-md object-cover" />
              ) : (
                <span
                  className="grid size-7 place-items-center rounded-md"
                  style={{ backgroundColor: selectedTheme.accentSoft, color: selectedTheme.accent }}>
                  <StoreIcon className="size-3.5" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] font-semibold">{storeName || 'Ma boutique'}</span>
                <span className="block text-[8px]" style={{ color: selectedTheme.muted }}>Boutique en ligne</span>
              </span>
              <Search className="size-3.5" style={{ color: selectedTheme.muted }} />
              <ShoppingBag className="size-3.5" style={{ color: selectedTheme.muted }} />
            </div>

            <div className="p-3">
              <div
                className="relative h-28 overflow-hidden rounded-lg"
                style={{ backgroundColor: selectedTheme.accentSoft }}>
                {cover && <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />}
                {cover && <span className="absolute inset-0 bg-black/35" />}
                <div
                  className="absolute inset-x-3 bottom-3"
                  style={{ color: cover ? '#ffffff' : selectedTheme.text }}>
                  <p className="text-sm font-semibold">Découvre notre sélection</p>
                  <span
                    className="mt-2 inline-flex h-6 items-center rounded-md px-2.5 text-[9px] font-semibold"
                    style={{ backgroundColor: selectedTheme.accent, color: selectedTheme.accentText }}>
                    Voir le catalogue
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex gap-1.5">
                {['Nouveautés', 'Populaires', 'Offres'].map((label, index) => (
                  <span
                    key={label}
                    className="rounded-full px-2 py-1 text-[8px] font-medium"
                    style={index === 0
                      ? { backgroundColor: selectedTheme.accent, color: selectedTheme.accentText }
                      : { backgroundColor: selectedTheme.accentSoft, color: selectedTheme.muted }}>
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((item) => (
                  <span
                    key={item}
                    className="overflow-hidden rounded-lg border"
                    style={{ backgroundColor: selectedTheme.card, borderColor: selectedTheme.border }}>
                    <span className="block h-10" style={{ backgroundColor: selectedTheme.accentSoft }} />
                    <span className="block p-1.5">
                      <span className="block h-1 w-3/4 rounded-full" style={{ backgroundColor: selectedTheme.text, opacity: 0.75 }} />
                      <span className="mt-1.5 block h-1 w-1/2 rounded-full" style={{ backgroundColor: selectedTheme.accent }} />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {selectedThemeLocked && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-muted-foreground">
              <LockKeyhole className="size-3.5 text-brand" />
              Aperçu disponible. L’activation de ce thème nécessite SELLIA Premium.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
