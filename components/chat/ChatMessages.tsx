'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { MessageBubble } from './MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  onCitationClick: (page: number) => void;
}

export function ChatMessages({ messages, onCitationClick }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
          <span className="text-2xl">⚖️</span>
        </div>
        <div>
          <h3 className="font-semibold text-slate-200 mb-1">PIA 2021 Legal Assistant</h3>
          <p className="text-xs text-slate-500 max-w-[220px]">
            Ask any question about the Petroleum Industry Act 2021. I'll cite the exact section and page.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {[
            'What are the licensing requirements?',
            'What is the role of NUPRC?',
            'How are royalties calculated?',
          ].map((q) => (
            <div
              key={q}
              className="text-xs text-left px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 cursor-default"
            >
              {q}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} onCitationClick={onCitationClick} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
