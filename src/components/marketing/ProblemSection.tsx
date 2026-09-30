import { motion } from 'framer-motion';
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

const comparison = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } }
};

const panel = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } }
};

const staggeredList = {
  hidden: {},
  visible: { transition: { delayChildren: 0.12, staggerChildren: 0.11 } }
};

const messageBubble = {
  hidden: (side: string) => ({ opacity: 0, x: side === 'left' ? -14 : 14, scale: 0.98 }),
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.48, ease: easeOut } }
};

const benefit = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.42, ease: easeOut } }
};

export function ProblemSection() {
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

        <motion.div
          className="mt-10 grid gap-4 lg:grid-cols-2"
          variants={comparison}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}>
          <motion.div variants={panel} className="rounded-3xl border border-border bg-secondary/60 p-5 sm:p-7">
            <p className="text-sm font-medium text-muted-foreground">Aujourd’hui</p>
            <motion.div variants={staggeredList} className="mt-4 space-y-2.5">
              {messages.map((message) =>
              <motion.div
                key={message.text}
                custom={message.side}
                variants={messageBubble}
                className={`w-fit max-w-[85%] transform-gpu rounded-2xl px-3.5 py-2 text-[14px] shadow-soft will-change-transform ${message.side === 'left' ? 'rounded-tl-sm bg-card' : 'ml-auto rounded-tr-sm bg-[#d9fdd3] text-[#0f1a15]'}`}>
                  {message.text}
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          <motion.div variants={panel} className="rounded-3xl border border-brand/30 bg-brand-soft p-5 sm:p-7">
            <p className="text-sm font-medium text-brand-strong">Avec SELLIA</p>
            <motion.div variants={benefit} className="mt-4 flex items-center gap-2.5 rounded-2xl border border-brand/20 bg-card px-4 py-3 shadow-soft">
              <Link2 className="size-4 text-brand" />
              <span className="font-mono text-[14px]">sellia.app/ma-boutique</span>
            </motion.div>
            <motion.ul variants={staggeredList} className="mt-5 space-y-3">
              {after.map((item) =>
              <motion.li key={item} variants={benefit} className="flex transform-gpu gap-3 text-[14px] text-foreground will-change-transform">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
                    <Check className="size-3" />
                  </span>
                  {item}
                </motion.li>
              )}
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>
    </section>);
}
