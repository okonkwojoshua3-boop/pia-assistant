'use client';

export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-0.5">
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  );
}
