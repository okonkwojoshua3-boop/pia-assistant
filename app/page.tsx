'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PDFToolbar } from '@/components/pdf/PDFToolbar';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { FloatingAIButton } from '@/components/ui/FloatingAIButton';
import { usePDFNavigation } from '@/hooks/usePDFNavigation';
import { useChat } from '@/hooks/useChat';

// Dynamically import PDFViewer to avoid SSR issues with pdfjs
const PDFViewer = dynamic(
  () => import('@/components/pdf/PDFViewer').then((m) => m.PDFViewer),
  { ssr: false }
);

export default function Home() {
  const [totalPages, setTotalPages] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const nav = usePDFNavigation(totalPages);
  const chat = useChat();

  const handleDocumentLoad = useCallback((numPages: number) => {
    setTotalPages(numPages);
  }, []);

  const handleCitationClick = useCallback(
    (page: number) => {
      nav.goToPage(page);
      // On mobile, close chat to show the PDF
      if (window.innerWidth < 768) {
        setIsChatOpen(false);
      }
    },
    [nav]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <PDFToolbar
        currentPage={nav.currentPage}
        totalPages={totalPages}
        scale={nav.scale}
        onPrev={nav.prevPage}
        onNext={nav.nextPage}
        onZoomIn={nav.zoomIn}
        onZoomOut={nav.zoomOut}
        onResetZoom={nav.resetZoom}
        onPageChange={nav.goToPage}
      />

      {/* PDF Viewer */}
      <main className="flex-1 overflow-auto bg-gray-200 p-4">
        <PDFViewer
          currentPage={nav.currentPage}
          scale={nav.scale}
          targetPage={nav.targetPage}
          onDocumentLoad={handleDocumentLoad}
          onPageChange={nav.setCurrentPage}
          onTargetConsumed={nav.clearTarget}
        />
      </main>

      {/* Chat UI */}
      <ChatPanel
        isOpen={isChatOpen}
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSend={chat.sendMessage}
        onClose={() => setIsChatOpen(false)}
        onClear={chat.clearMessages}
        onCitationClick={handleCitationClick}
      />

      <FloatingAIButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen((o) => !o)}
      />
    </div>
  );
}
