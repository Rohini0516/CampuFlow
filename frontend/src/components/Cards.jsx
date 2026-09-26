import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'peach',
  trend,
  onClick,
}) => {
  const colorThemes = {
    peach: {
      bg: 'bg-[#FFF5F1]',
      text: 'text-[#A95763]',
      border: 'hover:border-[#EFA7B5]',
      iconBorder: 'border border-[#F0D9D5]',
    },
    rose: {
      bg: 'bg-[#FFD6C9]',
      text: 'text-[#7E3B46]',
      border: 'hover:border-[#EFA7B5]',
      iconBorder: 'border border-[#EFA7B5]',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'hover:border-emerald-200',
      iconBorder: 'border border-emerald-200',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'hover:border-amber-200',
      iconBorder: 'border border-amber-200',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'hover:border-indigo-200',
      iconBorder: 'border border-indigo-200',
    },
  };

  const theme = colorThemes[color] || colorThemes.peach;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-[#F0D9D5] shadow-sm card-hover transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${theme.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#A95763] uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D2526] tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text} ${theme.iconBorder} shadow-sm`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 flex items-center text-xs font-semibold text-[#6F6264]">
          {trend && (
            <span
              className={`mr-2 font-extrabold ${
                trend.startsWith('+') ? 'text-emerald-600' : 'text-[#A95763]'
              }`}
            >
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export const DashboardCard = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#F0D9D5] shadow-sm overflow-hidden flex flex-col hover:border-[#EFA7B5] transition-colors ${className}`}
    >
      {(title || action) && (
        <div className="px-5 py-4 border-b border-[#F0D9D5] flex items-center justify-between bg-[#FFF5F1]/40">
          <div>
            <h3 className="text-base font-extrabold text-[#2D2526]">{title}</h3>
            {subtitle && <p className="text-xs font-medium text-[#6F6264] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div className={`flex-1 ${noPadding ? '' : 'p-5'}`}>{children}</div>
    </div>
  );
};
