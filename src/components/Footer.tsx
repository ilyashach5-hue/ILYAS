import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Truck, MessageCircle, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onSelectCategory?: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const { lang, t, settings, setIsAdminOpen } = useStore();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080605] border-t border-[#D4AF37]/25 text-right rtl:text-right ltr:text-left text-[#B5ADA5]">
      
      {/* Upper Moroccan Trust & Delivery Banner */}
      <div className="border-b border-[#D4AF37]/15 py-8 bg-[#0D0A08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#120E0B] border border-[#D4AF37]/20">
            <div className="w-10 h-10 rounded-xl bg-[#F4BE16]/15 text-[#F4BE16] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">
                {t('توصيل 24-48 ساعة لجميع مدن المغرب', 'Livraison Express Partout au Maroc')}
              </div>
              <div className="text-[11px] text-[#B5ADA5] mt-0.5">
                {t('الدار البيضاء، الرباط، طنجة، مراكش، فاس، أكادير...', 'Casablanca, Rabat, Tanger, Marrakech...')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#120E0B] border border-[#D4AF37]/20">
            <div className="w-10 h-10 rounded-xl bg-[#F4BE16]/15 text-[#F4BE16] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">
                {t('الدفع نقداً بعد المعاينة والفحص', 'Paiement à la Livraison')}
              </div>
              <div className="text-[11px] text-[#B5ADA5] mt-0.5">
                {t('افحص حقيبتك وتأكد من جودتها قبل دفع أي سنتيم', 'Inspectez le colis avant le paiement')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#120E0B] border border-[#D4AF37]/20">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">
                {t('خدمة زبناء سريعة عبر واتساب', 'Support Client WhatsApp 7j/7')}
              </div>
              <div className="text-[11px] text-[#B5ADA5] mt-0.5">
                {settings.whatsappNumber}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F4BE16] to-[#D4AF37] flex items-center justify-center text-[#0D0A08] font-bold text-base font-brand">
                B
              </div>
              <span className="font-brand text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F4BE16]">
                {settings.storeName}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#B5ADA5] font-tajawal">
              {lang === 'ar' ? settings.slogan : settings.sloganFr}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E5D2A8]">
              <MapPin className="w-4 h-4 text-[#F4BE16] shrink-0" />
              <span>{t('الدار البيضاء، المملكة المغربية', 'Casablanca, Maroc')}</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-cairo border-b border-[#D4AF37]/20 pb-2">
              {t('تشكيلات الحقائب', 'Collections')}
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { ar: 'حقائب الحاسوب ورجال الأعمال', fr: 'Sacs Business & Ordinateur' },
                { ar: 'حقائب السفر والمقصورة', fr: 'Sacs Voyage Cabine' },
                { ar: 'حقائب مدرسية وجامعية', fr: 'Sacs Scolaires & Campus' },
                { ar: 'حقائب نسائية أنيقة', fr: 'Sacs à Dos Femme' },
                { ar: 'حقائب مقاومة للأمطار', fr: 'Sacs 100% Imperméables' }
              ].map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory('الكل');
                      const el = document.getElementById('collection-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-[#F4BE16] transition-colors"
                  >
                    {t(item.ar, item.fr)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Moroccan Delivery Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-cairo border-b border-[#D4AF37]/20 pb-2">
              {t('خدمة الزبناء والمبيعات', 'Service Client')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F4BE16]" />
                <span dir="ltr">{settings.whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F4BE16]" />
                <span>contact@bagora.ma</span>
              </li>
              <li className="text-[11px] text-[#B5ADA5]">
                {t('متاحون يومياً من 9:00 صباحاً إلى 9:00 مساءً للرد على استفساراتكم.', 'Disponible 7j/7 pour vous assister.')}
              </li>
            </ul>
          </div>

          {/* Moroccan Logistics Partners & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-cairo border-b border-[#D4AF37]/20 pb-2">
              {t('شركاء التوصيل والدفع', 'Livraison & Sécurité')}
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-[#120E0B] border border-[#D4AF37]/25 text-white">
                📦 {t('أمانة إكسبريس Amana', 'Amana Express')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#120E0B] border border-[#D4AF37]/25 text-white">
                🚚 {t('إرساليات CTM', 'CTM Messagerie')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#120E0B] border border-[#D4AF37]/25 text-[#F4BE16]">
                💵 {t('الدفع نقداً عند الباب (COD)', 'Paiement Espèces (COD)')}
              </span>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 text-xs text-[#B5ADA5] hover:text-[#F4BE16] transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t('دخول الإدارة (تعديل المتجر والطلبات)', 'Administration du Site')}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-[#D4AF37]/15 py-4 bg-[#050403] text-xs text-center text-[#B5ADA5]/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            {t(
              `جميع الحقوق محفوظة © ${currentYear} ${settings.storeName} المملكة المغربية. حقائب ظهر فاخرة.`,
              `Tous droits réservés © ${currentYear} ${settings.storeName} Maroc. Maroquinerie d'excellence.`
            )}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{t('سياسة الخصوصية', 'Confidentialité')}</span>
            <span>·</span>
            <span>{t('شروط الخدمة والاسترجاع', 'Conditions de Vente')}</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
