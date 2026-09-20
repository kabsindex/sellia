import type { Order, OrderStatus } from '../types';
import { productImageLibrary as img } from './products';

export const orderStatusMeta: Record<
  OrderStatus,
  {label: string;className: string;dot: string;}> =
{
  nouvelle: {
    label: 'Nouvelle',
    className: 'bg-brand-soft text-brand-strong border-transparent',
    dot: 'bg-brand'
  },
  confirmee: {
    label: 'Confirmée',
    className: 'bg-sky-50 text-sky-700 border-transparent',
    dot: 'bg-sky-500'
  },
  preparation: {
    label: 'En préparation',
    className: 'bg-amber-50 text-amber-700 border-transparent',
    dot: 'bg-amber-500'
  },
  expediee: {
    label: 'Expédiée',
    className: 'bg-violet-50 text-violet-700 border-transparent',
    dot: 'bg-violet-500'
  },
  livree: {
    label: 'Livrée',
    className: 'bg-emerald-50 text-emerald-700 border-transparent',
    dot: 'bg-emerald-600'
  },
  annulee: {
    label: 'Annulée',
    className: 'bg-rose-50 text-rose-700 border-transparent',
    dot: 'bg-rose-500'
  }
};

export const orderStatusFlow: OrderStatus[] = [
'nouvelle',
'confirmee',
'preparation',
'expediee',
'livree'];


export const demoOrders: Order[] = [
{
  id: 'o-1',
  reference: 'XG-1042',
  customerName: 'Jonathan Kabeya',
  phone: '+243 971 223 004',
  address: '12, avenue de la Paix',
  city: 'Kinshasa',
  note: 'Livrer avant 18h si possible.',
  items: [
  {
    productId: 'p-1',
    name: 'Nike Air Jordan 4',
    image: img.sneaker1,
    price: 65,
    quantity: 1,
    size: '42',
    color: 'Noir'
  }],

  total: 65,
  status: 'nouvelle',
  createdAt: '2026-09-11T08:24:00.000Z',
  channel: 'whatsapp'
},
{
  id: 'o-2',
  reference: 'XG-1041',
  customerName: 'Sarah Ilunga',
  phone: '+243 990 551 208',
  address: 'Résidence Lemba, bât. C',
  city: 'Kinshasa',
  items: [
  {
    productId: 'p-3',
    name: 'T-shirt oversize Cream',
    image: img.tshirt,
    price: 18,
    quantity: 2,
    size: 'M',
    color: 'Crème'
  },
  {
    productId: 'p-6',
    name: 'Casquette structurée Noire',
    image: img.cap,
    price: 12,
    quantity: 1,
    size: 'Taille unique',
    color: 'Noir'
  }],

  total: 48,
  status: 'confirmee',
  createdAt: '2026-09-11T07:02:00.000Z',
  channel: 'whatsapp'
},
{
  id: 'o-3',
  reference: 'XG-1040',
  customerName: 'Merveille Tshibangu',
  phone: '+243 812 440 119',
  address: '8, rue Bandundu',
  city: 'Lubumbashi',
  items: [
  {
    productId: 'p-5',
    name: 'Hoodie Olive Heavy',
    image: img.hoodie,
    price: 38,
    quantity: 1,
    size: 'L',
    color: 'Olive'
  }],

  total: 38,
  status: 'preparation',
  createdAt: '2026-09-10T17:45:00.000Z',
  channel: 'catalogue'
},
{
  id: 'o-4',
  reference: 'XG-1039',
  customerName: 'Patrick Ngoy',
  phone: '+243 856 771 330',
  address: 'Quartier Ma Campagne',
  city: 'Kinshasa',
  items: [
  {
    productId: 'p-2',
    name: 'Runner Low Grey Fog',
    image: img.sneaker2,
    price: 55,
    quantity: 1,
    size: '43',
    color: 'Gris'
  },
  {
    productId: 'p-7',
    name: 'Sacoche nylon Daily',
    image: img.bag,
    price: 22,
    quantity: 1,
    size: 'Taille unique',
    color: 'Noir'
  }],

  total: 77,
  status: 'expediee',
  createdAt: '2026-09-09T12:15:00.000Z',
  channel: 'whatsapp'
},
{
  id: 'o-5',
  reference: 'XG-1038',
  customerName: 'Esther Mbala',
  phone: '+243 977 010 552',
  address: '45, avenue Kimbangu',
  city: 'Kinshasa',
  items: [
  {
    productId: 'p-4',
    name: 'Jean straight Indigo',
    image: img.jeans,
    price: 32,
    quantity: 1,
    size: '30',
    color: 'Indigo'
  }],

  total: 32,
  status: 'livree',
  createdAt: '2026-09-07T09:05:00.000Z',
  channel: 'whatsapp'
},
{
  id: 'o-6',
  reference: 'XG-1037',
  customerName: 'Yannick Bemba',
  phone: '+243 899 320 771',
  address: 'Gombe centre',
  city: 'Kinshasa',
  note: 'Client a changé d’avis.',
  items: [
  {
    productId: 'p-1',
    name: 'Nike Air Jordan 4',
    image: img.sneaker1,
    price: 65,
    quantity: 1,
    size: '44',
    color: 'Rouge'
  }],

  total: 65,
  status: 'annulee',
  createdAt: '2026-09-05T15:30:00.000Z',
  channel: 'catalogue'
}];