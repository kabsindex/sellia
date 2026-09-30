import { motion, useReducedMotion } from 'framer-motion';
import { Check, Link2 } from 'lucide-react';
import { Reveal, easeOut } from './motion';

const messages = [
{ text: 'C’est combien ?', side: 'left' },
{ text: 'Tu l’as en 42 ?', side: 'left' },
{ text: 'Renvoie-moi les photos stp', side: 'left' },
{ text: 'Ton statut a disparu 😅', side: 'left' },
{ text: 'Encore les mêmes photos…', side: 'right' }];

const after = [
'Un catalogue permanent, toujours accessible',
'Prix, tailles et couleurs affichés clairement',
'Une commande déjà rédigée, envoyée en un clic',
'Commandes et clients enregistrés pour toi'];

export function ProblemSection() {
  const reduce = useReducedMotion();
  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal className="max-w-[720px]">
          <h2 className="font-heading text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
            Tu vends déjà sur WhatsApp. Mais tes produits sont dispersés.
          </h2>
          <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-muted-foreground">
            Statuts qui disparaissent, photos à renvoyer, prix à répéter : tes clients cherchent, et
            tu perds du temps à répondre aux mêmes questions.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-secondary/60 p-5 sm:p-7">
            <p className="text-sm font-medium text-muted-foreground">Aujourd’hui</p>
            <div className="mt-4 space-y-2.5">
              {messages.map((message, index) =>
              <motion.div
                key={message.text}
                initial={reduce ? false : { opacity: 0, x: message.side === 'left' ? -12 : 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.12, ease: easeOut }}
                className={`w-fit max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] shadow-soft ${message.side === 'left' ? 'rounded-tl-sm bg-card' : 'ml-auto rounded-tr-sm bg-[#d9fdd3] text-[#0f1a15]'}`}>
                  {message.text}
                </motion.div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-brand/30 bg-brand-soft p-5 sm:p-7">
            <p className="text-sm font-medium text-brand-strong">Avec SELLIA</p>
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-brand/20 bg-card px-4 py-3 shadow-soft">
              <Link2 className="size-4 text-brand" />
              <span className="font-mono text-[14px]">sellia.app/ma-boutique</span>
            </div>
            <ul className="mt-5 space-y-3">
              {after.map((item) =>
              <li key={item} className="flex gap-3 text-[14px] text-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);
}
