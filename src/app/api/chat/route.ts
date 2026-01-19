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
