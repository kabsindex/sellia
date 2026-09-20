import React from 'react';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { CategoryIcon } from '../shared/CategoryIcon';
import { ImagePicker } from '../shared/ImagePicker';
import { TagInput } from '../shared/TagInput';
import type { Category, ProductDraft } from '../../types';

interface FirstProductStepProps {
  draft: ProductDraft;
  categories: Category[];
  currency: string;
  onPatch: (patch: Partial<ProductDraft>) => void;
}

export function FirstProductStep({ draft, categories, currency, onPatch }: FirstProductStepProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="productName">Nom du produit</Label>
        <Input
          id="productName"
          value={draft.name}
          onChange={(event) => onPatch({ name: event.target.value })}
          placeholder="Nike Air Jordan 4"
          className="h-11" />
        
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="productPrice">Prix ({currency})</Label>
          <Input
            id="productPrice"
            type="number"
            inputMode="decimal"
            value={draft.price}
            onChange={(event) => onPatch({ price: event.target.value })}
            placeholder="65" />
          
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="productCategory">Catégorie</Label>
          <Select value={draft.categoryId} onValueChange={(value) => onPatch({ categoryId: value })}>
            <SelectTrigger id="productCategory">
              <SelectValue placeholder="Choisir" />
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

      <ImagePicker
        images={draft.images}
        onChange={(images) => onPatch({ images })}
        max={4}
        hint="Importe tes propres photos du produit."
        showLibrary={false} />
      

      <TagInput
        id="productSizes"
        label="Tailles disponibles (optionnel)"
        values={draft.sizes}
        onChange={(sizes) => onPatch({ sizes })}
        placeholder="42"
        suggestions={['40', '41', '42', '43', 'S', 'M', 'L']} />
      

      <div className="space-y-1.5">
        <Label htmlFor="productDescription">Description (optionnel)</Label>
        <Textarea
          id="productDescription"
          value={draft.description}
          onChange={(event) => onPatch({ description: event.target.value })}
          placeholder="Matière, état, détails de livraison…"
          rows={3} />
        
      </div>
    </div>);

}
