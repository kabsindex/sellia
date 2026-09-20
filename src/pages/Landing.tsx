import React from 'react';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { Hero } from '../components/marketing/Hero';
import { HowItWorks } from '../components/marketing/HowItWorks';
import { StorePreviewSection } from '../components/marketing/StorePreviewSection';
import { Features } from '../components/marketing/Features';
import { WhySellia } from '../components/marketing/WhySellia';
import { Pricing } from '../components/marketing/Pricing';
import { Testimonials } from '../components/marketing/Testimonials';
import { Faq } from '../components/marketing/Faq';
import { FinalCta } from '../components/marketing/FinalCta';
import { MarketingFooter } from '../components/marketing/MarketingFooter';

export function Landing() {
  return (
    <div className="min-h-screen w-full bg-background">
      <MarketingNav />
      <main>
        <Hero />
        <HowItWorks />
        <StorePreviewSection />
        <Features />
        <WhySellia />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>);

}