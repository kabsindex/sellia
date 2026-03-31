// Données mock centralisées pour SELLIA
// Simule un vendeur réel avec activité cohérente

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  sales: number;
  image: string;
  revenue: number;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  phone: string;
  productId: number;
  productName: string;
  productImage: string;
  amount: number;
  status: 'pending' | 'paid' | 'delivered';
  date: string;
  timestamp: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastActive: string;
  lastActiveTimestamp: number;
  tag: 'Nouveau' | 'Fidèle' | 'Régulier' | 'Inactif' | 'Gros acheteur';
  avatar?: string;
}

export interface Automation {
  id: number;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  message: string;
  performance: {
    sent?: number;
    recovered?: number;
    revenue?: number;
  };
}

// PRODUITS (6+)
export const products: Product[] = [
{
  id: 1,
  name: 'iPhone 13 Reconditionné',
  price: 549,
  stock: 3,
  category: 'Électronique',
  sales: 18,
  image: '📱',
  revenue: 9882
},
{
  id: 2,
  name: 'AirPods Pro',
  price: 189,
  stock: 12,
  category: 'Électronique',
  sales: 45,
  image: '🎧',
  revenue: 8505
},
{
  id: 3,
  name: 'T-shirt Oversize Premium',
  price: 35,
  stock: 28,
  category: 'Mode',
  sales: 67,
  image: '👕',
  revenue: 2345
},
{
  id: 4,
  name: 'Montre Connectée Sport',
  price: 129,
  stock: 0,
  category: 'Électronique',
  sales: 23,
  image: '⌚',
  revenue: 2967
},
{
  id: 5,
  name: 'Nike Air Max 2024',
  price: 145,
  stock: 8,
  category: 'Chaussures',
  sales: 31,
  image: '👟',
  revenue: 4495
},
{
  id: 6,
  name: 'Sac à Main Cuir',
  price: 89,
  stock: 15,
  category: 'Accessoires',
  sales: 29,
  image: '👜',
  revenue: 2581
}];


// CLIENTS (8+)
export const customers: Customer[] = [
{
  id: 1,
  name: 'Sophie Dubois',
  phone: '+33 6 12 34 56 78',
  orders: 8,
  totalSpent: 1247,
  lastActive: 'Il y a 2h',
  lastActiveTimestamp: Date.now() - 2 * 60 * 60 * 1000,
  tag: 'Gros acheteur'
},
{
  id: 2,
  name: 'Thomas Martin',
  phone: '+33 6 98 76 54 32',
  orders: 5,
  totalSpent: 678,
  lastActive: 'Hier',
  lastActiveTimestamp: Date.now() - 24 * 60 * 60 * 1000,
  tag: 'Fidèle'
},
{
  id: 3,
  name: 'Marie Leclerc',
  phone: '+33 6 11 22 33 44',
  orders: 1,
  totalSpent: 189,
  lastActive: "Aujourd'hui",
  lastActiveTimestamp: Date.now() - 3 * 60 * 60 * 1000,
  tag: 'Nouveau'
},
{
  id: 4,
  name: 'Lucas Bernard',
  phone: '+33 6 55 44 33 22',
  orders: 3,
  totalSpent: 423,
  lastActive: 'Il y a 3 jours',
  lastActiveTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
  tag: 'Inactif'
},
{
  id: 5,
  name: 'Emma Rousseau',
  phone: '+33 6 77 88 99 00',
  orders: 4,
  totalSpent: 534,
  lastActive: 'Il y a 5h',
  lastActiveTimestamp: Date.now() - 5 * 60 * 60 * 1000,
  tag: 'Régulier'
},
{
  id: 6,
  name: 'Alexandre Petit',
  phone: '+33 6 33 44 55 66',
  orders: 2,
  totalSpent: 324,
  lastActive: 'Il y a 1 semaine',
  lastActiveTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
  tag: 'Régulier'
},
{
  id: 7,
  name: 'Chloé Moreau',
  phone: '+33 6 22 11 00 99',
  orders: 6,
  totalSpent: 892,
  lastActive: "Aujourd'hui",
  lastActiveTimestamp: Date.now() - 1 * 60 * 60 * 1000,
  tag: 'Fidèle'
},
{
  id: 8,
  name: 'Hugo Lefebvre',
  phone: '+33 6 88 77 66 55',
  orders: 1,
  totalSpent: 145,
  lastActive: 'Il y a 2 semaines',
  lastActiveTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
  tag: 'Inactif'
}];


// COMMANDES (10+)
export const orders: Order[] = [
{
  id: '#1058',
  customerId: 3,
  customerName: 'Marie Leclerc',
  phone: '+33 6 11 22 33 44',
  productId: 2,
  productName: 'AirPods Pro',
  productImage: '🎧',
  amount: 189,
  status: 'pending',
  date: "Aujourd'hui, 15:30",
  timestamp: Date.now() - 2 * 60 * 60 * 1000
},
{
  id: '#1057',
  customerId: 7,
  customerName: 'Chloé Moreau',
  phone: '+33 6 22 11 00 99',
  productId: 6,
  productName: 'Sac à Main Cuir',
  productImage: '👜',
  amount: 89,
  status: 'paid',
  date: "Aujourd'hui, 14:15",
  timestamp: Date.now() - 3 * 60 * 60 * 1000
},
{
  id: '#1056',
  customerId: 1,
  customerName: 'Sophie Dubois',
  phone: '+33 6 12 34 56 78',
  productId: 1,
  productName: 'iPhone 13 Reconditionné',
  productImage: '📱',
  amount: 549,
  status: 'paid',
  date: "Aujourd'hui, 11:20",
  timestamp: Date.now() - 6 * 60 * 60 * 1000
},
{
  id: '#1055',
  customerId: 5,
  customerName: 'Emma Rousseau',
  phone: '+33 6 77 88 99 00',
  productId: 3,
  productName: 'T-shirt Oversize Premium',
  productImage: '👕',
  amount: 35,
  status: 'delivered',
  date: 'Hier, 18:45',
  timestamp: Date.now() - 24 * 60 * 60 * 1000
},
{
  id: '#1054',
  customerId: 2,
  customerName: 'Thomas Martin',
  phone: '+33 6 98 76 54 32',
  productId: 5,
  productName: 'Nike Air Max 2024',
  productImage: '👟',
  amount: 145,
  status: 'delivered',
  date: 'Hier, 16:30',
  timestamp: Date.now() - 25 * 60 * 60 * 1000
},
{
  id: '#1053',
  customerId: 1,
  customerName: 'Sophie Dubois',
  phone: '+33 6 12 34 56 78',
  productId: 2,
  productName: 'AirPods Pro',
  productImage: '🎧',
  amount: 189,
  status: 'delivered',
  date: 'Hier, 10:15',
  timestamp: Date.now() - 31 * 60 * 60 * 1000
},
{
  id: '#1052',
  customerId: 7,
  customerName: 'Chloé Moreau',
  phone: '+33 6 22 11 00 99',
  productId: 3,
  productName: 'T-shirt Oversize Premium',
  productImage: '👕',
  amount: 35,
  status: 'delivered',
  date: 'Il y a 2 jours, 14:20',
  timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
},
{
  id: '#1051',
  customerId: 5,
  customerName: 'Emma Rousseau',
  phone: '+33 6 77 88 99 00',
  productId: 6,
  productName: 'Sac à Main Cuir',
  productImage: '👜',
  amount: 89,
  status: 'paid',
  date: 'Il y a 3 jours, 09:30',
  timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
},
{
  id: '#1050',
  customerId: 2,
  customerName: 'Thomas Martin',
  phone: '+33 6 98 76 54 32',
  productId: 2,
  productName: 'AirPods Pro',
  productImage: '🎧',
  amount: 189,
  status: 'delivered',
  date: 'Il y a 4 jours, 16:45',
  timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000
},
{
  id: '#1049',
  customerId: 1,
  customerName: 'Sophie Dubois',
  phone: '+33 6 12 34 56 78',
  productId: 5,
  productName: 'Nike Air Max 2024',
  productImage: '👟',
  amount: 145,
  status: 'delivered',
  date: 'Il y a 5 jours, 11:00',
  timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
},
{
  id: '#1048',
  customerId: 6,
  customerName: 'Alexandre Petit',
  phone: '+33 6 33 44 55 66',
  productId: 3,
  productName: 'T-shirt Oversize Premium',
  productImage: '👕',
  amount: 35,
  status: 'delivered',
  date: 'Il y a 6 jours, 13:20',
  timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000
}];


// AUTOMATISATIONS
export const automations: Automation[] = [
{
  id: 1,
  name: 'Relance Panier Abandonné',
  description: "Envoie un message WhatsApp 2h après l'abandon.",
  icon: 'ShoppingCart',
  status: 'active',
  message:
  'Coucou [Nom] ! Tu as oublié tes articles dans le panier. Voici un code de -10% pour finaliser ta commande : SAVE10 🎁',
  performance: {
    recovered: 124,
    revenue: 1450
  }
},
{
  id: 2,
  name: 'Message de Bienvenue',
  description: 'Immédiatement après le premier contact.',
  icon: 'MessageSquare',
  status: 'active',
  message:
  "Bienvenue chez nous ! 👋 Je suis l'assistant de la boutique. Que recherches-tu aujourd'hui ?",
  performance: {
    sent: 856
  }
},
{
  id: 3,
  name: 'Suivi Après Achat',
  description: '48h après la livraison.',
  icon: 'Heart',
  status: 'active',
  message:
  "Salut [Nom] ! J'espère que tu es satisfait(e) de ton achat. N'hésite pas si tu as des questions ! 😊",
  performance: {
    sent: 234
  }
},
{
  id: 4,
  name: 'Relance Client Inactif',
  description: 'Après 30 jours sans commande.',
  icon: 'Clock',
  status: 'inactive',
  message:
  'Ça fait longtemps ! On a de nouveaux produits qui pourraient te plaire. Voici -15% : BACK15',
  performance: {}
}];


// ANALYTICS - Ventes sur 7 jours
export const salesData = [
{ day: 'Lun', revenue: 342, orders: 8 },
{ day: 'Mar', revenue: 456, orders: 11 },
{ day: 'Mer', revenue: 289, orders: 7 },
{ day: 'Jeu', revenue: 523, orders: 13 },
{ day: 'Ven', revenue: 678, orders: 16 },
{ day: 'Sam', revenue: 834, orders: 19 },
{ day: 'Dim', revenue: 612, orders: 14 }];


// INSIGHTS IA
export const aiInsights = [
{
  type: 'opportunity',
  title: 'Opportunité détectée',
  message:
  'Les AirPods Pro génèrent 40% de tes ventes. Stock actuel : 12 unités. Recommandation : Augmente ton stock à 25 unités pour ne pas perdre de ventes.',
  action: 'Commander du stock',
  color: 'indigo'
},
{
  type: 'success',
  title: 'Bonne nouvelle',
  message:
  "Tes relances de paniers abandonnés ont généré 1,450€ ce mois. C'est 65% de plus que le mois dernier !",
  action: 'Voir les détails',
  color: 'green'
},
{
  type: 'warning',
  title: 'Action recommandée',
  message:
  "3 clients n'ont pas répondu depuis 48h (Sophie, Thomas, Lucas). Relancer maintenant peut générer 300-500€ de ventes.",
  action: 'Relancer les clients',
  color: 'orange'
},
{
  type: 'alert',
  title: 'Alerte stock',
  message:
  'La Montre Connectée Sport est en rupture de stock et a généré 2,967€. 5 clients ont demandé ce produit cette semaine.',
  action: 'Réapprovisionner',
  color: 'red'
}];


// MÉTRIQUES BUSINESS
export const businessMetrics = {
  todayRevenue: 827,
  yesterdayRevenue: 738,
  monthRevenue: 12450,
  todayOrders: 3,
  monthOrders: 213,
  conversionRate: 8.4,
  averageBasket: 58.45,
  newCustomers: 12,
  automatedMessages: 234,
  recoveredCarts: 18
};