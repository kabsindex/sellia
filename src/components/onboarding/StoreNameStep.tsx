import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { api } from '../../utils/api';
import { slugify } from '../../utils/format';
import { storefrontUrl } from '../../utils/whatsapp';

interface StoreNameStepProps {
  name: string;
  onChange: (name: string) => void;
  onAvailabilityChange: (available: boolean) => void;
}

type Availability = 'idle' | 'checking' | 'available' | 'unavailable';

export function StoreNameStep({
  name,
  onChange,
  onAvailabilityChange
}: StoreNameStepProps) {
  const slug = slugify(name) || 'tonnom';
  const [availability, setAvailability] = useState<Availability>('idle');
  const lastUnavailableName = useRef('');

  useEffect(() => {
    const normalizedName = name.trim().replace(/\s+/g, ' ');
    onAvailabilityChange(false);

    if (normalizedName.length < 2) {
      setAvailability('idle');
      return;
    }

    setAvailability('checking');
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const result = await api<{ available: boolean }>(
          `/stores/name-availability?name=${encodeURIComponent(normalizedName)}`,
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;

        if (result.available) {
          setAvailability('available');
          onAvailabilityChange(true);
          lastUnavailableName.current = '';
          toast.dismiss('store-name-unavailable');
          return;
        }

        setAvailability('unavailable');
        if (lastUnavailableName.current !== normalizedName) {
          lastUnavailableName.current = normalizedName;
          toast.error('Ce nom de boutique existe déjà. Choisis-en un autre.', {
            id: 'store-name-unavailable'
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          setAvailability('idle');
          onAvailabilityChange(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [name, onAvailabilityChange]);

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAvailability(event.target.value.trim().length >= 2 ? 'checking' : 'idle');
    onAvailabilityChange(false);
    onChange(event.target.value);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="storeName">Nom de ta boutique</Label>
        <Input
          id="storeName"
          value={name}
          onChange={handleNameChange}
          placeholder="Nom de ton commerce"
          className="h-11 text-base"
          aria-invalid={availability === 'unavailable'}
          autoFocus
        />

        <div className="h-5" aria-live="polite">
          {availability === 'checking' && (
            <p className="flex h-5 items-center gap-1.5 text-xs text-muted-foreground">
              <LoaderCircle className="size-3.5 animate-spin" />
              Vérification du nom...
            </p>
          )}
          {availability === 'available' && (
            <p className="flex h-5 items-center gap-1.5 text-xs text-brand-strong">
              <CheckCircle2 className="size-3.5" />
              Ce nom est disponible.
            </p>
          )}
          {availability === 'unavailable' && (
            <p className="flex h-5 items-center gap-1.5 text-xs text-destructive">
              <CircleAlert className="size-3.5" />
              Ce nom de boutique existe déjà.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-secondary/50 p-3.5">
        <p className="text-xs text-muted-foreground">Ton lien de boutique sera</p>
        <p
          className="mt-1 truncate font-mono text-sm font-medium text-brand-strong"
          title={storefrontUrl(slug)}
        >
          {storefrontUrl(slug)}
        </p>
      </div>
    </div>
  );
}
