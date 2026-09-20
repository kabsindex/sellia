import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { ColorOption } from '../../types';

const palette = [
{ name: 'Noir', hex: '#1b1b1b' },
{ name: 'Blanc', hex: '#f3f3f3' },
{ name: 'Rouge', hex: '#b8332c' },
{ name: 'Bleu', hex: '#2f4d7a' },
{ name: 'Olive', hex: '#5b6340' },
{ name: 'Crème', hex: '#e9e0d2' }];


interface ColorEditorProps {
  colors: ColorOption[];
  onChange: (colors: ColorOption[]) => void;
}

export function ColorEditor({ colors, onChange }: ColorEditorProps) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#1b1b1b');

  function add(color: ColorOption) {
    if (!color.name || colors.some((item) => item.name === color.name)) return;
    onChange([...colors, color]);
    setName('');
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Couleurs disponibles</p>

      {colors.length > 0 &&
      <ul className="flex flex-wrap gap-1.5">
          {colors.map((color) =>
        <li key={color.name}>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2 py-1 text-xs font-medium">
                <span
              className="size-3 rounded-full border border-black/10"
              style={{ backgroundColor: color.hex }} />
            
                {color.name}
                <button
              type="button"
              onClick={() => onChange(colors.filter((item) => item.name !== color.name))}
              aria-label={`Retirer ${color.name}`}
              className="text-muted-foreground hover:text-foreground">
              
                  <X className="size-3" />
                </button>
              </span>
            </li>
        )}
        </ul>
      }

      <div className="flex gap-2">
        <label className="sr-only" htmlFor="colorName">
          Nom de la couleur
        </label>
        <Input
          id="colorName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nom de la couleur" />
        
        <label className="sr-only" htmlFor="colorHex">
          Code couleur
        </label>
        <input
          id="colorHex"
          type="color"
          value={hex}
          onChange={(event) => setHex(event.target.value)}
          className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-border bg-card p-0.5" />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => add({ name, hex })}
          aria-label="Ajouter la couleur">
          
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {palette.
        filter((item) => !colors.some((color) => color.name === item.name)).
        map((item) =>
        <button
          key={item.name}
          type="button"
          onClick={() => add(item)}
          className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-brand hover:text-brand-strong">
          
              <span
            className="size-2.5 rounded-full border border-black/10"
            style={{ backgroundColor: item.hex }} />
          
              {item.name}
            </button>
        )}
      </div>
    </div>);

}