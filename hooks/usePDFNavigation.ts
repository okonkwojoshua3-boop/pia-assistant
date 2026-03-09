'use client';

import { useState, useCallback } from 'react';

export function usePDFNavigation(totalPages: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [targetPage, setTargetPage] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages || 1));
      setCurrentPage(clamped);
      setTargetPage(clamped);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.25, 3.0)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.25, 0.5)), []);
  const resetZoom = useCallback(() => setScale(1.0), []);

  const clearTarget = useCallback(() => setTargetPage(null), []);

  return {
    currentPage,
    targetPage,
    scale,
    setCurrentPage,
    goToPage,
    nextPage,
    prevPage,
    zoomIn,
    zoomOut,
    resetZoom,
    clearTarget,
  };
}
