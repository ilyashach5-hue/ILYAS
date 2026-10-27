import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Boxes,
  Tag,
  Palette,
  FileText,
  Menu as MenuIcon,
  Image as ImageIcon,
  Star,
  Truck,
  CreditCard,
  Search as SearchIcon,
  BarChart3,
  Settings,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Lock,
  Unlock,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  ExternalLink,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, Discount, CustomPage, AdminUser } from '../types';
import { MOROCCAN_CITIES } from '../data/initialData';
import { MediaPickerModal } from './admin/MediaPickerModal';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    setIsBuilderOpen,
    products,
    setProducts,
    orders,
    updateOrderStatus,
    deleteOrder,
    settings,
    updateSettings,
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
    reviews,
    lang,
    t,
    showToast
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active section among the 18 sidebar items
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Orders management states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Products management states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Discount management states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(200);

  // Pages management states
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  // Admin users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 'adm-1',
      username: 'admin',
      name: 'Ilyas (المدير التنفيذي)',
      role: 'superadmin',
      email: 'ilyas@bagora.ma',
      lastLogin: '2026-10-27 10:15'
    },
    {
      id: 'adm-2',
      username: 'manager_casa',
      name: 'مسؤول مبيعات الدار البيضاء',
      role: 'manager',
      email: 'support@bagora.ma',
      lastLogin: '2026-10-26 18:30'
    }
  ]);

  if (!isAdminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin' || password === '2026') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast(t('مرحباً بك في لوحة تحكم BAGORA الشاملة', 'Bienvenue sur votre Dashboard BAGORA'), 'success');
    } else {
      setAuthError(t('كلمة المرور غير صحيحة (جرب: admin123)', 'Mot de passe incorrect (essayez: admin123)'));
    }
  };

  // KPI Calculations
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status !== 'cancelled' && o.status !== 'returned' ? o.total : 0),
    0
  );
  const deliveredRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'new' || o.status === 'confirmed' || o.status === 'processing'
  ).length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch) ||
      o.city.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Customer', 'Phone', 'City', 'Address', 'Total (MAD)', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.city}"`,
      `"${o.address}"`,
      o.total,
      o.status,
      o.createdAt
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bagora_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t('تم تصدير ملف الطلبات بنجاح', 'Export CSV réussi'), 'success');
  };

  // Product Actions
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isAddingNewProduct) {
      setProducts((prev) => [editingProduct, ...prev]);
      showToast(t('تمت إضافة الحقيبة بنجاح للمتجر', 'Nouveau sac ajouté'), 'success');
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      showToast(t('تم تحديث بيانات الحقيبة', 'Sac mis à jour'), 'success');
    }
    setEditingProduct(null);
    setIsAddingNewProduct(false);
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...JSON.parse(JSON.stringify(p)),
      id: `bag-${Date.now().toString().slice(-4)}`,
      name: `${p.name} (نسخة جديدة)`,
      nameFr: `${p.nameFr} (Copie)`
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(t('تم تكرار المنتج بنجاح', 'Produit dupliqué'), 'success');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm(t('هل أنت متأكد من حذف هذه الحقيبة نهائياً؟', 'Supprimer ce sac ?'))) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(t('تم حذف الحقيبة', 'Sac supprimé'), 'info');
    }
  };

  const startAddNewProduct = () => {
    const newProd: Product = {
      id: `bag-${Date.now().toString().slice(-4)}`,
      name: 'حقيبة ظهر فاخرة جديدة',
      nameFr: 'Nouveau Sac à Dos Luxe',
      category: 'رجال أعمال وتقنية',
      categoryFr: 'Business & Tech',
      price: 249,
      originalPrice: 350,
      discountPercent: 28,
      rating: 5.0,
      reviewCount: 1,
      image: '/src/assets/images/hero_luxury_backpack_1793111382060.jpg',
      badges: ['جديد', 'شحن مجاني'],
      badgesFr: ['Nouveau'],
      specBadge: 'سعة 25L · حماية لابتوب صدمات',
      specBadgeFr: 'Capacité 25L · Protection PC',
      featureBadge: 'شحن مجاني لكافة المدن',
      featureBadgeFr: 'Livraison Gratuite',
      description: 'حقيبة ظهر مصنوعة من أجود الخامات العازلة للماء مع جيوب متعددة لتنظيم الأغراض.',
      descriptionFr: 'Sac à dos imperméable avec rangements multiples.',
      stock: 15,
      colors: [
        { name: 'أسود كلاسيكي', nameFr: 'Noir Classique', hex: '#111111', inStock: true },
        { name: 'كحلي', nameFr: 'Bleu Marine', hex: '#1e293b', inStock: true }
      ],
      specs: {
        capacity: '25 لتر',
        laptopSize: 'حتى 15.6 بوصة',
        waterproof: true,
        weight: '800 غرام',
        dimensions: '44 × 30 × 15 سم',
        material: 'نايلون باليستي وجلد فاخر'
      },
      featured: true,
      active: true
    };
    setEditingProduct(newProd);
    setIsAddingNewProduct(true);
  };

  // Coupons
  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newDisc: Discount = {
      id: `disc-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      type: 'percentage',
      value: newCouponValue,
      minSpend: newCouponMin,
      active: true,
      usageCount: 0
    };

    setDiscounts((prev) => [newDisc, ...prev]);
    setNewCouponCode('');
    showToast(t('تم إنشاء كوبون الخصم بنجاح', 'Code promo créé'), 'success');
  };

  const sidebarItems = [
    { id: 'overview', label: t('نظرة عامة', 'Vue d\'ensemble'), icon: LayoutDashboard },
    { id: 'orders', label: t('الطلبات (COD)', 'Commandes'), icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'products', label: t('الحقائب والمنتجات', 'Produits'), icon: Package, badge: products.length },
    { id: 'categories', label: t('التصنيفات', 'Catégories'), icon: Layers },
    { id: 'customers', label: t('الزبائن بالمغرب', 'Clients'), icon: Users, badge: customers.length },
    { id: 'inventory', label: t('المخزون والتنبيهات', 'Inventaire'), icon: Boxes, badge: lowStockProducts.length ? 'نقص' : undefined },
    { id: 'discounts', label: t('كوبونات الخصم', 'Réductions'), icon: Tag },
    { id: 'builder', label: t('محرر المظهر المرئي', 'Visual Builder'), icon: Palette, highlight: true },
    { id: 'pages', label: t('الصفحات المخصصة', 'Pages CMS'), icon: FileText },
    { id: 'navigation', label: t('قوائم الموقع', 'Menus Navigation'), icon: MenuIcon },
    { id: 'media', label: t('مكتبة الصور والوسائط', 'Médiathèque'), icon: ImageIcon },
    { id: 'reviews', label: t('آراء وتقييمات الزبائن', 'Avis Clients'), icon: Star },
    { id: 'shipping', label: t('إعدادات الشحن والتوصيل', 'Livraison Maroc'), icon: Truck },
    { id: 'payment', label: t('الدفع عند الاستلام (COD)', 'Paiement COD'), icon: CreditCard },
    { id: 'seo', label: t('تحسين محركات البحث SEO', 'Référencement SEO'), icon: SearchIcon },
    { id: 'analytics', label: t('التقارير والإحصائيات', 'Statistiques'), icon: BarChart3 },
    { id: 'settings', label: t('إعدادات المتجر العامة', 'Paramètres Boutique'), icon: Settings },
    { id: 'adminUsers', label: t('مديرو النظام', 'Utilisateurs Admin'), icon: Shield }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 text-right rtl:text-right ltr:text-left font-cairo select-none">
      <div className="relative w-full max-w-[1400px] h-[95vh] bg-[#120E0B] border border-[#D4AF37]/35 rounded-[26px] shadow-2xl flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <div className="h-14 border-b border-[#D4AF37]/20 bg-[#0D0A08] px-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] flex items-center justify-center font-bold">
              B
            </div>
            <div>
              <span className="font-brand font-black text-base text-white">BAGORA</span>
              <span className="text-[11px] text-[#D4AF37] mr-2 rtl:mr-2 ltr:ml-2 font-tajawal">لوحة الإدارة والتحكم الشاملة</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsBuilderOpen(true);
                  setIsAdminOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] text-xs font-bold hover:brightness-110 shadow-md"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{t('فتح محرر المظهر المرئي', 'Visual Builder')}</span>
              </button>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="w-8 h-8 rounded-full bg-[#1a140d] border border-[#D4AF37]/25 flex items-center justify-center text-neutral-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm p-6 bg-[#0D0A08] border border-[#D4AF37]/30 rounded-2xl text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#1a140d] border border-[#D4AF37]/30 text-[#F4BE16] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white font-cairo">
                {t('تسجيل دخول مدير المتجر', 'Connexion Administrateur')}
              </h3>
              <p className="text-xs text-[#B5ADA5]">
                {t('أدخل كلمة المرور لتعديل المتجر (الافتراضي: admin123)', 'Mot de passe par défaut : admin123')}
              </p>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  placeholder={t('كلمة المرور...', 'Mot de passe...')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-4 py-3 border border-[#D4AF37]/30 text-center tracking-widest focus:border-[#F4BE16]"
                />
                {authError && <p className="text-xs text-red-400">{authError}</p>}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-xs hover:brightness-110 shadow-md"
                >
                  {t('دخول لوحة التحكم', 'Se Connecter')}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD: SIDEBAR + CONTENT */
          <div className="flex-1 flex overflow-hidden">
            
            {/* 18-SECTION SIDEBAR */}
            <aside className="w-64 border-l rtl:border-l ltr:border-r border-[#D4AF37]/20 bg-[#0D0A08] flex flex-col shrink-0 overflow-y-auto p-2.5 space-y-0.5">
              <div className="px-3 py-2 text-[10px] uppercase font-bold text-[#D4AF37]/80 tracking-wider">
                {t('القائمة الرئيسية للإدارة', 'Menu Principal')}
              </div>

              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'builder') {
                        setIsBuilderOpen(true);
                        setIsAdminOpen(false);
                      } else {
                        setActiveTab(item.id);
                        setEditingProduct(null);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#F4BE16] text-[#0D0A08] font-bold shadow-md shadow-[#D4AF37]/20'
                        : item.highlight
                        ? 'bg-[#1a140d] text-[#F4BE16] border border-[#D4AF37]/30 hover:border-[#F4BE16]'
                        : 'text-[#B5ADA5] hover:text-white hover:bg-[#120E0B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0D0A08]' : item.highlight ? 'text-[#F4BE16]' : 'text-[#D4AF37]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-[#0D0A08] text-[#F4BE16]'
                            : typeof item.badge === 'string'
                            ? 'bg-red-950 text-red-300'
                            : 'bg-[#1a140d] text-[#D4AF37]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#120E0B]">
              
              {/* SECTION 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Stats Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25">
                      <span className="text-xs text-[#B5ADA5] block">{t('إجمالي المبيعات (COD)', 'Chiffre d\'Affaires')}</span>
                      <div className="text-2xl font-black text-[#F4BE16] font-tajawal mt-1">
                        {totalRevenue} {t('د.م', 'MAD')}
                      </div>
                      <span className="text-[10px] text-emerald-400 mt-1 block">★ نقداً عند الاستلام</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25">
                      <span className="text-xs text-[#B5ADA5] block">{t('مبالغ تم تحصيلها (تم التسليم)', 'Encaissé')}</span>
                      <div className="text-2xl font-black text-emerald-400 font-tajawal mt-1">
                        {deliveredRevenue} {t('د.م', 'MAD')}
                      </div>
                      <span className="text-[10px] text-[#B5ADA5] mt-1 block">طلبات مستلمة 100%</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25">
                      <span className="text-xs text-[#B5ADA5] block">{t('إجمالي الطلبيات', 'Total Commandes')}</span>
                      <div className="text-2xl font-black text-white font-tajawal mt-1">
                        {totalOrdersCount}
                      </div>
                      <span className="text-[10px] text-amber-400 mt-1 block">
                        {pendingOrdersCount} قيد المتابعة والشحن
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25">
                      <span className="text-xs text-[#B5ADA5] block">{t('الحقائب المعروضة', 'Produits')}</span>
                      <div className="text-2xl font-black text-white font-tajawal mt-1">
                        {products.length}
                      </div>
                      <span className="text-[10px] text-[#D4AF37] mt-1 block">جاهزة للطلب الفوري</span>
                    </div>
                  </div>

                  {/* Quick Shortcut Banner for Visual Builder */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17110c] via-[#241a10] to-[#17110c] border border-[#D4AF37]/35 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-[#F4BE16]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('محرر المظهر المباشر الشبيه بـ Shopify', 'Visual Website Builder')}</span>
                      </div>
                      <h3 className="text-base font-bold text-white font-cairo">
                        {t('خصص بانرات الموقع، النصوص، الألوان، وترتيب الأقسام بالسحب والإفلات', 'Éditez la boutique visuellement')}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setIsBuilderOpen(true);
                        setIsAdminOpen(false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-bold text-xs hover:brightness-110 whitespace-nowrap shadow-md"
                    >
                      {t('بدء التعديل المرئي الآن', 'Lancer l\'Éditeur')}
                    </button>
                  </div>

                  {/* Recent Orders Preview */}
                  <div className="p-5 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-cairo">
                        {t('أحدث طلبيات الدفع عند الاستلام بالمغرب', 'Dernières Commandes')}
                      </h4>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-[#F4BE16] hover:underline"
                      >
                        {t('عرض جميع الطلبات', 'Voir tout')} &larr;
                      </button>
                    </div>

                    <div className="space-y-2">
                      {orders.slice(0, 4).map((o) => (
                        <div
                          key={o.id}
                          className="p-3 rounded-xl bg-[#120E0B] border border-[#D4AF37]/15 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#F4BE16]">{o.id}</span>
                            <span className="text-white font-semibold mr-2 rtl:mr-2 ltr:ml-2">{o.customerName}</span>
                            <span className="text-[#B5ADA5]">({o.city})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-[#F4BE16] font-tajawal">{o.total} د.م</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                o.status === 'delivered'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : o.status === 'shipped'
                                  ? 'bg-blue-950 text-blue-400'
                                  : 'bg-amber-950 text-amber-400'
                              }`}
                            >
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white font-cairo">
                        {t('إدارة طلبيات الزبائن (Cash on Delivery)', 'Gestion des Commandes COD')}
                      </h3>
                      <p className="text-xs text-[#B5ADA5]">
                        {t('تأكيد الطلبات، تحديث حالة الشحن، طباعة الفاتورة، وتصدير البيانات', 'Gérez les statuts de livraison')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportCsv}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D0A08] text-[#F4BE16] border border-[#D4AF37]/35 text-xs font-bold hover:bg-[#1a140d]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t('تصدير CSV', 'Exporter')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder={t('بحث برقم الطلب، اسم الزبون، المدينة، الهاتف...', 'Recherche...')}
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 flex-1 min-w-[200px]"
                    />
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 cursor-pointer"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="new">جديد (New)</option>
                      <option value="confirmed">مؤكد (Confirmed)</option>
                      <option value="processing">قيد التجهيز (Processing)</option>
                      <option value="shipped">قيد الشحن (Shipped)</option>
                      <option value="delivered">تم التسليم (Delivered)</option>
                      <option value="cancelled">ملغي (Cancelled)</option>
                      <option value="returned">مرتجع (Returned)</option>
                    </select>
                  </div>

                  {/* Orders Table */}
                  <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/20 bg-[#0D0A08]">
                    <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37] bg-[#120E0B]/80 font-bold">
                          <th className="p-3">رقم الطلب</th>
                          <th className="p-3">الزبون</th>
                          <th className="p-3">الهاتف</th>
                          <th className="p-3">المدينة والعنوان</th>
                          <th className="p-3">الحقائب</th>
                          <th className="p-3">المبلغ الإجمالي</th>
                          <th className="p-3">حالة الطلب</th>
                          <th className="p-3">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4AF37]/10">
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-[#120E0B] transition-colors">
                              <td className="p-3 font-mono font-bold text-[#F4BE16]">{o.id}</td>
                              <td className="p-3 font-semibold text-white">{o.customerName}</td>
                              <td className="p-3" dir="ltr">{o.phone}</td>
                              <td className="p-3 max-w-[200px]">
                                <div className="font-bold text-white">{o.city}</div>
                                <div className="text-[11px] text-[#B5ADA5] truncate">{o.address}</div>
                              </td>
                              <td className="p-3">
                                {o.items.map((it, idx) => (
                                  <div key={idx} className="text-[11px]">
                                    {it.quantity}x {it.productName} ({it.color})
                                  </div>
                                ))}
                              </td>
                              <td className="p-3 font-black text-[#F4BE16] font-tajawal">
                                {o.total} د.م
                              </td>
                              <td className="p-3">
                                <select
                                  value={o.status}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                                  className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer ${
                                    o.status === 'delivered'
                                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                                      : o.status === 'shipped'
                                      ? 'bg-blue-950/80 text-blue-400 border-blue-500/40'
                                      : o.status === 'processing'
                                      ? 'bg-purple-950/80 text-purple-400 border-purple-500/40'
                                      : o.status === 'confirmed'
                                      ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                      : o.status === 'returned'
                                      ? 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                                      : o.status === 'cancelled'
                                      ? 'bg-red-950/80 text-red-400 border-red-500/40'
                                      : 'bg-neutral-800 text-white border-neutral-600'
                                  }`}
                                >
                                  <option value="new">جديد (New)</option>
                                  <option value="confirmed">مؤكد (Confirmed)</option>
                                  <option value="processing">قيد التجهيز (Processing)</option>
                                  <option value="shipped">قيد الشحن (Shipped)</option>
                                  <option value="delivered">تم التسليم (Delivered)</option>
                                  <option value="cancelled">ملغي (Cancelled)</option>
                                  <option value="returned">مرتجع (Returned)</option>
                                </select>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedOrderForInvoice(o)}
                                    className="p-1 rounded-lg bg-[#1a140d] text-[#F4BE16] hover:bg-[#D4AF37]/20"
                                    title="معاينة وطباعة الفاتورة"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteOrder(o.id)}
                                    className="p-1 rounded-lg bg-[#1a140d] text-red-400 hover:text-red-300"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-[#B5ADA5]">
                              {t('لا توجد طلبات تطابق هذا البحث', 'Aucune commande')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SECTION 3: PRODUCTS MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  {editingProduct ? (
                    /* EDIT / ADD PRODUCT FORM */
                    <form onSubmit={handleSaveProduct} className="p-5 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/30 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                        <h4 className="text-sm font-bold text-white font-cairo">
                          {isAddingNewProduct ? t('إضافة حقيبة جديدة للمتجر', 'Nouveau Sac') : t(`تعديل: ${editingProduct.name}`, 'Modifier le sac')}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="text-xs text-[#B5ADA5] hover:text-white"
                        >
                          {t('إلغاء والعودة', 'Annuler')}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-[#B5ADA5] mb-1">اسم الحقيبة (بالعربية) *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#B5ADA5] mb-1">Nom du sac (Français)</label>
                          <input
                            type="text"
                            value={editingProduct.nameFr}
                            onChange={(e) => setEditingProduct({ ...editingProduct, nameFr: e.target.value })}
                            className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs text-[#B5ADA5] mb-1">السعر الحالي (د.م) *</label>
                          <input
                            type="number"
                            required
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#B5ADA5] mb-1">السعر الأصلي المشطوب (د.م)</label>
                          <input
                            type="number"
                            value={editingProduct.originalPrice}
                            onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                            className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#B5ADA5] mb-1">الكمية بالمخزون *</label>
                          <input
                            type="number"
                            required
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                            className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#B5ADA5] mb-1">التصنيف *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                      </div>

                      {/* Image Selector */}
                      <div className="p-3 bg-[#120E0B] rounded-xl border border-[#D4AF37]/20 flex items-center justify-between gap-4">
                        <img
                          src={editingProduct.image}
                          alt="Product Preview"
                          className="w-20 h-20 object-cover rounded-xl border border-[#D4AF37]/30"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <label className="block text-xs text-[#B5ADA5] mb-1">رابط الصورة الرئيسية</label>
                          <input
                            type="text"
                            value={editingProduct.image}
                            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                            className="w-full bg-[#0D0A08] text-white text-xs rounded-lg px-3 py-1.5 border border-[#D4AF37]/25 mb-1"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsMediaPickerOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-[#1a140d] border border-[#D4AF37]/35 text-[#F4BE16] text-xs font-bold hover:bg-[#D4AF37]/20 whitespace-nowrap"
                        >
                          {t('اختيار من المكتبة', 'Médiathèque')}
                        </button>
                      </div>

                      {/* Specs and Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-[#B5ADA5] mb-1">شارة المواصفات (Spec Badge)</label>
                          <input
                            type="text"
                            value={editingProduct.specBadge}
                            onChange={(e) => setEditingProduct({ ...editingProduct, specBadge: e.target.value })}
                            className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#B5ADA5] mb-1">شارة الضمان (Feature Badge)</label>
                          <input
                            type="text"
                            value={editingProduct.featureBadge}
                            onChange={(e) => setEditingProduct({ ...editingProduct, featureBadge: e.target.value })}
                            className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs text-[#B5ADA5] mb-1">الوصف التسويقي للحقيبة</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex justify-end gap-2 pt-2 border-t border-[#D4AF37]/20">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl text-xs text-[#B5ADA5] hover:text-white"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-[#F4BE16] text-[#0D0A08] font-bold text-xs hover:brightness-110"
                        >
                          حفظ بيانات الحقيبة
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* PRODUCTS LIST GRID */
                    <div>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            placeholder="بحث في الحقائب..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 w-full sm:w-56"
                          />
                        </div>

                        <button
                          onClick={startAddNewProduct}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-bold text-xs hover:brightness-110"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة حقيبة جديدة</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {products
                          .filter((p) => p.name.includes(productSearch) || p.category.includes(productSearch))
                          .map((p) => (
                            <div
                              key={p.id}
                              className="p-3 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25 flex flex-col justify-between"
                            >
                              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute top-2 right-2 bg-black/80 text-[#F4BE16] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                                  {p.stock} قطعة بالمخزون
                                </span>
                              </div>

                              <div>
                                <h5 className="font-bold text-white text-xs truncate">{p.name}</h5>
                                <div className="text-[11px] text-[#B5ADA5]">{p.category}</div>
                                <div className="text-sm font-black text-[#F4BE16] font-tajawal mt-1">
                                  {p.price} د.م{' '}
                                  <span className="text-[10px] text-neutral-400 line-through">
                                    {p.originalPrice} د.م
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 pt-3 border-t border-[#D4AF37]/15 mt-3">
                                <button
                                  onClick={() => {
                                    setEditingProduct(p);
                                    setIsAddingNewProduct(false);
                                  }}
                                  className="flex-1 py-1.5 rounded-lg bg-[#120E0B] border border-[#D4AF37]/30 text-[#F4BE16] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#D4AF37]/20"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>تعديل</span>
                                </button>
                                <button
                                  onClick={() => handleDuplicateProduct(p)}
                                  className="p-1.5 rounded-lg bg-[#120E0B] border border-[#D4AF37]/30 text-neutral-300 hover:text-white"
                                  title="تكرار"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 rounded-lg bg-[#120E0B] border border-red-500/30 text-red-400 hover:text-red-300"
                                  title="حذف"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 4: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-sm font-bold text-white font-cairo">إدارة تصنيفات الحقائب</h3>
                  <div className="space-y-2">
                    {[
                      { ar: 'رجال أعمال وتقنية', count: 2 },
                      { ar: 'سفر ومغامرات', count: 2 },
                      { ar: 'مدرسية وجامعية', count: 1 },
                      { ar: 'نسائية وأزياء', count: 1 },
                      { ar: 'مقاومة للماء وتقنية', count: 1 },
                      { ar: 'رياضة ولياقة', count: 1 },
                      { ar: 'أطفال وناشئة', count: 1 }
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-white">{c.ar}</span>
                        <span className="text-[#F4BE16] font-mono">{c.count} حقائب</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white font-cairo">قائمة زبائن المتجر بالمغرب</h3>
                  <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/20 bg-[#0D0A08]">
                    <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37] bg-[#120E0B]">
                          <th className="p-3">اسم الزبون</th>
                          <th className="p-3">الهاتف</th>
                          <th className="p-3">المدينة والعنوان</th>
                          <th className="p-3">عدد الطلبات</th>
                          <th className="p-3">إجمالي المشتريات</th>
                          <th className="p-3">آخر طلب</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4AF37]/10">
                        {customers.map((c) => (
                          <tr key={c.id} className="hover:bg-[#120E0B]">
                            <td className="p-3 font-semibold text-white">{c.name}</td>
                            <td className="p-3" dir="ltr">{c.phone}</td>
                            <td className="p-3">{c.city} - {c.address}</td>
                            <td className="p-3 font-bold">{c.ordersCount} طلبات</td>
                            <td className="p-3 font-black text-[#F4BE16] font-tajawal">{c.totalSpent} د.م</td>
                            <td className="p-3 text-[#B5ADA5]">{c.lastOrderDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SECTION 6: INVENTORY */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white font-cairo">تتبع المخزون والقطع المتبقية</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{p.name}</div>
                          <div className="text-[11px] text-[#B5ADA5] mt-1">{p.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setProducts((prev) =>
                                prev.map((item) =>
                                  item.id === p.id ? { ...item, stock: Math.max(0, item.stock - 1) } : item
                                )
                              );
                            }}
                            className="w-7 h-7 rounded-lg bg-[#120E0B] border border-[#D4AF37]/30 text-white font-bold flex items-center justify-center hover:text-[#F4BE16]"
                          >
                            -
                          </button>
                          <span
                            className={`w-10 text-center font-black font-tajawal text-sm ${
                              p.stock <= 5 ? 'text-red-400' : p.stock <= 10 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => {
                              setProducts((prev) =>
                                prev.map((item) =>
                                  item.id === p.id ? { ...item, stock: item.stock + 1 } : item
                                )
                              );
                            }}
                            className="w-7 h-7 rounded-lg bg-[#120E0B] border border-[#D4AF37]/30 text-white font-bold flex items-center justify-center hover:text-[#F4BE16]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 7: DISCOUNTS */}
              {activeTab === 'discounts' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-base font-bold text-white font-cairo">كوبونات وأكواد الخصم</h3>
                  
                  {/* Create Coupon Form */}
                  <form onSubmit={handleAddDiscount} className="p-4 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25 flex flex-wrap gap-3 items-end">
                    <div>
                      <label className="block text-[11px] text-[#B5ADA5] mb-1">كود الخصم (Promo Code)</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: BAGORA20"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#B5ADA5] mb-1">نسبة الخصم (%)</label>
                      <input
                        type="number"
                        required
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(Number(e.target.value))}
                        className="w-24 bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#B5ADA5] mb-1">الحد الأدنى للطلب (د.م)</label>
                      <input
                        type="number"
                        value={newCouponMin}
                        onChange={(e) => setNewCouponMin(Number(e.target.value))}
                        className="w-28 bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#F4BE16] text-[#0D0A08] font-bold text-xs"
                    >
                      إنشاء الكود
                    </button>
                  </form>

                  {/* Active Discounts List */}
                  <div className="space-y-2">
                    {discounts.map((d) => (
                      <div
                        key={d.id}
                        className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[#F4BE16] text-sm bg-[#120E0B] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                            {d.code}
                          </span>
                          <span className="text-white">خصم {d.value}% على الطلبات فوق {d.minSpend} د.م</span>
                        </div>
                        <span className="text-[#B5ADA5]">تم الاستعمال {d.usageCount} مرة</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 9: CUSTOM PAGES CMS */}
              {activeTab === 'pages' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white font-cairo">صفحات المتجر (CMS)</h3>
                  </div>
                  <div className="space-y-3">
                    {pages.map((pg) => (
                      <div
                        key={pg.id}
                        className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-xs">{pg.title}</h4>
                          <span className="text-[11px] text-[#D4AF37] font-mono">/{pg.slug}</span>
                        </div>
                        <p className="text-xs text-[#B5ADA5] leading-relaxed">{pg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 10: NAVIGATION MENUS */}
              {activeTab === 'navigation' && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-base font-bold text-white font-cairo">روابط القائمة العلوية والفوتر</h3>
                  <div className="space-y-2">
                    {navigation.headerMenu.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-white">{m.label}</span>
                        <span className="text-[#D4AF37] font-mono">{m.url}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 11: MEDIA LIBRARY */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white font-cairo">مكتبة صور الحقائب والبانرات</h3>
                    <button
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#F4BE16] text-[#0D0A08] font-bold text-xs"
                    >
                      إضافة صورة جديدة
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {media.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-xl overflow-hidden bg-[#0D0A08] border border-[#D4AF37]/25"
                      >
                        <img
                          src={m.url}
                          alt={m.title}
                          className="w-full h-32 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-2 text-xs">
                          <div className="font-bold text-white truncate">{m.title}</div>
                          <div className="text-[10px] text-[#B5ADA5] truncate mt-0.5">{m.url}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 12: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-base font-bold text-white font-cairo">تقييمات وآراء الزبائن</h3>
                  <div className="space-y-3">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{r.author} ({r.city})</span>
                          <span className="text-[#F4BE16]">{'★'.repeat(r.rating)}</span>
                        </div>
                        <p className="text-[#E5D2A8]">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 13: SHIPPING */}
              {activeTab === 'shipping' && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-base font-bold text-white font-cairo">إعدادات التوصيل لكافة مدن المغرب</h3>
                  <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 space-y-3 text-xs">
                    <div>
                      <label className="block text-[#B5ADA5] mb-1">الحد الأدنى للشحن المجاني (د.م)</label>
                      <input
                        type="number"
                        value={shippingSettings.freeShippingThreshold}
                        onChange={(e) => updateShippingSettings({ freeShippingThreshold: Number(e.target.value) })}
                        className="bg-[#120E0B] text-white rounded-xl px-3 py-2 border border-[#D4AF37]/25 w-40"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B5ADA5] mb-1">مدة التوصيل للمدن الكبرى (الدار البيضاء، الرباط، مراكش)</label>
                      <input
                        type="text"
                        value={shippingSettings.deliveryEstimateMajor}
                        onChange={(e) => updateShippingSettings({ deliveryEstimateMajor: e.target.value })}
                        className="bg-[#120E0B] text-white rounded-xl px-3 py-2 border border-[#D4AF37]/25 w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 14: PAYMENT */}
              {activeTab === 'payment' && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-base font-bold text-white font-cairo">إعدادات الدفع عند الاستلام (COD)</h3>
                  <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 space-y-3 text-xs">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-white">تفعيل الدفع عند الاستلام نقداً (COD)</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.codEnabled}
                        onChange={(e) => updatePaymentSettings({ codEnabled: e.target.checked })}
                        className="w-4 h-4 accent-[#F4BE16]"
                      />
                    </label>
                    <div>
                      <label className="block text-[#B5ADA5] mb-1">تعليمات الدفع للزبون</label>
                      <textarea
                        rows={2}
                        value={paymentSettings.codInstructions}
                        onChange={(e) => updatePaymentSettings({ codInstructions: e.target.value })}
                        className="w-full bg-[#120E0B] text-white rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 15: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-base font-bold text-white font-cairo">إعدادات محركات البحث ووسائل التواصل</h3>
                  <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 space-y-3 text-xs">
                    <div>
                      <label className="block text-[#B5ADA5] mb-1">عنوان المتجر في Google (Meta Title)</label>
                      <input
                        type="text"
                        value={seoSettings.metaTitle}
                        onChange={(e) => updateSeoSettings({ metaTitle: e.target.value })}
                        className="w-full bg-[#120E0B] text-white rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B5ADA5] mb-1">وصف المتجر (Meta Description)</label>
                      <textarea
                        rows={3}
                        value={seoSettings.metaDescription}
                        onChange={(e) => updateSeoSettings({ metaDescription: e.target.value })}
                        className="w-full bg-[#120E0B] text-white rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 16: ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white font-cairo">تحليلات المبيعات ونشاط المدن المغربية</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 text-xs">
                      <span className="text-[#B5ADA5] block">المدينة الأكثر طلباً</span>
                      <span className="font-bold text-white text-base mt-1 block">الدار البيضاء (45%)</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 text-xs">
                      <span className="text-[#B5ADA5] block">الحقيبة الأكثر مبيعاً</span>
                      <span className="font-bold text-[#F4BE16] text-base mt-1 block">حقيبة الحاسوب المحمول</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 text-xs">
                      <span className="text-[#B5ADA5] block">متوسط قيمة الطلب</span>
                      <span className="font-bold text-emerald-400 text-base mt-1 block">268 د.م</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 17: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-base font-bold text-white font-cairo">بيانات وهوية المتجر</h3>
                  <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 space-y-3 text-xs">
                    <div>
                      <label className="block text-[#B5ADA5] mb-1">اسم العلامة التجارية</label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={(e) => updateSettings({ storeName: e.target.value })}
                        className="w-full bg-[#120E0B] text-white rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B5ADA5] mb-1">رقم الواتساب للمبيعات والدعم</label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                        className="w-full bg-[#120E0B] text-white rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B5ADA5] mb-1">البريد الإلكتروني الرسمي</label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => updateSettings({ supportEmail: e.target.value })}
                        className="w-full bg-[#120E0B] text-white rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 18: ADMIN USERS */}
              {activeTab === 'adminUsers' && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-base font-bold text-white font-cairo">حسابات وصلاحيات مديري المتجر</h3>
                  <div className="space-y-2">
                    {adminUsers.map((u) => (
                      <div
                        key={u.id}
                        className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[11px] text-[#B5ADA5]">{u.email} · آخر دخول: {u.lastLogin}</div>
                        </div>
                        <span className="text-[10px] font-bold text-[#F4BE16] bg-[#120E0B] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                          {u.role === 'superadmin' ? 'مدير أعلى (Super Admin)' : 'مدير مبيعات'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={(url) => {
          if (editingProduct) {
            setEditingProduct({ ...editingProduct, image: url });
          }
        }}
      />

      {/* Invoice Modal for Printable Receipt */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#120E0B] border border-[#D4AF37]/40 rounded-2xl p-6 max-w-lg w-full text-right rtl:text-right ltr:text-left space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div>
                <span className="font-brand font-black text-lg text-[#F4BE16]">BAGORA</span>
                <span className="text-xs text-[#B5ADA5] block">وصل تسليم طلبية (Cash on Delivery)</span>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2 bg-[#0D0A08] p-4 rounded-xl border border-[#D4AF37]/20">
              <div className="flex justify-between">
                <span className="text-[#B5ADA5]">رقم الطلب:</span>
                <span className="font-mono font-bold text-[#F4BE16]">{selectedOrderForInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B5ADA5]">اسم الزبون:</span>
                <span className="font-bold text-white">{selectedOrderForInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B5ADA5]">رقم الهاتف:</span>
                <span dir="ltr" className="text-white">{selectedOrderForInvoice.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B5ADA5]">المدينة:</span>
                <span className="text-white">{selectedOrderForInvoice.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B5ADA5]">العنوان:</span>
                <span className="text-white">{selectedOrderForInvoice.address}</span>
              </div>
              <div className="border-t border-[#D4AF37]/15 pt-2 flex justify-between font-bold text-sm">
                <span className="text-white">المبلغ المطلوب نقداً عند التسليم:</span>
                <span className="text-[#F4BE16] font-tajawal">{selectedOrderForInvoice.total} د.م</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#F4BE16] text-[#0D0A08] font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الوصل</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
