import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Share2 } from 'lucide-react';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { toast } from 'sonner';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { Reveal, easeOut, useScript } from './motion';

const LINK = 'sellia.app/ma-boutique';
const durations = [1400, 900, 600, 600, 600, 600, 2800];
const channels = [
{ label: 'Message WhatsApp', hint: 'Envoie-le à tes clients', icon: WhatsAppIcon, tone: 'bg-[#25d366]/15 text-[#0b7a3a]' },
{ label: 'Statut WhatsApp', hint: 'Visible 24 h par tes contacts', icon: WhatsAppIcon, tone: 'bg-[#25d366]/15 text-[#0b7a3a]' },
{ label: 'Bio Instagram', hint: 'Un lien qui reste en permanence', icon: SiInstagram, tone: 'bg-[#e1306c]/10 text-[#c2185b]' },
{ label: 'Bio TikTok', hint: 'Pour tes vidéos de produits', icon: SiTiktok, tone: 'bg-foreground/10 text-foreground' }];

export function LinkShare() {
  const { ref, step, setStep } = useScript(durations);
  const [copied, setCopied] = useState(false);
  const showCopied = copied || step >= 1;
  const activeChannels = step < 2 ? 0 : Math.min(step - 1, channels.length);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://${LINK}`);
    } catch {
      /* le presse-papiers peut être indisponible : le retour visuel suffit */
    }
    setCopied(true);
    setStep(1);
    toast.success('Lien copié. Colle-le où tu veux.');
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <section className="border-b border-border bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal className="max-w-[620px]">
          <h2 className="font-heading text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[36px]">
            Un seul lien, partagé partout où tu vends déjà.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Ta boutique a sa propre adresse. Copie-la une fois, elle fonctionne dans tes statuts,
            tes groupes et tes bios.
          </p>
        </Reveal>

        <div ref={ref} className="mt-10 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-8">
          <div className="mx-auto flex max-w-[560px] items-center gap-2 rounded-2xl border border-border bg-background p-2 pl-4">
            <Share2 className="size-4 shrink-0 text-muted-foreground" />
            <p className="min-w-0 flex-1 truncate font-mono text-[14px] sm:text-[15px]">{LINK}</p>
            <button
              type="button"
              onClick={copyLink}
              className="relative h-10 w-[98px] shrink-0 overflow-hidden rounded-xl bg-brand text-sm font-semibold text-brand-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0">
              <AnimatePresence initial={false}>
                <motion.span
                  key={showCopied ? 'ok' : 'copy'}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.28, ease: easeOut }}
                  className="absolute inset-0 inline-flex transform-gpu items-center justify-center gap-1.5 will-change-transform">
                  {showCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {showCopied ? 'Copié' : 'Copier'}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel, index) => {
              const on = index < activeChannels;
              return (
                <motion.div
                  key={channel.label}
                  animate={{ opacity: on ? 1 : 0.48, y: on ? 0 : 7, scale: on ? 1 : 0.985 }}
                  transition={{ duration: 0.48, ease: easeOut }}
                  className="transform-gpu rounded-2xl border border-border bg-background p-4 will-change-transform">
                  <motion.span
                    animate={{ scale: on ? [1, 1.08, 1] : 1 }}
                    transition={{ duration: 0.42, ease: easeOut }}
                    className={`grid size-9 place-items-center rounded-xl ${channel.tone}`}>
                    <channel.icon className="size-[18px]" />
                  </motion.span>
                  <p className="mt-3 text-sm font-semibold">{channel.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{channel.hint}</p>
                </motion.div>);
            })}
          </div>
        </div>
      </div>
    </section>);
}
