import React from 'react';
import { X, SlidersHorizontal, Check, Zap, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ComparisonModal: React.FC = () => {
  const {
    isCompareOpen,
    setIsCompareOpen,
    comparedProducts,
    toggleCompare,
    clearCompare,
    setCodModalProduct,
    addToCart,
    lang,
    t
  } = useStore();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-[#120E0B] border border-[#D4AF37]/35 rounded-[26px] shadow-2xl p-5 sm:p-7 text-right rtl:text-right ltr:text-left overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#F4BE16]" />
            <div>
              <h3 className="text-lg font-bold text-white font-cairo">
                {t('مقارنة مواصفات الحقائب', 'Comparateur de Sacs')}
              </h3>
              <p className="text-xs text-[#B5ADA5]">
                {t('قارن بين السعة وحجم اللابتوب ومقاومة الماء والأسعار', 'Comparez la capacité, protection PC, étanchéité et prix')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/20"
              >
                {t('مسح الكل', 'Vider')}
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="w-8 h-8 rounded-full bg-[#1a140d] border border-[#D4AF37]/25 flex items-center justify-center text-neutral-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pt-4">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <SlidersHorizontal className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
              <p className="text-xs text-[#B5ADA5]">
                {t(
                  'لم تقم بإضافة أي حقيبة للمقارنة. اضغط على أيقونة المقارنة على بطاقة أي حقيبة.',
                  'Aucun sac sélectionné. Cliquez sur l\'icône de comparaison sur les fiches produits.'
                )}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D4AF37]/20">
                    <th className="p-3 text-[#D4AF37] font-bold w-36">
                      {t('المواصفة', 'Caractéristique')}
                    </th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="p-3 w-60 min-w-[200px] text-center align-top">
                        <div className="relative inline-block mb-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-24 h-24 object-cover rounded-xl border border-[#D4AF37]/30 mx-auto"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => toggleCompare(p)}
                            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-900 text-white flex items-center justify-center hover:bg-red-700"
                            title={t('إزالة', 'Retirer')}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="font-bold text-white text-xs">{t(p.name, p.nameFr)}</div>
                        <div className="text-sm font-black text-[#F4BE16] font-tajawal mt-1">
                          {p.price} {t('د.م', 'MAD')}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  <tr>
                    <td className="p-3 font-semibold text-[#B5ADA5]">{t('السعة باللتر', 'Capacité')}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center font-bold text-white">
                        {p.specs.capacity}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#B5ADA5]">{t('حجم اللابتوب', 'Taille PC')}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-white">
                        {p.specs.laptopSize}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#B5ADA5]">{t('مقاومة الماء', 'Imperméabilité')}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <Check className="w-3.5 h-3.5" />
                          {t('مقاوم 100%', '100% Étanche')}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#B5ADA5]">{t('الوزن', 'Poids')}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-white">{p.specs.weight}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#B5ADA5]">{t('الأبعاد', 'Dimensions')}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-[#B5ADA5]">{p.specs.dimensions}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#B5ADA5]">{t('المادة المصنعة', 'Matière')}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-xs text-[#E5D2A8]">
                        {p.specs.material}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#B5ADA5]">{t('طلب فوري', 'Achat')}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center">
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              setIsCompareOpen(false);
                              setCodModalProduct({ product: p });
                            }}
                            className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-xs hover:brightness-110 flex items-center justify-center gap-1 shadow-md"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>{t('شراء الآن', 'Acheter')}</span>
                          </button>
                          <button
                            onClick={() => addToCart(p)}
                            className="py-1.5 px-3 rounded-xl bg-[#0D0A08] text-white border border-[#D4AF37]/30 text-[11px] font-semibold hover:border-[#F4BE16]"
                          >
                            {t('أضف للسلة', 'Panier')}
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
