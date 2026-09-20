import React, { useState } from 'react';
import { toast } from 'sonner';
import { Check, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import {
  CategoryIcon,
  categoryIconOptions,
  resolveCategoryIcon
} from '../../components/shared/CategoryIcon';
import { useSellia } from '../../contexts/SelliaContext';

const suggestions = [
  { name: 'Nouveautés', icon: 'package' },
  { name: 'Promotions', icon: 'tag' },
  { name: 'Sacs', icon: 'shopping-bag' },
  { name: 'Montres', icon: 'watch' },
  { name: 'Parfums', icon: 'sparkles' }
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

function IconPicker({ value, onChange, compact = false }: IconPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Icône de la catégorie"
      className={`grid gap-1.5 ${compact ? 'grid-cols-8 sm:grid-cols-12' : 'grid-cols-6 sm:grid-cols-8 lg:grid-cols-6'}`}
    >
      {categoryIconOptions.map((option) => {
        const Icon = option.icon;
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.value)}
            className={`grid aspect-square min-h-9 place-items-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
              selected
                ? 'border-brand bg-brand text-white'
                : 'border-border bg-background text-muted-foreground hover:border-brand hover:text-brand-strong'
            }`}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}

export function Categories() {
  const { categories, products, addCategory, renameCategory, deleteCategory } = useSellia();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tag');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingIcon, setEditingIcon] = useState('tag');

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    addCategory(name.trim(), icon);
    setName('');
    setIcon('tag');
    toast.success('Catégorie créée.');
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-2xl border border-border bg-card shadow-soft">
        <header className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <h2 className="font-heading text-sm font-semibold">
            Mes catégories ({categories.length})
          </h2>
          <Tags className="size-4 text-muted-foreground" />
        </header>

        {categories.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Aucune catégorie. Crée-en une pour organiser ton catalogue.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((category) => {
              const count = products.filter((product) => product.categoryId === category.id).length;
              const editing = editingId === category.id;
              return (
                <li key={category.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                      <CategoryIcon
                        slug={category.slug}
                        icon={editing ? editingIcon : category.emoji}
                        className="size-4.5"
                      />
                    </span>

                    {editing ? (
                      <>
                        <Input
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          className="min-w-0 flex-1"
                          aria-label="Nouveau nom de la catégorie"
                          autoFocus
                        />
                        <Button
                          size="icon-sm"
                          aria-label="Enregistrer"
                          onClick={() => {
                            renameCategory(
                              category.id,
                              editingName.trim() || category.name,
                              editingIcon
                            );
                            setEditingId(null);
                            toast.success('Catégorie mise à jour.');
                          }}
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Annuler"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{category.name}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            /{category.slug} · {count} produit{count > 1 ? 's' : ''}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Modifier ${category.name}`}
                          onClick={() => {
                            setEditingId(category.id);
                            setEditingName(category.name);
                            setEditingIcon(resolveCategoryIcon(category.slug, category.emoji));
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Supprimer ${category.name}`}
                          onClick={() => {
                            deleteCategory(category.id);
                            toast.success('Catégorie supprimée.');
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>

                  {editing && (
                    <div className="ml-12 mt-3">
                      <Label className="mb-2 block">Icône</Label>
                      <IconPicker value={editingIcon} onChange={setEditingIcon} compact />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <aside className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <h2 className="font-heading text-sm font-semibold">Nouvelle catégorie</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Les catégories apparaissent en filtres sur ta boutique publique.
        </p>

        <form onSubmit={handleAdd} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="categoryName">Nom</Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Sneakers"
            />
          </div>
          <div className="space-y-2">
            <Label>Icône</Label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
          <Button type="submit" className="w-full" disabled={!name.trim()}>
            <Plus className="size-4" />
            Créer la catégorie
          </Button>
        </form>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">Suggestions</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions
              .filter((item) => !categories.some((category) => category.name === item.name))
              .map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    addCategory(item.name, item.icon);
                    toast.success(`Catégorie « ${item.name} » créée.`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-brand hover:text-brand-strong"
                >
                  <CategoryIcon slug={item.name} icon={item.icon} className="size-3" />
                  {item.name}
                </button>
              ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
