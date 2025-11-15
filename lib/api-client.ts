/**
 * Cliente para las APIs de Gemini
 * Helper para hacer llamadas a las rutas API desde el cliente
 */

'use client';

export interface GenerateRequest {
  prompt: string;
  contractType: string;
  complexity?: string;
  features?: string[];
  language?: string;
}

export interface ExplainRequest {
  code: string;
  focus?: 'general' | 'security' | 'optimization' | 'deployment';
}

export interface DebugRequest {
  errorMessage: string;
  code?: string;
  context?: string;
}

export interface ChatRequest {
  message: string;
  history?: Array<{ role: 'user' | 'model'; parts: string }>;
}

export interface MarketplaceSearchRequest {
  searchQuery: string;
  availableTemplates?: Array<{ title: string; description: string; category: string; tags: string[] }>;
}

export interface DocsSearchRequest {
  searchQuery: string;
  docSections?: Array<{ title: string; description: string }>;
}

/**
 * Genera un contrato usando la API de Gemini
 */
export async function* generateContract(
  request: GenerateRequest
): AsyncGenerator<string, void, unknown> {
  console.log('[API Client] Iniciando request a /api/generate', request);
  
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  console.log('[API Client] Response status:', response.status, response.statusText);

  if (!response.ok) {
    let errorMessage = 'Error generando contrato';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
      console.error('[API Client] Error response:', error);
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      console.error('[API Client] Error parsing error response:', e);
    }
    throw new Error(errorMessage);
  }

  if (!response.body) {
    console.error('[API Client] Response body es null');
    throw new Error('No se pudo leer la respuesta del servidor');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No se pudo crear el reader de la respuesta');
  }

  let buffer = '';
  let hasReceivedData = false;
  let errorReceived = false;
  let errorMessage = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('[API Client] Stream terminado. Datos recibidos:', hasReceivedData, 'Error recibido:', errorReceived);
        
        // Si se recibió un error, lanzarlo
        if (errorReceived && errorMessage) {
          throw new Error(errorMessage);
        }
        
        // Si no se recibió ningún dato, lanzar error
        if (!hasReceivedData) {
          throw new Error(
            'No se recibió ningún dato del servidor. ' +
            'Esto puede deberse a: 1) GEMINI_API_KEY no configurada o inválida, ' +
            '2) Problema de conexión con Gemini API, ' +
            '3) El modelo no generó contenido. ' +
            'Verifica los logs del servidor para más detalles.'
          );
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Mantener la última línea incompleta en el buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          
          if (data === '[DONE]') {
            console.log('[API Client] Stream completado con [DONE]');
            
            // Verificar si hubo error antes de terminar
            if (errorReceived && errorMessage) {
              throw new Error(errorMessage);
            }
            
            // Verificar si se recibieron datos
            if (!hasReceivedData) {
              throw new Error(
                'El stream se completó pero no se recibió ningún contenido. ' +
                'Esto puede deberse a: 1) GEMINI_API_KEY inválida, ' +
                '2) Problema con la API de Gemini, ' +
                '3) El prompt fue filtrado por seguridad.'
              );
            }
            
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            
            // Verificar si hay error en la respuesta
            if (parsed.error) {
              errorReceived = true;
              errorMessage = parsed.error;
              console.error('[API Client] Error en stream:', parsed.error);
              
              // Si hay detalles adicionales, incluirlos
              if (parsed.details) {
                errorMessage += ` (${parsed.details})`;
              }
              
              // Lanzar el error inmediatamente
              throw new Error(errorMessage);
            }
            
            if (parsed.content) {
              hasReceivedData = true;
              yield parsed.content;
            }
          } catch (e) {
            if (e instanceof Error) {
              // Si es un error que ya procesamos (error del servidor), relanzarlo
              if (e.message && (e.message.includes('error') || e.message.includes('Error'))) {
                console.error('[API Client] Error crítico:', e.message);
                throw e;
              }
              // Ignorar errores de parsing menores
              console.warn('[API Client] Error de parsing menor:', e.message);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[API Client] Error en stream:', error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

/**
 * Explica código usando la API de Gemini
 */
export async function* explainCode(
  request: ExplainRequest
): AsyncGenerator<string, void, unknown> {
  console.log('[API Client Explain] Iniciando request a /api/explain', request);

  const response = await fetch('/api/explain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  console.log('[API Client Explain] Response status:', response.status, response.statusText);

  if (!response.ok) {
    let errorMessage = 'Error explicando código';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
      console.error('[API Client Explain] Error response:', error);
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      console.error('[API Client Explain] Error parsing error response:', e);
    }
    throw new Error(errorMessage);
  }

  if (!response.body) {
    console.error('[API Client Explain] Response body es null');
    throw new Error('No se pudo leer la respuesta del servidor');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No se pudo crear el reader de la respuesta');
  }

  let buffer = '';
  let hasReceivedData = false;
  let chunkCount = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('[API Client Explain] Stream terminado. Datos recibidos:', hasReceivedData);
        if (!hasReceivedData) {
          throw new Error('No se recibió ningún dato del servidor. Verifica que GEMINI_API_KEY esté configurada.');
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // Mantener la última línea incompleta en el buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;

        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            console.log('[API Client Explain] Stream completado con [DONE]');
            return;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              console.error('[API Client Explain] Error en stream:', parsed.error);
              throw new Error(parsed.error);
            }

            if (parsed.content) {
              hasReceivedData = true;
              chunkCount++;
              console.log(`[API Client Explain] Chunk ${chunkCount} recibido (${parsed.content.length} chars)`);
              yield parsed.content;
            }
          } catch (e) {
            if (e instanceof Error) {
              if (e.message.includes('error') || e.message.includes('Error')) {
                console.error('[API Client Explain] Error crítico:', e.message);
                throw e;
              }
              console.warn('[API Client Explain] Error de parsing menor:', e.message);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[API Client Explain] Error en stream:', error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

/**
 * Debug errores usando la API de Gemini
 */
export async function* debugError(
  request: DebugRequest
): AsyncGenerator<string, void, unknown> {
  const response = await fetch('/api/debug', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error debuggeando');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No se pudo leer la respuesta');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.content) {
            yield parsed.content;
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes('error')) {
            throw e;
          }
          // Ignorar errores de parsing menores
        }
      }
    }
  }
}

/**
 * Chat usando la API de Gemini
 */
export async function* chat(
  request: ChatRequest
): AsyncGenerator<string, void, unknown> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en chat');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No se pudo leer la respuesta');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.content) {
            yield parsed.content;
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes('error')) {
            throw e;
          }
          // Ignorar errores de parsing menores
        }
      }
    }
  }
}

/**
 * Búsqueda inteligente en marketplace usando la API de Gemini
 */
export async function* marketplaceSearch(
  request: MarketplaceSearchRequest
): AsyncGenerator<string, void, unknown> {
  console.log('[API Client Marketplace Search] Iniciando request', request);

  const response = await fetch('/api/marketplace-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  console.log('[API Client Marketplace Search] Response status:', response.status);

  if (!response.ok) {
    let errorMessage = 'Error en búsqueda inteligente';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
      console.error('[API Client Marketplace Search] Error response:', error);
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      console.error('[API Client Marketplace Search] Error parsing error response:', e);
    }
    throw new Error(errorMessage);
  }

  if (!response.body) {
    console.error('[API Client Marketplace Search] Response body es null');
    throw new Error('No se pudo leer la respuesta del servidor');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No se pudo crear el reader de la respuesta');
  }

  let buffer = '';
  let hasReceivedData = false;
  let chunkCount = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('[API Client Marketplace Search] Stream terminado. Datos recibidos:', hasReceivedData);
        if (!hasReceivedData) {
          throw new Error('No se recibió ningún dato del servidor.');
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;

        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            console.log('[API Client Marketplace Search] Stream completado con [DONE]');
            return;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              console.error('[API Client Marketplace Search] Error en stream:', parsed.error);
              throw new Error(parsed.error);
            }

            if (parsed.content) {
              hasReceivedData = true;
              chunkCount++;
              console.log(`[API Client Marketplace Search] Chunk ${chunkCount} recibido (${parsed.content.length} chars)`);
              yield parsed.content;
            }
          } catch (e) {
            if (e instanceof Error) {
              if (e.message.includes('error') || e.message.includes('Error')) {
                console.error('[API Client Marketplace Search] Error crítico:', e.message);
                throw e;
              }
              console.warn('[API Client Marketplace Search] Error de parsing menor:', e.message);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[API Client Marketplace Search] Error en stream:', error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

/**
 * Búsqueda inteligente en documentación usando la API de Gemini
 */
export async function* docsSearch(
  request: DocsSearchRequest
): AsyncGenerator<string, void, unknown> {
  console.log('[API Client Docs Search] Iniciando request', request);

  const response = await fetch('/api/docs-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  console.log('[API Client Docs Search] Response status:', response.status);

  if (!response.ok) {
    let errorMessage = 'Error en búsqueda inteligente';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
      console.error('[API Client Docs Search] Error response:', error);
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      console.error('[API Client Docs Search] Error parsing error response:', e);
    }
    throw new Error(errorMessage);
  }

  if (!response.body) {
    console.error('[API Client Docs Search] Response body es null');
    throw new Error('No se pudo leer la respuesta del servidor');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No se pudo crear el reader de la respuesta');
  }

  let buffer = '';
  let hasReceivedData = false;
  let chunkCount = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('[API Client Docs Search] Stream terminado. Datos recibidos:', hasReceivedData);
        if (!hasReceivedData) {
          throw new Error('No se recibió ningún dato del servidor.');
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;

        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            console.log('[API Client Docs Search] Stream completado con [DONE]');
            return;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              console.error('[API Client Docs Search] Error en stream:', parsed.error);
              throw new Error(parsed.error);
            }

            if (parsed.content) {
              hasReceivedData = true;
              chunkCount++;
              console.log(`[API Client Docs Search] Chunk ${chunkCount} recibido (${parsed.content.length} chars)`);
              yield parsed.content;
            }
          } catch (e) {
            if (e instanceof Error) {
              if (e.message.includes('error') || e.message.includes('Error')) {
                console.error('[API Client Docs Search] Error crítico:', e.message);
                throw e;
              }
              console.warn('[API Client Docs Search] Error de parsing menor:', e.message);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[API Client Docs Search] Error en stream:', error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}
