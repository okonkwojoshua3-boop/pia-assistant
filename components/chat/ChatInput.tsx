'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
      <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask about the Petroleum Industry Act…"
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400',
            'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            'max-h-[120px] overflow-y-auto'
          )}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-lg shrink-0',
            'bg-green-700 text-white transition-all',
            'hover:bg-green-800 disabled:opacity-30 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-green-400'
          )}
        >
          <Send size={14} />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-1.5">Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
