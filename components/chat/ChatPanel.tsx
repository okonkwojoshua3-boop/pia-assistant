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
        'flex flex-col h-full shrink-0 overflow-hidden',
        'bg-[#1e293b] border-l border-slate-700/60',
        'shadow-[-4px_0_24px_rgba(0,0,0,0.3)]',
        'transition-[width] duration-300 ease-in-out',
        isOpen ? 'w-1/3' : 'w-0'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-700/30 border border-brand-600/40 flex items-center justify-center">
            <Bot size={16} className="text-brand-400" />
          </div>
          <div>
            <h2 className="text-slate-100 font-semibold text-sm leading-tight">PIA 2021 Assistant</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              <p className="text-slate-500 text-[11px]">AI Legal Assistant</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClear}
              aria-label="Clear conversation"
              className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
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
