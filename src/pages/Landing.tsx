import { Nav, MobileCta } from '../components/landing/Nav';
import { Hero } from '../components/landing/Hero';
import { Faq, FinalCta, Footer } from '../components/landing/Closing';
import { Plans } from '../components/landing/Plans';

export function Landing() {
  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--ds-bg)', color: 'var(--ds-ink)' }}>
      <Nav />
      <main>
        <Hero />
        <Plans />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCta />
    </div>
  );
}
