import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const GuaranteesSection: React.FC = () => {
  const { lang, t } = useStore();

  const guarantees = [
    {
      icon: Truck,
      title: t('توصيل سريع مجاني بالمغرب', 'Livraison Rapide Gratuite'),
      desc: t('توصيل من 24 إلى 48 ساعة فقط للدار البيضاء، الرباط، مراكش وجميع مدن وقرى المملكة.', 'Livraison en 24h à 48h partout au Maroc.')
    },
    {
      icon: ShieldCheck,
      title: t('الدفع عند الاستلام بعد المعاينة', 'Paiement à la Livraison'),
      desc: t('يمكنك فتح الطرد وفحص جودة الحقيبة والمواد قبل تسليم أي درهم للموزع بكل أمان.', 'Ouvrez et vérifiez la qualité avant tout paiement.')
    },
    {
      icon: Award,
      title: t('ضمان الجودة والمتانة سنتين', 'Garantie Qualité 2 Ans'),
      desc: t('جميع حقائب BAGORA تخضع لاختبارات متانة السحابات والنسيج العازل للأمطار والخدوش.', 'Matériaux haute résistance testés et certifiés.')
    },
    {
      icon: RefreshCw,
      title: t('استبدال مجاني خلال 14 يوماً', 'Échange Gratuit 14 Jours'),
      desc: t('إذا رغبت في تغيير اللون أو المقاس، نوفر لك خدمة استبدال سهلة وفورية عبر الواتساب.', 'Échange facile de couleur ou modèle sous 14 jours.')
    }
  ];

  return (
    <section className="py-12 bg-[#0A0806] border-y border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-[22px] bg-[#120E0B] border border-[#D4AF37]/20 hover:border-[#F4BE16]/50 transition-all text-right rtl:text-right ltr:text-left flex flex-col justify-between group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1a140d] border border-[#D4AF37]/30 flex items-center justify-center text-[#F4BE16] group-hover:scale-110 group-hover:bg-[#F4BE16] group-hover:text-[#0D0A08] transition-all duration-300 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-cairo mb-1.5 group-hover:text-[#F4BE16] transition-colors">
                    {g.title}
                  </h4>
                  <p className="text-xs text-[#B5ADA5] leading-relaxed font-tajawal">
                    {g.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
