import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, Tag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MOROCCAN_CITIES } from '../data/initialData';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartCount,
    createOrder,
    settings,
    lang,
    t,
    showToast
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Quick form for cart checkout
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]);
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState<any | null>(null);

  if (!isCartOpen) return null;

  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleApplyPromo = () => {
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'BAGORA10') {
      setDiscountPercent(10);
      showToast(t('تم تطبيق خصم 10% بنجاح!', 'Code promo 10% appliqué !'), 'success');
    } else if (promoCode.trim().toUpperCase() === 'MAROC') {
      setDiscountPercent(15);
      showToast(t('تم تطبيق خصم 15% بنجاح!', 'Code promo 15% appliqué !'), 'success');
    } else {
      setPromoError(t('رمز ترويجي غير صالح', 'Code promo invalide'));
    }
  };

  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalTotal = cartTotal - discountAmount;

  const handleCartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast(t('المرجو ملء جميع معلومات التوصيل', 'Veuillez remplir vos coordonnées'), 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        color: item.selectedColor,
        price: item.product.price,
        image: item.product.image
      }));

      const res = await createOrder({
        customerName: fullName,
        phone,
        city,
        address,
        items: orderItems,
        subtotal: cartTotal,
        shippingFee: 0,
        total: finalTotal,
        notes: discountPercent > 0 ? `كوبون خصم: ${promoCode}` : ''
      });

      setOrderDone(res);
      clearCart();
    } catch {
      showToast(t('حدث خطأ أثناء الطلب', 'Erreur de commande'), 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-[#120E0B] border-l border-[#D4AF37]/30 h-full flex flex-col justify-between shadow-2xl text-right rtl:text-right ltr:text-left">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#F4BE16]" />
            <h3 className="text-base font-bold text-white font-cairo">
              {t('سلة المشتريات', 'Panier d\'achat')} ({cartCount})
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckingOut(false);
              setOrderDone(null);
            }}
            className="w-8 h-8 rounded-full bg-[#1a140d] border border-[#D4AF37]/25 flex items-center justify-center text-neutral-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Strip */}
        <div className="bg-[#1a140d] px-4 py-2 border-b border-[#D4AF37]/15 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>{t('مبروك! التوصيل مجاني بالكامل لكافة مدن المغرب', 'Félicitations ! Livraison gratuite')}</span>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orderDone ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 mx-auto flex items-center justify-center text-xl">
                ✓
              </div>
              <h4 className="text-xl font-bold text-white">{t('تم تسجيل طلبك بنجاح!', 'Commande confirmée !')}</h4>
              <p className="text-xs text-[#B5ADA5]">
                {t(`رقم الطلب: ${orderDone.id} - سنتصل بك لتأكيد التسليم.`, `Commande n° ${orderDone.id}`)}
              </p>
              <button
                onClick={() => {
                  setOrderDone(null);
                  setIsCartOpen(false);
                  setIsCheckingOut(false);
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#F4BE16] text-[#0D0A08] font-bold text-xs"
              >
                {t('إغلاق ومتابعة التسوق', 'Continuer le shopping')}
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Fast Cart Checkout View */
            <form onSubmit={handleCartSubmit} className="space-y-3 animate-in fade-in">
              <div className="text-xs font-bold text-[#F4BE16] mb-1">
                {t('معلومات التوصيل والدفع عند الاستلام:', 'Coordonnées de livraison (COD):')}
              </div>
              <input
                type="text"
                required
                placeholder={t('الاسم الكامل *', 'Nom complet *')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2.5 border border-[#D4AF37]/30"
              />
              <input
                type="tel"
                required
                dir="ltr"
                placeholder={t('رقم الهاتف (06 / 07) *', 'Téléphone *')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2.5 border border-[#D4AF37]/30 text-right rtl:text-right ltr:text-left"
              />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2.5 border border-[#D4AF37]/30 cursor-pointer"
              >
                {MOROCCAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder={t('العنوان الكامل (الحي، الشارع) *', 'Adresse complète *')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2.5 border border-[#D4AF37]/30"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-sm hover:brightness-110 active:scale-95 transition-all mt-3 cursor-pointer shadow-lg"
              >
                {isSubmitting ? '...' : t('تأكيد الطلب الآن نقداً', 'Confirmer la commande')}
              </button>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="w-full py-2 text-xs text-[#B5ADA5] hover:text-white"
              >
                {t('العودة للسلة', 'Retour au panier')}
              </button>
            </form>
          ) : cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/20"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-xl border border-[#D4AF37]/20 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{t(item.product.name, item.product.nameFr)}</h4>
                  <div className="text-[11px] text-[#D4AF37] mt-0.5">{item.selectedColor}</div>
                  <div className="text-xs font-black text-[#F4BE16] font-tajawal mt-1">
                    {item.product.price} {t('د.م', 'MAD')}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 bg-[#120E0B] rounded-lg border border-[#D4AF37]/25 p-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-white hover:text-[#F4BE16]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-white hover:text-[#F4BE16]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                    className="text-red-400 hover:text-red-300 text-xs p-1"
                    title={t('حذف', 'Supprimer')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#1a140d] border border-[#D4AF37]/20 flex items-center justify-center text-[#B5ADA5] mx-auto">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-xs text-[#B5ADA5]">{t('سلة المشتريات فارغة حالياً', 'Votre panier est vide')}</p>
            </div>
          )}
        </div>

        {/* Drawer Footer (Summary & Checkout CTA) */}
        {cart.length > 0 && !isCheckingOut && !orderDone && (
          <div className="p-4 sm:p-5 border-t border-[#D4AF37]/20 bg-[#0D0A08] space-y-3">
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('كود الخصم (مثال: BAGORA10)', 'Code Promo')}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-[#120E0B] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 uppercase"
              />
              <button
                onClick={handleApplyPromo}
                className="px-3.5 py-2 bg-[#1a140d] border border-[#D4AF37]/40 text-[#F4BE16] text-xs font-bold rounded-xl hover:bg-[#D4AF37]/20"
              >
                <Tag className="w-3.5 h-3.5" />
              </button>
            </div>
            {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#B5ADA5]">
              <div className="flex justify-between">
                <span>{t('المجموع الفرعي:', 'Sous-total:')}</span>
                <span className="font-tajawal text-white">
                  {cartTotal} {t('د.م', 'MAD')}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t('الخصم:', 'Remise:')}</span>
                  <span className="font-tajawal">
                    -{discountAmount} {t('د.م', 'MAD')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-emerald-400">
                <span>{t('الشحن:', 'Livraison:')}</span>
                <span>{t('مجاني لكافة المدن', 'Gratuite')}</span>
              </div>
              <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between items-baseline text-sm font-bold text-white">
                <span>{t('المجموع الإجمالي عند الاستلام:', 'Total à la livraison:')}</span>
                <span className="text-xl font-black text-[#F4BE16] font-tajawal">
                  {finalTotal} {t('د.م', 'MAD')}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('متابعة الطلب والدفع عند الاستلام', 'Passer la commande')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
