import type { Product } from '../types';

const img = {
  airForce: '/products/catalog-air-force-white.webp',
  airForceBlack: '/products/catalog-air-force-black.webp',
  tshirt: '/products/catalog-mediterranean-tee.webp',
  bag: '/products/catalog-taupe-handbag.webp',
  rolex: '/products/catalog-two-tone-watch.webp',
  newBalance: '/products/catalog-new-balance-silver.webp',
  blackCat: '/products/catalog-black-cat.webp',
  jordan4: '/products/catalog-jordan-bred.webp'
};

export const productImageLibrary = img;

export const demoProducts: Product[] = [
{
  id: 'p-1',
  name: 'Nike Air Force 1 07',
  slug: 'nike-air-force-1-07',
  description:
  'Air Force 1 blanche, silhouette classique, facile à porter avec tout. Disponible en tailles homme et femme.',
  price: 75,
  oldPrice: 90,
  categoryId: 'cat-sneakers',
  images: [img.airForce, img.airForceBlack],
  stock: 10,
  sizes: ['39', '40', '41', '42', '43', '44'],
  colors: [
  { name: 'Blanc', hex: '#f7f7f7' },
  { name: 'Noir', hex: '#111111' }],

  available: true,
  promo: true,
  featured: true,
  hidden: false,
  views: 1284,
  createdAt: '2026-08-28T09:12:00.000Z'
},
{
  id: 'p-2',
  name: 'New Balance 530 Silver',
  slug: 'new-balance-530-silver',
  description:
  'New Balance 530 grise et blanche, mesh respirant, confort quotidien et style rétro running.',
  price: 60,
  categoryId: 'cat-sneakers',
  images: [img.newBalance],
  stock: 12,
  sizes: ['39', '40', '41', '42', '43'],
  colors: [
  { name: 'Blanc', hex: '#efefef' },
  { name: 'Gris', hex: '#9aa0a6' }],

  available: true,
  promo: false,
  featured: true,
  hidden: false,
  views: 842,
  createdAt: '2026-09-01T14:02:00.000Z'
},
{
  id: 'p-3',
  name: 'T-shirt Casa Blanca',
  slug: 't-shirt-casa-blanca',
  description: 'T-shirt imprimé Casa Blanca, coupe relax, disponible en blanc et noir.',
  price: 22,
  oldPrice: 30,
  categoryId: 'cat-tshirts',
  images: [img.tshirt],
  stock: 24,
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [
  { name: 'Blanc', hex: '#f7f7f7' },
  { name: 'Noir', hex: '#1b1b1b' }],

  available: true,
  promo: true,
  featured: false,
  hidden: false,
  views: 611,
  createdAt: '2026-09-04T08:41:00.000Z'
},
{
  id: 'p-4',
  name: 'Sac femme taupe',
  slug: 'sac-femme-taupe',
  description: 'Sac à main élégant avec bandoulière, format pratique pour les sorties et le quotidien.',
  price: 35,
  categoryId: 'cat-sacs',
  images: [img.bag],
  stock: 8,
  sizes: ['Taille unique'],
  colors: [{ name: 'Taupe', hex: '#a58b7b' }],
  available: true,
  promo: false,
  featured: false,
  hidden: false,
  views: 388,
  createdAt: '2026-08-21T11:25:00.000Z'
},
{
  id: 'p-5',
  name: 'Rolex Datejust bicolore',
  slug: 'rolex-datejust-bicolore',
  description: 'Montre style Datejust bicolore argent et or, cadran clair, finition premium.',
  price: 120,
  oldPrice: 150,
  categoryId: 'cat-montres',
  images: [img.rolex],
  stock: 4,
  sizes: ['Taille unique'],
  colors: [
  { name: 'Argent', hex: '#c8c8c8' },
  { name: 'Or', hex: '#d4af37' }],
  available: true,
  promo: true,
  featured: true,
  hidden: false,
  views: 527,
  createdAt: '2026-09-07T16:10:00.000Z'
},
{
  id: 'p-6',
  name: 'Air Jordan Black Cat',
  slug: 'air-jordan-black-cat',
  description: 'Jordan noire full black, look premium, idéale pour les outfits streetwear.',
  price: 80,
  categoryId: 'cat-sneakers',
  images: [img.blackCat],
  stock: 5,
  sizes: ['40', '41', '42', '43', '44'],
  colors: [{ name: 'Noir', hex: '#1b1b1b' }],
  available: true,
  promo: false,
  featured: false,
  hidden: false,
  views: 249,
  createdAt: '2026-08-12T10:00:00.000Z'
},
{
  id: 'p-7',
  name: 'Air Jordan 4 Bred',
  slug: 'air-jordan-4-bred',
  description: 'Air Jordan 4 noire, grise et rouge. Modèle iconique, confortable et solide.',
  price: 65,
  categoryId: 'cat-sneakers',
  images: [img.jordan4],
  stock: 6,
  sizes: ['40', '41', '42', '43', '44'],
  colors: [
  { name: 'Noir', hex: '#1b1b1b' },
  { name: 'Rouge', hex: '#b8332c' }],
  available: true,
  promo: false,
  featured: true,
  hidden: false,
  views: 402,
  createdAt: '2026-09-09T09:30:00.000Z'
},
{
  id: 'p-8',
  name: 'Air Force 1 07 - édition limitée',
  slug: 'air-force-1-07-edition-limitee',
  description: 'Édition limitée blanche. Réservation par WhatsApp.',
  price: 78,
  categoryId: 'cat-sneakers',
  images: [img.airForce],
  stock: 0,
  sizes: ['41', '42', '43'],
  colors: [{ name: 'Blanc', hex: '#f3f3f3' }],
  available: false,
  promo: false,
  featured: false,
  hidden: true,
  views: 158,
  createdAt: '2026-07-30T13:20:00.000Z'
}];
