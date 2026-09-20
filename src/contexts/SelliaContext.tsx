import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type {
  CartLine,
  Category,
  CheckoutDetails,
  Customer,
  Order,
  OrderStatus,
  PlanId,
  Product,
  Store,
  StoreAnalytics,
  User
} from '../types';
import { canPublishProduct } from '../data/plans';
import { api, ApiError } from '../utils/api';
import { slugify } from '../utils/format';

interface BootstrapPayload {
  user?: User | null;
  store: Store;
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  analytics: StoreAnalytics;
  onboardingComplete: boolean;
}

interface SelliaState {
  user: User | null;
  store: Store;
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  analytics: StoreAnalytics;
  cart: CartLine[];
  favorites: string[];
  checkout: CheckoutDetails;
  onboardingComplete: boolean;
  bootstrapStatus: 'loading' | 'ready' | 'not-found' | 'error';
  bootstrapError: string | null;
  bootstrapSlug: string;
}

interface SelliaActions {
  signup: (payload: Omit<User, 'plan'>, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setPlan: (plan: PlanId) => Promise<Store>;
  startPremiumCheckout: () => Promise<void>;
  openBillingPortal: () => Promise<void>;
  refreshDashboard: () => Promise<Store>;
  updateStore: (patch: Partial<Store>) => Promise<Store>;
  completeOnboarding: () => void;
  finishOnboarding: (
    nextStore: Store,
    product: Omit<Product, 'id' | 'slug' | 'views' | 'createdAt'>
  ) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'views' | 'createdAt'>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductHidden: (id: string) => void;
  addCategory: (name: string, icon?: string) => void;
  renameCategory: (id: string, name: string, icon?: string) => void;
  deleteCategory: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addToCart: (line: Omit<CartLine, 'lineId'>) => void;
  toggleFavorite: (productId: string) => boolean;
  updateCartQuantity: (lineId: string, quantity: number) => void;
  removeCartLine: (lineId: string) => void;
  clearCart: () => void;
  setCheckout: (patch: Partial<CheckoutDetails>) => void;
  placeOrder: (details: CheckoutDetails) => Order;
}

type SelliaContextValue = SelliaState & SelliaActions;

const SelliaContext = createContext<SelliaContextValue | null>(null);

const emptyCheckout: CheckoutDetails = {
  name: '',
  phone: '',
  address: '',
  city: '',
  note: ''
};

const emptyStore: Store = {
  name: '',
  slug: '',
  category: 'Autres',
  description: '',
  logo: '',
  cover: '',
  coverMobile: '',
  whatsapp: '',
  address: '',
  city: '',
  country: '',
  currency: '$',
  instagram: '',
  tiktok: '',
  facebook: '',
  theme: 'emerald',
  layout: 'grid',
  font: 'Geist',
  heroTitle: '',
  heroSubtitle: '',
  ctaLabel: 'Commander sur WhatsApp',
  showBranding: true,
  plan: 'basic',
  newsletterAvailable: false,
  verificationStatus: 'unverified'
};

const reservedPaths = new Set([
  '', 'connexion', 'inscription', 'mot-de-passe-oublie', 'onboarding', 'dashboard', 'demo', 'desabonnement', 'confirmation'
]);

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function routeStore(pathname: string): { slug: string; dashboard: boolean; publicStore: boolean } {
  if (pathname.startsWith('/demo/premium')) {
    return { slug: 'novamarket-premium', dashboard: false, publicStore: true };
  }
  const firstSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  return {
    slug: reservedPaths.has(firstSegment) ? 'novamarket' : firstSegment,
    dashboard: firstSegment === 'dashboard' || firstSegment === 'onboarding',
    publicStore: Boolean(firstSegment) && !reservedPaths.has(firstSegment)
  };
}

function visitorKey(): string {
  const storageKey = 'sellia:visitor-id';
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;
  const created = window.crypto.randomUUID();
  window.localStorage.setItem(storageKey, created);
  return created;
}

function reportPersistenceError(error: unknown) {
  const message = error instanceof Error ? error.message : 'La sauvegarde a échoué.';
  toast.error(message);
}

interface ProviderProps {
  children: React.ReactNode;
  initialStore?: Partial<Store>;
}

export function SelliaProvider({ children, initialStore }: ProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const routeTarget = useMemo(() => routeStore(location.pathname), [location.pathname]);
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store>({ ...emptyStore, ...initialStore });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<StoreAnalytics>({ visitors7d: 0, visitors30d: 0, daily: [] });
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = window.localStorage.getItem('sellia:favorites');
      return raw ? JSON.parse(raw) as string[] : [];
    } catch {
      return [];
    }
  });
  const [checkout, setCheckoutState] = useState<CheckoutDetails>(emptyCheckout);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [bootstrapState, setBootstrapState] = useState<{
    status: 'loading' | 'ready' | 'not-found' | 'error';
    error: string | null;
    slug: string;
  }>({ status: 'loading', error: null, slug: routeTarget.slug });

  const applyBootstrap = useCallback((payload: BootstrapPayload) => {
    setStore(payload.store);
    setProducts(payload.products);
    setCategories(payload.categories);
    setOrders(payload.orders);
    setCustomers(payload.customers);
    setAnalytics(payload.analytics);
    setOnboardingComplete(payload.onboardingComplete);
    if ('user' in payload) setUser(payload.user ?? null);
  }, []);

  useEffect(() => {
    const target = routeTarget;
    const controller = new AbortController();
    setBootstrapState({ status: 'loading', error: null, slug: target.slug });
    api<BootstrapPayload>(
      `/bootstrap?slug=${encodeURIComponent(target.slug)}${target.dashboard ? '&dashboard=1' : ''}`,
      { signal: controller.signal }
    ).then((payload) => {
      applyBootstrap(payload);
      setBootstrapState({ status: 'ready', error: null, slug: target.slug });
      if (target.publicStore) {
        void api(`/stores/${encodeURIComponent(payload.store.slug)}/visit`, {
          method: 'POST',
          body: JSON.stringify({ visitorKey: visitorKey() })
        }).catch((error) => console.error('SELLIA visit:', error));
      }
    }).catch((error) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      if (target.dashboard && error instanceof ApiError && error.status === 401) {
        setUser(null);
        toast.error(error.message);
        navigate('/connexion', { replace: true });
        return;
      }
      if (error instanceof ApiError && error.status === 404) {
        setBootstrapState({ status: 'not-found', error: error.message, slug: target.slug });
        return;
      }
      setBootstrapState({
        status: 'error',
        error: error instanceof ApiError
          ? error.message
          : 'Impossible de contacter SELLIA. Vérifie ta connexion puis réessaie.',
        slug: target.slug
      });
      console.error('SELLIA bootstrap:', error);
    });
    return () => controller.abort();
  }, [applyBootstrap, navigate, routeTarget.dashboard, routeTarget.publicStore, routeTarget.slug]);

  const signup = useCallback(async (payload: Omit<User, 'plan'>, password: string) => {
    const result = await api<BootstrapPayload>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ ...payload, password })
    });
    applyBootstrap(result);
  }, [applyBootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api<BootstrapPayload>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    applyBootstrap(result);
    return result.onboardingComplete;
  }, [applyBootstrap]);

  const logout = useCallback(() => {
    setUser(null);
    void api('/auth/logout', { method: 'POST' }).catch(reportPersistenceError);
  }, []);

  const persistStore = useCallback((nextStore: Store, onboarding = onboardingComplete) => {
    void api<BootstrapPayload>(`/stores/${encodeURIComponent(store.slug)}`, {
      method: 'PUT',
      body: JSON.stringify({ ...nextStore, onboardingComplete: onboarding })
    }).then((payload) => {
      setStore(payload.store);
      setOnboardingComplete(payload.onboardingComplete);
    }).catch(reportPersistenceError);
  }, [onboardingComplete, store.slug]);

  const setPlan = useCallback(async (plan: PlanId) => {
    const payload = await api<BootstrapPayload>(`/stores/${encodeURIComponent(store.slug)}/plan`, {
      method: 'POST',
      body: JSON.stringify({ plan })
    });
    applyBootstrap(payload);
    setUser((current) => current ? { ...current, plan: payload.store.plan } : current);
    return payload.store;
  }, [applyBootstrap, store.slug]);

  const startPremiumCheckout = useCallback(async () => {
    const { url } = await api<{ url: string }>(`/stores/${encodeURIComponent(store.slug)}/billing/checkout`, {
      method: 'POST',
      body: JSON.stringify({ returnPath: window.location.pathname })
    });
    window.location.assign(url);
  }, [store.slug]);

  const openBillingPortal = useCallback(async () => {
    const { url } = await api<{ url: string }>(`/stores/${encodeURIComponent(store.slug)}/billing/portal`, {
      method: 'POST'
    });
    window.location.assign(url);
  }, [store.slug]);

  const refreshDashboard = useCallback(async () => {
    const payload = await api<BootstrapPayload>('/bootstrap?dashboard=1');
    applyBootstrap(payload);
    return payload.store;
  }, [applyBootstrap]);

  const updateStore = useCallback(async (patch: Partial<Store>) => {
    const nextStore = { ...store, ...patch };
    setStore(nextStore);
    try {
      const saved = await api<BootstrapPayload>(`/stores/${encodeURIComponent(store.slug)}`, {
        method: 'PUT',
        body: JSON.stringify({ ...nextStore, onboardingComplete })
      });
      setStore(saved.store);
      setOnboardingComplete(saved.onboardingComplete);
      return saved.store;
    } catch (error) {
      setStore(store);
      reportPersistenceError(error);
      throw error;
    }
  }, [onboardingComplete, store]);

  const completeOnboarding = useCallback(() => {
    setOnboardingComplete(true);
    persistStore(store, true);
  }, [persistStore, store]);

  const finishOnboarding = useCallback(async (
    nextStore: Store,
    product: Omit<Product, 'id' | 'slug' | 'views' | 'createdAt'>
  ) => {
    const savedStore = await api<BootstrapPayload>(`/stores/${encodeURIComponent(store.slug)}`, {
      method: 'PUT',
      body: JSON.stringify({ ...nextStore, onboardingComplete: false })
    });

    await api<Product>(`/stores/${encodeURIComponent(savedStore.store.slug)}/products`, {
      method: 'POST',
      body: JSON.stringify(product)
    });

    const completed = await api<BootstrapPayload>(
      `/stores/${encodeURIComponent(savedStore.store.slug)}`,
      {
        method: 'PUT',
        body: JSON.stringify({ ...savedStore.store, onboardingComplete: true })
      }
    );
    applyBootstrap(completed);
  }, [applyBootstrap, store.slug]);

  const addProduct = useCallback(
    (product: Omit<Product, 'id' | 'slug' | 'views' | 'createdAt'>) => {
      const plan = user?.plan ?? store.plan;
      const publishedProductsCount = products.filter((item) => !item.hidden).length;
      if (!product.hidden && !canPublishProduct(plan, publishedProductsCount)) {
        throw new Error('PLAN_PRODUCT_LIMIT_REACHED');
      }
      const created: Product = {
        ...product,
        id: uid('p'),
        slug: slugify(product.name) || uid('produit'),
        views: 0,
        createdAt: new Date().toISOString()
      };
      setProducts((current) => [created, ...current]);
      void api<Product>(`/stores/${encodeURIComponent(store.slug)}/products`, {
        method: 'POST',
        body: JSON.stringify(product)
      }).then((saved) => {
        setProducts((current) => current.map((item) => item.id === created.id ? saved : item));
      }).catch((error) => {
        setProducts((current) => current.filter((item) => item.id !== created.id));
        reportPersistenceError(error);
      });
      return created;
    },
    [products, store.plan, store.slug, user?.plan]
  );

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    const source = products.find((item) => item.id === id);
    if (!source) return;
    const updated = { ...source, ...patch, slug: patch.name ? slugify(patch.name) : source.slug };
    setProducts((current) => current.map((item) => item.id === id ? updated : item));
    void api(`/stores/${encodeURIComponent(store.slug)}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updated)
    }).catch(reportPersistenceError);
  }, [products, store.slug]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((current) => current.filter((item) => item.id !== id));
    void api(`/stores/${encodeURIComponent(store.slug)}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(reportPersistenceError);
  }, [store.slug]);

  const duplicateProduct = useCallback((id: string) => {
    const source = products.find((item) => item.id === id);
    if (!source) return;
    const copy: Product = {
      ...source,
      id: uid('p'),
      name: `${source.name} (copie)`,
      slug: `${source.slug}-copie`,
      hidden: true,
      views: 0,
      createdAt: new Date().toISOString()
    };
    setProducts((current) => [copy, ...current]);
    void api<Product>(`/stores/${encodeURIComponent(store.slug)}/products`, {
      method: 'POST',
      body: JSON.stringify(copy)
    }).then((saved) => {
      setProducts((current) => current.map((item) => item.id === copy.id ? saved : item));
    }).catch((error) => {
      setProducts((current) => current.filter((item) => item.id !== copy.id));
      reportPersistenceError(error);
    });
  }, [products, store.slug]);

  const toggleProductHidden = useCallback((id: string) => {
    const source = products.find((item) => item.id === id);
    if (!source) return;
    const publishedProductsCount = products.filter((product) => !product.hidden).length;
    if (source.hidden && !canPublishProduct(user?.plan ?? store.plan, publishedProductsCount)) {
      throw new Error('PLAN_PRODUCT_LIMIT_REACHED');
    }
    const updated = { ...source, hidden: !source.hidden };
    setProducts((current) => current.map((item) => item.id === id ? updated : item));
    void api(`/stores/${encodeURIComponent(store.slug)}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updated)
    }).catch(reportPersistenceError);
  }, [products, store.plan, store.slug, user?.plan]);

  const addCategory = useCallback((name: string, icon = 'tag') => {
    const temporary: Category = { id: uid('cat'), name, slug: slugify(name), emoji: icon };
    setCategories((current) => [...current, temporary]);
    void api<Category>(`/stores/${encodeURIComponent(store.slug)}/categories`, {
      method: 'POST',
      body: JSON.stringify({ name, emoji: icon })
    }).then((saved) => {
      setCategories((current) => current.map((item) => item.id === temporary.id ? saved : item));
    }).catch((error) => {
      setCategories((current) => current.filter((item) => item.id !== temporary.id));
      reportPersistenceError(error);
    });
  }, [store.slug]);

  const renameCategory = useCallback((id: string, name: string, icon?: string) => {
    setCategories((current) => current.map((item) => item.id === id ? {
      ...item,
      name,
      slug: slugify(name),
      emoji: icon || item.emoji
    } : item));
    void api(`/stores/${encodeURIComponent(store.slug)}/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ name, emoji: icon })
    }).catch(reportPersistenceError);
  }, [store.slug]);

  const deleteCategory = useCallback((id: string) => {
    setCategories((current) => current.filter((item) => item.id !== id));
    void api(`/stores/${encodeURIComponent(store.slug)}/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(reportPersistenceError);
  }, [store.slug]);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    void api(`/stores/${encodeURIComponent(store.slug)}/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }).catch(reportPersistenceError);
  }, [store.slug]);

  const addToCart = useCallback((line: Omit<CartLine, 'lineId'>) => {
    setCart((current) => {
      const existing = current.find((item) =>
        item.productId === line.productId && item.size === line.size && item.color === line.color
      );
      if (existing) {
        return current.map((item) => item.lineId === existing.lineId
          ? { ...item, quantity: item.quantity + line.quantity }
          : item);
      }
      return [...current, { ...line, lineId: uid('line') }];
    });
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    const added = !favorites.includes(productId);
    const updated = added
      ? Array.from(new Set([...favorites, productId]))
      : favorites.filter((id) => id !== productId);
    setFavorites(updated);
    window.localStorage.setItem('sellia:favorites', JSON.stringify(updated));
    return added;
  }, [favorites]);

  const updateCartQuantity = useCallback((lineId: string, quantity: number) => {
    setCart((current) => current
      .map((item) => item.lineId === lineId ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0));
  }, []);

  const removeCartLine = useCallback((lineId: string) => {
    setCart((current) => current.filter((item) => item.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const setCheckout = useCallback((patch: Partial<CheckoutDetails>) => {
    setCheckoutState((current) => ({ ...current, ...patch }));
  }, []);

  const placeOrder = useCallback((details: CheckoutDetails) => {
    const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const order: Order = {
      id: uid('o'),
      reference: `SL-${Date.now().toString(36).toUpperCase()}`,
      customerName: details.name,
      phone: details.phone,
      address: details.address,
      city: details.city,
      note: details.note,
      items: cart.map(({ lineId, ...rest }) => rest),
      total,
      status: 'nouvelle',
      createdAt: new Date().toISOString(),
      channel: 'whatsapp'
    };
    setOrders((current) => [order, ...current]);
    setCustomers((current) => {
      const existing = current.find((item) => item.phone === details.phone);
      if (existing) {
        return current.map((item) => item.id === existing.id ? {
          ...item,
          ordersCount: item.ordersCount + 1,
          spent: item.spent + total,
          lastOrder: order.createdAt
        } : item);
      }
      return [{
        id: uid('c'),
        name: details.name,
        phone: details.phone,
        city: details.city,
        ordersCount: 1,
        spent: total,
        lastOrder: order.createdAt
      }, ...current];
    });
    void api(`/stores/${encodeURIComponent(store.slug)}/orders`, {
      method: 'POST',
      body: JSON.stringify(order)
    }).catch(reportPersistenceError);
    return order;
  }, [cart, store.slug]);

  const value = useMemo<SelliaContextValue>(() => ({
    user,
    store,
    products,
    categories,
    orders,
    customers,
    analytics,
    cart,
    favorites,
    checkout,
    onboardingComplete,
    bootstrapStatus: bootstrapState.status,
    bootstrapError: bootstrapState.error,
    bootstrapSlug: bootstrapState.slug,
    signup,
    login,
    logout,
    setPlan,
    startPremiumCheckout,
    openBillingPortal,
    refreshDashboard,
    updateStore,
    completeOnboarding,
    finishOnboarding,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleProductHidden,
    addCategory,
    renameCategory,
    deleteCategory,
    updateOrderStatus,
    addToCart,
    toggleFavorite,
    updateCartQuantity,
    removeCartLine,
    clearCart,
    setCheckout,
    placeOrder
  }), [
    user, store, products, categories, orders, customers, analytics, cart, favorites, checkout,
    bootstrapState,
    onboardingComplete, signup, login, logout, setPlan, startPremiumCheckout, openBillingPortal, refreshDashboard, updateStore, completeOnboarding,
    finishOnboarding,
    addProduct, updateProduct, deleteProduct, duplicateProduct, toggleProductHidden,
    addCategory, renameCategory, deleteCategory, updateOrderStatus, addToCart,
    toggleFavorite, updateCartQuantity, removeCartLine, clearCart, setCheckout, placeOrder
  ]);

  return <SelliaContext.Provider value={value}>{children}</SelliaContext.Provider>;
}

export function useSellia(): SelliaContextValue {
  const context = useContext(SelliaContext);
  if (!context) {
    throw new Error('useSellia doit être utilisé à l’intérieur de SelliaProvider');
  }
  return context;
}
