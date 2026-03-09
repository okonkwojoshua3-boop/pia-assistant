'use client';

import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAIButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function FloatingAIButton({ isOpen, onClick }: FloatingAIButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
      className={cn(
        'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg',
        'flex items-center justify-center transition-all duration-300',
        'bg-green-700 hover:bg-green-800 text-white',
        'focus:outline-none focus:ring-4 focus:ring-green-400'
      )}
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </button>
  );
}
