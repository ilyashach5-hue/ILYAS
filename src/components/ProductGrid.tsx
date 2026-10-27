import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Filter, ArrowUpDown } from 'lucide-react';

interface ProductGridProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const { products, lang, t } = useStore();
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating'>('featured');

  const categories = [
    { ar: 'الكل', fr: 'Tous' },
    { ar: 'رجال أعمال وتقنية', fr: 'Business & Tech' },
    { ar: 'سفر ومغامرات', fr: 'Voyage' },
    { ar: 'مدرسية وجامعية', fr: 'Scolaire' },
    { ar: 'نسائية وأزياء', fr: 'Femme' },
    { ar: 'مقاومة للماء وتقنية', fr: 'Waterproof' },
    { ar: 'رياضة ولياقة', fr: 'Sport' }
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'الكل') {
      result = result.filter(
        (p) => p.category === selectedCategory || (p.categoryFr && p.categoryFr === selectedCategory)
      );
    }

    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  return (
    <section id="collection-grid" className="py-12 bg-[#0D0A08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-right rtl:text-right ltr:text-left">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#F4BE16]"></span>
              <span>{t('تشكيلة باغورا الفاخرة', 'Collection Exclusive BAGORA')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-cairo text-white tracking-tight">
              {t('اختر حقيبتك المثالية مع الدفع عند الاستلام', 'Trouvez le Sac Idéal · Paiement à la Livraison')}
            </h2>
            <p className="text-xs sm:text-sm text-[#B5ADA5] mt-1 font-tajawal">
              {t(
                'توصيل مجاني خلال 24 إلى 48 ساعة مع إمكانية فتح الطرد والمعاينة قبل الدفع',
                'Livraison gratuite 24/48h avec possibilité d\'ouvrir et inspecter avant de payer'
              )}
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#B5ADA5] flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
              {t('ترتيب حسب:', 'Trier par:')}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 focus:outline-none focus:border-[#F4BE16] cursor-pointer"
            >
              <option value="featured">{t('المميزة والأكثر مبيعاً', 'Plus Populaires')}</option>
              <option value="priceAsc">{t('السعر: من الأقل للأعلى', 'Prix: Moins cher')}</option>
              <option value="priceDesc">{t('السعر: من الأعلى للأقل', 'Prix: Plus cher')}</option>
              <option value="rating">{t('الأعلى تقييماً ★', 'Meilleures Notes')}</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-[#D4AF37] ml-2">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('الفئات:', 'Filtres:')}</span>
          </div>
          {categories.map((c) => (
            <button
              key={c.ar}
              onClick={() => onSelectCategory(c.ar)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === c.ar
                  ? 'bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] shadow-md shadow-[#D4AF37]/20 scale-105'
                  : 'bg-[#120E0B] text-[#B5ADA5] hover:text-white border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
              }`}
            >
              {t(c.ar, c.fr)}
            </button>
          ))}
        </div>

        {/* 4 CARDS PER ROW DESKTOP GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#120E0B] rounded-3xl border border-[#D4AF37]/20">
            <p className="text-[#B5ADA5] text-sm">
              {t('لا توجد حقائب متوفرة في هذا التصنيف حالياً', 'Aucun sac disponible dans cette catégorie')}
            </p>
            <button
              onClick={() => onSelectCategory('الكل')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#F4BE16] text-[#0D0A08] text-xs font-bold"
            >
              {t('عرض جميع الحقائب', 'Voir tous les sacs')}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
