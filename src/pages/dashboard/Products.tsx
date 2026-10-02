import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Eye, EyeOff, MoreHorizontal, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, DsButton, EmptyState, IconButton, PageHeader, Price, SearchField, Segmented } from '../../components/ds';
import { ActionSheet } from '../../components/ds/ActionSheet';
import { ProductImage } from '../../components/shared/ProductImage';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { canPublishProduct } from '../../data/plans';
import type { Product } from '../../types';

type Filter = 'tous' | 'en-ligne' | 'masques' | 'promo' | 'rupture';
const filters: {id: Filter;label: string;}[] = [
{ id: 'tous', label: 'Tous' },
{ id: 'en-ligne', label: 'En ligne' },
{ id: 'masques', label: 'Masqués' },
{ id: 'promo', label: 'En promo' },
{ id: 'rupture', label: 'Rupture' }];

export function Products() {
  const navigate = useNavigate();
  const { products, categories, store, user, toggleProductHidden, duplicateProduct, deleteProduct } = useSellia();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('tous');
  const [menuProduct, setMenuProduct] = useState<Product | null>(null);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [premiumIntent, setPremiumIntent] = useState<{type: 'add';} | {type: 'publish';productId: string;} | null>(null);

  const visible = useMemo(() => products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
    filter === 'tous' ||
    filter === 'en-ligne' && !product.hidden ||
    filter === 'masques' && product.hidden ||
    filter === 'promo' && product.promo ||
    filter === 'rupture' && product.stock === 0;
    return matchesQuery && matchesFilter;
  }), [products, query, filter]);

  const currentPlan = user?.plan ?? store.plan;
  const published = products.filter((product) => !product.hidden).length;
  const atLimit = !canPublishProduct(currentPlan, published);

  const requestAccess = (intent: NonNullable<typeof premiumIntent>) => {
    setPremiumIntent(intent);
    setPremiumDialogOpen(true);
  };
  const handleAdd = () => atLimit ? requestAccess({ type: 'add' }) : navigate('/dashboard/produits/nouveau');

  useEffect(() => {
    if (currentPlan !== 'premium' || !premiumIntent || premiumDialogOpen) return;
    if (premiumIntent.type === 'add') {
      setPremiumIntent(null);
      navigate('/dashboard/produits/nouveau');
      return;
    }
    try {
      toggleProductHidden(premiumIntent.productId);
      toast.success('Produit remis en ligne.');
    } finally {
      setPremiumIntent(null);
    }
  }, [currentPlan, navigate, premiumDialogOpen, premiumIntent, toggleProductHidden]);

  function toggleVisibility(product: Product) {
    if (product.hidden && atLimit) {
      requestAccess({ type: 'publish', productId: product.id });
      return;
    }
    try {
      toggleProductHidden(product.id);
      toast.success(product.hidden ? 'Produit remis en ligne.' : 'Produit masqué.');
    } catch {
      requestAccess({ type: 'publish', productId: product.id });
    }
  }

  const options = filters.map((item) => ({ ...item }));

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="Produits"
        description={currentPlan === 'basic' ? `SELLIA Basic : ${published}/5 produits publiés` : `${products.length} produit${products.length > 1 ? 's' : ''} · illimités avec Premium`}
        actions={<DsButton onClick={handleAdd}><Plus className="size-4" />Ajouter un produit</DsButton>} />

      {atLimit &&
      <div className="mb-4 flex flex-col gap-3 rounded-[16px] p-4 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--ds-warn-soft)' }}>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--ds-warn)' }}>Tu as atteint la limite de l’offre Basic.</p>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--ds-warn)' }}>Passe à Premium pour publier plus de produits.</p>
          </div>
          <DsButton size="sm" variant="dark" onClick={() => requestAccess({ type: 'add' })}>Passer à Premium</DsButton>
        </div>
      }

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented label="Filtre des produits" value={filter} options={options} onChange={setFilter} />
        <SearchField value={query} onChange={setQuery} placeholder="Rechercher un produit" className="lg:w-[300px]" />
      </div>

      <div className="ds-card mt-4 overflow-hidden">
        {visible.length === 0 ?
        <EmptyState icon={Package} title={products.length === 0 ? 'Ajoute ton premier produit' : 'Aucun produit trouvé'} text={products.length === 0 ? 'Photo, prix, description : ton produit est en ligne en moins d’une minute.' : 'Essaie un autre filtre ou une autre recherche.'}>
            {products.length === 0 && <DsButton onClick={handleAdd}><Plus className="size-4" />Ajouter un produit</DsButton>}
          </EmptyState> :
        visible.map((product) => {
          const category = categories.find((item) => item.id === product.categoryId);
          const soldOut = product.stock === 0;
          return (
            <div key={product.id} className="ds-row">
              <button type="button" onClick={() => navigate(`/dashboard/produits/${product.id}`)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`Modifier ${product.name}`}>
                <span className="size-14 shrink-0 overflow-hidden rounded-[12px]" style={{ background: 'var(--ds-subtle)', opacity: product.hidden ? 0.55 : 1 }}><ProductImage src={product.images[0]} alt="" className="bg-transparent" imageClassName="p-1" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{product.name}</span>
                  <span className="ds-muted block truncate text-[12px]">{category?.name ?? 'Sans catégorie'} · {product.views} vue{product.views > 1 ? 's' : ''}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 sm:hidden">
                    <Price price={product.price} oldPrice={product.oldPrice} currency={store.currency} size="sm" />
                    {product.hidden ? <Badge>Masqué</Badge> : <Badge tone="accent">En ligne</Badge>}
                    {soldOut && <Badge tone="danger">Rupture</Badge>}
                  </span>
                </span>
              </button>
              <div className="hidden items-center gap-1.5 sm:flex">
                {product.hidden ? <Badge>Masqué</Badge> : <Badge tone="accent">En ligne</Badge>}
                {soldOut && <Badge tone="danger">Rupture</Badge>}
                {product.promo && <Badge tone="warn">Promo</Badge>}
              </div>
              <div className="hidden w-[88px] text-right sm:block"><Price price={product.price} oldPrice={product.oldPrice} currency={store.currency} size="sm" /></div>
              <IconButton label={`Actions pour ${product.name}`} small onClick={() => setMenuProduct(product)}><MoreHorizontal className="size-4" /></IconButton>
            </div>);
        })}
      </div>

      <ActionSheet
        open={Boolean(menuProduct)}
        title={menuProduct?.name ?? ''}
        subtitle={menuProduct?.hidden ? 'Masqué de la boutique' : 'En ligne'}
        onClose={() => setMenuProduct(null)}
        actions={menuProduct ? [
        { label: 'Modifier', icon: Pencil, onSelect: () => navigate(`/dashboard/produits/${menuProduct.id}`) },
        { label: 'Dupliquer', icon: Copy, onSelect: () => { duplicateProduct(menuProduct.id); toast.success('Produit dupliqué.'); } },
        { label: menuProduct.hidden ? 'Remettre en ligne' : 'Masquer', icon: menuProduct.hidden ? Eye : EyeOff, onSelect: () => toggleVisibility(menuProduct) },
        { label: 'Supprimer', icon: Trash2, danger: true, onSelect: () => { if (window.confirm(`Supprimer « ${menuProduct.name} » ?`)) { deleteProduct(menuProduct.id); toast.success('Produit supprimé.'); } } }] : []} />

      <PremiumUpgradeDialog open={premiumDialogOpen} context="products" onClose={() => { setPremiumDialogOpen(false); setPremiumIntent(null); }} />
    </div>);
}
