import { memo } from 'react';
import type { Toast } from '@/types';

const TOAST_STYLES: Record<Toast['type'], { bg: string; icon: string; border: string; accent: string }> = {
  success: { bg: 'bg-white', icon: 'solar:check-circle-linear', border: 'border-[#dcfce7]', accent: 'text-[#10b981]' },
  error: { bg: 'bg-white', icon: 'solar:close-circle-linear', border: 'border-rose-100', accent: 'text-rose-500' },
  warning: { bg: 'bg-white', icon: 'solar:danger-triangle-linear', border: 'border-amber-100', accent: 'text-amber-500' },
  info: { bg: 'bg-white', icon: 'solar:info-circle-linear', border: 'border-[#dcfce7]', accent: 'text-[#022c22]' },
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer = memo(function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none" aria-live="polite">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-premium
              animate-toast-in bg-white min-w-[340px] max-w-[420px] transition-all
              ${style.border}
            `}
            role="alert"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.accent} bg-[#f0fdf4]`}>
              <iconify-icon
                icon={style.icon}
                width="24"
                height="24"
              />
            </div>
            <div className="flex-1">
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{toast.type}</div>
               <div className="text-sm font-bold text-[#022c22]">
                 {toast.message}
               </div>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-[#022c22] hover:bg-[#f0fdf4] transition-all flex-shrink-0"
              aria-label="Dismiss"
            >
              <iconify-icon icon="mingcute:close-line" width="18" height="18" />
            </button>
          </div>
        );
      })}
    </div>
  );
});
