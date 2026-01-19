// src/components/ChatWidget/index.tsx
'use client';

import { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatPanel } from './ChatPanel';
import type { ChatWidgetState } from './types';

export function ChatWidget() {
  const [state, setState] = useState<ChatWidgetState>('closed');
  const [hasUnread, setHasUnread] = useState(false);

  const handleOpen = () => {
    setState('open');
    setHasUnread(false);
  };

  const handleClose = () => {
    setState('closed');
  };

  const handleMinimize = () => {
    setState('minimized');
  };

  return (
    <>
      {state !== 'open' && (
        <ChatButton onClick={handleOpen} hasUnread={hasUnread} />
      )}
      <ChatPanel
        isOpen={state === 'open'}
        onClose={handleClose}
        onMinimize={handleMinimize}
      />
    </>
  );
}

export default ChatWidget;
