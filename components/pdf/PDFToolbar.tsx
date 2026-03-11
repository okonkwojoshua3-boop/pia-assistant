'use client';

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFToolbarProps {
  currentPage: number;
  totalPages: number;
  scale: number;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPageChange: (page: number) => void;
}

export function PDFToolbar({
  currentPage,
  totalPages,
  scale,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPageChange,
}: PDFToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 shadow-sm text-sm">
      {/* Branding */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className="w-6 h-6 rounded-md bg-brand-700 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">PIA</span>
        </div>
        <span className="text-gray-700 font-semibold text-xs hidden sm:block">Petroleum Industry Act</span>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) onPageChange(val);
            }}
            className={cn(
              'w-10 text-center bg-transparent text-gray-700 text-xs font-medium',
              'focus:outline-none',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            )}
          />
          <span className="text-gray-400 text-xs">/ {totalPages || '—'}</span>
        </div>

        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 min-w-[120px] justify-end">
        <button
          onClick={onZoomOut}
          disabled={scale <= 0.5}
          aria-label="Zoom out"
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomOut size={15} />
        </button>

        <button
          onClick={onResetZoom}
          className="px-2 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors min-w-[44px] text-center"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          disabled={scale >= 3.0}
          aria-label="Zoom in"
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomIn size={15} />
        </button>

        <button
          onClick={onResetZoom}
          aria-label="Reset zoom"
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}
