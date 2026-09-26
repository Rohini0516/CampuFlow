import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-[#FFD6C9] border-t-[#A95763] animate-spin"></div>
        </div>
        <p className="text-sm font-semibold text-[#A95763] animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 space-x-3 text-[#A95763]">
      <Loader2 className="w-5 h-5 animate-spin text-[#E27B88]" />
      <span className="text-sm font-semibold">{text}</span>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon,
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-[#F0D9D5] shadow-sm">
      {Icon && (
        <div className="p-3 bg.FFF5F1 bg-[#FFF5F1] text-[#A95763] rounded-2xl mb-4 border border-[#F0D9D5]">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base font-bold text-[#2D2526] mb-1">{title}</h3>
      <p className="text-sm text-[#6F6264] max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#E27B88] to-[#A95763] rounded-xl hover:from-[#A95763] hover:to-[#7E3B46] shadow-sm shadow-[#F4A6A6]/30 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Unable to load data',
  message = 'An error occurred while connecting to the server. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#FFF5F1] rounded-2xl border border-[#F0D9D5] my-4">
      <div className="w-10 h-10 rounded-full bg-[#FFD6C9] text-[#A95763] flex items-center justify-center font-black mb-3">
        !
      </div>
      <h4 className="text-base font-extrabold text-[#A95763] mb-1">{title}</h4>
      <p className="text-sm text-[#6F6264] max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-bold text-[#A95763] bg-white border border-[#F0D9D5] rounded-xl hover:bg-[#FFF5F1] shadow-sm transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs font-bold',
    lg: 'px-3 py-1.5 text-sm font-bold',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-[#FFF5F1] text-[#A95763] border border-[#F0D9D5]',
    peach: 'bg-[#FFF5F1] text-[#A95763] border border-[#F0D9D5]',
    rose: 'bg-[#FFD6C9] text-[#7E3B46] border border-[#EFA7B5]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg transition-colors ${sizeClasses[size]} ${
        variantClasses[variant] || variantClasses.primary
      }`}
    >
      {children}
    </span>
  );
};
