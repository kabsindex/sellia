import { demoCategories } from '../../data/categories';
import { demoProducts } from '../../data/products';
import { demoStore } from '../../data/store';
import type { Product, Store } from '../../types';

/** Boutique d'exemple utilisée dans toutes les démos de la landing (données de démonstration). */
export const sceneStore: Store = { ...demoStore, plan: 'premium', verificationStatus: 'verified', theme: 'emerald' };
export const sceneCategories = demoCategories;

const pick = (slug: string, fallback: number): Product => demoProducts.find((product) => product.slug === slug) ?? demoProducts[fallback];

export const sceneProducts = {
  airForce: pick('nike-air-force-1-07', 0),
  jordan: pick('air-jordan-4-bred', 5),
  newBalance: pick('new-balance-530-silver', 1),
  tee: pick('t-shirt-casa-blanca', 2),
  bag: pick('sac-femme-taupe', 3),
  watch: pick('rolex-datejust-bicolore', 4)
};

export const catalogue = [sceneProducts.airForce, sceneProducts.newBalance, sceneProducts.tee, sceneProducts.watch, sceneProducts.jordan, sceneProducts.bag];
export const sceneUrl = 'sellia.app/novamarket';
