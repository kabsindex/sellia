import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Search,
  Plus,
  Image as ImageIcon,
  MoreHorizontal,
} from 'lucide-react';
import { products } from '../../utils/mockData';

export function ProductsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Rechercher un produit..."
            icon={<Search size={18} />}
          />
        </div>
        <Button
          variant="primary"
          icon={<Plus size={18} />}
          className="w-full sm:w-auto"
        >
          Nouveau produit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <div className="group relative mb-4 flex aspect-video cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-5xl">
              {product.image}
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<ImageIcon size={16} />}
                >
                  Modifier l'image
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-1 flex items-start justify-between">
                <h3 className="text-lg font-bold text-sellia-text">
                  {product.name}
                </h3>
                <button
                  className="text-sellia-muted hover:text-sellia-text"
                  aria-label={`Options pour ${product.name}`}
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="mb-3 text-sm text-sellia-muted">
                {product.category}
              </div>

              <div className="mt-auto flex items-end justify-between">
                <div>
                  <div className="text-xl font-bold text-sellia-text">
                    {product.price.toFixed(2)} EUR
                  </div>
                  <div
                    className={`mt-1 text-xs ${
                      product.stock === 0
                        ? 'font-medium text-sellia-error'
                        : 'text-sellia-muted'
                    }`}
                  >
                    {product.stock === 0
                      ? 'Rupture de stock'
                      : `${product.stock} en stock`}
                  </div>
                </div>
                <div className="rounded-md bg-slate-100 px-2 py-1 text-xs text-sellia-muted">
                  {product.sales} ventes
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
