import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { faq } from '../../data/landing';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1160px] gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-medium text-brand-strong">FAQ</p>
          <h2 className="mt-3 font-heading text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">
            Les questions qu’on nous pose le plus.
          </h2>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {faq.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left">
                    
                    <span className="text-sm font-medium">{item.question}</span>
                    <ChevronDown
                      className={cn(
                        'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                        open && 'rotate-180'
                      )} />
                    
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open &&
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden">
                    
                      <p className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>);

          })}
        </div>
      </div>
    </section>);

}