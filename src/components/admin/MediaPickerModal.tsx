import React, { useState } from 'react';
import { X, Check, Image as ImageIcon, Plus, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MediaItem } from '../../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  currentImage?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImage
}) => {
  const { media, addMediaItem, t } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  if (!isOpen) return null;

  const filteredMedia = media.filter(
    (m) => selectedCategory === 'all' || m.category === selectedCategory
  );

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      title: customTitle.trim() || 'صورة مخصصة',
      url: customUrl.trim(),
      category: 'backpacks',
      size: 'Custom URL',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    addMediaItem(newItem);
    onSelectImage(newItem.url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 text-right rtl:text-right ltr:text-left">
      <div className="relative w-full max-w-4xl bg-[#120E0B] border border-[#D4AF37]/35 rounded-[24px] shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F4BE16]/20 text-[#F4BE16] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-cairo">
                {t('مكتبة وسائط BAGORA', 'Médiathèque BAGORA')}
              </h3>
              <p className="text-xs text-[#B5ADA5]">
                {t('اختر صورة من مكتبة المتجر أو أدخل رابط صورة مخصصة', 'Sélectionnez ou ajoutez une image')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1a140d] border border-[#D4AF37]/25 flex items-center justify-center text-neutral-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar & Custom URL Adder */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-[#D4AF37]/15 shrink-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'الكل (Tous)' },
              { id: 'backpacks', label: 'الحقائب' },
              { id: 'banners', label: 'البانرات' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#F4BE16] text-[#0D0A08]'
                    : 'bg-[#0D0A08] text-[#B5ADA5] hover:text-white border border-[#D4AF37]/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/35 text-[#F4BE16] text-xs font-bold hover:bg-[#1a140d]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('إضافة رابط صورة جديد', 'Ajouter via URL')}</span>
          </button>
        </div>

        {/* Custom URL Form Dropdown */}
        {showAddCustom && (
          <form onSubmit={handleAddCustom} className="p-3 bg-[#0D0A08] rounded-xl border border-[#D4AF37]/25 my-2 flex gap-2 shrink-0 animate-in fade-in">
            <input
              type="text"
              placeholder={t('عنوان الصورة...', 'Titre...')}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-44 bg-[#120E0B] text-white text-xs rounded-lg px-3 py-2 border border-[#D4AF37]/25"
            />
            <input
              type="url"
              required
              placeholder="https://example.com/image.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-[#120E0B] text-white text-xs rounded-lg px-3 py-2 border border-[#D4AF37]/25"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#F4BE16] text-[#0D0A08] text-xs font-bold"
            >
              {t('إضافة واختيار', 'Ajouter')}
            </button>
          </form>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredMedia.map((m) => {
              const isSelected = currentImage === m.url;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectImage(m.url);
                    onClose();
                  }}
                  className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#F4BE16] ring-2 ring-[#F4BE16]'
                      : 'border-[#D4AF37]/25 hover:border-[#D4AF37]/60 bg-[#0D0A08]'
                  }`}
                >
                  <div className="aspect-[4/3] bg-black">
                    <img
                      src={m.url}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-2 bg-[#120E0B] border-t border-[#D4AF37]/15">
                    <div className="text-[11px] font-bold text-white truncate">{m.title}</div>
                    <div className="text-[10px] text-[#B5ADA5] mt-0.5">{m.size}</div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F4BE16] text-[#0D0A08] flex items-center justify-center font-bold shadow-md">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
