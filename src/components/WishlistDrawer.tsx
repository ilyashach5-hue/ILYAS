import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    setCodModalProduct,
    lang,
    t
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-[#120E0B] border-l border-[#D4AF37]/30 h-full flex flex-col justify-between shadow-2xl text-right rtl:text-right ltr:text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#F4BE16] fill-current" />
            <h3 className="text-base font-bold text-white font-cairo">
              {t('قائمة الرغبات والمفضلة', 'Mes Favoris')} ({wishlist.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-8 h-8 rounded-full bg-[#1a140d] border border-[#D4AF37]/25 flex items-center justify-center text-neutral-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlist.length > 0 ? (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl border border-[#D4AF37]/20 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{t(product.name, product.nameFr)}</h4>
                  <div className="text-[11px] text-[#B5ADA5] truncate">{product.specBadge}</div>
                  <div className="text-xs font-black text-[#F4BE16] font-tajawal mt-1">
                    {product.price} {t('د.م', 'MAD')}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      addToCart(product);
                    }}
                    className="p-2 rounded-lg bg-[#F4BE16] text-[#0D0A08] hover:brightness-110"
                    title={t('أضف للسلة', 'Ajouter')}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 rounded-lg bg-[#1a140d] text-neutral-400 hover:text-red-400"
                    title={t('حذف', 'Retirer')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#1a140d] border border-[#D4AF37]/20 flex items-center justify-center text-[#B5ADA5] mx-auto">
                <Heart className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-xs text-[#B5ADA5]">{t('لم تقم بإضافة أي حقيبة للمفضلة بعد', 'Aucun sac dans vos favoris')}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 border-t border-[#D4AF37]/20 bg-[#0D0A08]">
            <button
              onClick={() => {
                wishlist.forEach((p) => addToCart(p));
                setIsWishlistOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('إضافة جميع الحقائب إلى السلة', 'Tout ajouter au panier')}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
