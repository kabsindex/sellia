import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, Copy, LoaderCircle, PartyPopper } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Logo } from '../components/shared/Logo';
import { PremiumUpgradeDialog } from '../components/shared/PremiumUpgradeDialog';
import { StoreNameStep } from '../components/onboarding/StoreNameStep';
import { StoreCategoryStep } from '../components/onboarding/StoreCategoryStep';
import { StoreIdentityStep } from '../components/onboarding/StoreIdentityStep';
import { StoreBusinessStep } from '../components/onboarding/StoreBusinessStep';
import { FirstProductStep } from '../components/onboarding/FirstProductStep';
import { useSellia } from '../contexts/SelliaContext';
import { slugify } from '../utils/format';
import { storefrontUrl } from '../utils/whatsapp';
import { isPremiumTheme, storeThemes } from '../utils/themes';
import type { ProductDraft, Store } from '../types';

const steps = [
{ title: 'Nom de ta boutique', subtitle: 'C’est le nom que verront tes clients.' },
{ title: 'Que vends-tu ?', subtitle: 'On adapte ta boutique à ton activité.' },
{ title: 'Identité visuelle', subtitle: 'Logo, couverture et thème de ta boutique.' },
{ title: 'Informations commerciales', subtitle: 'Comment tes clients te joignent et te trouvent.' },
{ title: 'Ton premier produit', subtitle: 'Ajoute-en un, tu pourras compléter juste après.' }];


const emptyProduct: ProductDraft = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  categoryId: 'cat-sneakers',
  images: [],
  stock: '10',
  sizes: [],
  colors: [],
  available: true,
  promo: false,
  featured: true,
  hidden: false
};

export function Onboarding() {
  const navigate = useNavigate();
  const { store, categories, finishOnboarding, user } = useSellia();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [draft, setDraft] = useState<Store>({
    ...store,
    name: '',
    category: '',
    description: '',
    logo: '',
    cover: '',
    coverMobile: '',
    address: '',
    city: '',
    country: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    heroTitle: '',
    heroSubtitle: '',
    verificationStatus: 'unverified'
  });
  const [product, setProduct] = useState<ProductDraft>(emptyProduct);
  const [copied, setCopied] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [storeNameAvailable, setStoreNameAvailable] = useState(false);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);

  const patchStore = (patch: Partial<Store>) => setDraft((current) => ({ ...current, ...patch }));
  const patchProduct = (patch: Partial<ProductDraft>) =>
  setProduct((current) => ({ ...current, ...patch }));

  const canContinue = (() => {
    if (step === 0) return draft.name.trim().length > 1 && storeNameAvailable;
    if (step === 1) return Boolean(draft.category);
    if (step === 2) return Boolean(draft.logo && draft.cover && draft.coverMobile);
    if (step === 3) return draft.whatsapp.trim().length > 5;
    if (step === 4) return product.name.trim().length > 1 && Number(product.price) > 0 && product.images.length > 0;
    return true;
  })();

  async function finish() {
    setFinishing(true);
    try {
      await finishOnboarding(
        {
          ...draft,
          slug: slugify(draft.name) || draft.slug,
          heroTitle: draft.name,
          heroSubtitle: draft.description,
          verificationStatus: 'unverified'
        },
        {
          name: product.name,
          description: product.description,
          price: Number(product.price) || 0,
          oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
          categoryId: categories.some((category) => category.id === product.categoryId)
            ? product.categoryId
            : categories[0]?.id ?? '',
          images: product.images,
          stock: Number(product.stock) || 0,
          sizes: product.sizes,
          colors: product.colors,
          available: true,
          promo: false,
          featured: true,
          hidden: false
        }
      );
      setDone(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'La création de la boutique a échoué.');
    } finally {
      setFinishing(false);
    }
  }

  function handlePrimaryAction() {
    if (step === 2 && draft.plan !== 'premium' && isPremiumTheme(draft.theme)) {
      setPremiumDialogOpen(true);
      return;
    }
    if (step === steps.length - 1) {
      void finish();
      return;
    }
    setStep((value) => value + 1);
  }

  const slug = slugify(draft.name) || draft.slug;

  if (done) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-secondary/50 px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[440px] rounded-3xl border border-border bg-card p-7 text-center shadow-lift">
          
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-soft">
            <PartyPopper className="size-6 text-brand-strong" />
          </span>
          <h1 className="mt-5 font-heading text-[24px] font-semibold tracking-[-0.02em]">
            🎉 Votre boutique est prête !
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {draft.name} est en ligne. Partage ton lien et reçois tes premières commandes sur
            WhatsApp.
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-secondary/60 p-3">
            <span className="min-w-0 flex-1 truncate text-left font-mono text-sm font-medium text-brand-strong">
              {storefrontUrl(slug)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(storefrontUrl(slug));
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1800);
              }}>
              
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? 'Copié' : 'Copier'}
            </Button>
          </div>

          <div className="mt-5 grid gap-2">
            <Button size="lg" className="h-11" onClick={() => navigate('/dashboard')}>
              Aller à mon tableau de bord
            </Button>
            <Button variant="ghost" onClick={() => navigate(`/${slug}`)}>
              Voir ma boutique publique
            </Button>
          </div>
        </motion.div>
      </div>);

  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/50">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[720px] items-center gap-4 px-4 sm:px-5">
          <Logo className="shrink-0" />
          <div className="min-w-0 flex-1">
            <Progress value={(step + 1) / steps.length * 100} className="h-1.5" />
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {step + 1}/{steps.length}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[720px] flex-1 px-5 pb-32 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          Étape {step + 1}
        </p>
        <h1 className="mt-2 font-heading text-[26px] font-semibold tracking-[-0.02em]">
          {steps[step].title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{steps[step].subtitle}</p>

        <div className="mt-7 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}>
              
              {step === 0 &&
              <StoreNameStep
                name={draft.name}
                onChange={(name) => patchStore({ name })}
                onAvailabilityChange={setStoreNameAvailable}
              />
              }
              {step === 1 &&
              <StoreCategoryStep
                category={draft.category}
                onChange={(category) => patchStore({ category })} />

              }
              {step === 2 && <StoreIdentityStep draft={draft} onPatch={patchStore} />}
              {step === 3 && <StoreBusinessStep draft={draft} onPatch={patchStore} />}
              {step === 4 &&
              <FirstProductStep
                draft={product}
                categories={categories}
                currency={draft.currency}
                onPatch={patchProduct} />

              }
            </motion.div>
          </AnimatePresence>
        </div>

        {step === 0 && user &&
        <p className="mt-4 text-center text-xs text-muted-foreground">
            Bienvenue {user.firstName} — on y va doucement, une question à la fois.
          </p>
        }
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[720px] items-center gap-3 px-5 py-3">
          <Button
            variant="ghost"
            onClick={() => step === 0 ? navigate('/inscription') : setStep((value) => value - 1)}>
            
            <ArrowLeft className="size-4" />
            Retour
          </Button>
          <Button
            size="lg"
            className="h-11 flex-1"
            disabled={!canContinue || finishing}
            onClick={handlePrimaryAction}>

            {finishing && <LoaderCircle className="size-4 animate-spin" />}
            {step === steps.length - 1
              ? finishing ? 'Création en cours...' : 'Créer ma boutique'
              : 'Continuer'}
            {!finishing && <ArrowRight className="size-4" />}
          </Button>
        </div>
      </div>

      <PremiumUpgradeDialog
        open={premiumDialogOpen}
        context="theme"
        featureName={storeThemes[draft.theme].name}
        onClose={() => {
          setPremiumDialogOpen(false);
          patchStore({ theme: 'emerald' });
        }}
      />
    </div>);

}
