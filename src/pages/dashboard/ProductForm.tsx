import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Crown, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, DsButton, Field, IconButton, PageHeader, Price, Toggle, discountPercent } from '../../components/ds';
import { ColorEditor } from '../../components/shared/ColorEditor';
import { ImagePicker } from '../../components/shared/ImagePicker';
import { ProductImage } from '../../components/shared/ProductImage';
import { PremiumUpgradeDialog, type PremiumUpgradeContext } from '../../components/shared/PremiumUpgradeDialog';
import { TagInput } from '../../components/shared/TagInput';
import { useSellia } from '../../contexts/SelliaContext';
import { canPublishProduct } from '../../data/plans';
import type { ColorOption } from '../../types';

interface ProductDraft {
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  categoryId: string;
  images: string[];
  stock: string;
  sizes: string[];
  colors: ColorOption[];
  available: boolean;
  promo: boolean;
  featured: boolean;
  hidden: boolean;
}

const emptyDraft: ProductDraft = {
  name: '', description: '', price: '', oldPrice: '', categoryId: '', images: [], stock: '10',
  sizes: [], colors: [], available: true, promo: false, featured: false, hidden: false
};

export function ProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, categories, store, addProduct, updateProduct, deleteProduct, duplicateProduct, user } = useSellia();
  const existing = useMemo(() => products.find((product) => product.id === productId), [products, productId]);
  const [draft, setDraft] = useState<ProductDraft>(() => existing ? {
    name: existing.name,
    description: existing.description,
    price: String(existing.price),
    oldPrice: existing.oldPrice ? String(existing.oldPrice) : '',
    categoryId: existing.categoryId,
    images: existing.images,
    stock: String(existing.stock),
    sizes: existing.sizes,
    colors: existing.colors,
    available: existing.available,
    promo: existing.promo,
    featured: existing.featured,
    hidden: existing.hidden
  } : { ...emptyDraft, categoryId: categories[0]?.id ?? '' });
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumContext, setPremiumContext] = useState<PremiumUpgradeContext>('products');
  const patch = (value: Partial<ProductDraft>) => setDraft((current) => ({ ...current, ...value }));
  const valid = draft.name.trim().length > 1 && Number(draft.price) > 0;
  const currentPlan = user?.plan ?? store.plan;
  const otherPublished = products.filter((product) => !product.hidden && product.id !== existing?.id).length;
  const limitReached = !draft.hidden && !canPublishProduct(currentPlan, otherPublished);
  const openPremium = (context: PremiumUpgradeContext) => {
    setPremiumContext(context);
    setPremiumOpen(true);
  };

  function save() {
    if (limitReached) return openPremium('products');
    if (currentPlan === 'basic' && draft.promo) return openPremium('promotions');
    const payload = {
      name: draft.name.trim(),
      description: draft.description,
      price: Number(draft.price) || 0,
      oldPrice: draft.oldPrice ? Number(draft.oldPrice) : undefined,
      categoryId: draft.categoryId,
      images: draft.images,
      stock: Number(draft.stock) || 0,
      sizes: draft.sizes,
      colors: draft.colors,
      available: draft.available,
      promo: draft.promo,
      featured: draft.featured,
      hidden: draft.hidden
    };
    if (existing) {
      updateProduct(existing.id, payload);
      toast.success('Produit mis à jour.');
    } else {
      try {
        addProduct(payload);
      } catch {
        return openPremium('products');
      }
      toast.success('Produit ajouté à ta boutique.');
    }
    navigate('/dashboard/produits');
  }

  const toggles = [
  { key: 'hidden' as const, label: 'Masquer le produit', hint: 'Il reste dans ton dashboard mais disparaît de la boutique.', value: draft.hidden },
  { key: 'available' as const, label: 'Disponible à la commande', hint: 'Désactive-le en cas de rupture.', value: draft.available },
  { key: 'promo' as const, label: 'En promotion', hint: 'Affiche un badge de remise sur la fiche.', value: draft.promo },
  { key: 'featured' as const, label: 'Produit vedette', hint: 'Mis en avant en page d’accueil.', value: draft.featured }];

  const price = Number(draft.price) || 0;
  const oldPrice = Number(draft.oldPrice) || undefined;
  const discount = discountPercent(price, oldPrice);

  return (
    <div className="mx-auto w-full max-w-[1100px] pb-24 lg:pb-0">
      <div className="mb-3"><IconButton label="Retour aux produits" onClick={() => navigate('/dashboard/produits')}><ArrowLeft className="size-[18px]" /></IconButton></div>
      <PageHeader
        title={existing ? 'Modifier le produit' : 'Nouveau produit'}
        description={existing ? existing.name : 'Les champs avec une photo, un nom et un prix suffisent pour publier.'}
        actions={<div className="hidden gap-2 lg:flex"><DsButton variant="outline" onClick={() => navigate('/dashboard/produits')}>Annuler</DsButton><DsButton disabled={!valid} onClick={save}>{existing ? 'Enregistrer' : 'Publier le produit'}</DsButton></div>} />

      {limitReached &&
      <div className="mb-4 flex flex-col gap-3 rounded-[16px] p-4 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--ds-warn-soft)' }}>
          <p className="text-[14px] font-semibold" style={{ color: 'var(--ds-warn)' }}>Tu as atteint la limite de l’offre Basic : passe à Premium pour publier ce produit.</p>
          <DsButton size="sm" variant="dark" onClick={() => openPremium('products')}>Passer à Premium</DsButton>
        </div>
      }

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-4">
          <section className="ds-card space-y-4 p-4 sm:p-5">
            <h2 className="ds-title text-[16px]">Informations</h2>
            <Field label="Nom du produit" htmlFor="name"><input id="name" className="ds-input" value={draft.name} onChange={(event) => patch({ name: event.target.value })} placeholder="Nike Air Jordan 4" /></Field>
            <Field label="Description" htmlFor="description"><textarea id="description" className="ds-input ds-textarea" value={draft.description} onChange={(event) => patch({ description: event.target.value })} placeholder="Matière, état, taille conseillée, livraison…" /></Field>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label={`Prix (${store.currency})`} htmlFor="price"><input id="price" type="number" inputMode="decimal" min="0" className="ds-input" value={draft.price} onChange={(event) => patch({ price: event.target.value })} placeholder="65" /></Field>
              <Field label="Ancien prix" htmlFor="oldPrice"><input id="oldPrice" type="number" inputMode="decimal" min="0" className="ds-input" value={draft.oldPrice} onChange={(event) => patch({ oldPrice: event.target.value })} placeholder="85" /></Field>
              <Field label="Stock" htmlFor="stock" className="col-span-2 sm:col-span-1"><input id="stock" type="number" inputMode="numeric" min="0" className="ds-input" value={draft.stock} onChange={(event) => patch({ stock: event.target.value })} placeholder="10" /></Field>
            </div>
            <Field label="Catégorie" htmlFor="category">
              <select id="category" className="ds-input" value={draft.categoryId} onChange={(event) => patch({ categoryId: event.target.value })}>
                <option value="">Sans catégorie</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </Field>
          </section>

          <section className="ds-card p-4 sm:p-5">
            <h2 className="ds-title mb-3 text-[16px]">Photos</h2>
            <ImagePicker images={draft.images} onChange={(images) => patch({ images })} />
          </section>

          <section className="ds-card space-y-5 p-4 sm:p-5">
            <h2 className="ds-title text-[16px]">Variantes</h2>
            <TagInput id="sizes" label="Tailles" values={draft.sizes} onChange={(sizes) => patch({ sizes })} placeholder="42" suggestions={['39', '40', '41', '42', '43', 'S', 'M', 'L', 'XL', 'Taille unique']} />
            <ColorEditor colors={draft.colors} onChange={(colors) => patch({ colors })} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="ds-card p-4">
            <h2 className="ds-title mb-1 text-[16px]">Visibilité</h2>
            {toggles.map((item) =>
            <div key={item.key} className="flex items-start gap-3 py-3" style={{ borderTop: '1px solid var(--ds-border)' }}>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[14px] font-semibold">{item.label}{item.key === 'promo' && currentPlan === 'basic' && <Crown className="size-3.5" style={{ color: '#a87b1f' }} aria-label="Fonction Premium" />}</p>
                  <p className="ds-muted mt-0.5 text-[12.5px] leading-relaxed">{item.hint}</p>
                </div>
                <Toggle label={item.label} checked={item.value} onChange={(checked) => {
                  if (item.key === 'promo' && checked && currentPlan === 'basic') return openPremium('promotions');
                  patch({ [item.key]: checked } as Partial<ProductDraft>);
                }} />
              </div>
            )}
          </section>

          <section className="ds-card p-4">
            <h2 className="ds-title text-[16px]">Aperçu dans la boutique</h2>
            <div className="ds-card ds-card--flat mt-3 overflow-hidden">
              <div className="relative aspect-square" style={{ background: 'var(--ds-subtle)' }}>
                {draft.images[0] ? <ProductImage src={draft.images[0]} alt="" className="bg-transparent" imageClassName="p-3" /> : <div className="grid h-full place-items-center text-[13px] ds-muted">Ajoute une photo</div>}
                {discount && <span className="absolute left-2 top-2"><Badge tone="danger">-{discount}%</Badge></span>}
              </div>
              <div className="p-3">
                <p className="truncate text-[13.5px] font-semibold">{draft.name || 'Nom du produit'}</p>
                <div className="mt-1"><Price price={price} oldPrice={oldPrice} currency={store.currency} /></div>
              </div>
            </div>
          </section>

          {existing &&
          <div className="grid grid-cols-2 gap-2">
              <DsButton variant="outline" onClick={() => { duplicateProduct(existing.id); toast.success('Produit dupliqué.'); navigate('/dashboard/produits'); }}><Copy className="size-4" />Dupliquer</DsButton>
              <DsButton variant="danger" onClick={() => { if (window.confirm(`Supprimer « ${existing.name} » ?`)) { deleteProduct(existing.id); toast.success('Produit supprimé.'); navigate('/dashboard/produits'); } }}><Trash2 className="size-4" />Supprimer</DsButton>
            </div>
          }
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden" style={{ background: 'color-mix(in srgb, var(--ds-card) 95%, transparent)', borderColor: 'var(--ds-border)' }}>
        <DsButton variant="outline" size="lg" onClick={() => navigate('/dashboard/produits')}>Annuler</DsButton>
        <DsButton size="lg" className="flex-1" disabled={!valid} onClick={save}>{existing ? 'Enregistrer' : 'Publier le produit'}</DsButton>
      </div>
      <PremiumUpgradeDialog open={premiumOpen} context={premiumContext} onClose={() => setPremiumOpen(false)} />
    </div>);
}
