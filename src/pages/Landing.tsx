import React, { Suspense, lazy } from 'react';
import { MotionConfig } from 'framer-motion';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { Hero } from '../components/marketing/Hero';
import { ProblemSection } from '../components/marketing/ProblemSection';
import { HowItWorks } from '../components/marketing/HowItWorks';
import { MobileCtaBar } from '../components/marketing/MobileCtaBar';
import { Features } from '../components/marketing/Features';
import { StorePreviewSection } from '../components/marketing/StorePreviewSection';
import { Pricing } from '../components/marketing/Pricing';
import { Testimonials } from '../components/marketing/Testimonials';
import { Faq } from '../components/marketing/Faq';
import { FinalCta } from '../components/marketing/FinalCta';
import { MarketingFooter } from '../components/marketing/MarketingFooter';

// Sections animées sous la ligne de flottaison : chargées à part pour garder le hero rapide.
const LiveDemo = lazy(() => import('../components/marketing/LiveDemo').then((m) => ({ default: m.LiveDemo })));
const DashboardPreview = lazy(() =>
import('../components/marketing/DashboardPreview').then((m) => ({ default: m.DashboardPreview }))
);
const LinkShare = lazy(() => import('../components/marketing/LinkShare').then((m) => ({ default: m.LinkShare })));

const placeholder = (height: string) => <div className={height} aria-hidden="true" />;

export function Landing() {
  return (
    // Les démos produit reposent sur le mouvement pour expliquer le parcours complet.
    <MotionConfig reducedMotion="never">
      <div className="min-h-screen w-full bg-background">
        <MarketingNav />
        <main>
          <Hero />
          <ProblemSection />
          <HowItWorks />
          <Suspense fallback={placeholder('min-h-[720px]')}>
            <LiveDemo />
          </Suspense>
          <Features />
          <StorePreviewSection />
          <Suspense fallback={placeholder('min-h-[520px]')}>
            <DashboardPreview />
          </Suspense>
          <Suspense fallback={placeholder('min-h-[420px]')}>
            <LinkShare />
          </Suspense>
          <Pricing />
          <Testimonials />
          <Faq />
          <FinalCta />
        </main>
        <MarketingFooter />
        <MobileCtaBar />
      </div>
    </MotionConfig>);
}
