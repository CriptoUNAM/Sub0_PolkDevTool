import { NextRequest } from 'next/server';
import { debugErrorStream } from '@/lib/ai/streaming';

export async function POST(req: NextRequest) {
  try {
    const { errorMessage, code, context } = await req.json();
    
    if (!errorMessage) {
      return new Response('Missing errorMessage field', { status: 400 });
    }

    const stream = debugErrorStream(errorMessage, code, context);
    
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              controller.enqueue(new TextEncoder().encode(chunk));
            }
            controller.close();
          } catch (error) {
            console.error('Stream error:', error);
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );
  } catch (error) {
    console.error('Debug error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
