import { NextRequest } from 'next/server';
import { generateContractStream } from '@/lib/ai/gemini';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, contractType, complexity, features, language } = body;

    // Validación
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'El prompt es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!contractType || typeof contractType !== 'string') {
      return new Response(
        JSON.stringify({ error: 'El tipo de contrato es requerido' }),
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

    console.log('[API Generate] Iniciando generación:', { 
      prompt: prompt.substring(0, 50) + '...', 
      contractType, 
      complexity, 
      language 
    });

    // Crear stream de respuesta
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let hasData = false;
          let chunkCount = 0;
          const startTime = Date.now();
          
          console.log('[API Generate] Iniciando stream de Gemini...', {
            promptLength: prompt.length,
            contractType,
            complexity,
            language,
            hasApiKey: !!process.env.GEMINI_API_KEY,
            apiKeyLength: process.env.GEMINI_API_KEY?.length || 0
          });
          
          try {
            for await (const chunk of generateContractStream(
              prompt,
              contractType,
              complexity,
              features,
              language
            )) {
              hasData = true;
              chunkCount++;
              const chunkStr = chunk.substring(0, 50) + (chunk.length > 50 ? '...' : '');
              console.log(`[API Generate] Chunk ${chunkCount} recibido (${chunk.length} chars): ${chunkStr}`);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }
          } catch (streamError: any) {
            console.error('[API Generate] Error en el stream de Gemini:', {
              message: streamError?.message || String(streamError),
              code: streamError?.code,
              status: streamError?.status,
              statusCode: streamError?.statusCode,
              stack: streamError?.stack?.substring(0, 500)
            });
            
            const errorMsg = streamError?.message || 'Error desconocido en la API de Gemini';
            const errorCode = streamError?.code || streamError?.status || streamError?.statusCode;
            
            let userMessage = errorMsg;
            if (errorCode === 401 || errorCode === 403) {
              userMessage = 'Error de autenticación con Gemini API. Verifica que GEMINI_API_KEY sea válida.';
            } else if (errorCode === 429) {
              userMessage = 'Cuota de API excedida. Por favor, intenta más tarde.';
            } else if (errorCode === 400) {
              userMessage = 'Solicitud inválida a Gemini API. Verifica el prompt.';
            }
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: userMessage, details: errorMsg })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            return;
          }
          
          const duration = Date.now() - startTime;
          console.log(`[API Generate] Stream completado. Total chunks: ${chunkCount}, HasData: ${hasData}, Duración: ${duration}ms`);
          
          if (!hasData) {
            console.error('[API Generate] ⚠️ No se recibió ningún chunk de Gemini', {
              duration,
              chunkCount,
              promptLength: prompt.length
            });
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              error: 'No se recibió respuesta de la API de Gemini. Esto puede deberse a: 1) GEMINI_API_KEY no configurada o inválida, 2) Problema de conexión con Gemini API, 3) El modelo no generó contenido. Verifica los logs del servidor para más detalles.' 
            })}\n\n`));
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[API Generate] Error crítico en stream:', error);
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          const errorStack = error instanceof Error ? error.stack : 'N/A';
          console.error('[API Generate] Stack trace completo:', errorStack);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            error: `Error interno: ${errorMessage}`,
            details: 'Revisa los logs del servidor para más información'
          })}\n\n`));
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
    console.error('Error en /api/generate:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

