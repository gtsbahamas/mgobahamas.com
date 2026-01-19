# Voice Assistant Design: MGO Bahamas

*Created: 2026-01-19*
*Status: Approved*

## Overview

Add a conversational voice and text assistant to mgobahamas.com that helps visitors with product questions, guides them through merchant applications, checks application status, and connects to human support when needed.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Interaction type | Text chat + voice option | Accessibility for all users |
| Capabilities | Full support | Questions, forms, status, handoff |
| Voice technology | Deepgram + ElevenLabs | Proven stack from Fire OS |
| Backend location | MGO Support | Reuse existing infrastructure |
| Knowledge source | MGO Support KB | Easy to maintain |
| UI pattern | Floating button + slide-out | Industry standard, non-intrusive |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      mgobahamas.com                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ChatWidget Component (React)                            │    │
│  │  - Floating button (bottom-right)                        │    │
│  │  - Slide-out panel with chat UI                         │    │
│  │  - Voice mode with real-time streaming                  │    │
│  │  - Text input fallback                                   │    │
│  └──────────────────────┬──────────────────────────────────┘    │
└─────────────────────────┼───────────────────────────────────────┘
                          │ WebSocket / REST
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MGO Support                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ /api/chat   │  │ /api/voice  │  │ /api/kb                 │  │
│  │ - Messages  │  │ - STT/TTS   │  │ - Product knowledge     │  │
│  │ - Sessions  │  │ - Deepgram  │  │ - Service info          │  │
│  │ - History   │  │ - ElevenLabs│  │ - FAQ                   │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                      │                │
│         ▼                ▼                      ▼                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Claude API (Anthropic)                       │   │
│  │  - System prompt with MGO context                        │   │
│  │  - Tools: search_kb, create_inquiry, check_status,       │   │
│  │           transfer_to_human                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Tickets     │  │ Signals     │  │ Proposals               │  │
│  │ (HelpPilot) │  │ (Agents)    │  │ (Approval Queue)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Voice Flow (Real-time Conversational)

```
┌──────────────────────────────────────────────────────────────┐
│                    User clicks "Voice Mode"                   │
└──────────────────────────┬───────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  WebSocket connection opens to MGO Support /api/voice/stream │
└──────────────────────────┬───────────────────────────────────┘
                           ▼
     ┌─────────────────────────────────────────────┐
     │         CONTINUOUS LISTENING LOOP           │
     │                                             │
     │  Browser Mic → Audio Stream → WebSocket     │
     │                     ↓                       │
     │  MGO Support: Deepgram (streaming STT)      │
     │                     ↓                       │
     │  VAD detects end of speech                  │
     │                     ↓                       │
     │  Transcript → Claude → Response             │
     │                     ↓                       │
     │  ElevenLabs (streaming TTS) → WebSocket     │
     │                     ↓                       │
     │  Browser plays audio (can be interrupted)   │
     │                     ↓                       │
     │  Loop continues until user exits voice mode │
     └─────────────────────────────────────────────┘
```

**Key behaviors:**

| Feature | Behavior |
|---------|----------|
| Auto-listen | Always listening when voice mode active (VAD-based) |
| Barge-in | User can interrupt assistant mid-sentence |
| Streaming responses | TTS starts before full response is generated |
| Visual feedback | Waveform shows who's speaking (user vs assistant) |
| Fallback | If voice fails, gracefully drops to text mode |

**Turn-taking (VAD):**
- Deepgram's endpointing detects 800ms silence = end of utterance
- Assistant waits for full thought before responding
- If user starts speaking during assistant response → interrupt and listen

---

## Chat Widget Component

**Location:** `src/components/ChatWidget.tsx` in mgobahamas.com

**States:**
```
closed → open → [typing | recording | waiting | connected_to_human]
```

**UI Elements:**

| Element | Behavior |
|---------|----------|
| Floating Button | Bottom-right, MGO green (#7cb342), pulse animation when has unread |
| Panel | 400px wide, slides from right, glass-card styling to match site |
| Header | "MGO Assistant" + minimize/close buttons + status indicator |
| Messages | Scrollable area, user messages right, assistant left |
| Input Area | Text field + send button + microphone button |
| Voice Mode | Toggle to enable continuous voice conversation |

**Session Persistence:**
- Session ID stored in localStorage
- Reconnects to existing conversation on return visit
- Sessions expire after 24 hours of inactivity

---

## MGO Support Backend APIs

**New endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat/sessions` | POST | Create new chat session |
| `/api/chat/sessions/[id]` | GET | Get session + message history |
| `/api/chat/sessions/[id]/messages` | POST | Send message, get AI response |
| `/api/voice/stream` | WebSocket | Real-time voice conversation |
| `/api/voice/transcribe` | POST | One-off STT (fallback) |
| `/api/voice/speak` | POST | One-off TTS (fallback) |

---

## Claude Tools

```typescript
const TOOLS = [
  {
    name: "search_knowledge_base",
    description: "Search MGO product info, services, pricing, islands served",
    parameters: { query: string }
  },
  {
    name: "start_merchant_inquiry",
    description: "Begin collecting merchant application info",
    parameters: { field?: string }
  },
  {
    name: "save_inquiry_field",
    description: "Save a piece of info the user provided",
    parameters: {
      field: "firstName" | "lastName" | "email" | "phone" | "businessName" | "businessType" | "island" | "message",
      value: string
    }
  },
  {
    name: "submit_inquiry",
    description: "Submit completed merchant application",
    parameters: {}
  },
  {
    name: "check_application_status",
    description: "Look up status of existing application",
    parameters: { email: string } | { phone: string }
  },
  {
    name: "transfer_to_human",
    description: "Connect user to human support agent",
    parameters: { reason: string, priority: "normal" | "high" | "urgent" }
  }
]
```

---

## Session Data Structure

```typescript
interface ChatSession {
  id: string;
  source: "mgobahamas.com";
  status: "active" | "transferred" | "closed";
  mode: "text" | "voice";
  inquiryData: Partial<MerchantInquiry>;
  messages: Message[];
  createdAt: Date;
  lastActivityAt: Date;
  ticketId?: string;
}
```

---

## Agent Persona

```
Name: "Mia" (MGO Intelligent Assistant)
Personality: Friendly, professional, knowledgeable about Bahamas business
Voice: Warm, clear, moderate pace (ElevenLabs voice TBD)
```

**System prompt structure:**
```markdown
You are Mia, the voice and chat assistant for Mobile GO Bahamas (MGO).

## About MGO
[Pulled from knowledge base: services, islands, pricing, process]

## Your capabilities
- Answer questions about MGO merchant services
- Help users complete a merchant application conversationally
- Check status of existing applications
- Connect users to human support when needed

## Conversation guidelines
- Be warm and conversational, not robotic
- For voice: keep responses concise (1-2 sentences when possible)
- For text: can be slightly more detailed
- Always confirm before submitting applications
- If unsure, offer to connect to human support

## Form collection flow
When user wants to apply, collect naturally through conversation:
1. Business name and type
2. Island location
3. Contact info (name, email, phone)
4. Any questions or special needs

Don't ask all at once - have a conversation.

## Current session state
[Injected: what fields are already collected, conversation summary]
```

---

## Example Conversation

```
User: "Hi, I want to accept mobile payments at my restaurant"

Mia: "Welcome! I'd love to help you get set up with Mobile GO.
      Which island is your restaurant located on?"

User: "Nassau"

Mia: "Great, we have strong coverage in Nassau. What's the
      name of your restaurant?"

User: "Island Grill"

Mia: "Island Grill - love it! And is this primarily a
      sit-down restaurant, or do you do takeout and delivery too?"

[continues naturally until all info collected]

Mia: "Perfect! I have everything I need. Just to confirm:
      Island Grill in Nassau, restaurant business.
      Contact: [name] at [email], [phone].
      Should I submit your application?"
```

---

## Implementation Phases

### Phase 1: Text Chat Foundation
- ChatWidget component in mgobahamas.com (floating button + panel)
- Chat session API in MGO Support
- Claude integration with tools
- Knowledge base populated with MGO content
- Form data collection via conversation

### Phase 2: Voice Integration
- WebSocket streaming endpoint
- Deepgram STT integration (streaming)
- ElevenLabs TTS integration (streaming)
- VAD-based turn-taking
- Voice mode toggle in widget

### Phase 3: Full Support Features
- Application status lookup
- Human handoff (creates ticket, notifies team)
- Session persistence and history
- Analytics (conversations, conversions, handoffs)

---

## File Structure

```
mgobahamas.com/
├── src/components/
│   ├── ChatWidget/
│   │   ├── ChatWidget.tsx       # Main component
│   │   ├── ChatButton.tsx       # Floating trigger
│   │   ├── ChatPanel.tsx        # Slide-out container
│   │   ├── MessageList.tsx      # Message display
│   │   ├── InputArea.tsx        # Text + voice input
│   │   ├── VoiceVisualizer.tsx  # Waveform display
│   │   └── hooks/
│   │       ├── useChatSession.ts
│   │       └── useVoiceStream.ts

mgosupport/
├── src/app/api/
│   ├── chat/
│   │   ├── sessions/
│   │   │   ├── route.ts              # POST: create session
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET: session + history
│   │   │       └── messages/route.ts # POST: send message
│   └── voice/
│       ├── stream/route.ts           # WebSocket handler
│       ├── transcribe/route.ts       # Fallback STT
│       └── speak/route.ts            # Fallback TTS
├── src/features/
│   └── assistant/
│       ├── types.ts
│       ├── tools.ts                  # Tool definitions
│       ├── prompt.ts                 # System prompt builder
│       └── services/
│           ├── deepgram.ts
│           └── elevenlabs.ts
```

---

## Dependencies

**MGO Support (new):**
- `@deepgram/sdk` - Streaming STT
- `elevenlabs` - Streaming TTS
- `ws` - WebSocket handling

**mgobahamas.com:**
- No new dependencies (uses native Web APIs)

---

## Environment Variables

**MGO Support:**
```bash
DEEPGRAM_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
ASSISTANT_MODEL=claude-sonnet-4-20250514
ASSISTANT_MAX_TOKENS=1024
```

**mgobahamas.com:**
```bash
MGO_SUPPORT_URL=https://mgosupport.vercel.app
MGO_SUPPORT_WS_URL=wss://mgosupport.vercel.app
```

---

## Cost Estimate

| Service | Rate | Avg/conversation | Cost |
|---------|------|------------------|------|
| Deepgram | $0.0043/min | 3 min | $0.013 |
| ElevenLabs | $0.30/1K chars | 500 chars | $0.15 |
| Claude Sonnet | $3/$15 per 1M tokens | ~2K tokens | $0.03 |
| **Total** | | | **~$0.20/conversation** |

---

## Next Steps

1. Set up implementation workspace with git worktree
2. Create detailed implementation plan
3. Begin Phase 1: Text Chat Foundation
