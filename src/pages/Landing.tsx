import { Suspense, lazy } from 'react';
import { MotionConfig } from 'framer-motion';
import { Nav, MobileCta } from '../components/landing/Nav';
import { Hero } from '../components/landing/Hero';
import { Faq, FinalCta, Footer } from '../components/landing/Closing';
import { Plans } from '../components/landing/Plans';

// Sections animées sous la ligne de flottaison : chargées à part pour garder le hero rapide.
const ProblemDemo = lazy(() => import('../components/landing/ProblemDemo').then((m) => ({ default: m.ProblemDemo })));
const ProductDemo = lazy(() => import('../components/landing/ProductDemo').then((m) => ({ default: m.ProductDemo })));
const Features = lazy(() => import('../components/landing/Features').then((m) => ({ default: m.Features })));
const StorefrontShowcase = lazy(() => import('../components/landing/Showcases').then((m) => ({ default: m.StorefrontShowcase })));
const DashboardShowcase = lazy(() => import('../components/landing/Showcases').then((m) => ({ default: m.DashboardShowcase })));
const LinkShare = lazy(() => import('../components/landing/Showcases').then((m) => ({ default: m.LinkShare })));

const gap = (height: string) => <div className={height} aria-hidden="true" />;

export function Landing() {
  return (
    // « user » : les animations de transformation sont coupées si l'utilisateur réduit les animations.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full" style={{ background: 'var(--ds-bg)', color: 'var(--ds-ink)' }}>
        <Nav />
        <main>
          <Hero />
          <Suspense fallback={gap('min-h-[640px]')}><ProblemDemo /></Suspense>
          <Suspense fallback={gap('min-h-[760px]')}><ProductDemo /></Suspense>
          <Suspense fallback={gap('min-h-[700px]')}><Features /></Suspense>
          <Suspense fallback={gap('min-h-[700px]')}><StorefrontShowcase /></Suspense>
          <Suspense fallback={gap('min-h-[640px]')}><DashboardShowcase /></Suspense>
          <Suspense fallback={gap('min-h-[360px]')}><LinkShare /></Suspense>
          <Plans />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <MobileCta />
      </div>
    </MotionConfig>);
}
