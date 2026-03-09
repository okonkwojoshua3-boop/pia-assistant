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
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white text-sm">
      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5">
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
              'w-12 text-center bg-gray-700 rounded px-1.5 py-0.5',
              'text-white text-xs border border-gray-600',
              'focus:outline-none focus:border-green-400',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            )}
          />
          <span className="text-gray-400 text-xs">/ {totalPages || '—'}</span>
        </div>

        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onZoomOut}
          disabled={scale <= 0.5}
          aria-label="Zoom out"
          className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomOut size={16} />
        </button>

        <button
          onClick={onResetZoom}
          className="px-2 py-0.5 rounded text-xs hover:bg-gray-700 transition-colors min-w-[48px] text-center"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          disabled={scale >= 3.0}
          aria-label="Zoom in"
          className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomIn size={16} />
        </button>

        <button
          onClick={onResetZoom}
          aria-label="Reset zoom"
          className="p-1.5 rounded hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
