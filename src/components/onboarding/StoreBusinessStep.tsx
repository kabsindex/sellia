import React from 'react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { countryOptions } from '../../data/store';
import type { Store } from '../../types';

interface StoreBusinessStepProps {
  draft: Store;
  onPatch: (patch: Partial<Store>) => void;
}

export function StoreBusinessStep({ draft, onPatch }: StoreBusinessStepProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="whatsapp">Numéro WhatsApp de la boutique</Label>
        <Input
          id="whatsapp"
          type="tel"
          value={draft.whatsapp}
          onChange={(event) => onPatch({ whatsapp: event.target.value })}
          placeholder="+243 970 000 111"
          className="h-11" />
        
        <p className="text-xs text-muted-foreground">
          Toutes les commandes de tes clients arriveront sur ce numéro.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={draft.address}
          onChange={(event) => onPatch({ address: event.target.value })}
          placeholder="24, avenue Kasa-Vubu" />
        
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={draft.city}
            onChange={(event) => onPatch({ city: event.target.value })}
            placeholder="Kinshasa" />
          
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Pays</Label>
          <Select value={draft.country} onValueChange={(value) => onPatch({ country: value })}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Choisir un pays" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((option) =>
              <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description de la boutique</Label>
        <Textarea
          id="description"
          value={draft.description}
          onChange={(event) => onPatch({ description: event.target.value })}
          placeholder="Sneakers et streetwear sélectionnés à la main. Livraison 24h."
          rows={3} />
        
      </div>

      <fieldset className="space-y-2.5">
        <legend className="text-sm font-medium">Réseaux sociaux (optionnel)</legend>
        <div className="relative">
          <SiInstagram className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Compte Instagram"
            value={draft.instagram}
            onChange={(event) => onPatch({ instagram: event.target.value })}
            placeholder="Instagram"
            className="pl-9" />
          
        </div>
        <div className="relative">
          <SiTiktok className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Compte TikTok"
            value={draft.tiktok}
            onChange={(event) => onPatch({ tiktok: event.target.value })}
            placeholder="TikTok"
            className="pl-9" />
          
        </div>
        <div className="relative">
          <SiFacebook className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Page Facebook"
            value={draft.facebook}
            onChange={(event) => onPatch({ facebook: event.target.value })}
            placeholder="Facebook"
            className="pl-9" />
          
        </div>
      </fieldset>
    </div>);

}
