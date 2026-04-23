'use client';

import { Message } from '@/types';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { CitationCard } from './CitationCard';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  onCitationClick: (page: number) => void;
}

export function MessageBubble({ message, onCitationClick }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex flex-col gap-1.5', isUser ? 'items-end' : 'items-start')}>
      <span className="text-[10px] font-medium text-slate-600 px-1">
        {isUser ? 'You' : 'AI Assistant'}
      </span>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-brand-700 text-white rounded-tr-sm'
            : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm shadow-sm'
        )}
      >
        {message.loading ? (
          <LoadingDots />
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>

      {!message.loading && message.citations && message.citations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 max-w-[85%]">
          {message.citations.map((citation, i) => (
            <CitationCard
              key={`${citation.page_number}-${i}`}
              citation={citation}
              onClick={onCitationClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
