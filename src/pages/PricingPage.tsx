import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
export function PricingPage() {
  return (
    <MainLayout>
      <div className="bg-sellia-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-sellia-primary mb-6">
              Des tarifs simples qui grandissent avec toi
            </h1>
            <p className="text-xl text-sellia-muted max-w-2xl mx-auto">
              Commence gratuitement, passe à la vitesse supérieure quand tu es
              prêt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Starter */}
            <Card className="p-8 border-none shadow-md">
              <h3 className="text-xl font-bold text-sellia-text mb-2">
                Starter
              </h3>
              <p className="text-sellia-muted text-sm mb-6">
                Pour lancer sa première boutique.
              </p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-sellia-primary">
                  Gratuit
                </span>
              </div>
              <Link to="/auth">
                <Button variant="outline" fullWidth className="mb-8">
                  Commencer
                </Button>
              </Link>
              <ul className="space-y-4">
                {[
                'Boutique mobile optimisée',
                "Jusqu'à 20 produits",
                'Gestion des commandes basique',
                'Lien WhatsApp direct'].
                map((feature, i) =>
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-sellia-text">
                  
                    <CheckCircle2
                    size={20}
                    className="text-green-500 shrink-0" />
                  
                    <span>{feature}</span>
                  </li>
                )}
              </ul>
            </Card>

            {/* Growth */}
            <Card className="p-8 border-2 border-sellia-accent shadow-xl relative md:scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sellia-accent text-white px-4 py-1 rounded-full text-sm font-bold">
                Le plus populaire
              </div>
              <h3 className="text-xl font-bold text-sellia-text mb-2">
                Growth
              </h3>
              <p className="text-sellia-muted text-sm mb-6">
                Pour automatiser et vendre plus.
              </p>
              <div className="mb-6 flex items-end gap-1">
                <span className="text-4xl font-extrabold text-sellia-primary">
                  19€
                </span>
                <span className="text-sellia-muted mb-1">/mois</span>
              </div>
              <Link to="/auth">
                <Button
                  variant="primary"
                  fullWidth
                  className="mb-8 shadow-lg shadow-green-500/30">
                  
                  Passe au niveau supérieur
                </Button>
              </Link>
              <ul className="space-y-4">
                {[
                'Produits illimités',
                'Relance paniers abandonnés',
                'Assistant IA basique',
                'CRM Clients',
                'Paiements en ligne'].
                map((feature, i) =>
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-sellia-text font-medium">
                  
                    <CheckCircle2
                    size={20}
                    className="text-green-500 shrink-0" />
                  
                    <span>{feature}</span>
                  </li>
                )}
              </ul>
            </Card>

            {/* Pro */}
            <Card className="p-8 border-none shadow-md">
              <h3 className="text-xl font-bold text-sellia-text mb-2">Pro</h3>
              <p className="text-sellia-muted text-sm mb-6">
                Pour les vraies machines de vente.
              </p>
              <div className="mb-6 flex items-end gap-1">
                <span className="text-4xl font-extrabold text-sellia-primary">
                  49€
                </span>
                <span className="text-sellia-muted mb-1">/mois</span>
              </div>
              <Link to="/auth">
                <Button variant="secondary" fullWidth className="mb-8">
                  Essai gratuit 14j
                </Button>
              </Link>
              <ul className="space-y-4">
                {[
                "Tout de l'offre Growth",
                'Scénarios WhatsApp illimités',
                'Assistant IA avancé (24/7)',
                'Analytics détaillés',
                'Support prioritaire'].
                map((feature, i) =>
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-sellia-text">
                  
                    <CheckCircle2
                    size={20}
                    className="text-green-500 shrink-0" />
                  
                    <span>{feature}</span>
                  </li>
                )}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>);

}
