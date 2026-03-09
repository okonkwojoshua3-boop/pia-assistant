'use client';

import { useState, useCallback } from 'react';
import { Message, Citation } from '@/types';
import { nanoid } from '@/lib/utils';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMsg: Message = {
      id: nanoid(),
      role: 'user',
      content: question,
    };

    const loadingMsg: Message = {
      id: nanoid(),
      role: 'assistant',
      content: '',
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Request failed');
      }

      const data: { answer: string; citations: Citation[] } = await res.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.loading
            ? { ...m, content: data.answer, citations: data.citations, loading: false }
            : m
        )
      );
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setMessages((prev) =>
        prev.map((m) =>
          m.loading ? { ...m, content: errorText, loading: false } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, sendMessage, clearMessages };
}
