'use client';

import { FileText } from 'lucide-react';
import { Citation } from '@/types';
import { cn } from '@/lib/utils';

interface CitationCardProps {
  citation: Citation;
  onClick: (page: number) => void;
}

export function CitationCard({ citation, onClick }: CitationCardProps) {
  const label = [
    citation.section_number ? `Section ${citation.section_number}` : null,
    citation.chapter_number ? `Chapter ${citation.chapter_number}` : null,
  ]
    .filter(Boolean)
    .join(', ') || 'Reference';

  return (
    <button
      onClick={() => onClick(citation.page_number)}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs',
        'bg-accent-500/15 border border-accent-500/40 text-accent-400',
        'hover:bg-accent-500/25 hover:border-accent-500/70 hover:text-accent-300 hover:shadow-sm transition-all',
        'focus:outline-none focus:ring-2 focus:ring-accent-500/40'
      )}
      title={citation.chapter_title ?? undefined}
    >
      <FileText size={11} className="shrink-0 text-accent-500" />
      <span className="font-semibold">{label}</span>
      <span className="text-accent-400/70 font-normal">p. {citation.page_number}</span>
    </button>
  );
}
