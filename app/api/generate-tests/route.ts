import { NextRequest } from 'next/server';
import { generateTestsStream } from '@/lib/ai/gemini-helpers';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractCode, contractType } = body;

    if (!contractCode || typeof contractCode !== 'string' || contractCode.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'El código del contrato es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY no configurada' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let hasData = false;
          for await (const chunk of generateTestsStream(contractCode, contractType || 'ink')) {
            hasData = true;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
          }
          
          if (!hasData) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'No se recibió respuesta de la API de Gemini' })}\n\n`));
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[API Generate Tests] Error en stream:', error);
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error en /api/generate-tests:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

