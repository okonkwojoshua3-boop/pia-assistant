'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { PDFHighlight } from './PDFHighlight';

// Configure worker
import '@/lib/pdf/pdfWorker';

interface PDFViewerProps {
  currentPage: number;
  scale: number;
  targetPage: number | null;
  onDocumentLoad: (numPages: number) => void;
  onPageChange: (page: number) => void;
  onTargetConsumed: () => void;
}

export function PDFViewer({
  scale,
  targetPage,
  onDocumentLoad,
  onPageChange,
  onTargetConsumed,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [highlightPage, setHighlightPage] = useState<number | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
    setNumPages(n);
    onDocumentLoad(n);
  }

  // Scroll to target page and highlight it
  useEffect(() => {
    if (targetPage !== null && pageRefs.current[targetPage - 1]) {
      pageRefs.current[targetPage - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightPage(targetPage);
      onTargetConsumed();
      const t = setTimeout(() => setHighlightPage(null), 2500);
      return () => clearTimeout(t);
    }
  }, [targetPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track which page is most visible and report it as currentPage
  useEffect(() => {
    if (numPages === 0) return;
    const visibility: Record<number, number> = {};
    const observers = pageRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibility[i + 1] = entry.intersectionRatio;
          const best = Object.entries(visibility).reduce((a, b) => (b[1] > a[1] ? b : a));
          onPageChange(Number(best[0]));
        },
        { threshold: Array.from({ length: 11 }, (_, k) => k / 10) }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [numPages, onPageChange]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Document
        file="/pia-2021.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
            Loading PDF…
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-red-500 text-sm">
            <span className="text-2xl">⚠️</span>
            <p>Failed to load PDF.</p>
            <p className="text-xs text-gray-500">Place pia-2021.pdf in the public/ folder.</p>
          </div>
        }
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
          <div
            key={pageNum}
            ref={(el) => { pageRefs.current[pageNum - 1] = el; }}
            className="relative"
          >
            <Page
              pageNumber={pageNum}
              scale={scale}
              renderTextLayer
              renderAnnotationLayer
              loading={
                <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                  Rendering page…
                </div>
              }
            />
            <PDFHighlight active={highlightPage === pageNum} />
          </div>
        ))}
      </Document>
    </div>
  );
}
