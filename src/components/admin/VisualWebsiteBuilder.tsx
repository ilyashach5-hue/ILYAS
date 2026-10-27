import React, { useState } from 'react';
import {
  X,
  Undo2,
  Redo2,
  Save,
  Send,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Copy,
  Trash2,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Layers,
  Settings,
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BuilderSection, SectionType } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

// Preview Storefront Renderer Components
import { Header } from '../Header';
import { Hero } from '../Hero';
import { ProductGrid } from '../ProductGrid';
import { PromotionalBanner } from '../PromotionalBanner';
import { GuaranteesSection } from '../GuaranteesSection';
import { TestimonialsSection } from '../TestimonialsSection';
import { FaqSection } from '../FaqSection';
import { Footer } from '../Footer';

export const VisualWebsiteBuilder: React.FC = () => {
  const {
    isBuilderOpen,
    setIsBuilderOpen,
    draftSections,
    updateDraftSection,
    reorderDraftSections,
    toggleDraftSectionVisibility,
    addDraftSection,
    deleteDraftSection,
    duplicateDraftSection,
    draftThemeConfig,
    updateDraftTheme,
    selectedBuilderSectionId,
    setSelectedBuilderSectionId,
    builderViewport,
    setBuilderViewport,
    saveDraft,
    publishTheme,
    undoBuilder,
    redoBuilder,
    canUndo,
    canRedo,
    lang,
    t
  } = useStore();

  const [activeLeftTab, setActiveLeftTab] = useState<'sections' | 'theme' | 'pages'>('sections');
  const [activeRightTab, setActiveRightTab] = useState<'content' | 'style' | 'advanced'>('content');
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);

  // Media Picker state for image editing
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTargetKey, setMediaPickerTargetKey] = useState<string>('heroImage');

  if (!isBuilderOpen) return null;

  const selectedSection = draftSections.find((s) => s.id === selectedBuilderSectionId) || draftSections[0];

  const handleAddNewSection = (type: SectionType) => {
    const newId = `sec-custom-${Date.now().toString().slice(-5)}`;
    let newSec: BuilderSection;

    if (type === 'custom_banner') {
      newSec = {
        id: newId,
        type: 'custom_banner',
        name: 'بانر ترويجي مخصص',
        visible: true,
        content: {
          badge: 'عرض جديد',
          title: 'تصميم استثنائي لحقائب الظهر الفاخرة',
          subtitle: 'أفضل الخامات المقاومة للماء مع سحابات ذهبية متينة وتوصيل مجاني لكافة المدن.',
          buttonText: 'اطلب الآن نقداً',
          buttonUrl: '#collection-grid',
          image: '/src/assets/images/backpack_travel_adventure_1793111383080.jpg'
        },
        styles: {
          paddingY: '48px',
          bgColor: '#17110c',
          textColor: '#FFFFFF',
          accentColor: '#F4BE16',
          borderRadius: '24px',
          textAlign: 'right'
        }
      };
    } else if (type === 'rich_text') {
      newSec = {
        id: newId,
        type: 'rich_text',
        name: 'نص ورسالة ترويجية',
        visible: true,
        content: {
          badge: 'ضمان الجودة المغربية',
          title: 'حرفية تجمع بين الأصالة والابتكار',
          content: 'نحن في BAGORA نؤمن بأن حقيبة الظهر هي شريكك اليومي في العمل والدراسة والسفر، لذلك نصممها بأعلى معايير الحماية والأناقة.'
        },
        styles: {
          paddingY: '40px',
          bgColor: '#0D0A08',
          textColor: '#FFFFFF',
          accentColor: '#D4AF37',
          textAlign: 'center'
        }
      };
    } else {
      newSec = {
        id: newId,
        type,
        name: `قسم جديد (${type})`,
        visible: true,
        content: {},
        styles: { paddingY: '40px' }
      };
    }

    addDraftSection(newSec);
    setShowAddSectionMenu(false);
  };

  const openMediaPickerFor = (key: string) => {
    setMediaPickerTargetKey(key);
    setIsMediaPickerOpen(true);
  };

  const handleSelectMedia = (url: string) => {
    if (selectedSection) {
      updateDraftSection(selectedSection.id, { [mediaPickerTargetKey]: url });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0A08] text-white flex flex-col font-cairo overflow-hidden select-none">
      
      {/* 1. TOP TOOLBAR */}
      <header className="h-14 border-b border-[#D4AF37]/25 bg-[#120E0B] px-4 flex items-center justify-between gap-4 shrink-0 z-30">
        
        {/* Left: Exit to Admin & Store Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBuilderOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D0A08] border border-[#D4AF37]/30 text-xs font-bold text-neutral-300 hover:text-white hover:border-[#F4BE16] transition-colors"
          >
            <X className="w-4 h-4" />
            <span>{t('الخروج من المحرر', 'Quitter')}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-r rtl:border-r ltr:border-l border-[#D4AF37]/20 pr-3 rtl:pr-3 ltr:pl-3">
            <span className="font-brand font-black text-sm text-[#F4BE16]">BAGORA</span>
            <span className="text-[11px] text-[#B5ADA5]">· {t('محرر المظهر المباشر (Theme Visual Editor)', 'Visual Theme Editor')}</span>
          </div>
        </div>

        {/* Center: Device Responsive Viewport Switcher */}
        {!isPreviewFullscreen && (
          <div className="flex items-center bg-[#0D0A08] rounded-xl border border-[#D4AF37]/25 p-0.5">
            <button
              onClick={() => setBuilderViewport('desktop')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                builderViewport === 'desktop'
                  ? 'bg-[#F4BE16] text-[#0D0A08] font-bold'
                  : 'text-[#B5ADA5] hover:text-white'
              }`}
              title="Desktop (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">شاشة كاملة</span>
            </button>

            <button
              onClick={() => setBuilderViewport('tablet')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                builderViewport === 'tablet'
                  ? 'bg-[#F4BE16] text-[#0D0A08] font-bold'
                  : 'text-[#B5ADA5] hover:text-white'
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">تابلت</span>
            </button>

            <button
              onClick={() => setBuilderViewport('mobile')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                builderViewport === 'mobile'
                  ? 'bg-[#F4BE16] text-[#0D0A08] font-bold'
                  : 'text-[#B5ADA5] hover:text-white'
              }`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">موبايل</span>
            </button>
          </div>
        )}

        {/* Right: History, Save Draft, Publish */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 bg-[#0D0A08] rounded-xl border border-[#D4AF37]/20 p-0.5">
            <button
              onClick={undoBuilder}
              disabled={!canUndo}
              className="p-1.5 text-neutral-300 hover:text-[#F4BE16] disabled:opacity-30 disabled:hover:text-neutral-300"
              title="تراجع (Undo)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redoBuilder}
              disabled={!canRedo}
              className="p-1.5 text-neutral-300 hover:text-[#F4BE16] disabled:opacity-30 disabled:hover:text-neutral-300"
              title="إعادة (Redo)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen Preview Toggle */}
          <button
            onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
              isPreviewFullscreen
                ? 'bg-[#F4BE16] text-[#0D0A08] border-[#F4BE16]'
                : 'bg-[#0D0A08] text-[#B5ADA5] border-[#D4AF37]/25 hover:text-white'
            }`}
            title="معاينة بدون أشرطة الأدوات"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Save Draft */}
          <button
            onClick={saveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D0A08] text-[#F4BE16] border border-[#D4AF37]/35 text-xs font-bold hover:bg-[#1a140d]"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('حفظ مسودة', 'Enregistrer')}</span>
          </button>

          {/* Publish Live */}
          <button
            onClick={publishTheme}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] text-xs font-black hover:brightness-110 shadow-lg shadow-[#D4AF37]/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('نشر للمتجر المباشر', 'Publier')}</span>
          </button>
        </div>

      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT PANEL: Section Hierarchy, Add Section, Global Theme */}
        {!isPreviewFullscreen && (
          <aside className="w-80 border-l rtl:border-l ltr:border-r border-[#D4AF37]/20 bg-[#120E0B] flex flex-col shrink-0 z-20 overflow-hidden">
            
            {/* Tabs (Sections vs Global Theme) */}
            <div className="flex items-center border-b border-[#D4AF37]/20 p-2 gap-1 shrink-0">
              <button
                onClick={() => setActiveLeftTab('sections')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  activeLeftTab === 'sections'
                    ? 'bg-[#F4BE16] text-[#0D0A08]'
                    : 'text-[#B5ADA5] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('أقسام الصفحة', 'Sections')}</span>
              </button>

              <button
                onClick={() => setActiveLeftTab('theme')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  activeLeftTab === 'theme'
                    ? 'bg-[#F4BE16] text-[#0D0A08]'
                    : 'text-[#B5ADA5] hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{t('هوية التصميم', 'Thème')}</span>
              </button>
            </div>

            {/* TAB 1: SECTIONS LIST */}
            {activeLeftTab === 'sections' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#B5ADA5] pb-1">
                  <span>{t('ترتيب الأقسام (اسحب أو رتب):', 'Ordre des sections:')}</span>
                  <span className="font-mono text-[#F4BE16]">{draftSections.length}</span>
                </div>

                {/* Sections Stack */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {draftSections.map((sec, idx) => {
                    const isSelected = selectedBuilderSectionId === sec.id;
                    return (
                      <div
                        key={sec.id}
                        onClick={() => setSelectedBuilderSectionId(sec.id)}
                        className={`group p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1a140d] border-[#F4BE16] shadow-md shadow-[#D4AF37]/15 ring-1 ring-[#F4BE16]'
                            : 'bg-[#0D0A08] border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                        } ${!sec.visible ? 'opacity-40' : ''}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                          <div className="text-xs font-bold text-white truncate">
                            {sec.name}
                          </div>
                        </div>

                        {/* Quick Controls */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          {/* Reorder Up */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              reorderDraftSections(idx, Math.max(0, idx - 1));
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:text-[#F4BE16] disabled:opacity-20"
                            title="تحريك لأعلى"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>

                          {/* Reorder Down */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              reorderDraftSections(idx, Math.min(draftSections.length - 1, idx + 1));
                            }}
                            disabled={idx === draftSections.length - 1}
                            className="p-1 hover:text-[#F4BE16] disabled:opacity-20"
                            title="تحريك لأسفل"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>

                          {/* Visibility Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDraftSectionVisibility(sec.id);
                            }}
                            className="p-1 hover:text-[#F4BE16]"
                            title={sec.visible ? 'إخفاء' : 'إظهار'}
                          >
                            {sec.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-neutral-500" />}
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateDraftSection(sec.id);
                            }}
                            className="p-1 hover:text-[#F4BE16]"
                            title="تكرار"
                          >
                            <Copy className="w-3 h-3" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDraftSection(sec.id);
                            }}
                            className="p-1 hover:text-red-400"
                            title="حذف"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Section Button */}
                <div className="pt-2 border-t border-[#D4AF37]/20 relative">
                  <button
                    onClick={() => setShowAddSectionMenu(!showAddSectionMenu)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F4BE16] to-[#D4AF37] text-[#0D0A08] font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('إضافة قسم جديد إلى المتجر', 'Ajouter une section')}</span>
                  </button>

                  {/* Add Section Choices Popup */}
                  {showAddSectionMenu && (
                    <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#0D0A08] border border-[#D4AF37]/35 rounded-2xl p-2 shadow-2xl z-40 space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-[#F4BE16] border-b border-[#D4AF37]/15">
                        {t('اختر نوع القسم الجديد:', 'Type de section:')}
                      </div>
                      <button
                        onClick={() => handleAddNewSection('custom_banner')}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-[#1a140d] hover:text-[#F4BE16] transition-colors"
                      >
                        🌟 {t('بانر ترويجي مخصص (Custom Banner)', 'Bannière promotionnelle')}
                      </button>
                      <button
                        onClick={() => handleAddNewSection('rich_text')}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-[#1a140d] hover:text-[#F4BE16] transition-colors"
                      >
                        📝 {t('نص ورسالة توضيحية (Rich Text)', 'Texte riche & Message')}
                      </button>
                      <button
                        onClick={() => handleAddNewSection('banner_duo')}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-[#1a140d] hover:text-[#F4BE16] transition-colors"
                      >
                        🎁 {t('بانر عرض الثنائيات (Pack Duo)', 'Offre Pack Duo')}
                      </button>
                      <button
                        onClick={() => handleAddNewSection('guarantees')}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-[#1a140d] hover:text-[#F4BE16] transition-colors"
                      >
                        🛡️ {t('شريط أعمدة الثقة والضمان', 'Garanties & Confiance')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: GLOBAL THEME SETTINGS */}
            {activeLeftTab === 'theme' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <h4 className="text-xs font-bold text-[#F4BE16] uppercase tracking-wider">
                  {t('تخصيص الألوان والخطوط العامة', 'Paramètres Globaux')}
                </h4>

                {/* Primary Gold */}
                <div>
                  <label className="block text-xs text-[#B5ADA5] mb-1">{t('الذهب الرئيسي (Primary Gold)', 'Or Principal')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftThemeConfig.primaryGold}
                      onChange={(e) => updateDraftTheme({ primaryGold: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-[#D4AF37]/30"
                    />
                    <input
                      type="text"
                      value={draftThemeConfig.primaryGold}
                      onChange={(e) => updateDraftTheme({ primaryGold: e.target.value })}
                      className="flex-1 bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-1.5 border border-[#D4AF37]/25 font-mono"
                    />
                  </div>
                </div>

                {/* Bright Gold Buttons */}
                <div>
                  <label className="block text-xs text-[#B5ADA5] mb-1">{t('أزرار الذهب اللامع (Bright Gold)', 'Or Boutons')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftThemeConfig.brightGold}
                      onChange={(e) => updateDraftTheme({ brightGold: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-[#D4AF37]/30"
                    />
                    <input
                      type="text"
                      value={draftThemeConfig.brightGold}
                      onChange={(e) => updateDraftTheme({ brightGold: e.target.value })}
                      className="flex-1 bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-1.5 border border-[#D4AF37]/25 font-mono"
                    />
                  </div>
                </div>

                {/* Main Background */}
                <div>
                  <label className="block text-xs text-[#B5ADA5] mb-1">{t('لون الخلفية الأساسي', 'Arrière-plan principal')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftThemeConfig.bgMain}
                      onChange={(e) => updateDraftTheme({ bgMain: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-[#D4AF37]/30"
                    />
                    <input
                      type="text"
                      value={draftThemeConfig.bgMain}
                      onChange={(e) => updateDraftTheme({ bgMain: e.target.value })}
                      className="flex-1 bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-1.5 border border-[#D4AF37]/25 font-mono"
                    />
                  </div>
                </div>

                {/* Card Background */}
                <div>
                  <label className="block text-xs text-[#B5ADA5] mb-1">{t('خلفية بطاقات المنتجات', 'Arrière-plan cartes')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftThemeConfig.bgCard}
                      onChange={(e) => updateDraftTheme({ bgCard: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-[#D4AF37]/30"
                    />
                    <input
                      type="text"
                      value={draftThemeConfig.bgCard}
                      onChange={(e) => updateDraftTheme({ bgCard: e.target.value })}
                      className="flex-1 bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-1.5 border border-[#D4AF37]/25 font-mono"
                    />
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-xs text-[#B5ADA5] mb-1">
                    {t('استدارة الزوايا:', 'Rayon des bordures:')} {draftThemeConfig.borderRadius}
                  </label>
                  <select
                    value={draftThemeConfig.borderRadius}
                    onChange={(e) => updateDraftTheme({ borderRadius: e.target.value })}
                    className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 cursor-pointer"
                  >
                    <option value="16px">16px (كلاسيكي)</option>
                    <option value="20px">20px (ناعم)</option>
                    <option value="24px">24px (فاخر - الافتراضي)</option>
                    <option value="28px">28px (دائري ملكي)</option>
                  </select>
                </div>

                {/* Card Style */}
                <div>
                  <label className="block text-xs text-[#B5ADA5] mb-1">{t('نمط البطاقات:', 'Style de carte:')}</label>
                  <select
                    value={draftThemeConfig.cardStyle}
                    onChange={(e) => updateDraftTheme({ cardStyle: e.target.value as any })}
                    className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 cursor-pointer"
                  >
                    <option value="bordered-gold">إطار ذهبي خفيف (الافتراضي)</option>
                    <option value="glow">توهج ذهبي فخم</option>
                    <option value="minimal">بسيط بدون حدود</option>
                  </select>
                </div>

                {/* Grid Columns */}
                <div>
                  <label className="block text-xs text-[#B5ADA5] mb-1">
                    {t('عدد أعمدة بطاقات الحقائب (Desktop):', 'Colonnes desktop:')} {draftThemeConfig.gridColumnsDesktop}
                  </label>
                  <div className="flex gap-2">
                    {[3, 4, 5].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateDraftTheme({ gridColumnsDesktop: cols })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                          draftThemeConfig.gridColumnsDesktop === cols
                            ? 'bg-[#F4BE16] text-[#0D0A08] border-[#F4BE16]'
                            : 'bg-[#0D0A08] text-white border-white/20'
                        }`}
                      >
                        {cols} بطاقات
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* CENTER PANEL: LIVE PREVIEW CANVAS */}
        <main className="flex-1 bg-[#050403] overflow-auto flex flex-col items-center p-3 sm:p-6 transition-all duration-300">
          
          {/* Viewport Frame */}
          <div
            className={`transition-all duration-300 shadow-2xl bg-[#0D0A08] border border-[#D4AF37]/25 rounded-[28px] overflow-hidden ${
              builderViewport === 'desktop'
                ? 'w-full'
                : builderViewport === 'tablet'
                ? 'w-[768px] max-w-full my-auto ring-8 ring-neutral-900 rounded-[32px]'
                : 'w-[375px] max-w-full my-auto ring-8 ring-neutral-900 rounded-[40px]'
            }`}
          >
            {/* Live Sections Loop */}
            <div className="relative">
              {draftSections
                .filter((sec) => sec.visible)
                .map((sec) => {
                  const isSelected = selectedBuilderSectionId === sec.id;

                  return (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedBuilderSectionId(sec.id)}
                      className={`relative cursor-pointer transition-all duration-200 group/section ${
                        isSelected
                          ? 'ring-2 ring-[#F4BE16] ring-offset-2 ring-offset-[#0D0A08] z-10'
                          : 'hover:ring-1 hover:ring-[#D4AF37]/50'
                      }`}
                    >
                      {/* Selection Badge Overlay */}
                      {isSelected && (
                        <div className="absolute top-2 left-4 rtl:left-4 ltr:right-4 z-40 bg-[#F4BE16] text-[#0D0A08] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>قيد التعديل: {sec.name}</span>
                        </div>
                      )}

                      {/* Render Specific Section */}
                      {sec.type === 'announcement' && (
                        <div
                          style={{
                            backgroundColor: sec.styles?.bgColor || '#17110c',
                            color: sec.styles?.textColor || '#E5D2A8',
                            paddingTop: sec.styles?.paddingY || '8px',
                            paddingBottom: sec.styles?.paddingY || '8px'
                          }}
                          className="border-b border-[#D4AF37]/25 text-xs text-center px-4 overflow-hidden"
                        >
                          <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F4BE16]" />
                              <span className="font-medium text-[13px]">{sec.content?.text}</span>
                            </div>
                            <span className="text-xs text-[#F4BE16] font-tajawal hidden md:inline">
                              {sec.content?.badge}
                            </span>
                          </div>
                        </div>
                      )}

                      {sec.type === 'header' && (
                        <Header />
                      )}

                      {sec.type === 'hero' && (
                        <Hero />
                      )}

                      {sec.type === 'guarantees' && (
                        <GuaranteesSection />
                      )}

                      {sec.type === 'categories' && (
                        <div className="py-4 bg-[#0D0A08] border-b border-[#D4AF37]/15 px-4 text-center">
                          <span className="text-xs font-bold text-[#D4AF37]">{sec.content?.title || 'تصفح التصنيفات'}</span>
                        </div>
                      )}

                      {sec.type === 'grid' && (
                        <ProductGrid selectedCategory="الكل" onSelectCategory={() => {}} />
                      )}

                      {sec.type === 'banner_duo' && (
                        <PromotionalBanner />
                      )}

                      {sec.type === 'testimonials' && (
                        <TestimonialsSection />
                      )}

                      {sec.type === 'faq' && (
                        <FaqSection />
                      )}

                      {sec.type === 'footer' && (
                        <Footer />
                      )}

                      {/* Custom User Banner Section */}
                      {sec.type === 'custom_banner' && (
                        <section
                          style={{
                            backgroundColor: sec.styles?.bgColor || '#17110c',
                            paddingTop: sec.styles?.paddingY || '48px',
                            paddingBottom: sec.styles?.paddingY || '48px'
                          }}
                          className="px-4 sm:px-8 border-y border-[#D4AF37]/20"
                        >
                          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-3">
                              <span className="text-xs font-bold text-[#F4BE16] bg-[#F4BE16]/10 px-3 py-1 rounded-full border border-[#F4BE16]/30">
                                {sec.content?.badge}
                              </span>
                              <h3 className="text-2xl sm:text-3xl font-black text-white font-cairo">
                                {sec.content?.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-[#B5ADA5] leading-relaxed">
                                {sec.content?.subtitle}
                              </p>
                              <a
                                href={sec.content?.buttonUrl || '#'}
                                className="inline-block py-3 px-6 rounded-xl bg-[#F4BE16] text-[#0D0A08] font-black text-xs"
                              >
                                {sec.content?.buttonText}
                              </a>
                            </div>
                            {sec.content?.image && (
                              <img
                                src={sec.content.image}
                                alt="Custom Banner"
                                className="w-full h-64 object-cover rounded-2xl border border-[#D4AF37]/30 shadow-xl"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                        </section>
                      )}

                      {/* Rich Text Section */}
                      {sec.type === 'rich_text' && (
                        <section
                          style={{
                            backgroundColor: sec.styles?.bgColor || '#0D0A08',
                            paddingTop: sec.styles?.paddingY || '40px',
                            paddingBottom: sec.styles?.paddingY || '40px'
                          }}
                          className="px-4 text-center border-y border-[#D4AF37]/15"
                        >
                          <div className="max-w-3xl mx-auto space-y-2">
                            <span className="text-xs font-bold text-[#D4AF37]">{sec.content?.badge}</span>
                            <h3 className="text-2xl font-black text-white">{sec.content?.title}</h3>
                            <p className="text-xs sm:text-sm text-[#B5ADA5] leading-relaxed">
                              {sec.content?.content}
                            </p>
                          </div>
                        </section>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: SELECTED SECTION SETTINGS & INSPECTOR */}
        {!isPreviewFullscreen && selectedSection && (
          <aside className="w-80 border-r rtl:border-r ltr:border-l border-[#D4AF37]/20 bg-[#120E0B] flex flex-col shrink-0 z-20 overflow-hidden">
            
            {/* Inspector Header */}
            <div className="p-3 border-b border-[#D4AF37]/20 flex items-center justify-between shrink-0 bg-[#0D0A08]">
              <div>
                <span className="text-[10px] text-[#D4AF37] font-semibold block uppercase">
                  {t('إعدادات القسم المختار', 'Inspecteur')}
                </span>
                <h4 className="text-xs font-bold text-white truncate max-w-[180px]">
                  {selectedSection.name}
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a140d] border border-[#D4AF37]/30 text-[#F4BE16]">
                {selectedSection.type}
              </span>
            </div>

            {/* Inspector Tabs */}
            <div className="flex border-b border-[#D4AF37]/20 shrink-0">
              <button
                onClick={() => setActiveRightTab('content')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors ${
                  activeRightTab === 'content'
                    ? 'border-[#F4BE16] text-[#F4BE16] bg-[#1a140d]/40'
                    : 'border-transparent text-[#B5ADA5] hover:text-white'
                }`}
              >
                {t('المحتوى والنصوص', 'Contenu')}
              </button>

              <button
                onClick={() => setActiveRightTab('style')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors ${
                  activeRightTab === 'style'
                    ? 'border-[#F4BE16] text-[#F4BE16] bg-[#1a140d]/40'
                    : 'border-transparent text-[#B5ADA5] hover:text-white'
                }`}
              >
                {t('التصميم والأبعاد', 'Style')}
              </button>
            </div>

            {/* Inspector Fields */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: CONTENT FIELDS */}
              {activeRightTab === 'content' && (
                <div className="space-y-3.5 animate-in fade-in">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-xs text-[#B5ADA5] mb-1">اسم القسم (في لوحة التحكم)</label>
                    <input
                      type="text"
                      value={selectedSection.name}
                      onChange={(e) => updateDraftSection(selectedSection.id, undefined, undefined, { name: e.target.value })}
                      className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                    />
                  </div>

                  {/* Dynamic Content Fields based on keys in sec.content */}
                  {Object.keys(selectedSection.content || {}).map((key) => {
                    const val = selectedSection.content[key];
                    const isImage = key.toLowerCase().includes('image');
                    const isLongText = typeof val === 'string' && val.length > 50;

                    if (isImage) {
                      return (
                        <div key={key} className="p-3 bg-[#0D0A08] rounded-xl border border-[#D4AF37]/20 space-y-2">
                          <label className="block text-xs text-[#E5D2A8] font-bold">صورة القسم ({key})</label>
                          <img
                            src={val}
                            alt="Section Asset"
                            className="w-full h-28 object-cover rounded-lg border border-[#D4AF37]/25"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => openMediaPickerFor(key)}
                            className="w-full py-1.5 rounded-lg bg-[#1a140d] border border-[#D4AF37]/35 text-[#F4BE16] text-xs font-bold hover:bg-[#D4AF37]/20 flex items-center justify-center gap-1.5"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>{t('تغيير الصورة من المكتبة', 'Changer l\'image')}</span>
                          </button>
                        </div>
                      );
                    }

                    if (isLongText) {
                      return (
                        <div key={key}>
                          <label className="block text-xs text-[#B5ADA5] mb-1">{key}</label>
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => updateDraftSection(selectedSection.id, { [key]: e.target.value })}
                            className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={key}>
                        <label className="block text-xs text-[#B5ADA5] mb-1">{key}</label>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => updateDraftSection(selectedSection.id, { [key]: e.target.value })}
                          className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: STYLES FIELDS */}
              {activeRightTab === 'style' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Padding Y */}
                  <div>
                    <label className="block text-xs text-[#B5ADA5] mb-1">
                      {t('التباعد الرأسي (Padding Y):', 'Espacement vertical:')} {selectedSection.styles?.paddingY || '40px'}
                    </label>
                    <select
                      value={selectedSection.styles?.paddingY || '40px'}
                      onChange={(e) => updateDraftSection(selectedSection.id, undefined, { paddingY: e.target.value })}
                      className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 cursor-pointer"
                    >
                      <option value="16px">16px (ضيق)</option>
                      <option value="32px">32px (متوسط)</option>
                      <option value="48px">48px (قياسي)</option>
                      <option value="64px">64px (واسع)</option>
                      <option value="80px">80px (فاخر فسيح)</option>
                    </select>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-xs text-[#B5ADA5] mb-1">{t('لون خلفية هذا القسم', 'Couleur de fond')}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedSection.styles?.bgColor || '#0D0A08'}
                        onChange={(e) => updateDraftSection(selectedSection.id, undefined, { bgColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-[#D4AF37]/30"
                      />
                      <input
                        type="text"
                        value={selectedSection.styles?.bgColor || '#0D0A08'}
                        onChange={(e) => updateDraftSection(selectedSection.id, undefined, { bgColor: e.target.value })}
                        className="flex-1 bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-1.5 border border-[#D4AF37]/25 font-mono"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-xs text-[#B5ADA5] mb-1">{t('لون التمييز (Accent Color)', 'Couleur d\'accent')}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedSection.styles?.accentColor || '#F4BE16'}
                        onChange={(e) => updateDraftSection(selectedSection.id, undefined, { accentColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-[#D4AF37]/30"
                      />
                      <input
                        type="text"
                        value={selectedSection.styles?.accentColor || '#F4BE16'}
                        onChange={(e) => updateDraftSection(selectedSection.id, undefined, { accentColor: e.target.value })}
                        className="flex-1 bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-1.5 border border-[#D4AF37]/25 font-mono"
                      />
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="block text-xs text-[#B5ADA5] mb-1">{t('محاذاة النصوص', 'Alignement du texte')}</label>
                    <div className="flex gap-2">
                      {['right', 'center', 'left'].map((al) => (
                        <button
                          key={al}
                          type="button"
                          onClick={() => updateDraftSection(selectedSection.id, undefined, { textAlign: al as any })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                            (selectedSection.styles?.textAlign || 'right') === al
                              ? 'bg-[#F4BE16] text-[#0D0A08] border-[#F4BE16]'
                              : 'bg-[#0D0A08] text-white border-white/20'
                          }`}
                        >
                          {al === 'right' ? 'يمين' : al === 'center' ? 'وسط' : 'يسار'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="block text-xs text-[#B5ADA5] mb-1">
                      {t('انحناء زوايا القسم:', 'Rayon des bordures:')} {selectedSection.styles?.borderRadius || '0px'}
                    </label>
                    <select
                      value={selectedSection.styles?.borderRadius || '0px'}
                      onChange={(e) => updateDraftSection(selectedSection.id, undefined, { borderRadius: e.target.value })}
                      className="w-full bg-[#0D0A08] text-white text-xs rounded-xl px-3 py-2 border border-[#D4AF37]/25 cursor-pointer"
                    >
                      <option value="0px">بدون استدارة (0px)</option>
                      <option value="16px">16px</option>
                      <option value="24px">24px</option>
                      <option value="32px">32px</option>
                    </select>
                  </div>

                </div>
              )}

            </div>
          </aside>
        )}

      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={handleSelectMedia}
        currentImage={selectedSection?.content?.[mediaPickerTargetKey]}
      />

    </div>
  );
};
