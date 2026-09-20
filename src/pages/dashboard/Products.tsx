import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Copy,
  Eye,
  EyeOff,
  MoreVertical,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2 } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { CategoryIcon } from '../../components/shared/CategoryIcon';
import { ProductImage } from '../../components/shared/ProductImage';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'../../components/ui/DropdownMenu';
import { useSellia } from '../../contexts/SelliaContext';
import { formatPrice } from '../../utils/format';
import { canPublishProduct } from '../../data/plans';

type Filter = 'tous' | 'en-ligne' | 'masques' | 'promo' | 'rupture';

const filters: {id: Filter;label: string;}[] = [
{ id: 'tous', label: 'Tous' },
{ id: 'en-ligne', label: 'En ligne' },
{ id: 'masques', label: 'Masqués' },
{ id: 'promo', label: 'En promo' },
{ id: 'rupture', label: 'Rupture' }];


export function Products() {
  const navigate = useNavigate();
  const {
    products,
    categories,
    store,
    user,
    toggleProductHidden,
    duplicateProduct,
    deleteProduct
  } = useSellia();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('tous');
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [premiumIntent, setPremiumIntent] = useState<
    { type: 'add' } | { type: 'publish'; productId: string } | null
  >(null);

  const visible = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
      filter === 'tous' ||
      filter === 'en-ligne' && !product.hidden ||
      filter === 'masques' && product.hidden ||
      filter === 'promo' && product.promo ||
      filter === 'rupture' && product.stock === 0;
      return matchesQuery && matchesFilter;
    });
  }, [products, query, filter]);

  const currentPlan = user?.plan ?? store.plan;
  const publishedProducts = products.filter((product) => !product.hidden).length;
  const atLimit = !canPublishProduct(currentPlan, publishedProducts);

  const requestProductAccess = (intent: NonNullable<typeof premiumIntent>) => {
    setPremiumIntent(intent);
    setPremiumDialogOpen(true);
  };

  const handleAddProduct = () => {
    if (atLimit) {
      requestProductAccess({ type: 'add' });
      return;
    }
    navigate('/dashboard/produits/nouveau');
  };

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-[20px] font-semibold tracking-[-0.02em]">
            {products.length} produit{products.length > 1 ? 's' : ''}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {currentPlan === 'basic' ?
            `SELLIA Basic : ${publishedProducts}/5 produits publiés` :
            'Produits illimités'}
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          
          <Plus className="size-4" />
          Ajouter un produit
        </Button>
      </div>

      {atLimit &&
      <div className="rounded-2xl border border-brand/20 bg-brand-soft p-4 text-sm">
          <p className="font-semibold text-brand-strong">
            Vous avez atteint la limite de votre offre Basic.
          </p>
          <p className="mt-1 text-muted-foreground">
            Passez à SELLIA Premium pour ajouter des produits sans limite.
          </p>
          <Button
            className="mt-3"
            size="sm"
            onClick={() => requestProductAccess({ type: 'add' })}>
            Passer à Premium
          </Button>
        </div>
      }

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un produit…"
            className="pl-9"
            aria-label="Rechercher un produit" />
          
        </div>
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {filters.map((item) =>
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              filter === item.id ?
              'border-brand bg-brand-soft text-brand-strong' :
              'border-border bg-card text-muted-foreground hover:text-foreground'
            )}>
            
              {item.label}
            </button>
          )}
        </div>
      </div>

      {visible.length === 0 ?
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-secondary">
            <Package className="size-5 text-muted-foreground" />
          </span>
          <h3 className="mt-4 font-heading text-base font-semibold">Aucun produit trouvé</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Modifie ta recherche ou ajoute ton premier produit.
          </p>
          <Button className="mt-4" onClick={handleAddProduct}>
            <Plus className="size-4" />
            Ajouter un produit
          </Button>
        </div> :

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((product) => {
          const category = categories.find((item) => item.id === product.categoryId);
          return (
            <li
              key={product.id}
              className="group relative flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-shadow hover:shadow-lift">
              
                <Link
                to={`/dashboard/produits/${product.id}`}
                className="relative size-[76px] shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
                
                  <ProductImage src={product.images[0]} alt="" imageClassName="p-1.5" />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <Link
                    to={`/dashboard/produits/${product.id}`}
                    className="min-w-0 flex-1 truncate text-sm font-medium hover:underline">
                    
                      {product.name}
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Actions produit">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/produits/${product.id}`)}>
                          <Pencil className="size-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        onClick={() => {
                          duplicateProduct(product.id);
                          toast.success('Produit dupliqué (masqué par défaut).');
                        }}>
                        
                          <Copy className="size-4" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        onClick={() => {
                          if (product.hidden && atLimit) {
                            requestProductAccess({ type: 'publish', productId: product.id });
                            return;
                          }
                          try {
                            toggleProductHidden(product.id);
                            toast.success(
                              product.hidden ? 'Produit remis en ligne.' : 'Produit masqué.'
                            );
                          } catch {
                            requestProductAccess({ type: 'publish', productId: product.id });
                          }
                        }}>
                        
                          {product.hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                          {product.hidden ? 'Remettre en ligne' : 'Masquer'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          deleteProduct(product.id);
                          toast.success('Produit supprimé.');
                        }}>
                        
                          <Trash2 className="size-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {category ? (
                      <span className="inline-flex items-center gap-1.5">
                        <CategoryIcon slug={category.slug} icon={category.emoji} className="size-3.5" />
                        {category.name}
                      </span>
                    ) : 'Sans catégorie'}
                  </p>

                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold">
                      {formatPrice(product.price, store.currency)}
                    </span>
                    {product.oldPrice &&
                  <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.oldPrice, store.currency)}
                      </span>
                  }
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {product.hidden ?
                  <Badge variant="secondary" className="text-[10px]">
                        Masqué
                      </Badge> :

                  <Badge variant="outline" className="border-transparent bg-brand-soft text-[10px] text-brand-strong">
                        En ligne
                      </Badge>
                  }
                    {product.promo &&
                  <Badge variant="destructive" className="text-[10px]">
                        Promo
                      </Badge>
                  }
                    {product.stock === 0 ?
                  <Badge variant="secondary" className="text-[10px]">
                        Rupture
                      </Badge> :

                  <Badge variant="secondary" className="text-[10px]">
                        Stock {product.stock}
                      </Badge>
                  }
                  </div>
                </div>
              </li>);

        })}
        </ul>
      }
      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context="products"
        onClose={() => {
          setPremiumDialogOpen(false);
          setPremiumIntent(null);
        }}
      />
    </div>);

}
