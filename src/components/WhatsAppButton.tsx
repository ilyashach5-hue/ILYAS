import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppButton: React.FC = () => {
  const { settings, lang, t } = useStore();

  const phoneClean = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    lang === 'ar'
      ? 'السلام عليكم، أريد الاستفسار عن حقائب ظهر BAGORA والعروض المتوفرة اليوم.'
      : 'Bonjour, je souhaite des informations sur les sacs à dos BAGORA.'
  );

  return (
    <a
      href={`https://wa.me/${phoneClean}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 rtl:right-6 ltr:left-6 z-40 group flex items-center gap-2 p-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
      title={t('تواصل معنا عبر واتساب', 'Support WhatsApp')}
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
      </div>
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold font-tajawal pr-1 rtl:pr-1 ltr:pl-1">
        {t('استفسار واتساب مباشر', 'Discuter sur WhatsApp')}
      </span>
    </a>
  );
};
