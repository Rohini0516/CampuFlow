import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2526]/45 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full ${maxWidth} my-8 border border-[#F0D9D5] animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#F0D9D5] flex items-center justify-between bg-[#FFF5F1]">
            <div>
              <h3 className="text-lg font-black text-[#2D2526]">{title}</h3>
              {subtitle && <p className="text-xs text-[#6F6264] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#A95763] hover:text-[#7E3B46] hover:bg-[#FFD6C9]/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">{children}</div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-3.5 bg-[#FFF5F1]/50 border-t border-[#F0D9D5] flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

