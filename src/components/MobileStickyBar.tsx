import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileStickyBar: React.FC = () => {
  const { cartCount, setIsCartOpen, setCodModalProduct, products, lang, t } = useStore();

  const featuredProduct = products.find((p) => p.featured) || products[0];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0D0A08]/95 backdrop-blur-xl border-t border-[#D4AF37]/30 p-2.5 px-4 flex items-center justify-between gap-3 shadow-2xl">
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex items-center justify-center p-3 rounded-xl bg-[#120E0B] border border-[#D4AF37]/35 text-white"
        title={t('عرض السلة', 'Panier')}
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F4BE16] text-[#0D0A08] text-[10px] font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={() => {
          if (featuredProduct) {
            setCodModalProduct({ product: featuredProduct });
          }
        }}
        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
      >
        <Zap className="w-4 h-4 fill-[#0D0A08]" />
        <span>{t('طلب سريع (الدفع عند الاستلام)', 'Commander (COD)')}</span>
      </button>
    </div>
  );
};
