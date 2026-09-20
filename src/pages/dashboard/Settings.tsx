import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, LogOut, Trash2, UserPlus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Badge } from '../../components/ui/Badge';
import { Switch } from '../../components/ui/CSwitch';
import { Separator } from '../../components/ui/Separator';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { plans } from '../../data/plans';
import { api } from '../../utils/api';

export function Settings() {
  const { user, store, setPlan, openBillingPortal, refreshDashboard } = useSellia();
  const location = useLocation();
  const stripeReturn = new URLSearchParams(location.search).get('stripe');
  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    whatsapp: user?.whatsapp ?? ''
  });
  const [notifications, setNotifications] = useState({
    newOrder: true,
    dailyRecap: false,
    tips: true
  });
  const [changingPlan, setChangingPlan] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [managedByStripe, setManagedByStripe] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.plan !== 'premium' || !store.slug) return undefined;
    let cancelled = false;
    void api<{ managedByStripe: boolean }>(`/stores/${encodeURIComponent(store.slug)}/billing`)
      .then((result) => { if (!cancelled) setManagedByStripe(result.managedByStripe); })
      .catch(() => { if (!cancelled) setManagedByStripe(null); });
    return () => { cancelled = true; };
  }, [store.slug, user?.plan]);

  useEffect(() => {
    if (stripeReturn !== 'success' || user?.plan === 'premium') return undefined;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      void refreshDashboard().catch(() => undefined);
      if (attempts >= 5) window.clearInterval(timer);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [refreshDashboard, stripeReturn, user?.plan]);

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h2 className="font-heading text-[20px] font-semibold tracking-[-0.02em]">Paramètres</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Ton compte, ton abonnement et tes notifications.
        </p>
      </div>

      {stripeReturn === 'success' && <p role="status" className="border-l-4 border-brand bg-brand-soft px-4 py-3 text-sm">
        {user?.plan === 'premium'
          ? 'Ton abonnement Premium est actif.'
          : 'Paiement terminé. Nous attendons la confirmation Stripe pour activer Premium.'}
      </p>}
      {stripeReturn === 'cancel' && <p role="status" className="border-l-4 border-border bg-secondary px-4 py-3 text-sm">
        Paiement annulé. Ta boutique reste sur son plan actuel.
      </p>}

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <h3 className="font-heading text-sm font-semibold">Mon compte</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={profile.firstName}
              onChange={(event) => setProfile({ ...profile, firstName: event.target.value })} />
            
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={profile.lastName}
              onChange={(event) => setProfile({ ...profile, lastName: event.target.value })} />
            
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
            
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={profile.whatsapp}
              onChange={(event) => setProfile({ ...profile, whatsapp: event.target.value })} />
            
          </div>
        </div>
        <Button className="mt-4" onClick={() => toast.success('Compte mis à jour.')}>
          Enregistrer mes informations
        </Button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-heading text-sm font-semibold">Abonnement</h3>
          <Badge variant="outline" className="border-transparent bg-brand-soft text-brand-strong">
            Plan actuel :{' '}
            {plans.find((plan) => plan.id === user?.plan)?.name ?? 'Gratuit'}
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {plans.map((plan) => {
            const current = user?.plan === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  'flex flex-col rounded-xl border p-4',
                  current ? 'border-brand bg-brand-soft/40' : 'border-border'
                )}>
                
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-heading text-sm font-semibold">{plan.name}</h4>
                  {plan.highlight && !current &&
                  <Badge className="text-[10px]">{plan.highlight}</Badge>
                  }
                </div>
                <p className="mt-1.5 flex items-baseline gap-1">
                  <span className="font-heading text-xl font-semibold tracking-[-0.02em]">
                    {plan.price}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{plan.period}</span>
                </p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {(plan.id === 'premium' ? plan.features : plan.features.slice(0, 4)).map((feature) =>
                  <li key={feature} className="flex gap-2 text-xs text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand" />
                      {feature}
                    </li>
                  )}
                </ul>
                <Button
                  className="mt-4 w-full"
                  size="sm"
                  variant={current ? 'outline' : 'default'}
                  disabled={current || changingPlan || (plan.id === 'basic' && user?.plan === 'premium')}
                  onClick={() => {
                    if (plan.id === 'premium') {
                      setPremiumDialogOpen(true);
                      return;
                    }
                    setChangingPlan(true);
                    void setPlan(plan.id)
                      .then(() => toast.success(`Plan ${plan.name} activé.`))
                      .catch((error) => {
                        toast.error(error instanceof Error ? error.message : 'Changement de plan impossible.');
                      })
                      .finally(() => setChangingPlan(false));
                  }}>
                  
                  {current ? 'Plan actuel' : plan.id === 'basic' && user?.plan === 'premium' ? 'Gérer depuis Stripe' : plan.cta}
                </Button>
              </div>);

          })}
        </div>

        {user?.plan === 'premium' && managedByStripe && <Button
          variant="outline"
          className="mt-4"
          onClick={() => void openBillingPortal().catch((error) =>
            toast.error(error instanceof Error ? error.message : 'Portail de facturation indisponible.')
          )}>
          Gérer mon abonnement
        </Button>}
        {user?.plan === 'premium' && managedByStripe === false && <p className="mt-3 text-xs text-muted-foreground">
          Ce plan Premium existait avant la facturation Stripe. Aucun abonnement Stripe n’est associé à cette boutique.
        </p>}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <h3 className="font-heading text-sm font-semibold">Notifications</h3>
        <div className="mt-4 space-y-4">
          {[
          {
            key: 'newOrder' as const,
            label: 'Nouvelle commande',
            hint: 'Reçois une alerte dès qu’un client commande.'
          },
          {
            key: 'dailyRecap' as const,
            label: 'Récapitulatif quotidien',
            hint: 'Un résumé de tes ventes chaque soir.'
          },
          {
            key: 'tips' as const,
            label: 'Conseils de vente SELLIA',
            hint: 'Astuces pour vendre plus sur WhatsApp.'
          }].
          map((item) =>
          <div key={item.key} className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <Label htmlFor={item.key} className="text-sm">
                  {item.label}
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.hint}</p>
              </div>
              <Switch
              id={item.key}
              checked={notifications[item.key]}
              onCheckedChange={(checked: boolean) =>
              setNotifications({ ...notifications, [item.key]: checked })
              } />
            
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <h3 className="font-heading text-sm font-semibold">Équipe</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoute un employé pour gérer les commandes avec toi. Disponible dans une future option équipe.
        </p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => toast.info('Les comptes employés arrivent bientôt.')}>
          
          <UserPlus className="size-4" />
          Inviter un employé
        </Button>
      </section>

      <section className="rounded-2xl border border-destructive/30 bg-card p-4 shadow-soft sm:p-5">
        <h3 className="font-heading text-sm font-semibold text-destructive">Zone sensible</h3>
        <Separator className="my-3" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => toast.success('Déconnecté (démo).')}>
            <LogOut className="size-4" />
            Se déconnecter
          </Button>
          <Button
            variant="outline"
            className="text-destructive"
            onClick={() => toast.error('Suppression de compte désactivée dans la démo.')}>
            
            <Trash2 className="size-4" />
            Supprimer ma boutique
          </Button>
        </div>
      </section>

      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context="general"
        onClose={() => setPremiumDialogOpen(false)}
      />
    </div>);

}
