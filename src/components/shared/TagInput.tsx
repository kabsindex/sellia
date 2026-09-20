import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TagInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  label: string;
  id: string;
}

export function TagInput({
  values,
  onChange,
  placeholder = 'Ajouter…',
  suggestions = [],
  label,
  id
}: TagInputProps) {
  const [draft, setDraft] = useState('');

  function add(value: string) {
    const clean = value.trim();
    if (!clean || values.includes(clean)) return;
    onChange([...values, clean]);
    setDraft('');
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {values.length > 0 &&
      <ul className="flex flex-wrap gap-1.5">
          {values.map((value) =>
        <li key={value}>
              <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary px-2 py-1 text-xs font-medium">
                {value}
                <button
              type="button"
              onClick={() => onChange(values.filter((item) => item !== value))}
              aria-label={`Retirer ${value}`}
              className="text-muted-foreground hover:text-foreground">
              
                  <X className="size-3" />
                </button>
              </span>
            </li>
        )}
        </ul>
      }

      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add(draft);
            }
          }}
          placeholder={placeholder} />
        
        <Button type="button" variant="outline" size="icon" onClick={() => add(draft)} aria-label="Ajouter">
          <Plus className="size-4" />
        </Button>
      </div>

      {suggestions.filter((item) => !values.includes(item)).length > 0 &&
      <div className="flex flex-wrap gap-1.5">
          {suggestions.
        filter((item) => !values.includes(item)).
        map((item) =>
        <button
          key={item}
          type="button"
          onClick={() => add(item)}
          className="rounded-md border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-brand hover:text-brand-strong">
          
                + {item}
              </button>
        )}
        </div>
      }
    </div>);

}