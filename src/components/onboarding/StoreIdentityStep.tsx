import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Images, Loader2, Monitor, Smartphone, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { orderedCoverSuggestions } from '../../data/coverLibrary';
import { StoreThemePicker } from '../store/StoreThemePicker';
import { cn } from '../../utils/cn';
import type { Store } from '../../types';
import { uploadHeroImage, uploadImage } from '../../utils/api';



interface StoreIdentityStepProps {
  draft: Pick<Store, 'name' | 'logo' | 'cover' | 'coverMobile' | 'theme' | 'category' | 'plan'>;
  onPatch: (patch: Partial<Store>) => void;
}

async function imageDimensions(file: File): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossible de lire cette image.'));
    };
    image.src = url;
  });
}

export function StoreIdentityStep({ draft, onPatch }: StoreIdentityStepProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    if (!libraryOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLibraryOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [libraryOpen]);

  const librarySuggestions = orderedCoverSuggestions(draft.category);

  async function importLogo(file: File | undefined) {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const logo = await uploadImage(file);
      onPatch({ logo });
      toast.success('Logo importé.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import impossible.');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  }

  async function importCover(file: File | undefined) {
    if (!file) return;
    setUploadingCover(true);
    try {
      const { width, height } = await imageDimensions(file);
      const ratio = width / height;
      if (width < 1200 || height < 600 || ratio < 1.4 || ratio > 2.4) {
        toast.error(
          `Cette image mesure ${width} × ${height} px et ne convient pas. Taille conseillée : 1920 × 960 px (minimum 1200 × 600 px, format horizontal).`
        );
        return;
      }
      const { desktopUrl, mobileUrl } = await uploadHeroImage(file);
      onPatch({ cover: desktopUrl, coverMobile: mobileUrl });
      toast.success('Photo optimisée pour ordinateur et mobile.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import impossible.');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium">Logo de la boutique</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Importe un logo carré qui représente ta boutique.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-secondary">
            {draft.logo ?
            <img src={draft.logo} alt="Logo sélectionné" className="h-full w-full object-cover" /> :

            <span className="text-xs text-muted-foreground">Aucun</span>
            }
          </span>
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={uploadingLogo}
            className="flex size-12 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-brand bg-brand-soft text-brand-strong transition-colors hover:bg-brand/10 disabled:cursor-wait"
            aria-label={draft.logo ? 'Changer le logo de la boutique' : 'Importer le logo de la boutique'}>
            {uploadingLogo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            <span className="text-[9px] font-semibold">{draft.logo ? 'Changer' : 'Importer'}</span>
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(event) => void importLogo(event.target.files?.[0])} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Photo d’en-tête</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Importe ta photo ou choisis un modèle dans la bibliothèque. SELLIA prépare automatiquement les cadrages ordinateur et mobile.
        </p>

        <div className="mt-3 grid items-start gap-3 sm:grid-cols-[minmax(0,1.65fr)_minmax(110px,0.65fr)]">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Monitor className="size-3.5" /> Ordinateur
            </p>
            <div className="relative aspect-[2/1] overflow-hidden rounded-lg border border-border bg-secondary">
              {draft.cover ?
              <img src={draft.cover} alt="Aperçu ordinateur" className="size-full object-cover" /> :
              <span className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">Aucun visuel</span>}
            </div>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Smartphone className="size-3.5" /> Mobile
            </p>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-secondary">
              {draft.coverMobile ?
              <img src={draft.coverMobile} alt="Aperçu mobile" className="size-full object-cover" /> :
              <span className="absolute inset-0 grid place-items-center px-2 text-center text-[10px] text-muted-foreground">Généré à l’import</span>}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-dashed border-brand bg-brand-soft px-3 text-xs font-semibold text-brand-strong transition-colors hover:bg-brand/10 disabled:cursor-wait">
            {uploadingCover ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploadingCover ? 'Optimisation...' : draft.cover ? 'Importer une autre photo' : 'Importer ma photo'}
          </button>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand-strong">
            <Images className="size-4" />
            Voir la bibliothèque
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Import personnel : 1920 × 960 px conseillé. La bibliothèque contient {librarySuggestions.length} modèles prêts à l’emploi.
        </p>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(event) => void importCover(event.target.files?.[0])} />
      </div>

      <div>
        <p className="text-sm font-medium">Thème et couleur principale</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Emerald est inclus gratuitement. Prévisualise les thèmes Premium avant de faire ton choix.
        </p>
        <div className="mt-3">
          <StoreThemePicker
            value={draft.theme}
            plan={draft.plan}
            storeName={draft.name}
            logo={draft.logo}
            cover={draft.coverMobile || draft.cover}
            onChange={(theme) => onPatch({ theme })}
            showPreview
          />
        </div>
      </div>

      {libraryOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLibraryOpen(false);
          }}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cover-library-title"
            className="flex max-h-[92dvh] w-full max-w-[880px] flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-2xl sm:max-h-[86vh] sm:rounded-2xl">
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-background px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <h2 id="cover-library-title" className="font-heading text-lg font-semibold">
                  Bibliothèque d’images
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Les modèles adaptés à tes activités apparaissent en premier. Chaque choix inclut les deux cadrages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Fermer la bibliothèque">
                <X className="size-4" />
              </button>
            </header>

            <div className="overflow-y-auto overscroll-contain p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Monitor className="size-3.5" /> Aperçu ordinateur
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="size-3.5" /> Aperçu mobile
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {librarySuggestions.map(({ suggestion, recommended }) => {
                  const selected = draft.cover === suggestion.desktop && draft.coverMobile === suggestion.mobile;
                  return (
                    <button
                      key={suggestion.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        onPatch({ cover: suggestion.desktop, coverMobile: suggestion.mobile });
                        setLibraryOpen(false);
                        toast.success(`En-tête « ${suggestion.label} » appliqué.`);
                      }}
                      className={cn(
                        'group overflow-hidden rounded-xl border bg-card p-2 text-left transition-all hover:border-brand hover:shadow-soft',
                        selected ? 'border-brand ring-1 ring-brand' : 'border-border'
                      )}>
                      <span className="grid grid-cols-[minmax(0,1fr)_58px] gap-2">
                        <span className="relative aspect-[2/1] overflow-hidden rounded-lg bg-secondary">
                          <img
                            src={suggestion.desktop}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          {recommended && (
                            <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-1 text-[9px] font-semibold text-brand-strong shadow-sm backdrop-blur">
                              Pour vos activités
                            </span>
                          )}
                        </span>
                        <span className="aspect-[4/5] overflow-hidden rounded-lg bg-secondary">
                          <img
                            src={suggestion.mobile}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover"
                          />
                        </span>
                      </span>
                      <span className="flex items-center gap-3 px-1 pb-1 pt-2.5">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{suggestion.label}</span>
                          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                            {suggestion.description}
                          </span>
                        </span>
                        <span className={cn(
                          'grid size-7 shrink-0 place-items-center rounded-full border transition-colors',
                          selected
                            ? 'border-brand bg-brand text-brand-foreground'
                            : 'border-border text-muted-foreground group-hover:border-brand group-hover:text-brand-strong'
                        )}>
                          <Check className="size-3.5" />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>,
        document.body
      )}
    </div>);

}
