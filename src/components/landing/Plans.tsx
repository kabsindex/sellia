import { useNavigate } from 'react-router-dom';
import { Check, Minus } from 'lucide-react';
import { Badge, DsButton } from '../ds';
import { Reveal } from '../ds/motion';
import { comparisonRows, plans } from '../../data/plans';

export function Plans() {
  const navigate = useNavigate();
  return (
    <section id="tarifs" className="scroll-mt-16 border-b py-14 lg:py-24" style={{ borderColor: 'var(--ds-border)' }}>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <Reveal className="max-w-[640px]">
          <h2 className="ds-title text-[30px] leading-[1.08] tracking-[-0.03em] sm:text-[40px]">Commence gratuitement. Passe à Premium quand tu grandis.</h2>
          <p className="ds-muted mt-3 text-[15.5px]">Aucune commission sur tes ventes, quel que soit ton plan.</p>
        </Reveal>

        <div className="mt-9 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
          {plans.map((plan, index) => {
            const premium = plan.id === 'premium';
            return (
              <Reveal key={plan.id} delay={index * 0.08} className="h-full">
                <article className="relative flex h-full flex-col rounded-[22px] border p-6 sm:p-7" style={premium ? { background: 'var(--ds-ink)', color: '#fff', borderColor: 'var(--ds-ink)', boxShadow: 'var(--ds-shadow-md)' } : { background: 'var(--ds-card)', borderColor: 'var(--ds-border)', boxShadow: 'var(--ds-shadow-xs)' }}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="ds-title text-[18px]" style={premium ? { color: '#fff' } : undefined}>{plan.name}</h3>
                    {plan.highlight && <Badge tone="solid">{plan.highlight}</Badge>}
                  </div>
                  <p className="mt-1.5 text-[14px]" style={{ color: premium ? 'rgb(255 255 255 / 0.65)' : 'var(--ds-muted)' }}>{plan.tagline}</p>
                  <p className="mt-5 flex items-baseline gap-1.5"><span className="ds-title text-[44px] leading-none" style={premium ? { color: '#fff' } : undefined}>{plan.price}</span><span className="text-[13px]" style={{ color: premium ? 'rgb(255 255 255 / 0.6)' : 'var(--ds-muted)' }}>{plan.period}</span></p>
                  <ul className="mt-6 grid flex-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {plan.features.map((feature) =>
                    <li key={feature} className="flex items-start gap-2 text-[13.5px] leading-snug">
                        <span className="mt-px grid size-4 shrink-0 place-items-center rounded-full" style={{ background: premium ? 'var(--ds-accent)' : 'var(--ds-accent-soft)', color: premium ? '#fff' : 'var(--ds-accent-strong)' }}><Check className="size-3" strokeWidth={3} /></span>{feature}
                      </li>
                    )}
                  </ul>
                  <div className="mt-7 grid gap-2 sm:grid-cols-2">
                    <DsButton size="lg" variant={premium ? 'primary' : 'dark'} onClick={() => navigate('/inscription')}>{plan.cta}</DsButton>
                    <DsButton size="lg" variant="outline" className={premium ? '!border-white/20 !bg-transparent !text-white hover:!bg-white/10' : ''} onClick={() => navigate(plan.demoHref)}>{premium ? 'Voir la boutique Premium' : 'Voir la boutique Basic'}</DsButton>
                  </div>
                </article>
              </Reveal>);
          })}
        </div>

        <Reveal className="mt-5">
          <details className="ds-card group overflow-hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[14.5px] font-semibold">Comparer les deux plans en détail<span className="ds-muted text-[12px] group-open:hidden">Afficher</span><span className="ds-muted hidden text-[12px] group-open:inline">Masquer</span></summary>
            <div className="border-t" style={{ borderColor: 'var(--ds-border)' }}>
              <div className="grid grid-cols-[1.4fr_1fr_1fr] px-5 py-2.5 text-[12px] font-semibold ds-muted" style={{ background: 'var(--ds-subtle)' }}><span /><span className="text-center">Basic</span><span className="text-center">Premium</span></div>
              {comparisonRows.map(([label, basic, premium]) =>
              <div key={label} className="grid grid-cols-[1.4fr_1fr_1fr] items-center px-5 py-2.5 text-[13.5px]" style={{ borderTop: '1px solid var(--ds-border)' }}>
                  <span>{label}</span>
                  {[basic, premium].map((value, index) =>
                  <span key={index} className="flex justify-center">{value === '✓' ? <Check className="size-4" style={{ color: 'var(--ds-accent)' }} /> : value === '—' ? <Minus className="size-4 ds-muted" /> : <span className="font-medium">{value}</span>}</span>
                  )}
                </div>
              )}
            </div>
          </details>
        </Reveal>
      </div>
    </section>);
}
