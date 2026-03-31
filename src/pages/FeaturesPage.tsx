import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import {
  Bot,
  Users,
  Zap,
  BarChart2,
  CreditCard,
  CheckCircle2 } from
'lucide-react';
export function FeaturesPage() {
  const features = [
  {
    id: 'assistant',
    icon: <Bot size={32} />,
    title: 'Assistant IA',
    problem:
    "Tu passes tes journées à répondre aux mêmes questions sur WhatsApp ('C'est combien ?', 'C'est dispo ?').",
    solution:
    'Notre IA répond instantanément aux questions fréquentes, prend les commandes et guide tes clients 24/7.',
    benefit:
    'Gagne 3h par jour et ne rate plus aucune vente pendant ton sommeil.'
  },
  {
    id: 'crm',
    icon: <Users size={32} />,
    title: 'CRM Automatisé',
    problem:
    'Tu perds la trace de qui a acheté quoi, et tu ne sais pas qui relancer.',
    solution:
    "Chaque client est enregistré automatiquement avec son historique d'achat et classé par tags (Nouveau, Fidèle, Inactif).",
    benefit:
    'Fidélise tes clients facilement et augmente la valeur à vie de chaque acheteur.'
  },
  {
    id: 'automation',
    icon: <Zap size={32} />,
    title: 'Automatisation WhatsApp',
    problem:
    "Beaucoup de clients ajoutent au panier mais ne finalisent pas l'achat.",
    solution:
    "Crée des scénarios automatiques : relance panier abandonné, message de bienvenue, promo d'anniversaire.",
    benefit:
    "Récupère jusqu'à 30% des ventes perdues sans lever le petit doigt."
  },
  {
    id: 'analytics',
    icon: <BarChart2 size={32} />,
    title: 'Analytics Intelligents',
    problem:
    'Tu ne sais pas exactement combien tu gagnes ni quels produits sont les plus rentables.',
    solution:
    "Un tableau de bord clair avec tes revenus, taux de conversion et des recommandations de l'IA.",
    benefit:
    'Prends des décisions basées sur des chiffres réels pour faire croître ton business.'
  },
  {
    id: 'payments',
    icon: <CreditCard size={32} />,
    title: 'Paiements Locaux',
    problem:
    "La gestion des paiements par transfert manuel est longue et source d'erreurs.",
    solution:
    'Intégration native avec Mobile Money et cartes bancaires selon ton pays.',
    benefit: "Encaisse l'argent de manière sécurisée et automatique."
  }];

  return (
    <MainLayout>
      <div className="bg-sellia-bg py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-sellia-primary mb-6">
              La puissance d'une équipe entière, dans ta poche.
            </h1>
            <p className="text-xl text-sellia-muted">
              Découvre comment SELLIA transforme ton WhatsApp en une véritable
              machine de vente automatisée.
            </p>
          </div>

          <div className="space-y-12">
            {features.map((feature) =>
            <Card
              key={feature.id}
              className="p-8 md:p-10 border-none shadow-lg relative overflow-hidden">
              
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-green-100 text-sellia-accent rounded-2xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-sellia-primary">
                      {feature.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                      <div className="text-red-800 font-bold mb-2 text-sm uppercase tracking-wider">
                        👉 Le Problème
                      </div>
                      <p className="text-red-900/80">{feature.problem}</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                      <div className="text-blue-800 font-bold mb-2 text-sm uppercase tracking-wider">
                        ✨ La Solution
                      </div>
                      <p className="text-blue-900/80">{feature.solution}</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-5 border border-green-100 md:scale-105 shadow-sm">
                      <div className="text-green-800 font-bold mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 size={16} /> Le Bénéfice
                      </div>
                      <p className="text-green-900 font-medium">
                        {feature.benefit}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>);

}
