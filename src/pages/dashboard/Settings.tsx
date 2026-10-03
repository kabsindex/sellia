import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, LogOut, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, DsButton, Field, Toggle } from '../../components/ds';
import { PremiumUpgradeDialog } from '../../components/shared/PremiumUpgradeDialog';
import { useSellia } from '../../contexts/SelliaContext';
import { plans } from '../../data/plans';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

const notificationItems = [
{ key: 'newOrder', label: 'Nouvelle commande', hint: 'Une alerte dès qu’un client commande.' },
{ key: 'dailyRecap', label: 'Récapitulatif quotidien', hint: 'Un résumé de tes ventes chaque soir.' },
{ key: 'tips', label: 'Conseils de vente SELLIA', hint: 'Astuces pour vendre plus sur WhatsApp.' }];

export function Settings() {
  const { user, store, setPlan, openBillingPortal, refreshDashboard, logout } = useSellia();
  const location = useLocation();
  const navigate = useNavigate();
  const stripeReturn = new URLSearchParams(location.search).get('stripe');
  const [changingPlan, setChangingPlan] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [managedByStripe, setManagedByStripe] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.plan !== 'premium' || !store.slug) return undefined;
    let cancelled = false;
    void api<{managedByStripe: boolean;}>(`/stores/${encodeURIComponent(store.slug)}/billing`).
    then((result) => {if (!cancelled) setManagedByStripe(result.managedByStripe);}).
    catch(() => {if (!cancelled) setManagedByStripe(null);});
    return () => {cancelled = true;};
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

  function choosePlan(planId: 'basic' | 'premium', name: string) {
    if (planId === 'premium') {
      setPremiumDialogOpen(true);
      return;
    }
    setChangingPlan(true);
    void setPlan(planId).
    then(() => toast.success(`Plan ${name} activé.`)).
    catch((error) => toast.error(error instanceof Error ? error.message : 'Changement de plan impossible.')).
    finally(() => setChangingPlan(false));
  }

  return (
    <div className="mx-auto w-full max-w-[860px] space-y-4">
      <div className="mb-1">
        <h1 className="ds-title text-[22px] lg:text-[26px]">Paramètres</h1>
        <p className="ds-muted mt-1 text-[14px]">Ton compte, ton abonnement et tes notifications.</p>
      </div>

      {stripeReturn === 'success' &&
      <p role="status" className="rounded-[14px] px-4 py-3 text-[14px] font-medium" style={{ background: 'var(--ds-accent-soft)', color: 'var(--ds-accent-strong)' }}>
          {user?.plan === 'premium' ? 'Ton abonnement Premium est actif.' : 'Paiement terminé. Nous attendons la confirmation de Stripe pour activer Premium.'}
        </p>
      }
      {stripeReturn === 'cancel' &&
      <p role="status" className="rounded-[14px] px-4 py-3 text-[14px]" style={{ background: 'var(--ds-subtle)' }}>Paiement annulé. Ta boutique reste sur son plan actuel.</p>
      }

      <section className="ds-card p-4 sm:p-5">
        <h2 className="ds-title text-[16px]">Mon compte</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Prénom"><input className="ds-input" value={user?.firstName ?? ''} readOnly /></Field>
          <Field label="Nom"><input className="ds-input" value={user?.lastName ?? ''} readOnly /></Field>
          <Field label="Email"><input className="ds-input" value={user?.email ?? ''} readOnly /></Field>
          <Field label="Numéro WhatsApp" hint="Le numéro de ta boutique se modifie dans Profil."><input className="ds-input" value={user?.whatsapp ?? ''} readOnly /></Field>
        </div>
        <p className="ds-muted mt-3 text-[12.5px]">La modification des informations du compte n’est pas encore disponible.</p>
      </section>

      <section className="ds-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="ds-title text-[16px]">Abonnement</h2>
          <Badge tone="accent">Plan actuel : {plans.find((plan) => plan.id === user?.plan)?.name ?? 'Gratuit'}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2">
          {plans.map((plan) => {
            const current = user?.plan === plan.id;
            return (
              <div key={plan.id} className={cn('flex flex-col rounded-[16px] border p-4')} style={{ borderColor: current ? 'var(--ds-accent)' : 'var(--ds-border)', background: current ? 'var(--ds-accent-soft)' : 'var(--ds-card)' }}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="ds-title text-[15px]">{plan.name}</h3>
                  {plan.highlight && !current && <Badge tone="ink">{plan.highlight}</Badge>}
                </div>
                <p className="mt-2 flex items-baseline gap-1"><span className="ds-title text-[26px]">{plan.price}</span><span className="ds-muted text-[12px]">{plan.period}</span></p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {(plan.id === 'premium' ? plan.features : plan.features.slice(0, 4)).map((feature) =>
                  <li key={feature} className="flex gap-2 text-[13px]"><Check className="mt-0.5 size-3.5 shrink-0" style={{ color: 'var(--ds-accent)' }} />{feature}</li>
                  )}
                </ul>
                <DsButton className="mt-4" block variant={current ? 'outline' : 'primary'} disabled={current || changingPlan || plan.id === 'basic' && user?.plan === 'premium'} onClick={() => choosePlan(plan.id as 'basic' | 'premium', plan.name)}>
                  {current ? 'Plan actuel' : plan.id === 'basic' && user?.plan === 'premium' ? 'Gérer depuis Stripe' : plan.cta}
                </DsButton>
              </div>);
          })}
        </div>
        {user?.plan === 'premium' && managedByStripe &&
        <DsButton variant="outline" className="mt-4" onClick={() => void openBillingPortal().catch((error) => toast.error(error instanceof Error ? error.message : 'Portail de facturation indisponible.'))}>Gérer mon abonnement</DsButton>
        }
        {user?.plan === 'premium' && managedByStripe === false &&
        <p className="ds-muted mt-3 text-[12.5px]">Ce plan Premium existait avant la facturation Stripe. Aucun abonnement Stripe n’est associé à cette boutique.</p>
        }
      </section>

      <section className="ds-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2"><h2 className="ds-title text-[16px]">Notifications</h2><Badge>Bientôt</Badge></div>
        {notificationItems.map((item) =>
        <div key={item.key} className="flex items-start gap-3 py-3" style={{ borderTop: '1px solid var(--ds-border)', marginTop: 12 }}>
            <div className="min-w-0 flex-1"><p className="text-[14px] font-semibold">{item.label}</p><p className="ds-muted mt-0.5 text-[12.5px]">{item.hint}</p></div>
            <span className="opacity-50"><Toggle label={item.label} checked={false} onChange={() => toast.info('Les notifications arrivent bientôt.')} /></span>
          </div>
        )}
      </section>

      <section className="ds-card p-4 sm:p-5">
        <h2 className="ds-title text-[16px]">Équipe</h2>
        <p className="ds-muted mt-1 text-[14px]">Ajoute un employé pour gérer les commandes avec toi. Disponible dans une future option équipe.</p>
        <DsButton variant="outline" className="mt-3" onClick={() => toast.info('Les comptes employés arrivent bientôt.')}><UserPlus className="size-4" />Inviter un employé</DsButton>
      </section>

      <section className="rounded-[16px] border p-4 sm:p-5" style={{ borderColor: 'color-mix(in srgb, var(--ds-danger) 30%, transparent)', background: 'var(--ds-card)' }}>
        <h2 className="ds-title text-[16px]" style={{ color: 'var(--ds-danger)' }}>Zone sensible</h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <DsButton variant="outline" onClick={() => { logout(); navigate('/'); }}><LogOut className="size-4" />Se déconnecter</DsButton>
          <DsButton variant="danger" onClick={() => toast.error('La suppression de boutique n’est pas encore disponible.')}><Trash2 className="size-4" />Supprimer ma boutique</DsButton>
        </div>
      </section>
      <PremiumUpgradeDialog open={premiumDialogOpen} context="general" onClose={() => setPremiumDialogOpen(false)} />
    </div>);
}
