# Voice Assistant Phase 2: Voice Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add real-time voice conversation capability to the existing text chat widget using Deepgram for STT and ElevenLabs for TTS.

**Architecture:** WebSocket streaming from browser → MGO Support backend → Deepgram for transcription → Claude for response → ElevenLabs for speech synthesis → stream audio back to browser.

**Tech Stack:** Deepgram SDK (streaming STT), ElevenLabs API (streaming TTS), WebSocket (ws library), Web Audio API (browser), React hooks for state management.

---

## Task 1: Add Voice Dependencies to MGO Support

**Files:**
- Modify: `/Users/tywells/Downloads/projects/mgosupport/package.json`

**Step 1: Install voice dependencies**

Run: `cd /Users/tywells/Downloads/projects/mgosupport && npm install @deepgram/sdk elevenlabs ws`
Expected: Dependencies added to package.json

**Step 2: Verify installation**

Run: `cd /Users/tywells/Downloads/projects/mgosupport && npm ls @deepgram/sdk elevenlabs ws`
Expected: Shows installed versions

**Step 3: Commit**

```bash
cd /Users/tywells/Downloads/projects/mgosupport
git add package.json package-lock.json
git commit -m "feat: add voice dependencies (Deepgram, ElevenLabs, ws)"
```

---

## Task 2: Create Deepgram Service

**Files:**
- Create: `/Users/tywells/Downloads/projects/mgosupport/src/features/assistant/services/deepgram.ts`
- Create: `/Users/tywells/Downloads/projects/mgosupport/src/features/assistant/services/deepgram.test.ts`

**Step 1: Write the failing test**

```typescript
// src/features/assistant/services/deepgram.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeepgramService } from './deepgram';

describe('DeepgramService', () => {
  beforeEach(() => {
    vi.stubEnv('DEEPGRAM_API_KEY', 'test-key');
  });

  it('should create a live transcription connection', async () => {
    const service = new DeepgramService();
    expect(service).toBeDefined();
    expect(typeof service.createLiveConnection).toBe('function');
  });

  it('should throw if API key is missing', () => {
    vi.stubEnv('DEEPGRAM_API_KEY', '');
    expect(() => new DeepgramService()).toThrow('DEEPGRAM_API_KEY is required');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/tywells/Downloads/projects/mgosupport && npm test -- --run src/features/assistant/services/deepgram.test.ts`
Expected: FAIL with "Cannot find module './deepgram'"

**Step 3: Write minimal implementation**

```typescript
// src/features/assistant/services/deepgram.ts
import { createClient, LiveTranscriptionEvents, ListenLiveClient } from '@deepgram/sdk';

export interface TranscriptCallback {
  (transcript: string, isFinal: boolean): void;
}

export class DeepgramService {
  private client: ReturnType<typeof createClient>;
  private connection: ListenLiveClient | null = null;

  constructor() {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPGRAM_API_KEY is required');
    }
    this.client = createClient(apiKey);
  }

  async createLiveConnection(onTranscript: TranscriptCallback): Promise<ListenLiveClient> {
    const connection = this.client.listen.live({
      model: 'nova-2',
      language: 'en',
      smart_format: true,
      encoding: 'linear16',
      sample_rate: 16000,
      channels: 1,
      endpointing: 800, // 800ms silence = end of utterance
      interim_results: true,
      utterance_end_ms: 1000,
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      if (transcript) {
        const isFinal = data.is_final ?? false;
        onTranscript(transcript, isFinal);
      }
    });

    connection.on(LiveTranscriptionEvents.Error, (err) => {
      console.error('Deepgram error:', err);
    });

    this.connection = connection;
    return connection;
  }

  sendAudio(audioData: Buffer): void {
    if (this.connection) {
      this.connection.send(audioData);
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.finish();
      this.connection = null;
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/tywells/Downloads/projects/mgosupport && npm test -- --run src/features/assistant/services/deepgram.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /Users/tywells/Downloads/projects/mgosupport
git add src/features/assistant/services/deepgram.ts src/features/assistant/services/deepgram.test.ts
git commit -m "feat: add Deepgram streaming STT service"
```

---

## Task 3: Create ElevenLabs Service

**Files:**
- Create: `/Users/tywells/Downloads/projects/mgosupport/src/features/assistant/services/elevenlabs.ts`
- Create: `/Users/tywells/Downloads/projects/mgosupport/src/features/assistant/services/elevenlabs.test.ts`

**Step 1: Write the failing test**

```typescript
// src/features/assistant/services/elevenlabs.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ElevenLabsService } from './elevenlabs';

describe('ElevenLabsService', () => {
  beforeEach(() => {
    vi.stubEnv('ELEVENLABS_API_KEY', 'test-key');
    vi.stubEnv('ELEVENLABS_VOICE_ID', 'test-voice');
  });

  it('should create service with required config', () => {
    const service = new ElevenLabsService();
    expect(service).toBeDefined();
    expect(typeof service.textToSpeechStream).toBe('function');
  });

  it('should throw if API key is missing', () => {
    vi.stubEnv('ELEVENLABS_API_KEY', '');
    expect(() => new ElevenLabsService()).toThrow('ELEVENLABS_API_KEY is required');
  });

  it('should throw if voice ID is missing', () => {
    vi.stubEnv('ELEVENLABS_VOICE_ID', '');
    expect(() => new ElevenLabsService()).toThrow('ELEVENLABS_VOICE_ID is required');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/tywells/Downloads/projects/mgosupport && npm test -- --run src/features/assistant/services/elevenlabs.test.ts`
Expected: FAIL with "Cannot find module './elevenlabs'"

**Step 3: Write minimal implementation**

```typescript
// src/features/assistant/services/elevenlabs.ts
import { ElevenLabsClient } from 'elevenlabs';

export interface AudioChunkCallback {
  (chunk: Buffer): void;
}

export class ElevenLabsService {
  private client: ElevenLabsClient;
  private voiceId: string;

  constructor() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is required');
    }
    if (!voiceId) {
      throw new Error('ELEVENLABS_VOICE_ID is required');
    }

    this.client = new ElevenLabsClient({ apiKey });
    this.voiceId = voiceId;
  }

  async textToSpeechStream(
    text: string,
    onChunk: AudioChunkCallback
  ): Promise<void> {
    const audioStream = await this.client.textToSpeech.convertAsStream(
      this.voiceId,
      {
        text,
        model_id: 'eleven_turbo_v2_5',
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }
    );

    for await (const chunk of audioStream) {
      onChunk(Buffer.from(chunk));
    }
  }

  async textToSpeechBuffer(text: string): Promise<Buffer> {
    const chunks: Buffer[] = [];
    await this.textToSpeechStream(text, (chunk) => {
      chunks.push(chunk);
    });
    return Buffer.concat(chunks);
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/tywells/Downloads/projects/mgosupport && npm test -- --run src/features/assistant/services/elevenlabs.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /Users/tywells/Downloads/projects/mgosupport
git add src/features/assistant/services/elevenlabs.ts src/features/assistant/services/elevenlabs.test.ts
git commit -m "feat: add ElevenLabs streaming TTS service"
```

---

## Task 4: Create Voice WebSocket Stream Endpoint

**Files:**
- Create: `/Users/tywells/Downloads/projects/mgosupport/src/app/api/voice/stream/route.ts`

**Step 1: Create WebSocket handler for voice streaming**

Note: Next.js App Router doesn't natively support WebSocket. We'll use a workaround with Server-Sent Events for the response stream, and regular POST for audio upload. For true WebSocket, we'd need a separate server.

```typescript
// src/app/api/voice/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DeepgramService } from '@/features/assistant/services/deepgram';
import { ElevenLabsService } from '@/features/assistant/services/elevenlabs';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/features/assistant/prompt';
import { TOOLS, handleToolCall } from '@/features/assistant/tools';

const anthropic = new Anthropic();

// POST: Receive audio chunk, return transcription + AI response + audio
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const sessionId = formData.get('sessionId') as string;

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
    }

    // Convert audio to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Transcribe with Deepgram
    const deepgram = new DeepgramService();
    let transcription = '';

    // For non-streaming, use prerecorded API
    const dgClient = (deepgram as any).client;
    const { result } = await dgClient.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: 'nova-2',
        language: 'en',
        smart_format: true,
      }
    );
    transcription = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    if (!transcription) {
      return NextResponse.json({
        transcription: '',
        response: '',
        audio: null
      });
    }

    // Get AI response
    const systemPrompt = buildSystemPrompt({});
    const response = await anthropic.messages.create({
      model: process.env.ASSISTANT_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: parseInt(process.env.ASSISTANT_MAX_TOKENS || '1024'),
      system: systemPrompt,
      tools: TOOLS,
      messages: [{ role: 'user', content: transcription }],
    });

    // Extract text response
    let textResponse = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        textResponse = block.text;
        break;
      }
    }

    // Generate audio response with ElevenLabs
    const elevenlabs = new ElevenLabsService();
    const audioResponse = await elevenlabs.textToSpeechBuffer(textResponse);

    // Return as JSON with base64 audio
    return NextResponse.json({
      transcription,
      response: textResponse,
      audio: audioResponse.toString('base64'),
      audioFormat: 'mp3',
    });

  } catch (error) {
    console.error('Voice stream error:', error);
    return NextResponse.json(
      { error: 'Voice processing failed' },
      { status: 500 }
    );
  }
}
```

**Step 2: Build and verify no errors**

Run: `cd /Users/tywells/Downloads/projects/mgosupport && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /Users/tywells/Downloads/projects/mgosupport
git add src/app/api/voice/stream/route.ts
git commit -m "feat: add voice stream API endpoint"
```

---

## Task 5: Create Voice Hook for Widget

**Files:**
- Create: `/Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant/src/components/ChatWidget/hooks/useVoiceStream.ts`

**Step 1: Create voice streaming hook**

```typescript
// src/components/ChatWidget/hooks/useVoiceStream.ts
'use client';

import { useState, useRef, useCallback } from 'react';

interface VoiceStreamState {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  error: string | null;
}

interface UseVoiceStreamOptions {
  onTranscription?: (text: string) => void;
  onResponse?: (text: string) => void;
  sessionId?: string;
}

export function useVoiceStream(options: UseVoiceStreamOptions = {}) {
  const { onTranscription, onResponse, sessionId } = options;

  const [state, setState] = useState<VoiceStreamState>({
    isRecording: false,
    isProcessing: false,
    isPlaying: false,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setState(s => ({ ...s, error: null, isRecording: true }));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());

        if (audioChunksRef.current.length === 0) {
          setState(s => ({ ...s, isRecording: false, isProcessing: false }));
          return;
        }

        setState(s => ({ ...s, isProcessing: true }));

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          if (sessionId) {
            formData.append('sessionId', sessionId);
          }

          const response = await fetch('/api/voice/stream', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Voice processing failed');
          }

          const data = await response.json();

          if (data.transcription && onTranscription) {
            onTranscription(data.transcription);
          }

          if (data.response && onResponse) {
            onResponse(data.response);
          }

          // Play audio response
          if (data.audio) {
            await playAudioResponse(data.audio);
          }

        } catch (err) {
          setState(s => ({ ...s, error: err instanceof Error ? err.message : 'Unknown error' }));
        } finally {
          setState(s => ({ ...s, isProcessing: false }));
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms

    } catch (err) {
      setState(s => ({
        ...s,
        isRecording: false,
        error: err instanceof Error ? err.message : 'Failed to access microphone'
      }));
    }
  }, [sessionId, onTranscription, onResponse]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(s => ({ ...s, isRecording: false }));
    }
  }, [state.isRecording]);

  const playAudioResponse = async (base64Audio: string) => {
    setState(s => ({ ...s, isPlaying: true }));

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData.buffer);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      source.onended = () => {
        setState(s => ({ ...s, isPlaying: false }));
      };

      source.start(0);
    } catch (err) {
      console.error('Audio playback error:', err);
      setState(s => ({ ...s, isPlaying: false }));
    }
  };

  const toggleRecording = useCallback(() => {
    if (state.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [state.isRecording, startRecording, stopRecording]);

  return {
    ...state,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
```

**Step 2: Build to verify no TypeScript errors**

Run: `cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant
git add src/components/ChatWidget/hooks/useVoiceStream.ts
git commit -m "feat: add useVoiceStream hook for voice recording"
```

---

## Task 6: Create Voice Proxy API in mgobahamas.com

**Files:**
- Create: `/Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant/src/app/api/voice/stream/route.ts`

**Step 1: Create proxy endpoint**

```typescript
// src/app/api/voice/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MGO_SUPPORT_URL = process.env.MGO_SUPPORT_URL || 'https://mgosupport.vercel.app';
const MGO_SUPPORT_API_KEY = process.env.MGO_SUPPORT_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Forward the request to MGO Support
    const response = await fetch(`${MGO_SUPPORT_URL}/api/voice/stream`, {
      method: 'POST',
      headers: {
        'x-api-key': MGO_SUPPORT_API_KEY || '',
        'x-source': 'mgobahamas.com',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MGO Support voice error:', error);
      return NextResponse.json(
        { error: 'Failed to process voice' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Voice API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Step 2: Build to verify**

Run: `cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant
git add src/app/api/voice/stream/route.ts
git commit -m "feat: add voice stream proxy API"
```

---

## Task 7: Create VoiceVisualizer Component

**Files:**
- Create: `/Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant/src/components/ChatWidget/VoiceVisualizer.tsx`

**Step 1: Create visualizer component**

```typescript
// src/components/ChatWidget/VoiceVisualizer.tsx
'use client';

import { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  mode: 'listening' | 'speaking' | 'processing';
  className?: string;
}

export function VoiceVisualizer({ isActive, mode, className = '' }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const barCount = 5;
      const barWidth = 4;
      const gap = 4;
      const totalWidth = barCount * barWidth + (barCount - 1) * gap;
      const startX = (width - totalWidth) / 2;

      // Color based on mode
      const color = mode === 'listening'
        ? '#7cb342' // Green for listening
        : mode === 'speaking'
        ? '#2196f3' // Blue for speaking
        : '#ff9800'; // Orange for processing

      for (let i = 0; i < barCount; i++) {
        const time = Date.now() / 200;
        const baseHeight = mode === 'processing' ? 8 : 16;
        const amplitude = mode === 'processing' ? 4 : 12;
        const barHeight = baseHeight + Math.sin(time + i * 0.5) * amplitude;

        const x = startX + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={48}
      height={32}
      className={className}
    />
  );
}
```

**Step 2: Build to verify**

Run: `cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant
git add src/components/ChatWidget/VoiceVisualizer.tsx
git commit -m "feat: add VoiceVisualizer component"
```

---

## Task 8: Integrate Voice Mode into ChatPanel

**Files:**
- Modify: `/Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant/src/components/ChatWidget/ChatPanel.tsx`
- Modify: `/Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant/src/components/ChatWidget/types.ts`

**Step 1: Update types to include voice mode**

Add to `types.ts`:
```typescript
export type InputMode = 'text' | 'voice';

export interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
}
```

**Step 2: Update ChatPanel to include voice button and integration**

Replace the input section in `ChatPanel.tsx` with voice-enabled version:

```typescript
// Add imports at top
import { useVoiceStream } from './hooks/useVoiceStream';
import { VoiceVisualizer } from './VoiceVisualizer';
import type { InputMode } from './types';

// Inside ChatPanel component, add:
const [inputMode, setInputMode] = useState<InputMode>('text');

const {
  isRecording,
  isProcessing,
  isPlaying,
  toggleRecording,
  error: voiceError
} = useVoiceStream({
  onTranscription: (text) => {
    // Add user message from voice
    sendMessage(text);
  },
  onResponse: (text) => {
    // Response is already handled by sendMessage
  },
});

const voiceMode = isRecording ? 'listening' : isPlaying ? 'speaking' : 'processing';

// Update the input JSX section
```

**Step 3: Full ChatPanel with voice integration**

The complete updated ChatPanel.tsx with voice mode toggle, microphone button, and visual feedback.

**Step 4: Build and verify**

Run: `cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant && npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant
git add src/components/ChatWidget/ChatPanel.tsx src/components/ChatWidget/types.ts
git commit -m "feat: integrate voice mode into ChatPanel"
```

---

## Task 9: Add Environment Variables

**Files:**
- Document: Environment variables needed for voice integration

**Step 1: MGO Support environment variables**

Add to Vercel project settings for mgosupport:
```
DEEPGRAM_API_KEY=<deepgram-key>
ELEVENLABS_API_KEY=<elevenlabs-key>
ELEVENLABS_VOICE_ID=<voice-id>
```

**Step 2: Verify local .env.local has placeholders**

For mgosupport:
```bash
echo "DEEPGRAM_API_KEY=" >> /Users/tywells/Downloads/projects/mgosupport/.env.local
echo "ELEVENLABS_API_KEY=" >> /Users/tywells/Downloads/projects/mgosupport/.env.local
echo "ELEVENLABS_VOICE_ID=" >> /Users/tywells/Downloads/projects/mgosupport/.env.local
```

**Step 3: Commit documentation**

No code to commit - environment variables are configured in Vercel dashboard.

---

## Task 10: Deploy and Test Voice Integration

**Step 1: Deploy MGO Support with voice endpoints**

```bash
cd /Users/tywells/Downloads/projects/mgosupport
git push origin main
# Vercel auto-deploys
```

**Step 2: Merge voice-assistant branch to main**

```bash
cd /Users/tywells/Downloads/projects/mgobahamas.com/.worktrees/voice-assistant
git checkout main
git merge feature/voice-assistant
git push origin main
```

**Step 3: Test voice functionality**

1. Open https://mgobahamascom.vercel.app
2. Click chat widget
3. Click microphone button
4. Speak a question
5. Verify: transcription appears, AI responds, audio plays back

**Step 4: Document test results**

Note any issues for Phase 3 or hotfixes.

---

## Progress Log

| Date | Session | Work Done | New % |
|------|---------|-----------|-------|
| 2026-01-19 | Initial | Plan created | 0% |

---

## Notes

- ElevenLabs voice selection: Need to choose appropriate voice for "Mia" persona (warm, professional, Bahamian-friendly)
- WebSocket limitation: Next.js App Router doesn't support true WebSocket; using POST-based approach instead
- Audio format: Using WebM for recording (browser native), MP3 for playback (ElevenLabs output)
- VAD: Using Deepgram's endpointing feature (800ms silence threshold) for turn detection
