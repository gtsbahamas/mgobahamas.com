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
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopCurrentPlayback = useCallback(() => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
      currentSourceRef.current = null;
    }
    setState(s => ({ ...s, isPlaying: false }));
  }, []);

  const playAudioResponse = useCallback(async (base64Audio: string) => {
    setState(s => ({ ...s, isPlaying: true }));

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      // Resume audio context if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData.buffer.slice(0));

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      currentSourceRef.current = source;

      source.onended = () => {
        currentSourceRef.current = null;
        setState(s => ({ ...s, isPlaying: false }));
      };

      source.start(0);
    } catch (err) {
      console.error('Audio playback error:', err);
      setState(s => ({ ...s, isPlaying: false, error: 'Failed to play audio response' }));
    }
  }, []);

  const processRecording = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      setState(s => ({ ...s, isProcessing: false }));
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
      console.error('Voice processing error:', err);
      setState(s => ({ ...s, error: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setState(s => ({ ...s, isProcessing: false }));
    }
  }, [sessionId, onTranscription, onResponse, playAudioResponse]);

  const startRecording = useCallback(async () => {
    try {
      setState(s => ({ ...s, error: null, isRecording: true }));

      // Stop any current playback when starting to record
      stopCurrentPlayback();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        await processRecording();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms

    } catch (err) {
      console.error('Recording start error:', err);
      setState(s => ({
        ...s,
        isRecording: false,
        error: err instanceof Error ? err.message : 'Failed to access microphone'
      }));
    }
  }, [processRecording, stopCurrentPlayback]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(s => ({ ...s, isRecording: false }));
    }
  }, [state.isRecording]);

  const toggleRecording = useCallback(() => {
    if (state.isRecording) {
      stopRecording();
    } else if (!state.isProcessing && !state.isPlaying) {
      startRecording();
    }
  }, [state.isRecording, state.isProcessing, state.isPlaying, startRecording, stopRecording]);

  const clearError = useCallback(() => {
    setState(s => ({ ...s, error: null }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    toggleRecording,
    stopPlayback: stopCurrentPlayback,
    clearError,
  };
}
