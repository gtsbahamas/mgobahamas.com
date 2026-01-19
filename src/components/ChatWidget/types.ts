// src/components/ChatWidget/types.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  status: 'active' | 'transferred' | 'closed';
  inquiryData: Partial<InquiryData>;
}

export interface InquiryData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  island: string;
  message: string;
}

export type ChatWidgetState = 'closed' | 'open' | 'minimized';

export type InputMode = 'text' | 'voice';

export type VoiceMode = 'listening' | 'speaking' | 'processing' | 'idle';
