import React from 'react';
import { Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { testimonials } from '../../data/landing';
import { initials } from '../../utils/format';

export function Testimonials() {
  return (
    <section className="border-b border-border bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <div className="max-w-[620px]">
          <p className="text-sm font-medium text-brand-strong">
            Ils vendent déjà avec SELLIA
          </p>
          <h2 className="mt-3 font-heading text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[36px]">
            Des vendeurs comme toi, en ligne en quelques minutes.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-3">
          {testimonials.map((item) =>
          <figure
            key={item.name}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
            
              <Quote className="size-5 text-brand" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                « {item.quote} »
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <Avatar className="size-9">
                  {item.avatar && <AvatarImage src={item.avatar} alt="" />}
                  <AvatarFallback className="text-xs">{initials(item.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>);

}