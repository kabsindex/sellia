import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Zap,
  ShoppingCart,
  MessageSquare,
  Clock,
  Plus,
  Heart,
  TrendingUp } from
'lucide-react';
import { automations } from '../../utils/mockData';
export function AutomationsTab() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart size={20} />;
      case 'MessageSquare':
        return <MessageSquare size={20} />;
      case 'Heart':
        return <Heart size={20} />;
      case 'Clock':
        return <Clock size={20} />;
      default:
        return <Zap size={20} />;
    }
  };
  const getIconColor = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart':
        return 'bg-green-100 text-green-600';
      case 'MessageSquare':
        return 'bg-blue-100 text-blue-600';
      case 'Heart':
        return 'bg-pink-100 text-pink-600';
      case 'Clock':
        return 'bg-slate-100 text-slate-500';
      default:
        return 'bg-purple-100 text-purple-600';
    }
  };
  const activeAutomations = automations.filter((a) => a.status === 'active');
  const totalRevenue = activeAutomations.reduce(
    (sum, a) => sum + (a.performance.revenue || 0),
    0
  );
  const totalRecovered = activeAutomations.reduce(
    (sum, a) => sum + (a.performance.recovered || 0),
    0
  );
  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-green-900 mb-1">
              Impact des automatisations
            </h3>
            <p className="text-sm text-green-800 mb-3">
              Tes automatisations ont généré{' '}
              <span className="font-bold">{totalRevenue}€</span> ce mois et
              récupéré{' '}
              <span className="font-bold">{totalRecovered} ventes</span>. C'est{' '}
              <span className="font-bold">18% de ton chiffre d'affaires</span>{' '}
              sans aucun effort.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="bg-white px-3 py-2 rounded-lg border border-green-200">
                <div className="text-green-700 font-medium">
                  Taux de conversion
                </div>
                <div className="text-xl font-bold text-green-900">32%</div>
              </div>
              <div className="bg-white px-3 py-2 rounded-lg border border-green-200">
                <div className="text-green-700 font-medium">
                  Temps économisé
                </div>
                <div className="text-xl font-bold text-green-900">12h/sem</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-sellia-text">
            Scénarios WhatsApp
          </h2>
          <p className="text-sm text-sellia-muted">
            Laisse l'IA vendre et relancer à ta place.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />}>
          Nouveau scénario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((automation) =>
        <Card
          key={automation.id}
          className={`border-l-4 ${automation.status === 'active' ? 'border-l-sellia-accent' : 'border-l-slate-300 opacity-75'} relative overflow-hidden`}>
          
            <div className="absolute top-4 right-4">
              {automation.status === 'active' ?
            <Badge variant="success">Actif</Badge> :

            <Badge variant="default">Inactif</Badge>
            }
            </div>
            <div className="flex items-start gap-4 mb-4">
              <div
              className={`w-10 h-10 ${getIconColor(automation.icon)} rounded-xl flex items-center justify-center shrink-0`}>
              
                {getIcon(automation.icon)}
              </div>
              <div>
                <h3 className="font-bold text-sellia-text text-lg">
                  {automation.name}
                </h3>
                <p className="text-sm text-sellia-muted mt-1">
                  {automation.description}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm border border-slate-100">
              <div className="font-medium text-sellia-text mb-1">
                Message IA :
              </div>
              <p className="text-sellia-muted italic">"{automation.message}"</p>
            </div>

            <div className="flex items-center justify-between border-t border-sellia-border pt-4">
              {automation.status === 'active' ?
            <div className="text-sm">
                  {automation.performance.recovered &&
              <>
                      <span className="font-bold text-sellia-text">
                        {automation.performance.recovered}
                      </span>{' '}
                      récupérés
                      {automation.performance.revenue &&
                <>
                          <span className="text-sellia-muted mx-2">•</span>
                          <span className="font-bold text-sellia-success">
                            +{automation.performance.revenue} €
                          </span>{' '}
                          générés
                        </>
                }
                    </>
              }
                  {automation.performance.sent &&
              !automation.performance.recovered &&
              <>
                        <span className="font-bold text-sellia-text">
                          {automation.performance.sent}
                        </span>{' '}
                        envoyés
                      </>
              }
                </div> :

            <div className="text-sm text-sellia-muted">Aucune donnée</div>
            }
              <Button
              variant={automation.status === 'active' ? 'ghost' : 'outline'}
              size="sm">
              
                {automation.status === 'active' ? 'Modifier' : 'Activer'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>);

}
