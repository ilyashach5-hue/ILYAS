import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FAQS } from '../data/initialData';

export const FaqSection: React.FC = () => {
  const { lang, t } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-14 bg-[#0A0806] border-t border-[#D4AF37]/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right rtl:text-right ltr:text-left">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#120E0B] border border-[#D4AF37]/30 text-[#F4BE16] text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('كل ما تحتاج معرفته', 'Questions Fréquentes')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-cairo text-white">
            {t('الأسئلة الشائعة حول الطلب والتوصيل', 'Foire Aux Questions')}
          </h2>
          <p className="text-xs sm:text-sm text-[#B5ADA5] mt-1 font-tajawal">
            {t('إجابات واضحة حول طريقة الدفع عند الاستلام، مدة الشحن، وفحص الطرد', 'Toutes les réponses sur vos commandes et la livraison')}
          </p>
        </div>

        {/* FAQ Accordion Items */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#120E0B] border border-[#D4AF37]/20 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-right rtl:text-right ltr:text-left cursor-pointer hover:bg-[#1a140d] transition-colors"
                >
                  <span className="text-sm font-bold text-white font-cairo">
                    {lang === 'fr' ? faq.qFr : faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#F4BE16] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#D4AF37]/10 text-xs text-[#B5ADA5] leading-relaxed font-tajawal animate-in fade-in">
                    {lang === 'fr' ? faq.aFr : faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
