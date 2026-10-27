import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Moon,
  Sun,
  Menu,
  X,
  PhoneCall,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSelectCategory, selectedCategory = 'الكل' }) => {
  const {
    lang,
    setLang,
    t,
    theme,
    setTheme,
    cartCount,
    wishlist,
    comparedProducts,
    settings,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsCompareOpen,
    setIsAssistantOpen,
    setIsAdminOpen,
    products,
    setQuickViewProduct
  } = useStore();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { ar: 'الكل', fr: 'Tous les Sacs' },
    { ar: 'رجال أعمال وتقنية', fr: 'Business & Tech' },
    { ar: 'سفر ومغامرات', fr: 'Voyage & Aventure' },
    { ar: 'مدرسية وجامعية', fr: 'Scolaire & Université' },
    { ar: 'نسائية وأزياء', fr: 'Femme & Mode' },
    { ar: 'مقاومة للماء وتقنية', fr: 'Waterproof' },
    { ar: 'رياضة ولياقة', fr: 'Sport & Fitness' },
    { ar: 'أطفال وناشئة', fr: 'Enfants & Junior' }
  ];

  // Search filtering
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0D0A08]/95 border-b border-[#D4AF37]/20 transition-all duration-300">
      {/* 1. Animated Announcement Bar */}
      {settings.visibleSections.announcement && (
        <div className="bg-gradient-to-r from-[#1a140d] via-[#2a1d0d] to-[#1a140d] border-b border-[#D4AF37]/25 text-xs text-[#E5D2A8] py-2 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4BE16]"></span>
              <p className="font-medium text-[13px] tracking-wide">
                {lang === 'ar' ? settings.announcementText : settings.announcementTextFr}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs shrink-0 text-[#B5ADA5]">
              <span className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors">
                <Check className="w-3.5 h-3.5 text-[#F4BE16]" />
                {t('معاينة قبل الأداء', 'Vérification avant paiement')}
              </span>
              <span>·</span>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#F4BE16] hover:underline"
              >
                <PhoneCall className="w-3 h-3" />
                {t('واتساب المبيعات: ', 'Support: ')} {settings.whatsappNumber}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Categories */}
        <div className="flex items-center gap-5">
          {/* Logo BAGORA */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F4BE16] via-[#D4AF37] to-[#8C6D1F] p-[1px] shadow-lg shadow-[#D4AF37]/20 group-hover:shadow-[#F4BE16]/40 transition-all duration-300">
              <div className="w-full h-full bg-[#0D0A08] rounded-[11px] flex items-center justify-center">
                <span className="font-brand font-bold text-lg text-transparent bg-clip-text bg-gradient-to-tr from-[#F4BE16] to-[#FFFFFF] tracking-widest">
                  B
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-brand text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F4BE16] to-[#D4AF37]">
                {settings.storeName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#B5ADA5] font-tajawal -mt-1 font-semibold">
                {t('حقائب مغربية فاخرة', 'Maroquinerie De Luxe')}
              </span>
            </div>
          </a>

          {/* Categories Dropdown (Desktop) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#120E0B] text-white border border-[#D4AF37]/25 hover:border-[#F4BE16] hover:bg-[#1a140d] transition-all duration-200"
            >
              <span>{t('التصنيفات', 'Catégories')}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div
                className="absolute top-full mt-2 w-56 bg-[#120E0B] border border-[#D4AF37]/30 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                {categories.map((c) => (
                  <button
                    key={c.ar}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(c.ar);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-right ${lang === 'fr' ? 'text-left' : ''} px-3 py-2 text-xs rounded-xl font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === c.ar
                        ? 'bg-[#D4AF37]/20 text-[#F4BE16] font-bold'
                        : 'text-neutral-300 hover:bg-[#1a140d] hover:text-[#D4AF37]'
                    }`}
                  >
                    <span>{t(c.ar, c.fr)}</span>
                    {selectedCategory === c.ar && <Check className="w-3.5 h-3.5 text-[#F4BE16]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={t('ابحث عن حقيبتك المفضلة (لابتوب، سفر، مدرسية...)', 'Rechercher un sac (ordinateur, voyage...)')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-[#120E0B] text-white placeholder-[#B5ADA5]/60 text-xs rounded-full pl-10 pr-4 py-2.5 border border-[#D4AF37]/25 focus:outline-none focus:border-[#F4BE16] focus:ring-1 focus:ring-[#F4BE16] transition-all"
            />
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#B5ADA5] hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Popup */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-[#120E0B] border border-[#D4AF37]/30 rounded-2xl p-2 shadow-2xl z-50 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-3 py-1.5 text-[11px] text-[#D4AF37] font-semibold border-b border-[#D4AF37]/15">
                    {t(`نتائج البحث (${searchResults.length})`, `Résultats (${searchResults.length})`)}
                  </div>
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setQuickViewProduct(p);
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1a140d] cursor-pointer transition-colors"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg border border-[#D4AF37]/20"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{t(p.name, p.nameFr)}</div>
                        <div className="text-[11px] text-[#B5ADA5] truncate">{t(p.category, p.categoryFr)}</div>
                      </div>
                      <div className="text-xs font-bold text-[#F4BE16] shrink-0 font-tajawal">
                        {p.price} {t('د.م', 'MAD')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#B5ADA5]">
                  {t('لم نجد حقيبة تطابق بحثك', 'Aucun sac trouvé pour cette recherche')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls: Smart Assistant, Compare, Wishlist, Cart, Language, Theme, Admin */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Smart Assistant Button */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#D4AF37]/20 via-[#F4BE16]/20 to-[#D4AF37]/20 text-[#F4BE16] border border-[#D4AF37]/40 hover:border-[#F4BE16] hover:bg-[#D4AF37]/30 transition-all duration-200"
            title={t('مساعد الاختيار الذكي', 'Assistant Intelligent')}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4BE16] animate-spin-slow" />
            <span className="hidden sm:inline font-tajawal">{t('مساعد الاختيار', 'Guide Choix')}</span>
          </button>

          {/* Comparison */}
          <button
            onClick={() => setIsCompareOpen(true)}
            className="relative p-2.5 rounded-full text-neutral-300 hover:text-[#F4BE16] bg-[#120E0B] border border-[#D4AF37]/25 hover:border-[#F4BE16] transition-all"
            title={t('مقارنة المنتجات', 'Comparateur')}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {comparedProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F4BE16] text-[#0D0A08] text-[10px] font-bold flex items-center justify-center">
                {comparedProducts.length}
              </span>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 rounded-full text-neutral-300 hover:text-[#F4BE16] bg-[#120E0B] border border-[#D4AF37]/25 hover:border-[#F4BE16] transition-all"
            title={t('قائمة الرغبات', 'Favoris')}
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F4BE16] text-[#0D0A08] text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart with Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-bold text-xs hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/20"
            title={t('سلة المشتريات', 'Panier')}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-tajawal text-xs">{t('السلة', 'Panier')}</span>
            <span className="w-5 h-5 rounded-full bg-[#0D0A08] text-[#F4BE16] text-[11px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Language Switcher AR / FR */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#E5D2A8] bg-[#120E0B] border border-[#D4AF37]/30 hover:border-[#F4BE16] transition-colors"
            title={t('تغيير اللغة', 'Changer la langue')}
          >
            {lang === 'ar' ? 'FR' : 'عربي'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-neutral-300 hover:text-[#F4BE16] bg-[#120E0B] border border-[#D4AF37]/20 transition-colors"
            title={t('تبديل المظهر', 'Changer le thème')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F4BE16]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin Dashboard Entry */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#B5ADA5] hover:text-[#F4BE16] bg-[#120E0B] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors"
            title="Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('لوحة التحكم', 'Admin')}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg lg:hidden text-white bg-[#120E0B] border border-[#D4AF37]/25"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D4AF37]/20 bg-[#0D0A08] px-4 py-4 space-y-3">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('ابحث عن حقيبتك...', 'Rechercher...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#120E0B] text-white placeholder-[#B5ADA5]/60 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-[#D4AF37]/30"
            />
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-3" />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {categories.map((c) => (
              <button
                key={c.ar}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(c.ar);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  selectedCategory === c.ar
                    ? 'bg-[#F4BE16] text-[#0D0A08] font-bold'
                    : 'bg-[#120E0B] text-white border border-[#D4AF37]/20'
                }`}
              >
                {t(c.ar, c.fr)}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#D4AF37]/15">
            <button
              onClick={() => {
                setIsAdminOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs text-[#B5ADA5] hover:text-[#F4BE16]"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{t('لوحة الإدارة والتعديل', 'Tableau de bord Admin')}</span>
            </button>
            <span className="text-xs text-[#F4BE16] font-tajawal">
              {t('الدفع عند الاستلام بالمغرب', 'Paiement à la livraison')}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
