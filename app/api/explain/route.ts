import { NextRequest } from 'next/server';
import { explainCodeStream } from '@/lib/ai/gemini';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, focus } = body;

    // Validación
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'El código es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar API key
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY no configurada' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[API Explain] Iniciando explicación:', {
      codeLength: code.length,
      focus: focus || 'general'
    });

    // Crear stream de respuesta
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let hasData = false;
          let chunkCount = 0;
          
          console.log('[API Explain] Iniciando stream de Gemini...');
          for await (const chunk of explainCodeStream(
            code,
            focus || 'general'
          )) {
            hasData = true;
            chunkCount++;
            const chunkStr = chunk.substring(0, 50) + (chunk.length > 50 ? '...' : '');
            console.log(`[API Explain] Chunk ${chunkCount} recibido (${chunk.length} chars): ${chunkStr}`);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
          }
          
          console.log(`[API Explain] Stream completado. Total chunks: ${chunkCount}, HasData: ${hasData}`);
          
          if (!hasData) {
            console.error('[API Explain] No se recibió ningún chunk de Gemini');
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'No se recibió respuesta de la API de Gemini. Verifica que GEMINI_API_KEY esté configurada correctamente.' })}\n\n`));
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[API Explain] Error en stream:', error);
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          console.error('[API Explain] Stack trace:', error instanceof Error ? error.stack : 'N/A');
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
    console.error('Error en /api/explain:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

