import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export function Modal({ isOpen, onClose, title, children, width = '480px' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#022c22]/40 z-[60] flex items-center justify-center backdrop-blur-sm animate-fade-in px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-premium shadow-premium overflow-hidden flex flex-col animate-scale-in border border-[#dcfce7]"
        style={{ width, maxWidth: '100%', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="px-10 py-8 border-b border-[#f0fdf4] flex justify-between items-center bg-white">
          <h2 id="modal-title" className="text-2xl font-black tracking-tighter uppercase text-[#022c22] flex items-center gap-3">
            <span className="text-[#bef264] text-lg">■</span>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#022c22] hover:bg-[#f0fdf4] transition-all"
            aria-label="Close modal"
          >
            <iconify-icon icon="mingcute:close-line" width="24" height="24" />
          </button>
        </div>
        <div className="p-10 flex-1 overflow-y-auto bg-white">{children}</div>
      </div>
    </div>
  );
}
