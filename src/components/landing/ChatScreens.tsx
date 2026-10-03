import { AnimatePresence, motion } from 'framer-motion';
import { CheckCheck, Link2 } from 'lucide-react';
import { ease } from '../../design/motion';
import { formatPrice } from '../../utils/format';
import { sceneStore, sceneUrl } from './scenes';
import type { Product } from '../../types';

const header =
<div className="flex shrink-0 items-center gap-2 bg-[#0b6b4c] px-3.5 pb-2.5 pt-8 text-white">
    <span className="grid size-7 place-items-center rounded-full bg-white/20 text-[11px] font-bold">C</span>
    <div><p className="text-[11px] font-semibold leading-tight">Mes clients</p><p className="text-[8px] text-white/75">WhatsApp</p></div>
  </div>;


const inputBar =
<div className="flex shrink-0 items-center gap-1.5 bg-[#efeae2] px-2.5 pb-3 pt-1.5">
    <span className="flex h-7 flex-1 items-center rounded-full bg-white px-3 text-[9px] text-[#8696a0]">Message</span>
    <span className="grid size-7 place-items-center rounded-full bg-[#0b6b4c] text-[10px] text-white">➤</span>
  </div>;

const messages = [
{ me: false, text: 'C’est combien ?' },
{ me: false, text: 'Tu l’as en 42 ?' },
{ me: true, text: '📷 📷 📷  (encore les photos…)' },
{ me: false, text: 'Renvoie-moi les prix stp' },
{ me: false, text: 'Ton statut a disparu 😅' }];

function Bubble({ me, children }: {me?: boolean;children: React.ReactNode;}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease }} className={`w-fit max-w-[84%] rounded-xl px-2.5 py-1.5 text-[9.5px] leading-snug shadow-sm ${me ? 'ml-auto rounded-tr-sm bg-[#d9fdd3]' : 'rounded-tl-sm bg-white'}`} style={{ color: '#0f1a15' }}>
      {children}
    </motion.div>);
}

/** Conversation WhatsApp désorganisée : `shown` messages visibles, puis le lien de la boutique est envoyé. */
export function ChaosChat({ shown, linkSent }: {shown: number;linkSent: boolean;}) {
  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      {header}
      <div className="flex-1 space-y-2 overflow-hidden px-3 pt-3">
        {messages.slice(0, shown).map((message) => <Bubble key={message.text} me={message.me}>{message.text}</Bubble>)}
        <AnimatePresence>
          {linkSent &&
          <Bubble me>
              <p className="mb-1 text-[9px]">Voici ma boutique 👇 tout est dedans.</p>
              <div className="flex items-center gap-2 rounded-lg bg-white/70 p-1.5">
                <img src={sceneStore.logo} alt="" className="size-8 rounded-md bg-white object-contain" />
                <div className="min-w-0"><p className="truncate text-[9px] font-bold">{sceneStore.name}</p><p className="flex items-center gap-0.5 truncate font-mono text-[8px] text-[#667781]"><Link2 className="size-2" />{sceneUrl}</p></div>
              </div>
            </Bubble>
          }
        </AnimatePresence>
      </div>
      {inputBar}
    </div>);
}

/** Message de commande prérempli reçu par le vendeur sur WhatsApp. */
export function OrderChat({ lines }: {lines: {product: Product;quantity: number;}[];}) {
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="flex shrink-0 items-center gap-2 bg-[#0b6b4c] px-3.5 pb-2.5 pt-8 text-white">
        <img src={sceneStore.logo} alt="" className="size-7 rounded-full bg-white object-contain p-0.5" />
        <div><p className="text-[11px] font-semibold leading-tight">{sceneStore.name}</p><p className="text-[8px] text-white/75">en ligne</p></div>
      </div>
      <div className="flex-1 space-y-2 px-3 pt-3">
        <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease }} className="ml-auto max-w-[90%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-2.5 py-2 text-[9px] leading-relaxed shadow-sm" style={{ color: '#0f1a15' }}>
          <p>Bonjour 👋 Je souhaite passer une commande sur {sceneStore.name}.</p>
          {lines.map((line, index) => <p key={line.product.id} className="mt-1">{index + 1}. {line.product.name} · {formatPrice(line.product.price * line.quantity, sceneStore.currency)}</p>)}
          <p className="mt-1 font-semibold">Total : {formatPrice(total, sceneStore.currency)}</p>
          <p className="mt-1 flex items-center justify-end gap-0.5 text-[7px] text-[#667781]">14:32 <CheckCheck className="size-2.5 text-[#53bdeb]" /></p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 1, ease }} className="max-w-[80%] rounded-xl rounded-tl-sm bg-white px-2.5 py-2 text-[9px] leading-relaxed shadow-sm" style={{ color: '#0f1a15' }}>
          Commande bien reçue ✅ Je te confirme la livraison dans un instant.
        </motion.div>
      </div>
      {inputBar}
    </div>);
}
