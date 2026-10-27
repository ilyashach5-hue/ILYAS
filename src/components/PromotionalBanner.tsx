import React from 'react';
import { Gift, Truck, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PromotionalBanner: React.FC = () => {
  const { lang, t, setCodModalProduct, products } = useStore();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const bestSeller = products.find((p) => p.bestSeller) || products[0];

  return (
    <section className="py-10 bg-[#0D0A08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#17110c] via-[#241a10] to-[#17110c] border border-[#D4AF37]/35 p-6 sm:p-10 shadow-2xl">
          
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-1/3 w-64 h-64 bg-[#F4BE16]/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-3.5 text-right rtl:text-right ltr:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4BE16]/15 border border-[#F4BE16]/40 text-[#F4BE16] text-xs font-bold">
                <Gift className="w-3.5 h-3.5" />
                <span>{t('عرض خاص محدود بالمغرب', 'Offre Spéciale Limitée')}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-cairo text-white">
                {t('عرض الثنائيات: احصل على حقيبتين واستفد من خصم إضافي 10%!', 'Pack Duo : Commandez 2 sacs et profitez de -10% de remise immédiate !')}
              </h3>

              <p className="text-xs sm:text-sm text-[#B5ADA5] font-tajawal max-w-xl leading-relaxed">
                {t(
                  'وفر أكثر عند طلب حقيبتين (لك ولصديقك أو للدراسة والعمل). التوصيل مجاني 100% لجميع المدن المغربية والدفع عند الاستلام بعد فحص الحقائب.',
                  'Économisez sur votre commande groupée. Livraison 100% offerte partout au Maroc avec paiement à la réception.'
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('collection-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                >
                  <span>{t('اختر حقائبك الآن', 'Choisir mes 2 sacs')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 text-xs text-[#E5D2A8]">
                  <Truck className="w-4 h-4 text-[#F4BE16]" />
                  <span>{t('شحن مجاني وسريع 24-48 ساعة', 'Livraison 24h-48h')}</span>
                </div>
              </div>
            </div>

            {/* Visual Thumbnail */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative">
                <img
                  src="/src/assets/images/backpack_executive_laptop_1793111382702.jpg"
                  alt="Pack Duo BAGORA"
                  className="w-48 sm:w-56 h-48 sm:h-56 object-cover rounded-2xl border-2 border-[#D4AF37]/40 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  {t('خصم 10% فوري', '-10% Immédiat')}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
