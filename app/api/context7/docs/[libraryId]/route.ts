import { NextRequest, NextResponse } from 'next/server';
import { CONTEXT7_CONFIG } from '@/lib/context7/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ libraryId: string }> }
) {
  const { libraryId } = await params;
  
  try {
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'txt';
    const tokens = searchParams.get('tokens') || CONTEXT7_CONFIG.defaultTokens.toString();
    const topic = searchParams.get('topic');

    const urlParams = new URLSearchParams({
      type,
      tokens,
      ...(topic && { topic }),
    });

    const response = await fetch(
      `${CONTEXT7_CONFIG.baseUrl}/${libraryId}?${urlParams}`,
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

    const content = await response.text();
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Context7 docs error:', error);
    
    const fallbackContent = `# Documentación no disponible

No se pudo cargar la documentación para ${libraryId}. Esto puede deberse a problemas de conectividad o configuración de la API.

**Posibles soluciones:**
- Verificar la conexión a internet
- Comprobar la configuración de la API key
- Intentar nuevamente más tarde

**Información de error:**
${error instanceof Error ? error.message : 'Error desconocido'}`;

    return new NextResponse(fallbackContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
