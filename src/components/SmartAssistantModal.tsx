import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowLeft, ArrowRight, Zap, ShoppingBag, Bot } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const SmartAssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    products,
    setCodModalProduct,
    addToCart,
    lang,
    t
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [usage, setUsage] = useState<string>('business');
  const [laptopSize, setLaptopSize] = useState<string>('15.6');
  const [waterproofNeeded, setWaterproofNeeded] = useState<boolean>(true);
  const [customNeed, setCustomNeed] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);

  if (!isAssistantOpen) return null;

  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleFinishQuiz = async () => {
    setIsAiLoading(true);
    setStep(4);

    // Find best local product match
    let match = products.find((p) => {
      if (usage === 'business') return p.id === 'bag-02';
      if (usage === 'travel') return p.id === 'bag-03';
      if (usage === 'school') return p.id === 'bag-01';
      if (usage === 'sport') return p.id === 'bag-04';
      if (usage === 'women') return p.id === 'bag-07';
      if (usage === 'kids') return p.id === 'bag-05';
      if (usage === 'waterproof') return p.id === 'bag-06';
      return p.id === 'bag-08';
    }) || products[1] || products[0];

    setMatchedProduct(match);

    // Call server recommendation for rich personalized Moroccan advice
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usage,
          laptopSize,
          waterproofNeeded,
          preference: customNeed
        })
      });
      const data = await res.json();
      if (data.success && data.text) {
        setAiAdvice(data.text);
      }
    } catch {
      setAiAdvice(
        lang === 'ar'
          ? 'بناءً على تفضيلاتك في الاستعمال والمقاس، هذه الحقيبة هي الخيار الأنسب لك لحماية أجهزتك وضمان الراحة اليومية. يمكنك معاينتها قبل الدفع!'
          : 'Selon vos besoins, ce sac à dos haut de gamme offre la meilleure protection et durabilité.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setMatchedProduct(null);
    setAiAdvice('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-[#120E0B] border border-[#D4AF37]/35 rounded-[26px] shadow-2xl p-5 sm:p-7 text-right rtl:text-right ltr:text-left overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAssistantOpen(false)}
          className="absolute top-4 left-4 rtl:left-4 ltr:right-4 w-9 h-9 rounded-full bg-[#1a140d] border border-[#D4AF37]/30 text-white/80 hover:text-[#F4BE16] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F4BE16] to-[#D4AF37] flex items-center justify-center text-[#0D0A08]">
            <Sparkles className="w-5 h-5 fill-[#0D0A08]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-cairo text-white">
              {t('مساعد الاختيار الذكي من BAGORA', 'Assistant Intelligent BAGORA')}
            </h3>
            <p className="text-xs text-[#B5ADA5]">
              {t('أجب عن 3 أسئلة سريعة وسنرشح لك الحقيبة المثالية لاحتياجاتك', 'Trouvez le sac parfait en 3 questions rapides')}
            </p>
          </div>
        </div>

        {/* Wizard Steps */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <span className="text-xs font-bold text-[#F4BE16]">{t('الخطوة 1 من 3: الاستعمال الرئيسي', 'Étape 1 sur 3: Usage principal')}</span>
            <h4 className="text-base font-bold text-white">
              {t('ما هو الغرض الأساسي الذي ستستعمل الحقيبة من أجله؟', 'Pour quel usage principal cherchez-vous ce sac ?')}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'business', ar: 'عمل، دوام، وحماية لابتوب', fr: 'Travail & Ordinateur' },
                { id: 'travel', ar: 'سفر، طائرة، ورحلات عطلة', fr: 'Voyage & Weekends' },
                { id: 'school', ar: 'دراسة، ثانوية، أو جامعة', fr: 'Études & Scolaire' },
                { id: 'sport', ar: 'نادي رياضي وحذاء تمرين', fr: 'Sport & Fitness' },
                { id: 'waterproof', ar: 'مقاومة تامة للأمطار الغزيرة', fr: '100% Imperméable' },
                { id: 'women', ar: 'أناقة نسائية راقية وخروج', fr: 'Chic Féminin' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setUsage(opt.id)}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-right rtl:text-right ltr:text-left transition-all ${
                    usage === opt.id
                      ? 'border-[#F4BE16] bg-[#1a140d] text-[#F4BE16] shadow-md'
                      : 'border-[#D4AF37]/20 bg-[#0D0A08] text-neutral-300 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{t(opt.ar, opt.fr)}</span>
                    {usage === opt.id && <Check className="w-4 h-4 text-[#F4BE16]" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-bold text-xs flex items-center gap-1.5 hover:brightness-110"
              >
                <span>{t('التالي', 'Suivant')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <span className="text-xs font-bold text-[#F4BE16]">{t('الخطوة 2 من 3: حجم الجهاز', 'Étape 2 sur 3: Taille de votre ordinateur')}</span>
            <h4 className="text-base font-bold text-white">
              {t('ما هو حجم الحاسوب المحمول أو الجهاز الذي تحمله عادة؟', 'Quelle est la taille de votre PC portable ?')}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: '13', label: '13" - 14" بوصة' },
                { id: '15.6', label: '15.6" بوصة (شائع)' },
                { id: '17', label: '17" بوصة (كبير)' },
                { id: 'tablet', label: 'تابلت / دفاتر فقط' }
              ].map((sz) => (
                <button
                  key={sz.id}
                  onClick={() => setLaptopSize(sz.id)}
                  className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                    laptopSize === sz.id
                      ? 'border-[#F4BE16] bg-[#1a140d] text-[#F4BE16]'
                      : 'border-[#D4AF37]/20 bg-[#0D0A08] text-neutral-300 hover:border-[#D4AF37]/50'
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-[#0D0A08] text-[#B5ADA5] hover:text-white text-xs border border-[#D4AF37]/20"
              >
                {t('السابق', 'Précédent')}
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-bold text-xs flex items-center gap-1.5 hover:brightness-110"
              >
                <span>{t('التالي', 'Suivant')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <span className="text-xs font-bold text-[#F4BE16]">{t('الخطوة 3 من 3: الأولويات والملاحظات', 'Étape 3 sur 3: Priorités')}</span>
            <h4 className="text-base font-bold text-white">
              {t('هل تحتاج إلى ميزة مقاومة الماء المعزولة؟', 'Avez-vous besoin d\'une étanchéité renforcée ?')}
            </h4>

            <div className="flex gap-3">
              <button
                onClick={() => setWaterproofNeeded(true)}
                className={`flex-1 p-3 rounded-2xl border text-xs font-bold ${
                  waterproofNeeded
                    ? 'border-[#F4BE16] bg-[#1a140d] text-[#F4BE16]'
                    : 'border-[#D4AF37]/20 bg-[#0D0A08] text-white'
                }`}
              >
                {t('نعم، حماية كاملة ضد الأمطار', 'Oui, 100% étanche')}
              </button>
              <button
                onClick={() => setWaterproofNeeded(false)}
                className={`flex-1 p-3 rounded-2xl border text-xs font-bold ${
                  !waterproofNeeded
                    ? 'border-[#F4BE16] bg-[#1a140d] text-[#F4BE16]'
                    : 'border-[#D4AF37]/20 bg-[#0D0A08] text-white'
                }`}
              >
                {t('عادي (مقاوم للرذاذ الخفيف)', 'Standard')}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B5ADA5] mb-1">
                {t('هل لديك أي طلب أو تفضيل خاص؟ (اختياري)', 'Autre préférence particulière ?')}
              </label>
              <input
                type="text"
                placeholder={t('مثال: أحتاج جيوب كثيرة سرية، أفضل اللون الأسود الفاحم...', 'Ex: Poches cachées, cuir noir...')}
                value={customNeed}
                onChange={(e) => setCustomNeed(e.target.value)}
                className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#D4AF37]/25 focus:border-[#F4BE16]"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-[#0D0A08] text-[#B5ADA5] hover:text-white text-xs border border-[#D4AF37]/20"
              >
                {t('السابق', 'Précédent')}
              </button>
              <button
                onClick={handleFinishQuiz}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-xs flex items-center gap-1.5 hover:brightness-110 shadow-lg"
              >
                <Sparkles className="w-4 h-4 fill-[#0D0A08]" />
                <span>{t('عرض ترشيح BAGORA الذكي', 'Voir la Recommandation')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            {isAiLoading ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-10 h-10 border-3 border-[#F4BE16] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#B5ADA5] font-tajawal">
                  {t('جاري تحليل تفضيلاتك وتجهيز أفضل ترشيح من حقائب BAGORA...', 'Analyse de vos préférences en cours...')}
                </p>
              </div>
            ) : matchedProduct ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4BE16]/15 border border-[#F4BE16]/40 text-[#F4BE16] text-xs font-bold mb-3">
                  <Bot className="w-3.5 h-3.5" />
                  <span>{t('ترشيح خبير BAGORA الذكي لك', 'Recommandation Personnalisée')}</span>
                </div>

                {/* AI Advice Bubble */}
                {aiAdvice && (
                  <div className="p-3.5 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/30 text-xs text-[#E5D2A8] leading-relaxed mb-4">
                    {aiAdvice}
                  </div>
                )}

                {/* Recommended Product Card */}
                <div className="p-4 rounded-2xl bg-[#0D0A08] border border-[#D4AF37]/35 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={matchedProduct.image}
                    alt={matchedProduct.name}
                    className="w-28 h-28 object-cover rounded-xl border border-[#D4AF37]/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
                    <span className="text-[11px] text-[#D4AF37] font-semibold">
                      {t(matchedProduct.category, matchedProduct.categoryFr)}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      {t(matchedProduct.name, matchedProduct.nameFr)}
                    </h4>
                    <div className="text-xs text-[#B5ADA5] mt-1">{matchedProduct.specBadge}</div>
                    <div className="text-lg font-black text-[#F4BE16] font-tajawal mt-2">
                      {matchedProduct.price} {t('د.م', 'MAD')}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-5">
                  <button
                    onClick={() => {
                      setIsAssistantOpen(false);
                      setCodModalProduct({ product: matchedProduct });
                    }}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-black text-xs hover:brightness-110 flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Zap className="w-4 h-4 fill-[#0D0A08]" />
                    <span>{t('طلب سريع (الدفع عند الاستلام)', 'Commander Maintenant')}</span>
                  </button>

                  <button
                    onClick={() => {
                      addToCart(matchedProduct);
                      setIsAssistantOpen(false);
                    }}
                    className="py-3 px-4 rounded-xl bg-[#120E0B] text-white border border-[#D4AF37]/40 hover:border-[#F4BE16] font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('أضف للسلة', 'Ajouter au Panier')}</span>
                  </button>
                </div>

                <div className="text-center pt-3">
                  <button onClick={handleReset} className="text-xs text-[#B5ADA5] hover:text-white underline">
                    {t('إعادة الاختبار من البداية', 'Recommencer le questionnaire')}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
