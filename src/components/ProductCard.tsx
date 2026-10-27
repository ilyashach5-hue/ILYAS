import React, { useState } from 'react';
import { Heart, SlidersHorizontal, Eye, Star, ShoppingBag, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    lang,
    t,
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared,
    setQuickViewProduct,
    setCodModalProduct
  } = useStore();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const compared = isCompared(product.id);

  // Instant Express Checkout
  const handleBuyNow = () => {
    setCodModalProduct({
      product,
      selectedColor,
      quantity: 1
    });
  };

  // Add to cart
  const handleAddToCart = () => {
    addToCart(product, selectedColor, 1);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between bg-[#120E0B] rounded-[24px] border border-[#D4AF37]/20 hover:border-[#F4BE16]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/10 overflow-hidden"
    >
      {/* Top Image Section with Badges and Vertical Action Bar */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0806] rounded-t-[23px]">
        {/* Product Image */}
        <img
          src={product.image}
          alt={t(product.name, product.nameFr)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-108' : 'scale-100'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Subtle Dark Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120E0B] via-transparent to-black/30 pointer-events-none" />

        {/* Product Badges (Upper Right in RTL) */}
        <div className="absolute top-3 right-3 rtl:right-3 ltr:left-3 flex flex-col gap-1.5 z-10">
          {product.badges?.map((badge, idx) => (
            <span
              key={idx}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-md ${
                idx === 0
                  ? 'bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08]'
                  : 'bg-black/75 text-[#F4BE16] border border-[#D4AF37]/40'
              }`}
            >
              {lang === 'fr' && product.badgesFr && product.badgesFr[idx]
                ? product.badgesFr[idx]
                : badge}
            </span>
          ))}
        </div>

        {/* Vertical Action Buttons (Wishlist, Compare, Quick View) */}
        <div className="absolute top-3 left-3 rtl:left-3 ltr:right-3 flex flex-col gap-1.5 z-10">
          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              wishlisted
                ? 'bg-[#F4BE16] text-[#0D0A08]'
                : 'bg-[#120E0B]/80 text-white/80 hover:text-[#F4BE16] hover:bg-[#120E0B] border border-[#D4AF37]/30'
            }`}
            title={t('إضافة إلى المفضلة', 'Ajouter aux favoris')}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Comparison */}
          <button
            onClick={() => toggleCompare(product)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              compared
                ? 'bg-[#D4AF37] text-[#0D0A08]'
                : 'bg-[#120E0B]/80 text-white/80 hover:text-[#D4AF37] hover:bg-[#120E0B] border border-[#D4AF37]/30'
            }`}
            title={t('مقارنة الحقيبة', 'Comparer ce sac')}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Quick View */}
          <button
            onClick={() => setQuickViewProduct(product)}
            className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-[#120E0B]/80 text-white/80 hover:text-[#F4BE16] hover:bg-[#120E0B] border border-[#D4AF37]/30 transition-all shadow-md"
            title={t('معاينة سريعة', 'Aperçu rapide')}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Color Swatch Dots Overlay at bottom of image */}
        <div className="absolute bottom-2.5 right-3 rtl:right-3 ltr:left-3 flex items-center gap-1.5 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(c.name);
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                selectedColor === c.name
                  ? 'border-[#F4BE16] scale-125 ring-1 ring-[#F4BE16]'
                  : 'border-white/30 opacity-70 hover:opacity-100'
              }`}
              title={t(c.name, c.nameFr)}
            />
          ))}
        </div>
      </div>

      {/* Product Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 text-right rtl:text-right ltr:text-left">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between text-xs text-[#B5ADA5] mb-1.5">
            <div className="flex items-center gap-1 text-[#F4BE16]">
              <Star className="w-3.5 h-3.5 fill-[#F4BE16]" />
              <span className="font-bold text-white text-[13px]">{product.rating}</span>
              <span className="text-[#B5ADA5] text-[11px]">
                ({product.reviewCount} {t('تقييم', 'avis')})
              </span>
            </div>
            <span className="text-[11px] text-[#D4AF37] font-medium">
              {t(product.category, product.categoryFr)}
            </span>
          </div>

          {/* Product Specification Badge (e.g. سعة 24L · لابتوب 14") */}
          <div className="inline-block text-[11px] font-semibold text-[#E5D2A8] bg-[#1a140d] px-2.5 py-1 rounded-md border border-[#D4AF37]/20 mb-2 truncate max-w-full">
            {lang === 'fr' && product.specBadgeFr ? product.specBadgeFr : product.specBadge}
          </div>

          {/* Bold Arabic Product Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-base sm:text-lg font-bold text-white hover:text-[#F4BE16] cursor-pointer transition-colors leading-snug line-clamp-1"
          >
            {t(product.name, product.nameFr)}
          </h3>

          {/* Small Golden Feature Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#F4BE16] font-medium mt-1">
            <Check className="w-3 h-3 text-[#F4BE16] shrink-0" />
            <span className="truncate">
              {lang === 'fr' && product.featureBadgeFr ? product.featureBadgeFr : product.featureBadge}
            </span>
          </div>

          {/* Short Product Description */}
          <p className="text-[#B5ADA5] text-xs line-clamp-2 mt-2 leading-relaxed">
            {t(product.description, product.descriptionFr)}
          </p>
        </div>

        {/* Bottom Section: Divider, Price, Action Buttons */}
        <div className="pt-3 border-t border-[#D4AF37]/20 space-y-3">
          {/* Price Row */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#F4BE16] font-tajawal tracking-tight">
                {product.price}{' '}
                <span className="text-xs font-bold text-[#D4AF37]">{t('د.م', 'MAD')}</span>
              </span>
              <span className="text-xs text-[#B5ADA5]/70 line-through font-tajawal">
                {product.originalPrice} {t('د.م', 'MAD')}
              </span>
            </div>

            {/* In-Stock or Low-Stock Indicator */}
            <span className="text-[11px] text-emerald-400 font-medium">
              {product.stock < 10
                ? t(`متبقي ${product.stock} فقط!`, `Plus que ${product.stock}!`)
                : t('متوفر في المخزون', 'En Stock')}
            </span>
          </div>

          {/* Two Action Buttons: Golden Buy Now + Dark Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Golden Buy Now Button (شراء الآن) */}
            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#D4AF37]/20"
            >
              <Zap className="w-3.5 h-3.5 fill-[#0D0A08]" />
              <span className="truncate">{t('شراء الآن', 'Acheter')}</span>
            </button>

            {/* 2. Dark Outlined Add to Cart (أضف إلى السلة) */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0D0A08] text-white border border-[#D4AF37]/35 hover:border-[#F4BE16] hover:text-[#F4BE16] active:scale-95 font-bold text-xs transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="truncate">{t('أضف إلى السلة', 'Panier')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
