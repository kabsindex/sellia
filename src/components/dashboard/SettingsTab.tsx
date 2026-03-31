import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Store, CreditCard, MessageCircle } from 'lucide-react';
export function SettingsTab() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Store className="text-sellia-primary" size={24} />
          <h2 className="text-lg font-bold text-sellia-text">
            Profil Business
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400 cursor-pointer hover:bg-slate-50">
              Ajouter Logo
            </div>
            <div>
              <Button variant="outline" size="sm">
                Changer le logo
              </Button>
              <p className="text-xs text-sellia-muted mt-2">
                JPG, PNG ou GIF. Max 2MB.
              </p>
            </div>
          </div>
          <Input label="Nom de la boutique" defaultValue="Ma Super Boutique" />
          <Input
            label="Description courte"
            defaultValue="Vente de produits tendances au meilleur prix." />
          
          <Input
            label="Lien de la boutique"
            defaultValue="sellia.app/ma-boutique"
            disabled />
          
          <Button variant="primary" className="mt-2">
            Enregistrer les modifications
          </Button>
        </div>
      </Card>

      {/* WhatsApp Connection */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="text-green-500" size={24} />
          <h2 className="text-lg font-bold text-sellia-text">
            Connexion WhatsApp
          </h2>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-green-800 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connecté
            </div>
            <p className="text-sm text-green-700">+33 6 12 34 56 78</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50">
            
            Déconnecter
          </Button>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="text-sellia-primary" size={24} />
          <h2 className="text-lg font-bold text-sellia-text">
            Moyens de paiement
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-sellia-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                Stripe
              </div>
              <div>
                <div className="font-medium text-sm text-sellia-text">
                  Carte Bancaire
                </div>
                <div className="text-xs text-sellia-success">Actif</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Gérer
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border border-sellia-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-yellow-400 rounded flex items-center justify-center text-blue-900 text-xs font-bold">
                MTN
              </div>
              <div>
                <div className="font-medium text-sm text-sellia-text">
                  Mobile Money
                </div>
                <div className="text-xs text-sellia-muted">Non configuré</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connecter
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}
