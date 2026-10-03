import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';
import { Badge, Chip, Price, Toggle } from '../ds';
import { Reveal } from '../ds/motion';
import { ProductImage } from '../shared/ProductImage';
import { CategoryIcon } from '../shared/CategoryIcon';
import { orderTone } from '../../design/status';
import { storeThemes } from '../../utils/themes';
import { sceneCategories, sceneProducts, sceneStore } from './scenes';

function Tile({ title, text, children, className }: {title: string;text: string;children: React.ReactNode;className?: string;}) {
  return (
    <article className={`ds-card flex flex-col overflow-hidden p-5 ${className ?? ''}`}>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
      <h3 className="ds-title mt-5 text-[17px]">{title}</h3>
      <p className="ds-muted mt-1 text-[13.5px] leading-relaxed">{text}</p>
    </article>);
}

function MiniProducts() {
  const [liked, setLiked] = useState<string[]>([sceneProducts.newBalance.id]);
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {[sceneProducts.airForce, sceneProducts.newBalance, sceneProducts.bag].map((product) =>
      <div key={product.id} className="ds-card ds-card--flat overflow-hidden !rounded-[13px]">
          <div className="relative aspect-square" style={{ background: 'var(--ds-subtle)' }}>
            <ProductImage src={product.images[0]} alt="" className="bg-transparent" imageClassName="p-2" />
            <button type="button" aria-label="Favori" aria-pressed={liked.includes(product.id)} onClick={() => setLiked((list) => list.includes(product.id) ? list.filter((id) => id !== product.id) : [...list, product.id])} className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-white/95">
              <svg viewBox="0 0 24 24" className="size-3" fill={liked.includes(product.id) ? '#ef4444' : 'none'} stroke={liked.includes(product.id) ? '#ef4444' : '#0f1a15'} strokeWidth="2"><path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6.2 5.4 5.4 0 0 1 21.3 12c-2.3 4.4-9.3 9-9.3 9Z" /></svg>
            </button>
          </div>
          <div className="px-2 py-1.5"><p className="truncate text-[11px] font-semibold">{product.name}</p><Price price={product.price} oldPrice={product.oldPrice} currency="$" size="sm" /></div>
        </div>
      )}
    </div>);
}

function ThemeSwatches() {
  const [active, setActive] = useState('emerald');
  const themes = Object.values(storeThemes).slice(0, 6);
  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {themes.map((theme) =>
        <button key={theme.id} type="button" aria-label={theme.name} aria-pressed={active === theme.id} onClick={() => setActive(theme.id)} className="relative grid size-11 place-items-center rounded-full transition-transform active:scale-90" style={{ background: theme.accent, boxShadow: active === theme.id ? `0 0 0 2px var(--ds-card), 0 0 0 4px ${theme.accent}` : 'inset 0 0 0 1px rgb(0 0 0 / 0.08)' }}>
            {active === theme.id && <Check className="size-4" style={{ color: theme.accentText }} />}
          </button>
        )}
      </div>
      <p className="mt-3 flex items-center gap-2 text-[13px] font-semibold">{storeThemes[active as keyof typeof storeThemes].name}<Badge tone={active === 'emerald' ? 'accent' : 'ink'}>{active === 'emerald' ? 'Inclus' : 'Premium'}</Badge></p>
    </div>);
}

function CatalogueToggles() {
  const [on, setOn] = useState([true, true, false]);
  return (
    <div className="divide-y rounded-[14px] border" style={{ borderColor: 'var(--ds-border)' }}>
      {[sceneProducts.airForce, sceneProducts.jordan, sceneProducts.watch].map((product, index) =>
      <div key={product.id} className="flex items-center gap-3 px-3 py-2.5" style={{ borderColor: 'var(--ds-border)' }}>
          <span className="size-9 shrink-0 overflow-hidden rounded-[9px]" style={{ background: 'var(--ds-subtle)', opacity: on[index] ? 1 : 0.5 }}><ProductImage src={product.images[0]} alt="" className="bg-transparent" imageClassName="p-1" /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold">{product.name}</p><p className="ds-muted text-[11.5px]">{on[index] ? 'En ligne' : 'Masqué'}</p></div>
          <Toggle label={`Afficher ${product.name}`} checked={on[index]} onChange={(value) => setOn((list) => list.map((item, i) => i === index ? value : item))} />
        </div>
      )}
    </div>);
}

function OrderRows() {
  const rows = [{ n: 'Jonathan K.', s: 'nouvelle', t: '65$' }, { n: 'Sarah I.', s: 'confirmee', t: '48$' }, { n: 'Esther M.', s: 'livree', t: '32$' }] as const;
  return (
    <div className="space-y-1.5">
      {rows.map((row) =>
      <div key={row.n} className="flex items-center gap-2.5 rounded-[12px] px-2.5 py-2" style={{ background: 'var(--ds-subtle)' }}>
          <span className="grid size-7 place-items-center rounded-full text-[11px] font-bold" style={{ background: 'var(--ds-card)' }}>{row.n[0]}</span>
          <span className="flex-1 truncate text-[13px] font-semibold">{row.n}</span>
          <Badge tone={orderTone[row.s].tone}>{orderTone[row.s].label}</Badge><span className="ds-price w-9 text-right text-[13px]">{row.t}</span>
        </div>
      )}
    </div>);
}

function Categories() {
  const [active, setActive] = useState('tout');
  return (
    <div>
      <div className="flex gap-3">
        {[{ slug: 'tout', name: 'Tous', emoji: 'grid' }, ...sceneCategories.slice(0, 3)].map((category) =>
        <button key={category.slug} type="button" aria-pressed={active === category.slug} onClick={() => setActive(category.slug)} className="flex flex-col items-center gap-1.5">
            <span className="grid size-12 place-items-center rounded-full transition-all" style={{ background: active === category.slug ? 'var(--ds-accent-soft)' : 'var(--ds-subtle)', color: 'var(--ds-accent-strong)', boxShadow: active === category.slug ? '0 0 0 2px var(--ds-accent)' : 'inset 0 0 0 1px var(--ds-border)' }}><CategoryIcon slug={category.slug} icon={category.emoji} className="size-5" /></span>
            <span className="text-[11.5px] font-medium">{category.name}</span>
          </button>
        )}
      </div>
      <div className="mt-4 flex gap-1.5"><Chip active>Tous</Chip><Chip>Nouveautés</Chip><Chip>Promo</Chip></div>
    </div>);
}

function ShareRow() {
  const [copied, setCopied] = useState(false);
  return (
    <>
    <div className="flex items-center gap-2 rounded-[14px] border p-1.5 pl-3" style={{ borderColor: 'var(--ds-border)' }}>
      <span className="min-w-0 flex-1 truncate font-mono text-[13px]">sellia.app/{sceneStore.slug}</span>
      <button type="button" onClick={() => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); }} className="ds-btn ds-btn--primary ds-btn--sm">{copied ? <><Check className="size-4" />Copié</> : <><Copy className="size-4" />Copier</>}</button>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      {[[WhatsAppIcon, 'WhatsApp'], [SiInstagram, 'Instagram'], [SiTiktok, 'TikTok']].map(([Icon, label]) => {
        const I = Icon as typeof WhatsAppIcon;
        return <span key={label as string} className="ds-chip !cursor-default"><I className="size-3.5" />{label as string}</span>;
      })}
    </div>
    </>);
}

export function Features() {
  return (
    <section id="fonctionnalites" className="scroll-mt-16 border-b py-14 lg:py-24" style={{ borderColor: 'var(--ds-border)' }}>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <Reveal className="max-w-[640px]">
          <h2 className="ds-title text-[30px] leading-[1.08] tracking-[-0.03em] sm:text-[40px]">Tout ce qu’il faut pour vendre. Rien de superflu.</h2>
          <p className="ds-muted mt-3 text-[15.5px]">Essaie les composants : ce sont ceux de la vraie boutique.</p>
        </Reveal>
        <div className="mt-9 grid grid-cols-[minmax(0,1fr)] gap-3.5 md:grid-cols-6">
          <Reveal className="md:col-span-4"><Tile title="Une boutique qui ressemble à une vraie application" text="Catalogue, favoris, panier et fiche produit, pensés pour le téléphone de tes clients." className="h-full"><MiniProducts /></Tile></Reveal>
          <Reveal delay={0.05} className="md:col-span-2"><Tile title="Ton lien, prêt à partager" text="Une adresse à toi, à coller dans tes statuts, groupes et bios." className="h-full"><ShareRow /></Tile></Reveal>
          <Reveal className="md:col-span-2"><Tile title="Catégories et filtres" text="Tes clients trouvent vite : catégories rondes, filtres, recherche." className="h-full"><Categories /></Tile></Reveal>
          <Reveal delay={0.05} className="md:col-span-2"><Tile title="Tu gères ton catalogue" text="Publie, masque ou modifie un produit en un geste." className="h-full"><CatalogueToggles /></Tile></Reveal>
          <Reveal delay={0.1} className="md:col-span-2"><Tile title="Commandes et clients suivis" text="Chaque commande est enregistrée, avec son statut." className="h-full"><OrderRows /></Tile></Reveal>
          <Reveal className="md:col-span-3"><Tile title="Ta boutique à tes couleurs" text="Thèmes et personnalisation avancée avec Premium." className="h-full"><ThemeSwatches /></Tile></Reveal>
          <Reveal delay={0.05} className="md:col-span-3"><Tile title="Commande WhatsApp prérempliée" text="Produits, tailles, total : le client envoie, tu réponds. Tu gardes la relation." className="h-full">
            <div className="ml-auto max-w-[300px] rounded-[14px] rounded-tr-sm bg-[#d9fdd3] p-3 text-[12px] leading-relaxed shadow-sm" style={{ color: '#0f1a15' }}>Bonjour 👋 Je souhaite commander :<br />1. Nike Air Force 1 07 · 75$<br />2. Sac femme taupe · 35$<br /><strong>Total : 110$</strong></div>
          </Tile></Reveal>
        </div>
      </div>
    </section>);
}
