import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';
import { Reveal } from './motion';
import { comparisonRows, plans } from '../../data/plans';

export function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="tarifs" className="scroll-mt-16 border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal className="max-w-[620px]">
          <p className="text-sm font-medium text-brand-strong">Tarifs</p>
          <h2 className="mt-3 font-heading text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[38px]">
            Commence gratuitement. Passe au niveau suivant quand tu vends plus.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Aucune commission sur tes ventes, quel que soit ton plan.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {plans.map((plan, planIndex) => {
            const featured = Boolean(plan.highlight);
            return (
              <Reveal key={plan.id} delay={planIndex * 0.1} className="h-full">
              <div
                className={cn(
                  'relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5',
                  featured ?
                  'border-brand bg-card shadow-lift' :
                  'border-border bg-card shadow-soft'
                )}>
                
                {plan.highlight &&
                <Badge className="absolute -top-2.5 left-6">{plan.highlight}</Badge>
                }
                <h3 className="font-heading text-base font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-heading text-[34px] font-semibold tracking-[-0.03em]">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) =>
                  <li key={feature} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  )}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={featured ? 'default' : 'outline'}
                  onClick={() => navigate('/inscription')}>
                  
                  {plan.cta}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate(plan.demoHref)}
                  className="mt-3 text-center text-sm font-semibold text-brand hover:underline">
                  {plan.id === 'basic' ? 'Voir la boutique Basic' : 'Voir la boutique Premium'}
                </button>
              </div>
              </Reveal>);
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="grid grid-cols-[1.5fr_1fr_1fr] border-b border-border bg-secondary px-4 py-3 text-xs font-semibold text-muted-foreground">
            <span>Comparaison</span>
            <span className="text-center">Basic</span>
            <span className="text-center">Premium</span>
          </div>
          {comparisonRows.map(([label, basic, premium]) =>
          <div key={label} className="grid grid-cols-[1.5fr_1fr_1fr] border-b border-border px-4 py-3 text-sm last:border-b-0">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-center font-medium">{basic}</span>
              <span className="text-center font-medium">{premium}</span>
            </div>
          )}
        </div>
      </div>
    </section>);

}
