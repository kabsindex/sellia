export interface AnalyticsPoint {
  label: string;
  visiteurs: number;
  commandes: number;
  revenus: number;
  clicsWhatsapp: number;
}

export const analytics7Days: AnalyticsPoint[] = [
{ label: 'Ven', visiteurs: 148, commandes: 4, revenus: 182, clicsWhatsapp: 21 },
{ label: 'Sam', visiteurs: 226, commandes: 7, revenus: 344, clicsWhatsapp: 38 },
{ label: 'Dim', visiteurs: 197, commandes: 5, revenus: 221, clicsWhatsapp: 29 },
{ label: 'Lun', visiteurs: 134, commandes: 3, revenus: 118, clicsWhatsapp: 17 },
{ label: 'Mar', visiteurs: 165, commandes: 6, revenus: 286, clicsWhatsapp: 24 },
{ label: 'Mer', visiteurs: 208, commandes: 8, revenus: 402, clicsWhatsapp: 41 },
{ label: 'Jeu', visiteurs: 241, commandes: 9, revenus: 468, clicsWhatsapp: 46 }];


export const analytics30Days: AnalyticsPoint[] = Array.from({ length: 30 }, (_, index) => {
  const base = 120 + Math.round(Math.sin(index / 2.6) * 45) + index * 3;
  const orders = Math.max(1, Math.round(base / 32));
  return {
    label: `${index + 1}`,
    visiteurs: base,
    commandes: orders,
    revenus: orders * 44,
    clicsWhatsapp: Math.round(base / 5.4)
  };
});

export const topProductStats = [
{ name: 'Nike Air Jordan 4', vues: 1284, commandes: 18, revenus: 1170 },
{ name: 'Runner Low Grey Fog', vues: 842, commandes: 11, revenus: 605 },
{ name: 'T-shirt oversize Cream', vues: 611, commandes: 14, revenus: 252 },
{ name: 'Hoodie Olive Heavy', vues: 527, commandes: 7, revenus: 266 },
{ name: 'Sacoche nylon Daily', vues: 402, commandes: 5, revenus: 110 }];


export const trafficSources = [
{ source: 'WhatsApp', share: 46 },
{ source: 'Instagram', share: 24 },
{ source: 'TikTok', share: 18 },
{ source: 'Lien direct', share: 12 }];