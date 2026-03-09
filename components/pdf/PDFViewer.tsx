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
  currentPage,
  scale,
  targetPage,
  onDocumentLoad,
  onPageChange,
  onTargetConsumed,
}: PDFViewerProps) {
  const [highlight, setHighlight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    onDocumentLoad(numPages);
  }

  // Respond to targetPage changes
  useEffect(() => {
    if (targetPage !== null) {
      onPageChange(targetPage);
      setHighlight(true);
      onTargetConsumed();
      const t = setTimeout(() => setHighlight(false), 2500);
      return () => clearTimeout(t);
    }
  }, [targetPage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} className="relative flex justify-center">
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
        <div className="relative">
          <Page
            pageNumber={currentPage}
            scale={scale}
            renderTextLayer
            renderAnnotationLayer
            loading={
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                Rendering page…
              </div>
            }
          />
          <PDFHighlight active={highlight} />
        </div>
      </Document>
    </div>
  );
}
