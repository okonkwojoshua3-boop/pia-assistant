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
    <div className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white">
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
          'flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2',
          'text-sm text-gray-800 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'max-h-[120px] overflow-y-auto'
        )}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className={cn(
          'w-9 h-9 flex items-center justify-center rounded-full shrink-0',
          'bg-green-700 text-white transition-colors',
          'hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-green-400'
        )}
      >
        <Send size={16} />
      </button>
    </div>
  );
}
