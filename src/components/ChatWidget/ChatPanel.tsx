// src/components/ChatWidget/ChatPanel.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatSession } from './hooks/useChatSession';
import { useVoiceStream } from './hooks/useVoiceStream';
import { VoiceVisualizer } from './VoiceVisualizer';
import type { VoiceMode, Message } from './types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export function ChatPanel({ isOpen, onClose, onMinimize }: ChatPanelProps) {
  const { sessionId, messages, isLoading, sendMessage, addMessage } = useChatSession();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice mode callbacks
  const handleTranscription = useCallback((text: string) => {
    // Add user's transcribed message to chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMessage);
  }, [addMessage]);

  const handleVoiceResponse = useCallback((text: string) => {
    // Add assistant's response to chat
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: text,
      timestamp: new Date(),
    };
    addMessage(assistantMessage);
  }, [addMessage]);

  const {
    isRecording,
    isProcessing,
    isPlaying,
    error: voiceError,
    toggleRecording,
    stopPlayback,
    clearError,
  } = useVoiceStream({
    sessionId: sessionId || undefined,
    onTranscription: handleTranscription,
    onResponse: handleVoiceResponse,
  });

  // Determine voice mode for visualizer
  const voiceMode: VoiceMode = isRecording ? 'listening'
    : isPlaying ? 'speaking'
    : isProcessing ? 'processing'
    : 'idle';

  const isVoiceActive = isRecording || isProcessing || isPlaying;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200">
      {/* Header */}
      <div className="bg-[#7cb342] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          <span className="font-semibold">MGO Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Minimize chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-8">
            <p className="text-lg font-medium">Hi! I'm Mia</p>
            <p className="text-sm mt-1">How can I help you today?</p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => sendMessage("I'd like to apply for a merchant account")}
                className="block w-full text-left px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Apply for merchant account
              </button>
              <button
                onClick={() => sendMessage("What services does MGO offer?")}
                className="block w-full text-left px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Learn about services
              </button>
              <button
                onClick={() => sendMessage("Which islands do you serve?")}
                className="block w-full text-left px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Coverage areas
              </button>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-[#7cb342] text-white rounded-br-md'
                  : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded-2xl rounded-bl-md">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Error Display */}
      {voiceError && (
        <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-600">{voiceError}</span>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
        {isVoiceActive ? (
          /* Voice Mode UI */
          <div className="flex items-center justify-center gap-4">
            <VoiceVisualizer
              isActive={isVoiceActive}
              mode={voiceMode === 'idle' ? 'processing' : voiceMode}
              className="flex-shrink-0"
            />
            <span className="text-sm text-slate-600">
              {isRecording ? 'Listening...' : isProcessing ? 'Processing...' : 'Speaking...'}
            </span>
            <button
              onClick={isPlaying ? stopPlayback : toggleRecording}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
              }`}
              aria-label={isRecording ? 'Stop recording' : isPlaying ? 'Stop playback' : 'Cancel'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          /* Text Mode UI */
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:border-[#7cb342] focus:ring-1 focus:ring-[#7cb342]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-[#7cb342] hover:bg-[#558b2f] disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
            {/* Microphone Button */}
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className="w-10 h-10 bg-[#7cb342] hover:bg-[#558b2f] disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Start voice recording"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
