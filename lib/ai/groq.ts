import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_your_free_groq_key_here',
});

export const GROQ_MODELS = {
  fast: 'llama-3.1-8b-instant',      // Más rápido, ideal para demos
  balanced: 'llama-3.1-70b-versatile', // Más inteligente
  coding: 'llama-3.1-8b-instant',    // Optimizado para código
};

export const SYSTEM_PROMPTS = {
  generate: `Eres un experto desarrollador de contratos inteligentes Substrate e ink!. 
Genera contratos ink! listos para producción basados en los requerimientos del usuario.
Siempre incluye:

1. **Estructura completa del contrato** con storage, constructors y messages
2. **Comentarios detallados** explicando cada función
3. **Manejo de errores** robusto con Result<T, Error>
4. **Eventos** para logging y debugging
5. **Tests unitarios** básicos
6. **Documentación** inline con ejemplos de uso

Formato de respuesta:
- Solo código Rust válido
- Sin explicaciones adicionales
- Código listo para compilar
- Siguiendo las mejores prácticas de ink!`,

  explain: `Eres un experto en contratos inteligentes Substrate e ink!. 
Explica el código proporcionado de manera clara y educativa.

Incluye:
1. **Propósito general** del contrato
2. **Análisis línea por línea** de las funciones principales
3. **Patrones de seguridad** implementados
4. **Posibles mejoras** y optimizaciones
5. **Ejemplos de uso** prácticos

Formato: Explicación clara y estructurada en español.`,

  debug: `Eres un experto en debugging de contratos ink! y Substrate.
Analiza el error proporcionado y ofrece soluciones específicas.

Incluye:
1. **Causa raíz** del error
2. **Solución paso a paso** con código
3. **Prevención** de errores similares
4. **Mejores prácticas** relacionadas

Formato: Análisis técnico detallado con soluciones prácticas.`
};

export async function* generateContractStream(
  prompt: string,
  contractType: string,
  complexity?: string,
  features?: string[]
) {
  const enhancedPrompt = `Genera un contrato ink! de tipo "${contractType}" con los siguientes requerimientos:
  
Prompt del usuario: ${prompt}
Complejidad: ${complexity || 'media'}
Características: ${features?.join(', ') || 'básicas'}

Responde SOLO con código Rust válido, sin explicaciones adicionales.`;

  try {
    const stream = await groq.chat.completions.create({
      model: GROQ_MODELS.coding,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.generate },
        { role: 'user', content: enhancedPrompt }
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error(`Error generando contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

export async function* explainCodeStream(
  code: string,
  focus: 'general' | 'security' | 'optimization' | 'deployment' = 'general'
) {
  const prompt = `Explica este código ink! con enfoque en ${focus}:

\`\`\`rust
${code}
\`\`\`

Proporciona una explicación detallada y educativa.`;

  try {
    const stream = await groq.chat.completions.create({
      model: GROQ_MODELS.balanced,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.explain },
        { role: 'user', content: prompt }
      ],
      stream: true,
      temperature: 0.5,
      max_tokens: 1500,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error(`Error explicando código: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

export async function* debugErrorStream(
  errorMessage: string,
  code?: string,
  context?: string
) {
  const prompt = `Debug este error de ink!/Substrate:

Error: ${errorMessage}
${code ? `Código:\n\`\`\`rust\n${code}\n\`\`\`` : ''}
${context ? `Contexto: ${context}` : ''}

Proporciona una solución detallada.`;

  try {
    const stream = await groq.chat.completions.create({
      model: GROQ_MODELS.fast,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.debug },
        { role: 'user', content: prompt }
      ],
      stream: true,
      temperature: 0.3,
      max_tokens: 1000,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error(`Error debuggeando: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}
