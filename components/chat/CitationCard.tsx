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
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs',
        'bg-green-50 border border-green-200 text-green-800',
        'hover:bg-green-100 hover:border-green-400 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-green-400'
      )}
      title={citation.chapter_title ?? undefined}
    >
      <FileText size={12} className="shrink-0" />
      <span className="font-medium">{label}</span>
      <span className="text-green-600">— p. {citation.page_number}</span>
    </button>
  );
}
