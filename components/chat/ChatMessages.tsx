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
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
          <span className="text-2xl">⚖️</span>
        </div>
        <h3 className="font-semibold text-gray-800 mb-1">PIA 2021 Legal Assistant</h3>
        <p className="text-xs text-gray-500 max-w-[200px]">
          Ask any question about the Petroleum Industry Act 2021. I will cite the exact section and page.
        </p>
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
