# Voice Assistant Phase 1: Text Chat Foundation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a floating chat widget to mgobahamas.com that connects to MGO Support for AI-powered customer assistance via text.

**Architecture:** React component in mgobahamas.com communicates with new chat API endpoints in MGO Support. Claude handles conversations with tools for knowledge base search, form filling, and human handoff.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Anthropic Claude API

---

## Prerequisites

Before starting, ensure:
- [ ] Working in worktree: `/Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant`
- [ ] MGO Support project available at: `/Users/tywells/Downloads/projects/mgosupport`
- [ ] Environment variables: `ANTHROPIC_API_KEY` in MGO Support

---

## Task 1: ChatWidget Component Structure

**Files:**
- Create: `src/components/ChatWidget/index.tsx`
- Create: `src/components/ChatWidget/ChatButton.tsx`
- Create: `src/components/ChatWidget/ChatPanel.tsx`
- Create: `src/components/ChatWidget/types.ts`
- Modify: `src/app/layout.tsx`

### Step 1: Create types file

```typescript
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
```

### Step 2: Create ChatButton component

```typescript
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
```

### Step 3: Create ChatPanel component (shell)

```typescript
// src/components/ChatWidget/ChatPanel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import type { Message, ChatSession } from './types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export function ChatPanel({ isOpen, onClose, onMinimize }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Connect to MGO Support API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
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
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create main ChatWidget component

```typescript
// src/components/ChatWidget/index.tsx
'use client';

import { useState, useEffect } from 'react';
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
```

### Step 5: Add ChatWidget to layout

Modify `src/app/layout.tsx`:

```typescript
// Add import at top
import { ChatWidget } from '@/components/ChatWidget';

// Add ChatWidget before closing </body> tag, after {children}
<ChatWidget />
```

### Step 6: Test locally

Run: `npm run dev`

Expected:
- Green chat button appears bottom-right
- Clicking opens chat panel
- Can type messages (will show error since API not connected)
- Close/minimize buttons work

### Step 7: Commit

```bash
git add src/components/ChatWidget/ src/app/layout.tsx
git commit -m "feat: add ChatWidget component with floating button and panel"
```

---

## Task 2: Local Chat API Proxy

**Files:**
- Create: `src/app/api/chat/route.ts`

This creates a proxy in mgobahamas.com that forwards to MGO Support.

### Step 1: Create the API route

```typescript
// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MGO_SUPPORT_URL = process.env.MGO_SUPPORT_URL || 'https://mgosupport.vercel.app';
const MGO_SUPPORT_API_KEY = process.env.MGO_SUPPORT_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${MGO_SUPPORT_URL}/api/chat/sessions/${sessionId || 'new'}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MGO_SUPPORT_API_KEY || '',
        'x-source': 'mgobahamas.com',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MGO Support error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from assistant' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 2: Commit

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: add chat API proxy route to MGO Support"
```

---

## Task 3: MGO Support Chat Session API

**Project:** `/Users/tywells/Downloads/projects/mgosupport`

**Files:**
- Create: `src/features/assistant/types.ts`
- Create: `src/features/assistant/tools.ts`
- Create: `src/features/assistant/prompt.ts`
- Create: `src/app/api/chat/sessions/route.ts`
- Create: `src/app/api/chat/sessions/[id]/route.ts`
- Create: `src/app/api/chat/sessions/[id]/messages/route.ts`

### Step 1: Create assistant types

```typescript
// src/features/assistant/types.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface ChatSession {
  id: string;
  source: string;
  status: 'active' | 'transferred' | 'closed';
  mode: 'text' | 'voice';
  messages: Message[];
  inquiryData: Partial<InquiryData>;
  createdAt: Date;
  lastActivityAt: Date;
  ticketId?: string;
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

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  toolResults?: ToolCall[];
}
```

### Step 2: Create tools definition

```typescript
// src/features/assistant/tools.ts
import Anthropic from '@anthropic-ai/sdk';

export const ASSISTANT_TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_knowledge_base',
    description: 'Search MGO product info, services, pricing, and islands served. Use this to answer questions about Mobile GO Bahamas services.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'The search query about MGO services',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'save_inquiry_field',
    description: 'Save a piece of information the user provided for their merchant application. Call this whenever the user shares their name, business, contact info, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {
        field: {
          type: 'string',
          enum: ['firstName', 'lastName', 'email', 'phone', 'businessName', 'businessType', 'island', 'message'],
          description: 'Which field to save',
        },
        value: {
          type: 'string',
          description: 'The value to save',
        },
      },
      required: ['field', 'value'],
    },
  },
  {
    name: 'submit_inquiry',
    description: 'Submit the completed merchant application. Only call this after confirming all required information with the user.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'check_application_status',
    description: 'Look up the status of an existing merchant application by email or phone.',
    input_schema: {
      type: 'object' as const,
      properties: {
        email: {
          type: 'string',
          description: 'Email address used in the application',
        },
        phone: {
          type: 'string',
          description: 'Phone number used in the application',
        },
      },
      required: [],
    },
  },
  {
    name: 'transfer_to_human',
    description: 'Connect the user to a human support agent. Use when the user requests it or when you cannot help with their request.',
    input_schema: {
      type: 'object' as const,
      properties: {
        reason: {
          type: 'string',
          description: 'Why the user needs human support',
        },
        priority: {
          type: 'string',
          enum: ['normal', 'high', 'urgent'],
          description: 'How urgent is this request',
        },
      },
      required: ['reason'],
    },
  },
];
```

### Step 3: Create system prompt builder

```typescript
// src/features/assistant/prompt.ts
import type { InquiryData } from './types';

export function buildSystemPrompt(inquiryData: Partial<InquiryData> = {}): string {
  const collectedFields = Object.entries(inquiryData)
    .filter(([_, value]) => value)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  return `You are Mia, the friendly voice and chat assistant for Mobile GO Bahamas (MGO).

## About MGO
Mobile GO Bahamas provides mobile payment solutions for merchants across the Bahamas. We help businesses accept card payments, mobile payments, and digital transactions.

**Services:**
- Point of Sale (POS) systems
- Mobile card readers
- Payment processing
- Merchant accounts
- Business analytics

**Islands Served:**
- New Providence (Nassau)
- Grand Bahama (Freeport)
- Abaco
- Eleuthera
- Exuma
- Andros
- Long Island
- And more across the Bahamas

**Getting Started:**
1. Submit a merchant application
2. Our team reviews your application (typically 1-2 business days)
3. Account setup and equipment delivery
4. Training and go-live support

## Your Capabilities
- Answer questions about MGO merchant services
- Help users complete a merchant application conversationally
- Check status of existing applications
- Connect users to human support when needed

## Conversation Guidelines
- Be warm, friendly, and conversational - not robotic
- Keep responses concise (1-3 sentences when possible)
- Always confirm before submitting applications
- If unsure about something, offer to connect to human support
- Use the user's name once you know it

## Form Collection Flow
When a user wants to apply, collect information naturally through conversation:
1. Business name and type (restaurant, retail, service, etc.)
2. Island location
3. Contact info (name, email, phone)
4. Any questions or special needs

Don't ask for all information at once - have a natural conversation.

## Current Session State
${collectedFields ? `Information collected so far:\n${collectedFields}` : 'No information collected yet.'}

## Important
- Never make up information about pricing or specific features
- If asked about competitors, stay professional and focus on MGO's strengths
- For technical issues or complaints, offer to transfer to human support`;
}
```

### Step 4: Create sessions route (create new session)

```typescript
// src/app/api/chat/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ChatSession } from '@/features/assistant/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const source = request.headers.get('x-source') || 'unknown';

    const supabase = await createClient();

    const session: Omit<ChatSession, 'id'> = {
      source,
      status: 'active',
      mode: 'text',
      messages: [],
      inquiryData: {},
      createdAt: new Date(),
      lastActivityAt: new Date(),
    };

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      console.error('Failed to create session:', error);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: data.id, session: data });

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create session messages route (send message, get response)

```typescript
// src/app/api/chat/sessions/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { ASSISTANT_TOOLS } from '@/features/assistant/tools';
import { buildSystemPrompt } from '@/features/assistant/prompt';
import type { Message, ChatSession, InquiryData } from '@/features/assistant/types';

const anthropic = new Anthropic();

async function executeToolCall(
  name: string,
  args: Record<string, unknown>,
  session: ChatSession,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ result: unknown; updatedInquiryData?: Partial<InquiryData> }> {
  switch (name) {
    case 'search_knowledge_base': {
      // For now, return static knowledge. Later: query actual KB
      const query = (args.query as string).toLowerCase();

      if (query.includes('price') || query.includes('cost') || query.includes('fee')) {
        return {
          result: 'MGO offers competitive pricing tailored to each business. Our team will provide a custom quote based on your transaction volume and business type during the application review.',
        };
      }
      if (query.includes('island') || query.includes('location') || query.includes('where')) {
        return {
          result: 'MGO serves merchants across all major islands in the Bahamas including Nassau, Freeport, Abaco, Eleuthera, Exuma, Andros, Long Island, and more.',
        };
      }
      if (query.includes('time') || query.includes('long') || query.includes('start')) {
        return {
          result: 'The application review typically takes 1-2 business days. Once approved, equipment delivery and setup usually happens within a week.',
        };
      }
      return {
        result: 'MGO provides mobile payment solutions including POS systems, card readers, and payment processing for Bahamian businesses.',
      };
    }

    case 'save_inquiry_field': {
      const field = args.field as keyof InquiryData;
      const value = args.value as string;
      const updatedInquiryData = { ...session.inquiryData, [field]: value };

      await supabase
        .from('chat_sessions')
        .update({ inquiry_data: updatedInquiryData, last_activity_at: new Date() })
        .eq('id', session.id);

      return {
        result: `Saved ${field}: ${value}`,
        updatedInquiryData,
      };
    }

    case 'submit_inquiry': {
      const { inquiryData } = session;

      // Validate required fields
      const required = ['firstName', 'lastName', 'email', 'businessName', 'island'];
      const missing = required.filter(f => !inquiryData[f as keyof InquiryData]);

      if (missing.length > 0) {
        return {
          result: `Cannot submit yet. Missing required fields: ${missing.join(', ')}`,
        };
      }

      // Submit to merchant application webhook (same endpoint used by the form)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL || ''}/api/webhooks/merchant-application`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.INTERNAL_API_KEY || '',
          },
          body: JSON.stringify(inquiryData),
        });

        if (response.ok) {
          const data = await response.json();

          await supabase
            .from('chat_sessions')
            .update({ status: 'closed', ticket_id: data.ticketId })
            .eq('id', session.id);

          return {
            result: `Application submitted successfully! Ticket ID: ${data.ticketId}. Our team will review your application and contact you within 1-2 business days.`,
          };
        } else {
          return {
            result: 'There was an issue submitting your application. Please try again or contact us directly.',
          };
        }
      } catch (error) {
        console.error('Submit inquiry error:', error);
        return {
          result: 'There was an issue submitting your application. Please try again or contact us directly.',
        };
      }
    }

    case 'check_application_status': {
      // For now, return a generic response. Later: query actual ticket system
      return {
        result: 'To check your application status, please contact our support team at info@mgobahamas.com or call 242-373-1915 with your application reference number.',
      };
    }

    case 'transfer_to_human': {
      const reason = args.reason as string;
      const priority = (args.priority as string) || 'normal';

      // Create a support ticket
      try {
        const { data: ticket } = await supabase
          .from('tickets')
          .insert({
            channel: 'chat',
            subject: `Chat Transfer: ${reason}`,
            status: 'open',
            priority,
            customer_name: [session.inquiryData.firstName, session.inquiryData.lastName].filter(Boolean).join(' ') || 'Chat Visitor',
            customer_email: session.inquiryData.email,
            customer_phone: session.inquiryData.phone,
            tags: ['chat-transfer', 'mgobahamas'],
          })
          .select()
          .single();

        await supabase
          .from('chat_sessions')
          .update({ status: 'transferred', ticket_id: ticket?.id })
          .eq('id', session.id);

        return {
          result: `I've connected you to our support team. A representative will reach out to you shortly. Reference: ${ticket?.id || 'pending'}`,
        };
      } catch (error) {
        console.error('Transfer error:', error);
        return {
          result: 'I\'ve noted your request. Please contact us at info@mgobahamas.com or 242-373-1915 for immediate assistance.',
        };
      }
    }

    default:
      return { result: 'Unknown tool' };
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get or create session
    let session: ChatSession;

    if (sessionId === 'new') {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          source: request.headers.get('x-source') || 'unknown',
          status: 'active',
          mode: 'text',
          messages: [],
          inquiry_data: {},
          created_at: new Date(),
          last_activity_at: new Date(),
        })
        .select()
        .single();

      if (error) throw error;
      session = {
        ...data,
        inquiryData: data.inquiry_data || {},
        createdAt: new Date(data.created_at),
        lastActivityAt: new Date(data.last_activity_at),
      };
    } else {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select()
        .eq('id', sessionId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      session = {
        ...data,
        inquiryData: data.inquiry_data || {},
        createdAt: new Date(data.created_at),
        lastActivityAt: new Date(data.last_activity_at),
      };
    }

    // Add user message to history
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    const messages = [...(session.messages || []), userMessage];

    // Build conversation for Claude
    const claudeMessages = messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Call Claude with tools
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: buildSystemPrompt(session.inquiryData),
      tools: ASSISTANT_TOOLS,
      messages: claudeMessages,
    });

    // Handle tool use
    let assistantContent = '';
    let currentInquiryData = session.inquiryData;

    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      );

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        const { result, updatedInquiryData } = await executeToolCall(
          toolUse.name,
          toolUse.input as Record<string, unknown>,
          { ...session, inquiryData: currentInquiryData },
          supabase
        );

        if (updatedInquiryData) {
          currentInquiryData = updatedInquiryData;
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: typeof result === 'string' ? result : JSON.stringify(result),
        });
      }

      // Continue conversation with tool results
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: buildSystemPrompt(currentInquiryData),
        tools: ASSISTANT_TOOLS,
        messages: [
          ...claudeMessages,
          { role: 'assistant', content: response.content },
          { role: 'user', content: toolResults },
        ],
      });
    }

    // Extract final text response
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    );
    assistantContent = textBlocks.map(b => b.text).join('\n');

    // Add assistant message to history
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date(),
    };
    messages.push(assistantMessage);

    // Update session
    await supabase
      .from('chat_sessions')
      .update({
        messages,
        inquiry_data: currentInquiryData,
        last_activity_at: new Date(),
      })
      .eq('id', session.id);

    return NextResponse.json({
      message: assistantContent,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Chat message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 6: Create database migration for chat_sessions

Create file: `supabase/migrations/20260119000000_chat_sessions.sql`

```sql
-- Chat sessions table for assistant conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'unknown',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'closed')),
  mode TEXT NOT NULL DEFAULT 'text' CHECK (mode IN ('text', 'voice')),
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  inquiry_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ticket_id UUID REFERENCES tickets(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for finding active sessions
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_sessions_source ON chat_sessions(source);
CREATE INDEX idx_chat_sessions_last_activity ON chat_sessions(last_activity_at);

-- RLS policies
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Allow insert from API (service role)
CREATE POLICY "Allow service role full access to chat_sessions"
  ON chat_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Step 7: Run migration

```bash
cd /Users/tywells/Downloads/projects/mgosupport
npx supabase db push
```

### Step 8: Install Anthropic SDK if not present

```bash
cd /Users/tywells/Downloads/projects/mgosupport
npm install @anthropic-ai/sdk
```

### Step 9: Commit MGO Support changes

```bash
cd /Users/tywells/Downloads/projects/mgosupport
git add src/features/assistant/ src/app/api/chat/ supabase/migrations/
git commit -m "feat: add chat session API with Claude assistant integration"
```

---

## Task 4: Connect Widget to Backend

**Project:** Back to mgobahamas.com worktree

**Files:**
- Modify: `src/components/ChatWidget/ChatPanel.tsx`
- Create: `src/components/ChatWidget/hooks/useChatSession.ts`

### Step 1: Create useChatSession hook

```typescript
// src/components/ChatWidget/hooks/useChatSession.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Message } from '../types';

const SESSION_KEY = 'mgo-chat-session-id';

export function useChatSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load session ID from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setSessionId(stored);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    // Optimistically add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          sessionId: sessionId || 'new',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Save session ID if new
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(SESSION_KEY, data.sessionId);
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');

      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearSession = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return {
    sessionId,
    messages,
    isLoading,
    error,
    sendMessage,
    clearSession,
  };
}
```

### Step 2: Update ChatPanel to use hook

Replace the ChatPanel.tsx content with:

```typescript
// src/components/ChatWidget/ChatPanel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatSession } from './hooks/useChatSession';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export function ChatPanel({ isOpen, onClose, onMinimize }: ChatPanelProps) {
  const { messages, isLoading, sendMessage } = useChatSession();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
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
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Commit

```bash
git add src/components/ChatWidget/
git commit -m "feat: connect ChatWidget to MGO Support backend with session persistence"
```

---

## Task 5: Update Chat API Proxy

**Files:**
- Modify: `src/app/api/chat/route.ts`

### Step 1: Update to handle session creation

```typescript
// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MGO_SUPPORT_URL = process.env.MGO_SUPPORT_URL || 'https://mgosupport.vercel.app';
const MGO_SUPPORT_API_KEY = process.env.MGO_SUPPORT_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const endpoint = `${MGO_SUPPORT_URL}/api/chat/sessions/${sessionId || 'new'}/messages`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MGO_SUPPORT_API_KEY || '',
        'x-source': 'mgobahamas.com',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MGO Support error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to get response from assistant' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 2: Commit

```bash
git add src/app/api/chat/route.ts
git commit -m "fix: update chat API proxy to handle session routing"
```

---

## Task 6: Deploy and Test

### Step 1: Deploy MGO Support

```bash
cd /Users/tywells/Downloads/projects/mgosupport
vercel --prod
```

### Step 2: Deploy mgobahamas.com (from worktree)

```bash
cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant
vercel --prod
```

### Step 3: Test end-to-end

1. Visit https://mgobahamascom.vercel.app
2. Click the green chat button (bottom-right)
3. Send a message: "Hi, I want to accept payments"
4. Verify assistant responds with relevant information
5. Test quick action buttons
6. Test form collection flow by saying "I'd like to apply"

### Step 4: Commit any fixes

```bash
git add -A
git commit -m "fix: deployment fixes for Phase 1"
```

---

## Phase 1 Complete Checklist

- [ ] ChatWidget renders with floating button
- [ ] Panel opens/closes/minimizes correctly
- [ ] Messages display correctly (user right, assistant left)
- [ ] Session persists across page refreshes
- [ ] Quick action buttons work
- [ ] Assistant answers product questions
- [ ] Assistant collects inquiry information
- [ ] Inquiry submission works
- [ ] Human handoff creates ticket

---

## Next: Phase 2 (Voice Integration)

After Phase 1 is verified working, proceed to Phase 2 plan for:
- WebSocket streaming endpoint
- Deepgram STT integration
- ElevenLabs TTS integration
- Voice mode in ChatWidget
