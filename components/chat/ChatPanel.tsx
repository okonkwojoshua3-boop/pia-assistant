'use client';

import { X, Trash2, Bot } from 'lucide-react';
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
        'fixed bottom-24 right-6 z-40 flex flex-col',
        'w-[400px] max-w-[calc(100vw-2rem)]',
        'h-[620px] max-h-[calc(100vh-8rem)]',
        'bg-white rounded-2xl border border-gray-200',
        'shadow-[0_8px_40px_rgba(0,0,0,0.18)]',
        'transition-all duration-300 origin-bottom-right overflow-hidden',
        isOpen
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-800 to-brand-600 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm leading-tight">PIA 2021 Assistant</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-300 animate-pulse" />
              <p className="text-brand-100 text-[11px]">AI Legal Assistant</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClear}
              aria-label="Clear conversation"
              className="p-1.5 text-brand-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="p-1.5 text-brand-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
