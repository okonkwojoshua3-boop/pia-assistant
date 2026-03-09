'use client';

import { useEffect, useState } from 'react';

interface PDFHighlightProps {
  active: boolean;
}

/**
 * Renders a semi-transparent highlight banner at the top of the PDF page
 * to draw attention when navigating via a citation.
 */
export function PDFHighlight({ active }: PDFHighlightProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 border-4 border-yellow-400 rounded animate-pulse"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
