import React from 'react';
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onShopClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  const {
    lang,
    t,
    settings,
    setIsAssistantOpen,
    isBuilderOpen,
    draftSections,
    publishedSections
  } = useStore();

  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const activeSection = (isBuilderOpen ? draftSections : publishedSections).find(
    (s) => s.type === 'hero'
  );

  const kickerBadge = activeSection?.content?.kickerBadge || 'المجموعة الملكية الجديدة 2026';
  const heroTitle = activeSection?.content?.title || (lang === 'ar' ? settings.heroTitle : settings.heroTitleFr);
  const heroSubtitle = activeSection?.content?.subtitle || (lang === 'ar' ? settings.heroSubtitle : settings.heroSubtitleFr);
  const heroImage = activeSection?.content?.heroImage || '/src/assets/images/hero_luxury_backpack_1793111382060.jpg';
  const primaryButtonLabel = activeSection?.content?.primaryButtonLabel || t('تسوق التشكيلة الآن', 'Explorer la Collection');
  const secondaryButtonLabel = activeSection?.content?.secondaryButtonLabel || t('ساعدني في اختيار حقيبتي', 'Aide-moi à choisir');

  return (
    <section className="relative overflow-hidden pt-6 pb-14 lg:py-16 bg-[#0D0A08]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#F4BE16]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column (in RTL: right side visually) */}
          <div className="lg:col-span-7 space-y-6 text-right rtl:text-right ltr:text-left">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#120E0B] border border-[#D4AF37]/35 text-[#F4BE16] text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#F4BE16] animate-ping" />
              <span>{t(kickerBadge, activeSection?.content?.kickerBadgeFr || kickerBadge)}</span>
              <span className="text-white/40">·</span>
              <span className="text-[#B5ADA5]">{t('صناعة وإتقان عالي', 'Finition Haute Couture')}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-cairo text-white leading-[1.25] tracking-tight">
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-[#B5ADA5] text-sm sm:text-base leading-relaxed max-w-2xl font-tajawal">
              {heroSubtitle}
            </p>

            {/* Guarantees Quick Pill Strip */}
            <div className="flex flex-wrap gap-2 text-xs text-[#E5D2A8]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#120E0B] border border-[#D4AF37]/20">
                <Truck className="w-3.5 h-3.5 text-[#F4BE16]" />
                <span>{t('توصيل سريع مجاني لكافة المدن', 'Livraison Express Gratuite')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#120E0B] border border-[#D4AF37]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F4BE16]" />
                <span>{t('الدفع نقداً بعد المعاينة', 'Paiement à la réception')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#120E0B] border border-[#D4AF37]/20">
                <RefreshCw className="w-3.5 h-3.5 text-[#F4BE16]" />
                <span>{t('استبدال مجاني 14 يوماً', 'Échange 14 jours gratuit')}</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onShopClick}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/25"
              >
                <span>{primaryButtonLabel}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAssistantOpen(true)}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#120E0B] text-white border border-[#D4AF37]/40 hover:border-[#F4BE16] hover:bg-[#1a140d] font-bold text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#F4BE16]" />
                <span>{secondaryButtonLabel}</span>
              </button>
            </div>

            {/* Moroccan Social Proof Metric */}
            <div className="pt-4 flex items-center gap-4 border-t border-[#D4AF37]/15">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-[#0D0A08] flex items-center justify-center text-xs font-bold text-[#F4BE16]">
                  🇲🇦
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1a140d] border-2 border-[#0D0A08] flex items-center justify-center text-[10px] font-bold text-white">
                  +15K
                </div>
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1 text-[#F4BE16]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F4BE16]" />
                  ))}
                  <span className="font-bold text-white mr-1 rtl:mr-1 ltr:ml-1">4.95 / 5</span>
                </div>
                <p className="text-[#B5ADA5] text-[11px]">
                  {t('أكثر من 15,000 زبون مغربي راضٍ في الدار البيضاء، الرباط، مراكش وجميع المدن', '+15 000 clients satisfaits partout au Maroc')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Showcase Column (in RTL: left visually) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative golden ring glow */}
              <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-tr from-[#D4AF37]/40 via-[#F4BE16]/20 to-transparent blur-lg opacity-70" />

              {/* Showcase Container */}
              <div className="relative bg-[#120E0B] border border-[#D4AF37]/35 rounded-[26px] p-2.5 overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="BAGORA Flagship Backpack"
                  className="w-full h-[360px] sm:h-[420px] object-cover rounded-[20px] hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Badge Bottom Right */}
                <div className="absolute bottom-5 right-5 left-5 bg-[#0D0A08]/90 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl p-3 flex items-center justify-between shadow-xl">
                  <div>
                    <div className="text-[11px] text-[#B5ADA5]">
                      {t('الحقيبة الأكثر طلباً هذا الأسبوع', 'Modèle le plus demandé')}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {t('حقيبة الأعمال والسفر الهجينة', 'Hybride Business & Voyage 30L')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#F4BE16] font-tajawal">
                      269 {t('د.م', 'MAD')}
                    </div>
                    <div className="text-[10px] text-neutral-400 line-through">
                      390 {t('د.م', 'MAD')}
                    </div>
                  </div>
                </div>

                {/* Moroccan Flagship Ribbon */}
                <div className="absolute top-5 right-5 bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                  {t('الأكثر مبيعاً بالمغرب', 'N°1 des Ventes Maroc')}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
