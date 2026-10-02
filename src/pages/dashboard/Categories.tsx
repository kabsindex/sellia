import { useState } from 'react';
import { Check, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { DsButton, EmptyState, Field, IconButton, PageHeader } from '../../components/ds';
import { CategoryIcon, categoryIconOptions, resolveCategoryIcon } from '../../components/shared/CategoryIcon';
import { useSellia } from '../../contexts/SelliaContext';

const suggestions = [
{ name: 'Nouveautés', icon: 'package' },
{ name: 'Promotions', icon: 'tag' },
{ name: 'Sacs', icon: 'shopping-bag' },
{ name: 'Montres', icon: 'watch' },
{ name: 'Parfums', icon: 'sparkles' }];

function IconPicker({ value, onChange }: {value: string;onChange: (value: string) => void;}) {
  return (
    <div role="radiogroup" aria-label="Icône de la catégorie" className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-6">
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
            className="grid aspect-square min-h-10 place-items-center rounded-[11px] transition-colors"
            style={selected ? { background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' } : { background: 'var(--ds-subtle)', color: 'var(--ds-muted)' }}>
            <Icon className="size-[18px]" />
          </button>);
      })}
    </div>);
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
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader title="Catégories" description="Elles apparaissent en cercles sur ta boutique, avec l’image de ton premier produit." />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <form onSubmit={handleAdd} className="ds-card p-4 lg:order-2">
          <h2 className="ds-title text-[16px]">Nouvelle catégorie</h2>
          <Field label="Nom" htmlFor="category-name" className="mt-3">
            <input id="category-name" className="ds-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Sacs à main" />
          </Field>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suggestions.filter((item) => !categories.some((category) => category.name.toLowerCase() === item.name.toLowerCase())).map((item) =>
            <button key={item.name} type="button" className="ds-chip" onClick={() => { setName(item.name); setIcon(item.icon); }}>{item.name}</button>
            )}
          </div>
          <p className="ds-label mt-4">Icône</p>
          <IconPicker value={icon} onChange={setIcon} />
          <DsButton type="submit" block className="mt-4" disabled={!name.trim()}><Plus className="size-4" />Créer la catégorie</DsButton>
        </form>

        <section className="ds-card overflow-hidden lg:order-1">
          <h2 className="ds-title px-4 pb-1 pt-4 text-[16px]">Mes catégories ({categories.length})</h2>
          {categories.length === 0 ?
          <EmptyState icon={Tags} title="Aucune catégorie" text="Crée-en une pour organiser ton catalogue." /> :
          categories.map((category) => {
            const count = products.filter((product) => product.categoryId === category.id).length;
            const editing = editingId === category.id;
            return (
              <div key={category.id} className="px-4 py-3" style={{ borderTop: '1px solid var(--ds-border)' }}>
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}>
                    <CategoryIcon slug={category.slug} icon={editing ? editingIcon : category.emoji} className="size-[20px]" />
                  </span>
                  {editing ?
                  <>
                      <input value={editingName} onChange={(event) => setEditingName(event.target.value)} className="ds-input min-w-0 flex-1" aria-label="Nouveau nom de la catégorie" autoFocus />
                      <IconButton label="Enregistrer" small onClick={() => { renameCategory(category.id, editingName.trim() || category.name, editingIcon); setEditingId(null); toast.success('Catégorie mise à jour.'); }}><Check className="size-4" /></IconButton>
                      <IconButton label="Annuler" small onClick={() => setEditingId(null)}><X className="size-4" /></IconButton>
                    </> :
                  <>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold">{category.name}</p>
                        <p className="ds-muted text-[12px]">{count} produit{count > 1 ? 's' : ''}</p>
                      </div>
                      <IconButton label={`Modifier ${category.name}`} small onClick={() => { setEditingId(category.id); setEditingName(category.name); setEditingIcon(resolveCategoryIcon(category.slug, category.emoji)); }}><Pencil className="size-4" /></IconButton>
                      <IconButton label={`Supprimer ${category.name}`} small onClick={() => { if (window.confirm(`Supprimer la catégorie « ${category.name} » ?`)) { deleteCategory(category.id); toast.success('Catégorie supprimée.'); } }}><Trash2 className="size-4" style={{ color: 'var(--ds-danger)' }} /></IconButton>
                    </>
                  }
                </div>
                {editing && <div className="mt-3"><IconPicker value={editingIcon} onChange={setEditingIcon} /></div>}
              </div>);
          })}
        </section>
      </div>
    </div>);
}
