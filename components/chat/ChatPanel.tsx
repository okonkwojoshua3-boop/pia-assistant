'use client';

import { X, Trash2 } from 'lucide-react';
import { Message } from '@/types';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onClose: () => void;
  onClear: () => void;
  onCitationClick: (page: number) => void;
}

export function ChatPanel({
  isOpen,
  messages,
  isLoading,
  onSend,
  onClose,
  onClear,
  onCitationClick,
}: ChatPanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col h-full shrink-0 overflow-hidden',
        'bg-[#111111] border-l border-[#222222]',
        'shadow-[-4px_0_32px_rgba(0,0,0,0.5)]',
        'transition-[width] duration-300 ease-in-out',
        isOpen ? 'w-1/3' : 'w-0'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-[#222222] shrink-0">
        <p className="text-[#888888] text-[9px] font-semibold tracking-[0.2em] uppercase">
          AI Assistant
        </p>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClear}
              aria-label="Clear conversation"
              className="p-1.5 text-[#555555] hover:text-[#aaaaaa] hover:bg-[#1e1e1e] rounded-lg transition-colors"
              title="Clear conversation"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="p-1.5 text-[#555555] hover:text-[#aaaaaa] hover:bg-[#1e1e1e] rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages messages={messages} onCitationClick={onCitationClick} />

      {/* Input */}
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
