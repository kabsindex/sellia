import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{className?: string;}>;
  delta?: number;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, delta, hint, className }: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div
      className={cn(
        'min-w-0 rounded-2xl border border-border bg-card p-3.5 shadow-soft transition-shadow hover:shadow-lift sm:p-4',
        className
      )}>
      
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-xs font-medium leading-[1.35] text-muted-foreground">{label}</p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-strong">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 break-words font-heading text-[22px] font-semibold leading-none sm:text-[24px]">
        {value}
      </p>
      <div className="mt-2 flex min-w-0 items-start gap-1.5">
        {typeof delta === 'number' &&
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium',
            positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          )}>
          
            {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
        }
        {hint && <span className="min-w-0 text-[11px] leading-4 text-muted-foreground">{hint}</span>}
      </div>
    </div>);

}
