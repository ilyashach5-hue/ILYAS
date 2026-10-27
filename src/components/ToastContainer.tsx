import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-20 right-4 rtl:right-4 ltr:left-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#120E0B] border border-[#D4AF37]/40 shadow-2xl text-xs text-white animate-in slide-in-from-top-2 duration-200"
        >
          {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#F4BE16] shrink-0" />}
          {t.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          <span className="font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
};
