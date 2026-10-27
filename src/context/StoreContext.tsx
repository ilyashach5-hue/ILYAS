import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  CartItem,
  Order,
  SiteSettings,
  Review,
  BuilderSection,
  ThemeConfig,
  Discount,
  Customer,
  MediaItem,
  CustomPage,
  NavigationMenus,
  SeoSettings,
  ShippingSettings,
  PaymentSettings
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS,
  INITIAL_THEME_CONFIG,
  INITIAL_BUILDER_SECTIONS,
  INITIAL_DISCOUNTS,
  INITIAL_CUSTOMERS,
  INITIAL_MEDIA,
  INITIAL_PAGES,
  INITIAL_NAVIGATION,
  INITIAL_SEO,
  INITIAL_SHIPPING,
  INITIAL_PAYMENT
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  lang: 'ar' | 'fr';
  setLang: (lang: 'ar' | 'fr') => void;
  t: (ar: string, fr?: string) => string;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, color?: string, quantity?: number) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateCartQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  comparedProducts: Product[];
  toggleCompare: (product: Product) => void;
  isCompared: (productId: string) => boolean;
  clearCompare: () => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
  
  // UI Dialog Controls
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  codModalProduct: { product: Product; selectedColor?: string; quantity?: number } | null;
  setCodModalProduct: (item: { product: Product; selectedColor?: string; quantity?: number } | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  
  // VISUAL WEBSITE BUILDER
  isBuilderOpen: boolean;
  setIsBuilderOpen: (open: boolean) => void;
  publishedSections: BuilderSection[];
  draftSections: BuilderSection[];
  themeConfig: ThemeConfig;
  draftThemeConfig: ThemeConfig;
  selectedBuilderSectionId: string | null;
  setSelectedBuilderSectionId: (id: string | null) => void;
  builderViewport: 'desktop' | 'tablet' | 'mobile';
  setBuilderViewport: (vp: 'desktop' | 'tablet' | 'mobile') => void;
  updateDraftSection: (
    id: string,
    contentUpdates?: Record<string, any>,
    styleUpdates?: Record<string, any>,
    generalUpdates?: Partial<BuilderSection>
  ) => void;
  reorderDraftSections: (fromIdx: number, toIdx: number) => void;
  toggleDraftSectionVisibility: (id: string) => void;
  addDraftSection: (section: BuilderSection) => void;
  deleteDraftSection: (id: string) => void;
  duplicateDraftSection: (id: string) => void;
  updateDraftTheme: (updates: Partial<ThemeConfig>) => void;
  saveDraft: () => Promise<void>;
  publishTheme: () => Promise<void>;
  undoBuilder: () => void;
  redoBuilder: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // EXTRA ADMIN DATA
  discounts: Discount[];
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  media: MediaItem[];
  addMediaItem: (item: MediaItem) => void;
  pages: CustomPage[];
  savePage: (page: CustomPage) => void;
  deletePage: (id: string) => void;
  navigation: NavigationMenus;
  saveNavigation: (nav: NavigationMenus) => void;
  seoSettings: SeoSettings;
  updateSeoSettings: (seo: Partial<SeoSettings>) => void;
  shippingSettings: ShippingSettings;
  updateShippingSettings: (shipping: Partial<ShippingSettings>) => void;
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (payment: Partial<PaymentSettings>) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'ar' | 'fr'>('ar');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load state from localStorage with fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('bagora_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // VISUAL WEBSITE BUILDER STATE
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedBuilderSectionId, setSelectedBuilderSectionId] = useState<string | null>('sec-hero');
  const [builderViewport, setBuilderViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Published Live Storefront Theme & Sections
  const [publishedSections, setPublishedSections] = useState<BuilderSection[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_sections_live');
      return saved ? JSON.parse(saved) : INITIAL_BUILDER_SECTIONS;
    } catch {
      return INITIAL_BUILDER_SECTIONS;
    }
  });

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('bagora_theme_live');
      return saved ? JSON.parse(saved) : INITIAL_THEME_CONFIG;
    } catch {
      return INITIAL_THEME_CONFIG;
    }
  });

  // Draft Theme & Sections (for Visual Editor)
  const [draftSections, setDraftSections] = useState<BuilderSection[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_sections_draft');
      return saved ? JSON.parse(saved) : INITIAL_BUILDER_SECTIONS;
    } catch {
      return INITIAL_BUILDER_SECTIONS;
    }
  });

  const [draftThemeConfig, setDraftThemeConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('bagora_theme_draft');
      return saved ? JSON.parse(saved) : INITIAL_THEME_CONFIG;
    } catch {
      return INITIAL_THEME_CONFIG;
    }
  });

  // Undo / Redo stacks
  const [undoStack, setUndoStack] = useState<{ sections: BuilderSection[]; theme: ThemeConfig }[]>([]);
  const [redoStack, setRedoStack] = useState<{ sections: BuilderSection[]; theme: ThemeConfig }[]>([]);

  // ADMIN EXTENDED SECTIONS
  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_discounts');
      return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
    } catch {
      return INITIAL_DISCOUNTS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_media');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  });

  const [pages, setPages] = useState<CustomPage[]>(() => {
    try {
      const saved = localStorage.getItem('bagora_pages');
      return saved ? JSON.parse(saved) : INITIAL_PAGES;
    } catch {
      return INITIAL_PAGES;
    }
  });

  const [navigation, setNavigation] = useState<NavigationMenus>(() => {
    try {
      const saved = localStorage.getItem('bagora_navigation');
      return saved ? JSON.parse(saved) : INITIAL_NAVIGATION;
    } catch {
      return INITIAL_NAVIGATION;
    }
  });

  const [seoSettings, setSeoSettings] = useState<SeoSettings>(() => {
    try {
      const saved = localStorage.getItem('bagora_seo');
      return saved ? JSON.parse(saved) : INITIAL_SEO;
    } catch {
      return INITIAL_SEO;
    }
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(() => {
    try {
      const saved = localStorage.getItem('bagora_shipping');
      return saved ? JSON.parse(saved) : INITIAL_SHIPPING;
    } catch {
      return INITIAL_SHIPPING;
    }
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('bagora_payment');
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT;
    } catch {
      return INITIAL_PAYMENT;
    }
  });

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [codModalProduct, setCodModalProduct] = useState<{ product: Product; selectedColor?: string; quantity?: number } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Sync with backend API
  useEffect(() => {
    // Orders
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders?.length) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.warn('Local API offline:', err));

    // Live theme
    fetch('/api/theme/live')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.theme) {
          if (data.theme.sections) setPublishedSections(data.theme.sections);
          if (data.theme.theme) setThemeConfig(data.theme.theme);
        }
      })
      .catch(() => {});

    // Draft theme
    fetch('/api/theme/draft')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.draft) {
          if (data.draft.sections) setDraftSections(data.draft.sections);
          if (data.draft.theme) setDraftThemeConfig(data.draft.theme);
        }
      })
      .catch(() => {});

    // Customers
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customers?.length) setCustomers(data.customers);
      })
      .catch(() => {});

    // Discounts
    fetch('/api/discounts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.discounts?.length) setDiscounts(data.discounts);
      })
      .catch(() => {});

    // Media
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.media?.length) setMedia(data.media);
      })
      .catch(() => {});
  }, []);

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem('bagora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bagora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bagora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bagora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bagora_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('bagora_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('bagora_sections_live', JSON.stringify(publishedSections));
  }, [publishedSections]);

  useEffect(() => {
    localStorage.setItem('bagora_theme_live', JSON.stringify(themeConfig));
  }, [themeConfig]);

  useEffect(() => {
    localStorage.setItem('bagora_sections_draft', JSON.stringify(draftSections));
  }, [draftSections]);

  useEffect(() => {
    localStorage.setItem('bagora_theme_draft', JSON.stringify(draftThemeConfig));
  }, [draftThemeConfig]);

  useEffect(() => {
    localStorage.setItem('bagora_discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem('bagora_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('bagora_media', JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem('bagora_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('bagora_navigation', JSON.stringify(navigation));
  }, [navigation]);

  useEffect(() => {
    localStorage.setItem('bagora_seo', JSON.stringify(seoSettings));
  }, [seoSettings]);

  useEffect(() => {
    localStorage.setItem('bagora_shipping', JSON.stringify(shippingSettings));
  }, [shippingSettings]);

  useEffect(() => {
    localStorage.setItem('bagora_payment', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  // Sync html dir & lang attributes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const t = (ar: string, fr?: string) => {
    return lang === 'fr' && fr ? fr : ar;
  };

  // Cart actions
  const addToCart = (product: Product, color?: string, quantity: number = 1) => {
    const chosenColor = color || (product.colors[0] ? product.colors[0].name : 'Default');
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedColor === chosenColor
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === chosenColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: chosenColor }];
    });
    showToast(
      lang === 'ar'
        ? `تمت إضافة "${product.name}" إلى السلة`
        : `"${product.nameFr || product.name}" ajouté au panier`,
      'success'
    );
  };

  const removeFromCart = (productId: string, color: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedColor === color)));
    showToast(lang === 'ar' ? 'تم حذف العنصر من السلة' : 'Article retiré du panier', 'info');
  };

  const updateCartQuantity = (productId: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(lang === 'ar' ? 'تمت الإزالة من المفضلة' : 'Retiré des favoris', 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(lang === 'ar' ? 'تمت الإضافة إلى المفضلة' : 'Ajouté aux favoris', 'success');
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.some((p) => p.id === productId);

  // Compare actions
  const toggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        showToast(
          lang === 'ar' ? 'يمكنك مقارنة 4 حقائب كحد أقصى' : 'Maximum 4 sacs en comparaison',
          'warning'
        );
        return prev;
      }
      showToast(
        lang === 'ar' ? 'تمت الإضافة للمقارنة' : 'Ajouté au comparateur',
        'success'
      );
      return [...prev, product];
    });
  };

  const isCompared = (productId: string) => comparedProducts.some((p) => p.id === productId);
  const clearCompare = () => setComparedProducts([]);

  // Orders
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => [data.order, ...prev]);
        return data.order;
      }
    } catch (e) {
      console.warn('API error, saving locally:', e);
    }

    // Fallback local persistence
    const localOrder: Order = {
      ...orderData,
      id: `BG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setOrders((prev) => [localOrder, ...prev]);
    return localOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.warn('API update failed:', e);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(lang === 'ar' ? 'تم تحديث حالة الطلب' : 'Statut mis à jour', 'success');
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete failed:', e);
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(lang === 'ar' ? 'تم حذف الطلب' : 'Commande supprimée', 'info');
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast(lang === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Paramètres enregistrés', 'success');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'verified'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: lang === 'ar' ? 'الآن' : 'À l\'instant',
      verified: true
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast(lang === 'ar' ? 'شكراً لتقييمك الكريم!' : 'Merci pour votre avis !', 'success');
  };

  // VISUAL BUILDER ACTIONS
  const recordHistory = () => {
    setUndoStack((prev) => [...prev.slice(-25), { sections: draftSections, theme: draftThemeConfig }]);
    setRedoStack([]);
  };

  const updateDraftSection = (
    id: string,
    contentUpdates?: Record<string, any>,
    styleUpdates?: Record<string, any>,
    generalUpdates?: Partial<BuilderSection>
  ) => {
    recordHistory();
    setDraftSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== id) return sec;
        return {
          ...sec,
          ...generalUpdates,
          content: contentUpdates ? { ...sec.content, ...contentUpdates } : sec.content,
          styles: styleUpdates ? { ...sec.styles, ...styleUpdates } : sec.styles
        };
      })
    );
  };

  const reorderDraftSections = (fromIdx: number, toIdx: number) => {
    if (fromIdx < 0 || toIdx < 0 || fromIdx >= draftSections.length || toIdx >= draftSections.length) return;
    recordHistory();
    setDraftSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const toggleDraftSectionVisibility = (id: string) => {
    recordHistory();
    setDraftSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const addDraftSection = (section: BuilderSection) => {
    recordHistory();
    setDraftSections((prev) => [...prev, section]);
    setSelectedBuilderSectionId(section.id);
    showToast(lang === 'ar' ? `تمت إضافة قسم جديد: ${section.name}` : `Nouvelle section ajoutée`, 'success');
  };

  const deleteDraftSection = (id: string) => {
    recordHistory();
    setDraftSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedBuilderSectionId === id) setSelectedBuilderSectionId(null);
    showToast(lang === 'ar' ? 'تم حذف القسم من المعاينة' : 'Section supprimée', 'info');
  };

  const duplicateDraftSection = (id: string) => {
    const target = draftSections.find((s) => s.id === id);
    if (!target) return;
    recordHistory();
    const cloned: BuilderSection = {
      ...JSON.parse(JSON.stringify(target)),
      id: `sec-${Date.now().toString().slice(-5)}`,
      name: `${target.name} (نسخة)`
    };
    const targetIdx = draftSections.findIndex((s) => s.id === id);
    setDraftSections((prev) => {
      const next = [...prev];
      next.splice(targetIdx + 1, 0, cloned);
      return next;
    });
    setSelectedBuilderSectionId(cloned.id);
    showToast(lang === 'ar' ? 'تم تكرار القسم بنجاح' : 'Section dupliquée', 'success');
  };

  const updateDraftTheme = (updates: Partial<ThemeConfig>) => {
    recordHistory();
    setDraftThemeConfig((prev) => ({ ...prev, ...updates }));
  };

  const saveDraft = async () => {
    try {
      await fetch('/api/theme/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: Date.now(),
          sections: draftSections,
          theme: draftThemeConfig,
          updatedAt: new Date().toISOString()
        })
      });
    } catch {}
    showToast(lang === 'ar' ? 'تم حفظ المسودة بنجاح' : 'Brouillon enregistré', 'success');
  };

  const publishTheme = async () => {
    setPublishedSections(draftSections);
    setThemeConfig(draftThemeConfig);
    try {
      await fetch('/api/theme/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: {
            version: Date.now(),
            sections: draftSections,
            theme: draftThemeConfig,
            updatedAt: new Date().toISOString()
          }
        })
      });
    } catch {}
    showToast(
      lang === 'ar'
        ? 'تم نشر التعديلات بنجاح! المتجر المباشر محدّث الآن'
        : 'Modifications publiées avec succès sur la boutique en direct !',
      'success'
    );
  };

  const undoBuilder = () => {
    if (!undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, { sections: draftSections, theme: draftThemeConfig }]);
    setUndoStack((u) => u.slice(0, -1));
    setDraftSections(prev.sections);
    setDraftThemeConfig(prev.theme);
  };

  const redoBuilder = () => {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, { sections: draftSections, theme: draftThemeConfig }]);
    setRedoStack((r) => r.slice(0, -1));
    setDraftSections(next.sections);
    setDraftThemeConfig(next.theme);
  };

  // Extra Admin features
  const addMediaItem = (item: MediaItem) => {
    setMedia((prev) => [item, ...prev]);
    fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(() => {});
    showToast(lang === 'ar' ? 'تمت إضافة العنصر للمكتبة' : 'Média ajouté', 'success');
  };

  const savePage = (page: CustomPage) => {
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === page.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = page;
        return next;
      }
      return [...prev, page];
    });
    fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page)
    }).catch(() => {});
    showToast(lang === 'ar' ? 'تم حفظ الصفحة' : 'Page enregistrée', 'success');
  };

  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/pages/${id}`, { method: 'DELETE' }).catch(() => {});
    showToast(lang === 'ar' ? 'تم حذف الصفحة' : 'Page supprimée', 'info');
  };

  const saveNavigation = (nav: NavigationMenus) => {
    setNavigation(nav);
    fetch('/api/settings/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ navigation: nav })
    }).catch(() => {});
    showToast(lang === 'ar' ? 'تم حفظ القوائم' : 'Menus enregistrés', 'success');
  };

  const updateSeoSettings = (seo: Partial<SeoSettings>) => {
    setSeoSettings((prev) => ({ ...prev, ...seo }));
    fetch('/api/settings/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seo: { ...seoSettings, ...seo } })
    }).catch(() => {});
    showToast(lang === 'ar' ? 'تم تحديث إعدادات SEO' : 'Paramètres SEO enregistrés', 'success');
  };

  const updateShippingSettings = (shipping: Partial<ShippingSettings>) => {
    setShippingSettings((prev) => ({ ...prev, ...shipping }));
    fetch('/api/settings/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipping: { ...shippingSettings, ...shipping } })
    }).catch(() => {});
    showToast(lang === 'ar' ? 'تم تحديث إعدادات الشحن' : 'Paramètres de livraison enregistrés', 'success');
  };

  const updatePaymentSettings = (payment: Partial<PaymentSettings>) => {
    setPaymentSettings((prev) => ({ ...prev, ...payment }));
    fetch('/api/settings/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment: { ...paymentSettings, ...payment } })
    }).catch(() => {});
    showToast(lang === 'ar' ? 'تم تحديث إعدادات الدفع' : 'Paramètres de paiement enregistrés', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        t,
        theme,
        setTheme,
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        comparedProducts,
        toggleCompare,
        isCompared,
        clearCompare,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        settings,
        updateSettings,
        reviews,
        addReview,
        quickViewProduct,
        setQuickViewProduct,
        codModalProduct,
        setCodModalProduct,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCompareOpen,
        setIsCompareOpen,
        isAssistantOpen,
        setIsAssistantOpen,
        isAdminOpen,
        setIsAdminOpen,

        // Visual Builder
        isBuilderOpen,
        setIsBuilderOpen,
        publishedSections,
        draftSections,
        themeConfig,
        draftThemeConfig,
        selectedBuilderSectionId,
        setSelectedBuilderSectionId,
        builderViewport,
        setBuilderViewport,
        updateDraftSection,
        reorderDraftSections,
        toggleDraftSectionVisibility,
        addDraftSection,
        deleteDraftSection,
        duplicateDraftSection,
        updateDraftTheme,
        saveDraft,
        publishTheme,
        undoBuilder,
        redoBuilder,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,

        // Extra Admin Sections
        discounts,
        setDiscounts,
        customers,
        setCustomers,
        media,
        addMediaItem,
        pages,
        savePage,
        deletePage,
        navigation,
        saveNavigation,
        seoSettings,
        updateSeoSettings,
        shippingSettings,
        updateShippingSettings,
        paymentSettings,
        updatePaymentSettings,

        toasts,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
