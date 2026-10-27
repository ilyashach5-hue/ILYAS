import React, { useState } from 'react';
import { X, Star, Check, ShieldCheck, Truck, ShoppingBag, Zap, Heart, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setCodModalProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared,
    reviews,
    lang,
    t
  } = useStore();

  const product = quickViewProduct;
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleBuyNow = () => {
    setCodModalProduct({
      product,
      selectedColor,
      quantity
    });
    setQuickViewProduct(null);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#120E0B] border border-[#D4AF37]/35 rounded-[26px] shadow-2xl p-5 sm:p-8 text-right rtl:text-right ltr:text-left overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 left-4 rtl:left-4 ltr:right-4 w-9 h-9 rounded-full bg-[#1a140d] border border-[#D4AF37]/30 text-white/80 hover:text-[#F4BE16] flex items-center justify-center transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
          
          {/* Left/Right Product Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0A0806] border border-[#D4AF37]/25">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                {product.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] shadow-md"
                  >
                    {lang === 'fr' && product.badgesFr ? product.badgesFr[idx] : badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Guarantees Under Image */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#B5ADA5]">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20">
                <Truck className="w-4 h-4 text-[#F4BE16] shrink-0" />
                <span>{t('توصيل مجاني لمدينتك', 'Livraison Gratuite')}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/20">
                <ShieldCheck className="w-4 h-4 text-[#F4BE16] shrink-0" />
                <span>{t('دفع عند الاستلام بعد المعاينة', 'Paiement à réception')}</span>
              </div>
            </div>
          </div>

          {/* Product Purchasing & Info Column */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#D4AF37]">
                {t(product.category, product.categoryFr)}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-cairo text-white mt-1">
                {t(product.name, product.nameFr)}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center gap-1 text-[#F4BE16]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F4BE16]" />
                  ))}
                </div>
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-[#B5ADA5]">({product.reviewCount} {t('تقييم مغربي موثق', 'avis clients')})</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-3.5 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25 flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#F4BE16] font-tajawal">
                  {product.price}{' '}
                  <span className="text-xs font-bold text-[#D4AF37]">{t('د.م', 'MAD')}</span>
                </span>
                <span className="mr-3 rtl:mr-3 ltr:ml-3 text-xs text-[#B5ADA5] line-through font-tajawal">
                  {product.originalPrice} {t('د.م', 'MAD')}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {t(`وفر ${(product.originalPrice - product.price)} درهم`, `Économisez ${(product.originalPrice - product.price)} DH`)}
              </span>
            </div>

            {/* Color Swatches */}
            <div>
              <label className="block text-xs font-bold text-[#E5D2A8] mb-2">
                {t('اللون المختار:', 'Couleur sélectionnée:')} <span className="text-[#F4BE16]">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === c.name
                        ? 'border-[#F4BE16] bg-[#1a140d] text-[#F4BE16] ring-1 ring-[#F4BE16]'
                        : 'border-white/15 bg-[#0D0A08] text-neutral-300 hover:border-white/30'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{t(c.name, c.nameFr)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-[#E5D2A8] mb-1.5">
                {t('الكمية:', 'Quantité:')}
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#0D0A08] border border-[#D4AF37]/30 rounded-xl px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded flex items-center justify-center text-white hover:text-[#F4BE16]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded flex items-center justify-center text-white hover:text-[#F4BE16]"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-neutral-400">
                  {quantity >= 2 && (
                    <span className="text-emerald-400 font-bold">
                      ★ {t('استفد من خصم إضافي عند طلب حقيبتين أو أكثر!', 'Remise de lot appliquée !')}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Dual CTA Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-[#0D0A08]" />
                <span>{t('شراء الآن (الدفع عند الاستلام)', 'Acheter Maintenant (COD)')}</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 rounded-2xl bg-[#0D0A08] text-white border border-[#D4AF37]/40 hover:border-[#F4BE16] hover:text-[#F4BE16] active:scale-95 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('أضف إلى السلة', 'Ajouter au Panier')}</span>
              </button>
            </div>

            {/* Secondary Wishlist / Compare Row */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isWishlisted(product.id)
                    ? 'border-[#F4BE16] text-[#F4BE16] bg-[#1a140d]'
                    : 'border-[#D4AF37]/25 text-[#B5ADA5] hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{isWishlisted(product.id) ? t('في المفضلة', 'Dans vos favoris') : t('إضافة للمفضلة', 'Favoris')}</span>
              </button>

              <button
                onClick={() => toggleCompare(product)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isCompared(product.id)
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#1a140d]'
                    : 'border-[#D4AF37]/25 text-[#B5ADA5] hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isCompared(product.id) ? t('موجود بالمقارنة', 'En comparaison') : t('إضافة للمقارنة', 'Comparer')}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Tabs Section: Details, Specs, Reviews */}
        <div className="mt-8 border-t border-[#D4AF37]/20 pt-6">
          <div className="flex items-center gap-3 border-b border-[#D4AF37]/15 pb-3">
            <button
              onClick={() => setActiveTab('details')}
              className={`text-xs font-bold pb-2 transition-colors border-b-2 ${
                activeTab === 'details'
                  ? 'border-[#F4BE16] text-[#F4BE16]'
                  : 'border-transparent text-[#B5ADA5] hover:text-white'
              }`}
            >
              {t('الوصف والمميزات', 'Description')}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-xs font-bold pb-2 transition-colors border-b-2 ${
                activeTab === 'specs'
                  ? 'border-[#F4BE16] text-[#F4BE16]'
                  : 'border-transparent text-[#B5ADA5] hover:text-white'
              }`}
            >
              {t('المواصفات التقنية', 'Spécifications')}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-xs font-bold pb-2 transition-colors border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-[#F4BE16] text-[#F4BE16]'
                  : 'border-transparent text-[#B5ADA5] hover:text-white'
              }`}
            >
              {t(`آراء الزبائن (${productReviews.length || product.reviewCount})`, `Avis clients`)}
            </button>
          </div>

          <div className="pt-4 text-xs">
            {activeTab === 'details' && (
              <div className="space-y-3 leading-relaxed text-[#B5ADA5]">
                <p>{t(product.description, product.descriptionFr)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15 text-white">
                    <Check className="w-4 h-4 text-[#F4BE16]" />
                    <span>{product.specBadge}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15 text-white">
                    <Check className="w-4 h-4 text-[#F4BE16]" />
                    <span>{product.featureBadge}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15">
                  <span className="text-[#B5ADA5] block text-[11px]">{t('السعة', 'Capacité')}</span>
                  <span className="font-bold text-white text-xs mt-1 block">{product.specs.capacity}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15">
                  <span className="text-[#B5ADA5] block text-[11px]">{t('حجم اللابتوب', 'Taille PC')}</span>
                  <span className="font-bold text-white text-xs mt-1 block">{product.specs.laptopSize}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15">
                  <span className="text-[#B5ADA5] block text-[11px]">{t('مقاومة الماء', 'Étanchéité')}</span>
                  <span className="font-bold text-emerald-400 text-xs mt-1 block">
                    {product.specs.waterproof ? t('مقاوم 100% للأمطار', '100% Étanche') : t('مقاوم للرذاذ', 'Déperlant')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15">
                  <span className="text-[#B5ADA5] block text-[11px]">{t('الوزن الصافي', 'Poids')}</span>
                  <span className="font-bold text-white text-xs mt-1 block">{product.specs.weight}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15">
                  <span className="text-[#B5ADA5] block text-[11px]">{t('الأبعاد', 'Dimensions')}</span>
                  <span className="font-bold text-white text-xs mt-1 block">{product.specs.dimensions}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15">
                  <span className="text-[#B5ADA5] block text-[11px]">{t('المادة الخام', 'Matière')}</span>
                  <span className="font-bold text-white text-xs mt-1 block">{product.specs.material}</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {productReviews.length > 0 ? (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/15 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <span>{rev.author}</span>
                          <span className="text-[10px] text-[#D4AF37] font-normal">({rev.city})</span>
                        </div>
                        <div className="flex text-[#F4BE16]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#B5ADA5] text-xs leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#B5ADA5] text-xs">
                    {t('تقييم 4.9 بناءً على طلبات الزبائن عبر الواتساب في مختلف المدن المغربية.', 'Note de 4.9 basée sur les avis vérifiés de nos clients au Maroc.')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
