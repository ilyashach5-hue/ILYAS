/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { PromotionalBanner } from './components/PromotionalBanner';
import { GuaranteesSection } from './components/GuaranteesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CodOrderModal } from './components/CodOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ComparisonModal } from './components/ComparisonModal';
import { SmartAssistantModal } from './components/SmartAssistantModal';
import { AdminDashboard } from './components/AdminDashboard';
import { VisualWebsiteBuilder } from './components/admin/VisualWebsiteBuilder';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileStickyBar } from './components/MobileStickyBar';
import { ToastContainer } from './components/ToastContainer';

function Storefront() {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const {
    publishedSections,
    themeConfig,
    setIsAdminOpen,
    isBuilderOpen,
    lang,
    t
  } = useStore();

  // Listen for /admin or #admin in URL
  useEffect(() => {
    if (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.includes('admin')
    ) {
      setIsAdminOpen(true);
    }
  }, [setIsAdminOpen]);

  const handleShopClick = () => {
    const el = document.getElementById('collection-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        backgroundColor: themeConfig.bgMain,
        color: themeConfig.textWhite,
        fontFamily: themeConfig.fontFamily
      }}
      className="min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#F4BE16] flex flex-col font-cairo"
    >
      {/* Dynamic Sections rendering based on published order and visibility */}
      {publishedSections
        .filter((sec) => sec.visible)
        .map((sec) => {
          switch (sec.type) {
            case 'announcement':
              return null; // Handled inside Header or top
            case 'header':
              return (
                <Header
                  key={sec.id}
                  onSelectCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
              );
            case 'hero':
              return <Hero key={sec.id} onShopClick={handleShopClick} />;
            case 'guarantees':
              return <GuaranteesSection key={sec.id} />;
            case 'categories':
              return null; // Rendered via ProductGrid or header
            case 'grid':
              return (
                <ProductGrid
                  key={sec.id}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              );
            case 'banner_duo':
              return <PromotionalBanner key={sec.id} />;
            case 'testimonials':
              return <TestimonialsSection key={sec.id} />;
            case 'faq':
              return <FaqSection key={sec.id} />;
            case 'footer':
              return <Footer key={sec.id} onSelectCategory={setSelectedCategory} />;
            case 'custom_banner':
              return (
                <section
                  key={sec.id}
                  style={{
                    backgroundColor: sec.styles?.bgColor || '#17110c',
                    paddingTop: sec.styles?.paddingY || '48px',
                    paddingBottom: sec.styles?.paddingY || '48px'
                  }}
                  className="px-4 sm:px-8 border-y border-[#D4AF37]/20"
                >
                  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-[#F4BE16] bg-[#F4BE16]/10 px-3 py-1 rounded-full border border-[#F4BE16]/30">
                        {sec.content?.badge}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white font-cairo">
                        {sec.content?.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#B5ADA5] leading-relaxed">
                        {sec.content?.subtitle}
                      </p>
                      <a
                        href={sec.content?.buttonUrl || '#collection-grid'}
                        className="inline-block py-3 px-6 rounded-xl bg-[#F4BE16] text-[#0D0A08] font-black text-xs hover:brightness-110"
                      >
                        {sec.content?.buttonText}
                      </a>
                    </div>
                    {sec.content?.image && (
                      <img
                        src={sec.content.image}
                        alt="Custom Banner"
                        className="w-full h-72 object-cover rounded-2xl border border-[#D4AF37]/30 shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                </section>
              );
            case 'rich_text':
              return (
                <section
                  key={sec.id}
                  style={{
                    backgroundColor: sec.styles?.bgColor || '#0D0A08',
                    paddingTop: sec.styles?.paddingY || '40px',
                    paddingBottom: sec.styles?.paddingY || '40px'
                  }}
                  className="px-4 text-center border-y border-[#D4AF37]/15"
                >
                  <div className="max-w-3xl mx-auto space-y-2">
                    <span className="text-xs font-bold text-[#D4AF37]">{sec.content?.badge}</span>
                    <h3 className="text-2xl font-black text-white">{sec.content?.title}</h3>
                    <p className="text-xs sm:text-sm text-[#B5ADA5] leading-relaxed">
                      {sec.content?.content}
                    </p>
                  </div>
                </section>
              );
            default:
              return null;
          }
        })}

      {/* Floating Helpers */}
      <WhatsAppButton />
      <MobileStickyBar />
      <ToastContainer />

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CodOrderModal />
      <CartDrawer />
      <WishlistDrawer />
      <ComparisonModal />
      <SmartAssistantModal />
      <AdminDashboard />

      {/* Visual Website Builder */}
      {isBuilderOpen && <VisualWebsiteBuilder />}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Storefront />
    </StoreProvider>
  );
}
