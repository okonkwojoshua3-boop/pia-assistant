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
        'bg-slate-800 border border-slate-700 text-slate-300',
        'hover:bg-slate-700 hover:border-brand-500/60 hover:text-slate-100 hover:shadow-sm transition-all',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/40'
      )}
      title={citation.chapter_title ?? undefined}
    >
      <FileText size={11} className="shrink-0 text-brand-400" />
      <span className="font-semibold">{label}</span>
      <span className="text-slate-500 font-normal">p. {citation.page_number}</span>
    </button>
  );
}
