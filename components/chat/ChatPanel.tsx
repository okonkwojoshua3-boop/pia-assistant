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
        'fixed bottom-24 right-6 z-40 flex flex-col',
        'w-[380px] max-w-[calc(100vw-2rem)]',
        'h-[600px] max-h-[calc(100vh-8rem)]',
        'bg-gray-50 rounded-2xl shadow-2xl border border-gray-200',
        'transition-all duration-300 origin-bottom-right',
        isOpen
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-green-700 rounded-t-2xl">
        <div>
          <h2 className="text-white font-semibold text-sm">PIA 2021 Assistant</h2>
          <p className="text-green-200 text-xs">Petroleum Industry Act</p>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClear}
              aria-label="Clear conversation"
              className="p-1.5 text-green-200 hover:text-white hover:bg-green-800 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="p-1.5 text-green-200 hover:text-white hover:bg-green-800 rounded-lg transition-colors"
          >
            <X size={14} />
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
