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
