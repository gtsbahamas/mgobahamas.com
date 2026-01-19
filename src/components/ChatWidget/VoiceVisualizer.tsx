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
