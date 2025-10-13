import { NextRequest } from 'next/server';
import { explainCodeStream } from '@/lib/ai/streaming';

export async function POST(req: NextRequest) {
  try {
    const { code, language = 'rust', focus = 'general' } = await req.json();
    
    if (!code) {
      return new Response('Missing code field', { status: 400 });
    }

    const stream = explainCodeStream(code, focus);
    
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
    console.error('Explanation error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
