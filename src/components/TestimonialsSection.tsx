import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MOROCCAN_CITIES } from '../data/initialData';

export const TestimonialsSection: React.FC = () => {
  const { reviews, addReview, lang, t, products } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // New review form
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'bag-01');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    addReview({
      productId: selectedProductId,
      author,
      city,
      rating,
      comment
    });

    setAuthor('');
    setComment('');
    setShowAddModal(false);
  };

  return (
    <section className="py-14 bg-[#0D0A08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-right rtl:text-right ltr:text-left">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#F4BE16]"></span>
              <span>{t('تجارب الزبائن بالمغرب', 'Témoignages Vérifiés')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-cairo text-white">
              {t('ماذا يقول زبناؤنا الكرام في مختلف المدن المغربية؟', 'Avis de nos clients à travers le Maroc')}
            </h2>
            <p className="text-xs sm:text-sm text-[#B5ADA5] mt-1 font-tajawal">
              {t('تقييمات حقيقية من زبائن استلموا وفحصوا حقائبهم ودفعوا عند الاستلام', 'Commentaires authentiques de clients livrés à domicile')}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#120E0B] border border-[#D4AF37]/35 text-[#F4BE16] text-xs font-bold hover:bg-[#1a140d] transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('أضف تقييمك وتجربتك', 'Laisser un avis')}</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-[22px] bg-[#120E0B] border border-[#D4AF37]/20 hover:border-[#D4AF37]/45 transition-all text-right rtl:text-right ltr:text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#F4BE16]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#D4AF37]/30" />
                </div>
                <p className="text-xs text-[#E5D2A8] leading-relaxed mb-4">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>{r.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-[#B5ADA5]">{r.city}</div>
                </div>
                <span className="text-[10px] text-[#B5ADA5]/70">{r.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120E0B] border border-[#D4AF37]/30 rounded-2xl p-6 text-right rtl:text-right ltr:text-left">
            <h3 className="text-base font-bold text-white mb-3">
              {t('شاركنا رأيك في حقيبة BAGORA', 'Partagez votre avis')}
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-xs text-[#B5ADA5] mb-1">{t('الاسم الكريم', 'Votre Nom')}</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                />
              </div>
              <div>
                <label className="block text-xs text-[#B5ADA5] mb-1">{t('المدينة', 'Ville')}</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#B5ADA5] mb-1">{t('الحقيبة المقتناة', 'Sac acheté')}</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#B5ADA5] mb-1">{t('التقييم', 'Note')}</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        rating === star
                          ? 'border-[#F4BE16] bg-[#F4BE16] text-[#0D0A08]'
                          : 'border-white/20 text-white'
                      }`}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#B5ADA5] mb-1">{t('رأيك بكل صراحة', 'Commentaire')}</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#B5ADA5] hover:text-white"
                >
                  {t('إلغاء', 'Annuler')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F4BE16] text-[#0D0A08] font-bold text-xs"
                >
                  {t('نشر التقييم', 'Publier')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
