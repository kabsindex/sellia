import type { CartLine, CheckoutDetails, Store } from '../types';
import { formatPrice } from './format';

export function storefrontOrigin(): string {
  if (typeof window === 'undefined') return 'https://sellia.app';
  return window.location.origin;
}

export function storefrontUrl(slug: string): string {
  return `${storefrontOrigin()}/${encodeURIComponent(slug)}`;
}

export function storeUrl(store: Store): string {
  return storefrontUrl(store.slug);
}

export function productUrl(store: Store, slug: string): string {
  return `${storefrontUrl(store.slug)}/produit/${encodeURIComponent(slug)}`;
}

export function whatsappHref(phone: string, message: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

interface SingleProductPayload {
  name: string;
  slug: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

export function buildProductMessage(store: Store, item: SingleProductPayload): string {
  const lines: string[] = [
  `Bonjour 👋 Je souhaite passer une commande sur ${store.name}.`,
  '',
  `Produit : ${item.name}`];

  if (item.size) lines.push(`Taille : ${item.size}`);
  if (item.color) lines.push(`Couleur : ${item.color}`);
  lines.push(`Quantité : ${item.quantity}`);
  lines.push(`Prix : ${formatPrice(item.price, store.currency)}`);
  lines.push('');
  lines.push(`Total : ${formatPrice(item.price * item.quantity, store.currency)}`);
  lines.push('');
  lines.push(`Lien produit : ${productUrl(store, item.slug)}`);
  return lines.join('\n');
}

export function buildCartMessage(
store: Store,
lines: CartLine[],
details?: CheckoutDetails)
: string {
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const out: string[] = [`Bonjour 👋 Je souhaite passer une commande sur ${store.name}.`, ''];

  lines.forEach((line, index) => {
    out.push(`${index + 1}. ${line.name}`);
    if (line.size) out.push(`   Taille : ${line.size}`);
    if (line.color) out.push(`   Couleur : ${line.color}`);
    out.push(`   Quantité : ${line.quantity}`);
    out.push(`   Prix : ${formatPrice(line.price * line.quantity, store.currency)}`);
    out.push('');
  });

  out.push(`Total : ${formatPrice(total, store.currency)}`);

  if (details) {
    out.push('');
    out.push('Mes informations :');
    out.push(`Nom : ${details.name}`);
    out.push(`Téléphone : ${details.phone}`);
    if (details.address) out.push(`Adresse : ${details.address}`);
    if (details.city) out.push(`Ville : ${details.city}`);
    if (details.note) out.push(`Note : ${details.note}`);
  }

  out.push('');
  out.push(`Boutique : ${storeUrl(store)}`);
  return out.join('\n');
}

export function buildCustomerFollowUp(store: Store, customerName: string): string {
  return `Bonjour ${customerName} 👋 C'est ${store.name}. On a de nouveaux articles disponibles, découvre le catalogue ici : ${storeUrl(store)}`;
}

export function openWhatsApp(phone: string, message: string): void {
  window.open(whatsappHref(phone, message), '_blank', 'noopener,noreferrer');
}
