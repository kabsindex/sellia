import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Copy, Crown, Save, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/CSwitch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../../components/ui/Select';
import { ImagePicker } from '../../components/shared/ImagePicker';
import { CategoryIcon } from '../../components/shared/CategoryIcon';
import { ProductImage } from '../../components/shared/ProductImage';
import {
  PremiumUpgradeDialog,
  type PremiumUpgradeContext
} from '../../components/shared/PremiumUpgradeDialog';
import { TagInput } from '../../components/shared/TagInput';
import { ColorEditor } from '../../components/shared/ColorEditor';
import { useSellia } from '../../contexts/SelliaContext';
import { formatPrice } from '../../utils/format';
import { canPublishProduct } from '../../data/plans';
import type { ProductDraft } from '../../types';

const emptyDraft: ProductDraft = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  categoryId: '',
  images: [],
  stock: '10',
  sizes: [],
  colors: [],
  available: true,
  promo: false,
  featured: false,
  hidden: false
};

export function ProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    products,
    categories,
    store,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    user,
  } = useSellia();

  const existing = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  );

  const [draft, setDraft] = useState<ProductDraft>(() =>
  existing ?
  {
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
  } :
  { ...emptyDraft, categoryId: categories[0]?.id ?? '' }
  );
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [premiumContext, setPremiumContext] = useState<PremiumUpgradeContext>('products');

  const patch = (value: Partial<ProductDraft>) => setDraft((current) => ({ ...current, ...value }));

  const valid = draft.name.trim().length > 1 && Number(draft.price) > 0;
  const currentPlan = user?.plan ?? store.plan;
  const otherPublishedProducts = products.filter(
    (product) => !product.hidden && product.id !== existing?.id
  ).length;
  const publicationLimitReached = !draft.hidden && !canPublishProduct(currentPlan, otherPublishedProducts);

  const openPremiumDialog = (context: PremiumUpgradeContext) => {
    setPremiumContext(context);
    setPremiumDialogOpen(true);
  };

  function save() {
    if (publicationLimitReached) {
      openPremiumDialog('products');
      return;
    }
    if (currentPlan === 'basic' && draft.promo) {
      openPremiumDialog('promotions');
      return;
    }

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
        openPremiumDialog('products');
        return;
      }
      toast.success('Produit ajouté à ta boutique.');
    }
    navigate('/dashboard/produits');
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/produits')}>
          <ArrowLeft className="size-4" />
          Produits
        </Button>
        <h2 className="font-heading text-[18px] font-semibold tracking-[-0.02em]">
          {existing ? 'Modifier le produit' : 'Nouveau produit'}
        </h2>
        {existing &&
        <div className="ml-auto flex gap-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => {
              duplicateProduct(existing.id);
              toast.success('Produit dupliqué.');
              navigate('/dashboard/produits');
            }}>
            
              <Copy className="size-3.5" />
              Dupliquer
            </Button>
            <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={() => {
              deleteProduct(existing.id);
              toast.success('Produit supprimé.');
              navigate('/dashboard/produits');
            }}>
            
              <Trash2 className="size-3.5" />
              Supprimer
            </Button>
          </div>
        }
      </div>

      {publicationLimitReached &&
      <div className="rounded-2xl border border-brand/20 bg-brand-soft p-4 text-sm">
          <p className="font-semibold text-brand-strong">
            Vous avez atteint la limite de votre offre Basic.
          </p>
          <p className="mt-1 text-muted-foreground">
            Passez à SELLIA Premium pour ajouter des produits sans limite.
          </p>
          <Button className="mt-3" size="sm" onClick={() => openPremiumDialog('products')}>
            Passer à Premium
          </Button>
        </div>
      }

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <h3 className="font-heading text-sm font-semibold">Informations principales</h3>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  value={draft.name}
                  onChange={(event) => patch({ name: event.target.value })}
                  placeholder="Nike Air Jordan 4"
                  className="h-11" />
                
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={draft.description}
                  onChange={(event) => patch({ description: event.target.value })}
                  placeholder="Matière, état, taille conseillée, livraison…"
                  rows={4} />
                
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Prix ({store.currency})</Label>
                  <Input
                    id="price"
                    type="number"
                    inputMode="decimal"
                    value={draft.price}
                    onChange={(event) => patch({ price: event.target.value })}
                    placeholder="65" />
                  
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="oldPrice">Ancien prix</Label>
                  <Input
                    id="oldPrice"
                    type="number"
                    inputMode="decimal"
                    value={draft.oldPrice}
                    onChange={(event) => patch({ oldPrice: event.target.value })}
                    placeholder="85" />
                  
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    inputMode="numeric"
                    value={draft.stock}
                    onChange={(event) => patch({ stock: event.target.value })}
                    placeholder="10" />
                  
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={draft.categoryId} onValueChange={(value) => patch({ categoryId: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) =>
                    <SelectItem key={category.id} value={category.id}>
                        <span className="inline-flex items-center gap-2">
                          <CategoryIcon slug={category.slug} icon={category.emoji} className="size-4" />
                          {category.name}
                        </span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <ImagePicker images={draft.images} onChange={(images) => patch({ images })} />
          </section>

          <section className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <h3 className="font-heading text-sm font-semibold">Variantes</h3>
            <TagInput
              id="sizes"
              label="Tailles"
              values={draft.sizes}
              onChange={(sizes) => patch({ sizes })}
              placeholder="42"
              suggestions={['39', '40', '41', '42', '43', 'S', 'M', 'L', 'XL', 'Taille unique']} />
            
            <ColorEditor colors={draft.colors} onChange={(colors) => patch({ colors })} />
          </section>
        </div>

        <aside className="space-y-4">
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h3 className="font-heading text-sm font-semibold">Visibilité</h3>

            {[
            {
              key: 'hidden' as const,
              label: 'Masquer le produit',
              hint: 'Il reste dans ton tableau de bord mais disparaît de la boutique.',
              value: draft.hidden
            },
            {
              key: 'available' as const,
              label: 'Disponible à la commande',
              hint: 'Désactive si tu es en rupture.',
              value: draft.available
            },
            {
              key: 'promo' as const,
              label: 'En promotion',
              hint: 'Affiche un badge Promo sur la fiche.',
              value: draft.promo
            },
            {
              key: 'featured' as const,
              label: 'Produit vedette',
              hint: 'Mis en avant en page d’accueil.',
              value: draft.featured
            }].
            map((item) =>
            <div key={item.key} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <Label htmlFor={item.key} className="text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      {item.label}
                      {item.key === 'promo' && currentPlan === 'basic' &&
                      <Crown className="size-3.5 text-[#a87b1f]" aria-label="Fonction Premium" />}
                    </span>
                  </Label>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.hint}</p>
                </div>
                <Switch
                id={item.key}
                checked={item.value}
                onCheckedChange={(checked: boolean) => {
                  if (item.key === 'promo' && checked && currentPlan === 'basic') {
                    openPremiumDialog('promotions');
                    return;
                  }
                  patch({ [item.key]: checked } as Partial<ProductDraft>);
                }} />
              
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h3 className="font-heading text-sm font-semibold">Aperçu client</h3>
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <div className="aspect-square bg-secondary">
                {draft.images[0] ?
                <ProductImage src={draft.images[0]} alt="" imageClassName="p-3" /> :

                <div className="grid h-full place-items-center text-xs text-muted-foreground">
                    Ajoute une photo
                  </div>
                }
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium">{draft.name || 'Nom du produit'}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-semibold text-brand">
                    {formatPrice(Number(draft.price) || 0, store.currency)}
                  </span>
                  {draft.oldPrice &&
                  <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(Number(draft.oldPrice), store.currency)}
                    </span>
                  }
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <div className="sticky bottom-16 z-20 flex gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-lift backdrop-blur lg:bottom-4">
        <Button variant="ghost" className="flex-1" onClick={() => navigate('/dashboard/produits')}>
          Annuler
        </Button>
        <Button className="flex-1" disabled={!valid} onClick={save}>
          <Save className="size-4" />
          {existing ? 'Enregistrer' : 'Ajouter le produit'}
        </Button>
      </div>
      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context={premiumContext}
        onClose={() => setPremiumDialogOpen(false)}
      />
    </div>);

}
