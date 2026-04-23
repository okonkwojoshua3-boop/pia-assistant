'use client';

import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAIButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function FloatingAIButton({ isOpen, onClick }: FloatingAIButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-accent-400 opacity-30 animate-ping" />
      )}
      <button
        onClick={onClick}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        className={cn(
          'relative w-14 h-14 rounded-full shadow-lg',
          'flex items-center justify-center transition-all duration-300',
          'bg-accent-500 hover:bg-accent-600 text-white',
          'focus:outline-none focus:ring-4 focus:ring-accent-400',
          !isOpen && 'hover:scale-110'
        )}
      >
        <span className={cn('transition-transform duration-300', isOpen ? 'rotate-90' : 'rotate-0')}>
          {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </span>
      </button>
    </div>
  );
}
