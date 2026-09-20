import React, { useRef, useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';
import { productImageLibrary } from '../../data/products';
import { ProductImage } from './ProductImage';
import { uploadImage } from '../../utils/api';

const library = Object.values(productImageLibrary);

interface ImagePickerProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  aspect?: 'square' | 'wide' | 'banner' | 'portrait';
  label?: string;
  hint?: string;
  showLibrary?: boolean;
  minWidth?: number;
  minHeight?: number;
  requiredAspectRatio?: number;
  aspectRatioTolerance?: number;
  dimensionError?: string;
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
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
      reject(new Error('Impossible de lire les dimensions de cette image.'));
    };
    image.src = url;
  });
}

export function ImagePicker({
  images,
  onChange,
  max = 5,
  aspect = 'square',
  label = 'Photos du produit',
  hint = 'Ajoute jusqu’à 5 photos. La première sera la photo principale.',
  showLibrary = true,
  minWidth,
  minHeight,
  requiredAspectRatio,
  aspectRatioTolerance = 0.12,
  dimensionError
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const available = library.filter((url) => !images.includes(url));
  const previewAspect = {
    square: 'aspect-square',
    wide: 'aspect-[16/9]',
    banner: 'aspect-[3/1]',
    portrait: 'aspect-[4/5]'
  }[aspect];

  function add(url: string) {
    if (images.length >= max) return;
    onChange([...images, url]);
  }

  function remove(url: string) {
    onChange(images.filter((item) => item !== url));
  }

  async function importFiles(files: FileList | null) {
    if (!files?.length) return;
    const replacesSingleImage = max === 1 && images.length === 1;
    const remaining = max - images.length;
    const selected = Array.from(files).slice(0, replacesSingleImage ? 1 : remaining);
    if (!selected.length) return;
    setUploading(true);
    try {
      for (const file of selected) {
        const { width, height } = await getImageDimensions(file);
        const ratio = width / height;
        const invalidSize = (minWidth && width < minWidth) || (minHeight && height < minHeight);
        const invalidRatio = requiredAspectRatio &&
          Math.abs(ratio - requiredAspectRatio) > requiredAspectRatio * aspectRatioTolerance;
        if (invalidSize || invalidRatio) {
          toast.error(
            dimensionError ?? `Dimensions insuffisantes (${width} × ${height} px).`
          );
          return;
        }
      }
      const uploaded = await Promise.all(selected.map(uploadImage));
      onChange(replacesSingleImage ? uploaded : [...images, ...uploaded]);
      toast.success(
        replacesSingleImage
          ? 'Photo remplacée.'
          : uploaded.length > 1 ? 'Photos importées.' : 'Photo importée.'
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import impossible.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>

      <div
        className={cn(
          'mt-3 grid gap-2',
          aspect === 'banner'
            ? 'grid-cols-1'
            : aspect === 'wide' || aspect === 'portrait'
              ? 'grid-cols-2 sm:grid-cols-3'
              : 'grid-cols-3 sm:grid-cols-4'
        )}>
        
        {images.map((url, index) =>
        <div
          key={url}
          className={cn(
            'group relative overflow-hidden rounded-xl border border-border bg-secondary',
            previewAspect
          )}>
          
            <ProductImage
              src={url}
              alt=""
              imageClassName={aspect === 'square' ? 'p-1.5' : 'object-cover p-0'} />
            {index === 0 &&
          <span className="absolute left-1.5 top-1.5 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Principale
              </span>
          }
            <button
            type="button"
            onClick={() => remove(url)}
            aria-label="Retirer cette photo"
            className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-ink/70 text-white transition-opacity">
            
              <X className="size-3" />
            </button>
          </div>
        )}

        {(images.length < max || max === 1) &&
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-secondary/40 p-2 text-center transition-colors hover:border-brand hover:bg-brand-soft disabled:cursor-wait',
            previewAspect
          )}>
            {uploading ? <Loader2 className="size-4 animate-spin text-brand" /> : <Upload className="size-4 text-brand" />}
            <span className="text-[10px] font-medium leading-tight text-muted-foreground">
              {uploading ? 'Import...' : images.length === max ? 'Changer' : 'Importer'}
            </span>
          </button>
        }
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={max > 1}
        className="sr-only"
        onChange={(event) => void importFiles(event.target.files)} />

      {showLibrary && available.length > 0 && images.length < max &&
      <div className="mt-3">
          <p className="text-xs text-muted-foreground">Bibliothèque d’exemples</p>
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
            {available.map((url) =>
          <button
            key={url}
            type="button"
            onClick={() => add(url)}
            className="size-14 shrink-0 overflow-hidden rounded-lg border border-border transition-all hover:border-brand hover:ring-2 hover:ring-brand/20"
            aria-label="Utiliser cette photo">
            
                <ProductImage src={url} alt="" imageClassName="p-1" />
              </button>
          )}
          </div>
        </div>
      }
    </div>);

}
