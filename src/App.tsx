import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ScrollToTop } from './components/shared/ScrollToTop';
import { RouteProgress } from './components/shared/RouteProgress';
import { SelliaProvider } from './contexts/SelliaContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Onboarding } from './pages/Onboarding';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { Products } from './pages/dashboard/Products';
import { ProductForm } from './pages/dashboard/ProductForm';
import { Categories } from './pages/dashboard/Categories';
import { Orders } from './pages/dashboard/Orders';
import { OrderDetail } from './pages/dashboard/OrderDetail';
import { Customers } from './pages/dashboard/Customers';
import { Subscribers } from './pages/dashboard/Subscribers';
import { Analytics } from './pages/dashboard/Analytics';
import { StoreProfile } from './pages/dashboard/StoreProfile';
import { Appearance } from './pages/dashboard/Appearance';
import { Settings } from './pages/dashboard/Settings';
import { StorefrontLayout } from './components/layout/StorefrontLayout';
import { StoreHome } from './pages/store/StoreHome';
import { StoreCatalog } from './pages/store/StoreCatalog';
import { StoreSearch } from './pages/store/StoreSearch';
import { StoreProductDetail } from './pages/store/StoreProductDetail';
import { StoreCart } from './pages/store/StoreCart';
import { StoreContact } from './pages/store/StoreContact';
import { StoreFavorites } from './pages/store/StoreFavorites';
import { StoreAccount } from './pages/store/StoreAccount';
import { StorePremiumDemo } from './pages/store/StorePremiumDemo';
import { StoreNotFound } from './pages/store/StoreNotFound';
import { Unsubscribe } from './pages/store/Unsubscribe';
import { ConfirmSubscription } from './pages/store/ConfirmSubscription';
import { BrandLoadingScreen } from './components/shared/BrandLoadingScreen';
import { useSellia } from './contexts/SelliaContext';
import { getTheme } from './utils/themes';
import type { ThemeId } from './types';

type StoreLayoutChoice = 'grid' | 'list';

interface AppProps {
  /** Thème appliqué à la boutique publique. */
  storeTheme?: ThemeId;
  /** Disposition du catalogue de la boutique publique. */
  storeLayout?: StoreLayoutChoice;
  /** Affiche la signature « Propulsé par SELLIA » sur la boutique publique. */
  showSelliaBranding?: boolean;
}

const platformPaths = new Set([
  '', 'connexion', 'inscription', 'mot-de-passe-oublie', 'onboarding', 'dashboard', 'demo', 'desabonnement', 'confirmation'
]);

function PlatformLoadingGate({ children }: {children: React.ReactNode}) {
  const location = useLocation();
  const { bootstrapStatus } = useSellia();
  const firstSegment = location.pathname.split('/').filter(Boolean)[0] ?? '';

  if (platformPaths.has(firstSegment) && bootstrapStatus === 'loading') {
    return <BrandLoadingScreen label="Chargement de SELLIA..." />;
  }

  return <>{children}</>;
}

export function App({
  storeTheme = 'emerald',
  storeLayout = 'grid',
  showSelliaBranding = true
}: AppProps) {
  return (
    <BrowserRouter>
      <SelliaProvider
        initialStore={{
          theme: storeTheme,
          layout: storeLayout,
          showBranding: showSelliaBranding
        }}>
        <ScrollToTop />
        <RouteProgress />
        <PlatformLoadingGate>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Signup />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/desabonnement/:token" element={<Unsubscribe />} />
          <Route path="/confirmation/:token" element={<ConfirmSubscription />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="produits" element={<Products />} />
            <Route path="produits/nouveau" element={<ProductForm />} />
            <Route path="produits/:productId" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="commandes" element={<Orders />} />
            <Route path="commandes/:orderId" element={<OrderDetail />} />
            <Route path="clients" element={<Customers />} />
            <Route path="abonnes" element={<Subscribers />} />
            <Route path="statistiques" element={<Analytics />} />
            <Route path="boutique" element={<StoreProfile />} />
            <Route path="apparence" element={<Appearance />} />
            <Route path="parametres" element={<Settings />} />
          </Route>

          <Route path="/demo/basic" element={<Navigate to="/novamarket" replace />} />
          <Route path="/demo/premium" element={<StorePremiumDemo />} />
          <Route path="/demo/premium/catalogue" element={<StorePremiumDemo />} />
          <Route path="/demo/premium/contact" element={<StorePremiumDemo />} />
          <Route path="/demo/premium/panier" element={<StorePremiumDemo />} />
          <Route path="/demo/premium/commande" element={<StorePremiumDemo />} />
          <Route
            path="/demo/premium/produit/:productSlug"
            element={
              <div className="min-h-screen" style={{ backgroundColor: getTheme('noir').surface, color: getTheme('noir').text }}>
                <StoreProductDetail />
              </div>
            }
          />

          <Route path="/:slug" element={<StorefrontLayout />}>
            <Route index element={<StoreHome />} />
            <Route path="catalogue" element={<StoreCatalog />} />
            <Route path="recherche" element={<StoreSearch />} />
            <Route path="produit/:productSlug" element={<StoreProductDetail />} />
            <Route path="panier" element={<StoreCart />} />
            <Route path="commande" element={<Navigate to="../panier" replace />} />
            <Route path="favoris" element={<StoreFavorites />} />
            <Route path="compte" element={<StoreAccount />} />
            <Route path="contact" element={<StoreContact />} />
            <Route path="*" element={<StoreNotFound />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PlatformLoadingGate>
        <Toaster position="top-center" richColors />
      </SelliaProvider>
    </BrowserRouter>);

}
