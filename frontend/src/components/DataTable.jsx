import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { LoadingSpinner, EmptyState } from './UIStates';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found',
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  pagination,
  onPageChange,
  actions,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#F0D9D5] shadow-sm overflow-hidden flex flex-col transition-all">
      {/* Table Toolbar */}
      {(onSearchChange || actions) && (
        <div className="p-4 border-b border-[#F0D9D5] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFF5F1]/30">
          {onSearchChange ? (
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#A95763]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] placeholder-[#6F6264]/60 focus:outline-none focus:ring-2 focus:ring-[#F4A6A6]/30 focus:border-[#E27B88] transition-all"
              />
            </div>
          ) : (
            <div />
          )}
          {actions && <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">{actions}</div>}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FFF5F1]/80 border-b border-[#F0D9D5]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 text-xs font-bold text-[#A95763] uppercase tracking-wider ${
                    col.className || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0D9D5]/60 text-sm">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <LoadingSpinner text="Loading records..." />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10">
                  <EmptyState title={emptyMessage} description="Try refining your search or filters." />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row._id || rowIdx}
                  className="hover:bg-[#FFF5F1]/50 transition-colors duration-150 group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-3.5 px-4 text-[#2D2526] align-middle text-xs sm:text-sm ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.pages > 1 && (
        <div className="px-4 py-3 border-t border-[#F0D9D5] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFF5F1]/40 text-xs text-[#6F6264]">
          <div>
            Showing <span className="font-extrabold text-[#2D2526]">{data.length}</span> of{' '}
            <span className="font-extrabold text-[#2D2526]">{pagination.total}</span> items
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-[#F0D9D5] bg-white text-[#A95763] hover:bg-[#FFF5F1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-bold text-[#2D2526]">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-1.5 rounded-lg border border-[#F0D9D5] bg-white text-[#A95763] hover:bg-[#FFF5F1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

