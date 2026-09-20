import React from "react";
import { BarChart3, Package, Palette, Store, Users, BoxIcon } from "lucide-react";
import { WhatsAppIcon } from "../shared/WhatsAppIcon";
import { features } from "../../data/landing";
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Store,
  MessageCircle: WhatsAppIcon,
  Package,
  BarChart3,
  Palette,
  Users
};
export function Features() {
  return <section id="fonctionnalites" className="border-b border-border bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <div className="max-w-[620px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Fonctionnalités
          </p>
          <h2 className="mt-3 font-heading text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[36px]">
            Tout ce qu’il faut pour vendre, rien de plus.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
          const Icon = iconMap[feature.icon] ?? Store;
          return <article key={feature.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand-strong">
                  <Icon className="size-[18px]" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>;
        })}
        </div>
      </div>
    </section>;
}
