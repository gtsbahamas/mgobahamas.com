// src/components/ChatWidget/ChatButton.tsx
'use client';

interface ChatButtonProps {
  onClick: () => void;
  hasUnread: boolean;
}

export function ChatButton({ onClick, hasUnread }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#7cb342] hover:bg-[#558b2f] text-white rounded-full shadow-lg shadow-[#7cb342]/25 hover:shadow-[#7cb342]/40 transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
      aria-label="Open chat assistant"
    >
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      )}
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
  );
}
