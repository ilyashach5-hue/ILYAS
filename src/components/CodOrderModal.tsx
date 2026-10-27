import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, Phone, MapPin, User, Package, MessageCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MOROCCAN_CITIES } from '../data/initialData';

export const CodOrderModal: React.FC = () => {
  const {
    codModalProduct,
    setCodModalProduct,
    createOrder,
    settings,
    lang,
    t
  } = useStore();

  if (!codModalProduct) return null;

  const { product } = codModalProduct;
  const [selectedColor, setSelectedColor] = useState(
    codModalProduct.selectedColor || product.colors[0]?.name || ''
  );
  const [quantity, setQuantity] = useState<number>(codModalProduct.quantity || 1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Pricing & Moroccan Bundle Discount
  // 1 bag = unit price
  // 2 bags = 10% discount on total
  // 3 bags = 15% discount on total
  let discountMultiplier = 1;
  let bundleLabel = '';
  if (quantity === 2) {
    discountMultiplier = 0.9;
    bundleLabel = t('خصم إضافي 10% على الحقيبتين!', 'Remise de 10% appliquée !');
  } else if (quantity >= 3) {
    discountMultiplier = 0.85;
    bundleLabel = t('خصم إضافي 15% على 3 حقائب أو أكثر!', 'Remise de 15% appliquée !');
  }

  const baseSubtotal = product.price * quantity;
  const subtotal = Math.round(baseSubtotal * discountMultiplier);
  const shippingFee = 0; // Free shipping across Morocco
  const total = subtotal + shippingFee;

  // Validation
  const validateMoroccanPhone = (num: string) => {
    const cleaned = num.replace(/[\s-]/g, '');
    return /^(0[567][0-9]{8}|\+212[567][0-9]{8})$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError(t('المرجو إدخال الاسم الكامل', 'Veuillez saisir votre nom complet'));
      return;
    }

    if (!phone.trim() || !validateMoroccanPhone(phone)) {
      setError(t('المرجو إدخال رقم هاتف مغربي صالح (مثال: 0612345678)', 'Veuillez saisir un numéro marocain valide (ex: 0612345678)'));
      return;
    }

    if (!address.trim()) {
      setError(t('المرجو إدخال العنوان الكامل (الحي، الشارع)', 'Veuillez renseigner votre adresse de livraison'));
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: fullName,
        phone,
        city,
        address,
        items: [
          {
            productId: product.id,
            productName: product.name,
            quantity,
            color: selectedColor,
            price: product.price,
            image: product.image
          }
        ],
        subtotal,
        shippingFee,
        total,
        notes
      };

      const result = await createOrder(orderData);
      setConfirmedOrder(result);
    } catch (err: any) {
      setError(t('حدث خطأ أثناء حفظ الطلب، يرجى المحاولة ثانية', 'Erreur lors de la commande, veuillez réessayer'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCodModalProduct(null);
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-[#120E0B] border border-[#D4AF37]/35 rounded-[26px] shadow-2xl p-4 sm:p-7 text-right rtl:text-right ltr:text-left overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 rtl:left-4 ltr:right-4 w-9 h-9 rounded-full bg-[#1a140d] border border-[#D4AF37]/30 text-white/80 hover:text-[#F4BE16] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedOrder ? (
          <div>
            {/* Modal Header */}
            <div className="mb-5 border-b border-[#D4AF37]/20 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4BE16]/15 border border-[#F4BE16]/40 text-[#F4BE16] text-xs font-bold mb-2">
                <Truck className="w-3.5 h-3.5" />
                <span>{t('الدفع عند الاستلام بعد المعاينة (COD)', 'Paiement à la Livraison après Inspection')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-cairo text-white">
                {t('استمارة الطلب السريع بالمغرب', 'Commander avec Livraison Rapide')}
              </h2>
              <p className="text-xs text-[#B5ADA5] font-tajawal mt-1">
                {t('املأ معلوماتك وسيتصل بك فريقنا لتأكيد موعد التسليم في مدينتك', 'Remplissez vos coordonnées pour recevoir votre colis')}
              </p>
            </div>

            {/* Product Summary Row */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/20 mb-5">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-xl border border-[#D4AF37]/25"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{t(product.name, product.nameFr)}</h4>
                <div className="text-xs text-[#B5ADA5] mt-0.5">{product.specBadge}</div>
                <div className="text-sm font-black text-[#F4BE16] font-tajawal mt-1">
                  {product.price} {t('د.م', 'MAD')}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* COD Order Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Color & Quantity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#1a140d] border border-[#D4AF37]/20">
                {/* Color Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#E5D2A8] mb-1.5">
                    {t('اختر اللون:', 'Couleur:')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedColor === c.name
                            ? 'border-[#F4BE16] bg-[#0D0A08] text-[#F4BE16]'
                            : 'border-white/15 text-neutral-300 hover:border-white/40'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{t(c.name, c.nameFr)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity with Bundle discounts */}
                <div>
                  <label className="block text-xs font-bold text-[#E5D2A8] mb-1.5">
                    {t('الكمية (استفد من خصم إضافي):', 'Quantité:')}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((qty) => (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => setQuantity(qty)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          quantity === qty
                            ? 'bg-[#F4BE16] text-[#0D0A08] border-[#F4BE16]'
                            : 'bg-[#0D0A08] text-white border-white/15 hover:border-white/40'
                        }`}
                      >
                        {qty} {t(qty === 1 ? 'حقيبة' : 'حقائب', qty === 1 ? 'sac' : 'sacs')}
                        {qty === 2 && <span className="block text-[10px] text-emerald-800 font-extrabold">-10%</span>}
                        {qty === 3 && <span className="block text-[10px] text-emerald-800 font-extrabold">-15%</span>}
                      </button>
                    ))}
                  </div>
                  {bundleLabel && (
                    <div className="text-[11px] text-emerald-400 font-bold mt-1">
                      ★ {bundleLabel}
                    </div>
                  )}
                </div>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#B5ADA5] mb-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {t('الاسم الكامل *', 'Nom Complet *')}
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('مثال: يوسف العلمي', 'Ex: Youssef El Alami')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#D4AF37]/30 focus:outline-none focus:border-[#F4BE16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#B5ADA5] mb-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {t('رقم الهاتف المغربي *', 'Numéro de téléphone *')}
                    </span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="06XXXXXXXX / 07XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#D4AF37]/30 focus:outline-none focus:border-[#F4BE16] text-right rtl:text-right ltr:text-left"
                  />
                </div>
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#B5ADA5] mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {t('المدينة *', 'Ville *')}
                    </span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#D4AF37]/30 focus:outline-none focus:border-[#F4BE16] cursor-pointer"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c} className="bg-[#120E0B]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#B5ADA5] mb-1">
                    {t('العنوان الكامل (الحي، الشارع، الإقامة) *', 'Adresse complète *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('مثال: حي الرياض، شارع النخيل إقامة 4', 'Ex: Hay Riad, Rue 12')}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#D4AF37]/30 focus:outline-none focus:border-[#F4BE16]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-[#B5ADA5] mb-1">
                  {t('ملاحظات خاصة بالتسليم (اختياري)', 'Remarques (optionnel)')}
                </label>
                <input
                  type="text"
                  placeholder={t('مثال: الاتصال بعد الساعة 2 زوالاً...', 'Ex: Appeler après 14h...')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3.5 py-2 border border-[#D4AF37]/25 focus:outline-none focus:border-[#F4BE16]"
                />
              </div>

              {/* Pricing Breakdown & COD Guarantee */}
              <div className="p-3.5 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/25 space-y-2">
                <div className="flex justify-between text-xs text-[#B5ADA5]">
                  <span>{t('المجموع الفرعي للحقائب:', 'Sous-total:')}</span>
                  <span className="font-tajawal text-white">
                    {subtotal} {t('د.م', 'MAD')}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    {t('مصاريف الشحن والتوصيل:', 'Frais de livraison:')}
                  </span>
                  <span>{t('مجاني 100%', 'GRATUIT')}</span>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">
                    {t('المبلغ الإجمالي عند الاستلام:', 'Total à payer à la livraison:')}
                  </span>
                  <span className="text-2xl font-black text-[#F4BE16] font-tajawal">
                    {total} <span className="text-sm text-[#D4AF37]">{t('د.م', 'MAD')}</span>
                  </span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#B5ADA5]">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1a140d]/80">
                  <ShieldCheck className="w-4 h-4 text-[#F4BE16] shrink-0" />
                  <span>{t('افتح الطرد وافحص الجودة قبل الدفع', 'Vérifiez avant de payer')}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1a140d]/80">
                  <Truck className="w-4 h-4 text-[#F4BE16] shrink-0" />
                  <span>{t('توصيل 24 إلى 48 ساعة فقط', 'Livraison 24h à 48h')}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F4BE16] via-[#D4AF37] to-[#F4BE16] text-[#0D0A08] font-black text-base hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0D0A08] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Package className="w-5 h-5 fill-[#0D0A08]" />
                    <span>{t('تأكيد الطلب الآن (الدفع عند الاستلام)', 'Confirmer la Commande (Paiement à la Réception)')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#F4BE16] uppercase tracking-wider">
                {t('تم تسجيل طلبك بنجاح!', 'Commande Enregistrée !')}
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {t('شكراً لثقتكم بـ BAGORA', 'Merci pour votre confiance')}
              </h3>
              <p className="text-xs text-[#B5ADA5] max-w-md mx-auto mt-2 leading-relaxed">
                {t(
                  `سيتصل بكم الموزع عبر الهاتف لتسليم الحقيبة في ${confirmedOrder.city}. يرجى إبقاء الهاتف مشغلاً.`,
                  `Notre livreur vous contactera pour livrer votre colis à ${confirmedOrder.city}.`
                )}
              </p>
            </div>

            {/* Order Receipt Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/30 text-right rtl:text-right ltr:text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-2">
                <span className="text-[#B5ADA5]">{t('رقم الطلب:', 'N° Commande:')}</span>
                <span className="font-bold text-[#F4BE16] font-mono">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B5ADA5]">{t('الزبون:', 'Client:')}</span>
                <span className="font-semibold text-white">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B5ADA5]">{t('المدينة:', 'Ville:')}</span>
                <span className="text-white">{confirmedOrder.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B5ADA5]">{t('المنتج:', 'Produit:')}</span>
                <span className="text-white">
                  {confirmedOrder.items[0]?.productName} ({confirmedOrder.items[0]?.color})
                </span>
              </div>
              <div className="flex justify-between border-t border-[#D4AF37]/15 pt-2 text-sm font-bold">
                <span className="text-white">{t('المبلغ المطلوب نقداً:', 'Total à payer:')}</span>
                <span className="text-[#F4BE16] font-tajawal font-black">
                  {confirmedOrder.total} {t('د.م', 'MAD')}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Confirmation Button */}
            <div className="max-w-md mx-auto space-y-2.5">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `السلام عليكم، لقد قمت بطلب حقيبة ${confirmedOrder.items[0]?.productName} رقم الطلب: ${confirmedOrder.id}، الاسم: ${confirmedOrder.customerName}، المدينة: ${confirmedOrder.city}. أرجو تأكيد موعد التوصيل.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t('اضغط هنا لتأكيد طلبك فوراً عبر واتساب', 'Confirmer immédiatement sur WhatsApp')}</span>
              </a>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl bg-[#120E0B] border border-[#D4AF37]/30 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                {t('متابعة التسوق', 'Continuer le shopping')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
