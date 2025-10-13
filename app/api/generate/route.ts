import { NextRequest } from 'next/server';
import { generateContractStream } from '@/lib/ai/streaming';

export async function POST(req: NextRequest) {
  try {
    const { prompt, contractType } = await req.json();
    
    if (!prompt || !contractType) {
      return new Response('Missing required fields', { status: 400 });
    }

    const stream = generateContractStream(prompt, contractType);
    
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
    console.error('Generation error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
