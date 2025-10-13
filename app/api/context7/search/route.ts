import { NextRequest, NextResponse } from 'next/server';
import { CONTEXT7_CONFIG } from '@/lib/context7/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const response = await fetch(
      `${CONTEXT7_CONFIG.baseUrl}/search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Bearer ${CONTEXT7_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Context7 API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Context7 search error:', error);
    return NextResponse.json(
      { error: 'Failed to search libraries', results: [] },
      { status: 500 }
    );
  }
}
