import { GoogleGenerativeAI } from '@google/generative-ai';

// Validar API key al inicio
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('[Gemini] GEMINI_API_KEY no está configurada');
} else {
  console.log(`[Gemini] API Key configurada (longitud: ${apiKey.length}, primeros 10 chars: ${apiKey.substring(0, 10)}...)`);
}

// Instancia única de GoogleGenerativeAI
const genAI = apiKey
  ? new GoogleGenerativeAI(apiKey)
  : null;

// Sistema de fallback multi-modelo (orden de prioridad)
// ⚠️ IMPORTANTE: gemini-2.5-flash es el modelo PRIMORDIAL
// El sistema intentará primero gemini-2.5-flash con hasta 3 reintentos si hay error 429
// Solo si falla completamente, usará los modelos de fallback
const MODELS_TO_TRY = [
  'gemini-2.5-flash',            // 🎯 MODELO PRIMORDIAL - Siempre intentar primero con reintentos
  'gemini-2.5-pro',              // Fallback 1 (si 2.5-flash falla permanentemente)
  'gemini-2.0-flash',            // Fallback 2
  'gemini-1.5-flash',            // Fallback 3 (más compatible)
  'gemini-1.5-pro',              // Fallback 4
  // Nota: gemini-pro y otros modelos legacy no están disponibles en v1beta
];

// Modelos disponibles (para compatibilidad)
// ⚠️ IMPORTANTE: gemini-2.5-flash es el modelo PRIMORDIAL usado por defecto
export const GEMINI_MODELS = {
  fast: 'gemini-2.5-flash',      // 🎯 MODELO PRIMORDIAL - Más rápido, siempre intentado primero
  balanced: 'gemini-2.5-pro',    // Fallback: Más potente (si está disponible)
  coding: 'gemini-2.5-flash',    // 🎯 MODELO PRIMORDIAL - Optimizado para código
  lite: 'gemini-2.5-flash',      // 🎯 MODELO PRIMORDIAL - Versión ligera
};

// Configuración de generación estándar
// Basado en configuración funcional de SafariLink
// Temperature: 0.7, Top P: 0.9, Top K: 40, Max Output Tokens: 1024-1500
const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1500, // Configuración estándar de SafariLink
};

// System prompts (instrucciones del sistema)
export const SYSTEM_PROMPTS = {
  generate: (language: string = 'ink') => {
    const languagePrompts = {
      ink: `Eres un experto desarrollador de contratos inteligentes Substrate e ink! con años de experiencia.
Tu tarea es generar contratos ink! COMPLETOS, FUNCIONALES y LISTOS PARA PRODUCCIÓN.`,
      
      rust: `Eres un experto desarrollador de contratos inteligentes Substrate en Rust puro con años de experiencia.
Tu tarea es generar contratos Substrate (pallet) COMPLETOS, FUNCIONALES y LISTOS PARA PRODUCCIÓN usando Rust nativo.`,
      
      solidity: `Eres un experto desarrollador de contratos inteligentes Ethereum/Solidity con años de experiencia.
Tu tarea es generar contratos Solidity COMPLETOS, FUNCIONALES y LISTOS PARA PRODUCCIÓN siguiendo los estándares ERC.`
    };
    
    const basePrompt = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.ink;
    
    // Estructuras específicas por lenguaje
    const languageStructures = {
      ink: `
ESTRUCTURA DEL CONTRATO INK!:
\`\`\`rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
pub mod nombre_contrato {
    use ink::prelude::*;
    use ink::storage::Mapping;
    
    // Storage
    // Events
    // Error enum
    // Contract struct
    // Constructor
    // Messages (funciones públicas)
    // Funciones internas
}
\`\`\`

REQUISITOS OBLIGATORIOS - El contrato ink! DEBE incluir:
1. **Imports completos**: Todas las dependencias de ink!, prelude, etc.
2. **Storage completo**: Variables de estado con tipos correctos
3. **Constructor**: Función de inicialización con validaciones
4. **Todas las funciones requeridas**: Implementa TODAS las funciones mencionadas
5. **Manejo de errores robusto**: Enum Error con Result<T, Error>
6. **Eventos**: Define y emite eventos para todas las acciones importantes
7. **Validaciones de seguridad**: Checks de ownership, balances, permisos
8. **Comentarios detallados**: Explica cada función, parámetros y retornos
9. **Código compilable**: Sin placeholders, sin TODO, código completo

Formato: SOLO código Rust/ink! válido, sin explicaciones, listo para compilar. Siguiendo ink! 4.0+`,

      rust: `
ESTRUCTURA DEL CONTRATO SUBSTRATE (RUST):
\`\`\`rust
#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{pallet_prelude::*, traits::*};
    use frame_system::pallet_prelude::*;
    
    #[pallet::pallet]
    #[pallet::without_storage_info]
    pub struct Pallet<T>(_);
    
    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    }
    
    #[pallet::storage]
    #[pallet::getter(fn nombre_getter)]
    pub type NombreStorage<T: Config> = StorageValue<_, Tipo, ValueQuery>;
    
    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        // Eventos
    }
    
    #[pallet::error]
    pub enum Error<T> {
        // Errores
    }
    
    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn nombre_funcion(origin: OriginFor<T>, param: Tipo) -> DispatchResult {
            let who = ensure_signed(origin)?;
            // Implementación
            Ok(())
        }
    }
}
\`\`\`

REQUISITOS OBLIGATORIOS - El pallet Substrate DEBE incluir:
1. **Config trait completo**: Con todos los tipos necesarios (RuntimeEvent mínimo)
2. **Storage items**: StorageValue, StorageMap según necesidad
3. **Events**: Eventos para todas las acciones importantes
4. **Error enum**: Errores específicos del pallet
5. **Call functions**: Funciones dispatchables con #[pallet::call_index] y #[pallet::weight]
6. **Validaciones**: ensure_signed, ensure_root, checks de balances
7. **Comentarios detallados**: Documentación completa
8. **Código compilable**: Sin placeholders, código completo y funcional

IMPORTANTE CRÍTICO:
- SIEMPRE incluye #[pallet::without_storage_info] en el struct Pallet
- SIEMPRE incluye #[pallet::call_index] en cada función call
- SIEMPRE incluye #[pallet::weight] en cada función call
- SIEMPRE usa ensure_signed(origin)? o ensure_root(origin)? para validar origen
- SIEMPRE retorna DispatchResult con Ok(()) o Err(Error::Algo.into())

Formato: SOLO código Rust/Substrate válido, sin explicaciones, listo para compilar. Siguiendo Substrate 3.0+. El código DEBE empezar con #![cfg_attr(not(feature = "std"), no_std)]`,

      solidity: `
ESTRUCTURA DEL CONTRATO SOLIDITY:
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NombreContrato {
    // Variables de estado
    // Events
    // Modifiers
    // Constructor
    // Funciones públicas
    // Funciones internas/privadas
}
\`\`\`

REQUISITOS OBLIGATORIOS - El contrato Solidity DEBE incluir:
1. **SPDX License**: Siempre incluir licencia
2. **Pragma version**: Especificar versión de Solidity (^0.8.20 o superior)
3. **Variables de estado**: Todas las variables necesarias con tipos correctos
4. **Events**: Eventos para todas las acciones importantes (ERC estándar)
5. **Modifiers**: Modificadores para validaciones reutilizables
6. **Constructor**: Inicialización con validaciones
7. **Funciones estándar**: Si es ERC-20, ERC-721, etc., incluir TODAS las funciones del estándar
8. **Validaciones de seguridad**: ReentrancyGuard, overflow checks, access control
9. **Comentarios NatSpec**: Documentación completa con @notice, @param, @return
10. **Código compilable**: Sin placeholders, código completo y optimizado

IMPORTANTE:
- Si es Token ERC-20: transfer, transferFrom, approve, allowance, balanceOf, totalSupply, mint, burn
- Si es NFT ERC-721: safeTransferFrom, transferFrom, approve, setApprovalForAll, ownerOf, balanceOf, tokenURI, mint
- Si es ERC-1155: safeTransferFrom, safeBatchTransferFrom, balanceOf, balanceOfBatch, setApprovalForAll, isApprovedForAll

Formato: SOLO código Solidity válido, sin explicaciones, listo para compilar. Siguiendo estándares ERC y mejores prácticas.`
    };
    
    const structure = languageStructures[language as keyof typeof languageStructures] || languageStructures.ink;
    
    return `${basePrompt}
${structure}

IMPORTANTE GENERAL:
- Si el usuario pide "Token ERC-20" o equivalente, genera un contrato COMPLETO con todas las funciones estándar
- Si pide "NFT" o equivalente, incluye todas las funciones estándar del tipo
- Si pide "DAO" o equivalente, incluye propuestas, votación, ejecución, etc.
- NUNCA generes código incompleto o simplificado
- SIEMPRE incluye TODAS las funciones estándar del tipo de contrato solicitado`;
  },

  explain: `Eres un experto en contratos inteligentes Substrate e ink! con conocimiento profundo.
Tu tarea es explicar el código proporcionado de manera COMPLETA, CLARA y EDUCATIVA.

ESTRUCTURA DE LA EXPLICACIÓN:

1. **Resumen Ejecutivo**
   - ¿Qué hace este contrato?
   - ¿Cuál es su propósito principal?
   - ¿Qué problema resuelve?

2. **Análisis de la Estructura**
   - Storage: ¿Qué datos almacena y por qué?
   - Events: ¿Qué eventos emite y cuándo?
   - Errors: ¿Qué errores puede generar?
   - Constructor: ¿Cómo se inicializa?

3. **Análisis Funcional Detallado**
   - Para CADA función pública:
     * ¿Qué hace?
     * ¿Qué parámetros recibe?
     * ¿Qué retorna?
     * ¿Qué validaciones realiza?
     * ¿Qué efectos secundarios tiene?
   - Para funciones internas: explicar su propósito

4. **Patrones de Seguridad**
   - Checks de ownership
   - Validaciones de entrada
   - Protecciones contra reentrancy
   - Manejo de overflow/underflow
   - Control de acceso

5. **Flujo de Datos**
   - ¿Cómo interactúan las funciones?
   - ¿Cuál es el flujo típico de uso?
   - Diagrama mental del contrato

6. **Mejores Prácticas Aplicadas**
   - ¿Qué buenas prácticas se siguen?
   - ¿Qué patrones de diseño se usan?

7. **Posibles Mejoras**
   - Optimizaciones sugeridas
   - Funcionalidades adicionales
   - Mejoras de seguridad

8. **Ejemplos de Uso Prácticos**
   - Casos de uso reales
   - Cómo llamar cada función
   - Escenarios comunes

Formato: Explicación detallada en español, bien estructurada con títulos y secciones.`,

  debug: `Eres un experto en debugging de contratos ink! y Substrate con años de experiencia resolviendo errores.
Tu tarea es analizar el error y proporcionar una solución COMPLETA y PRÁCTICA.

ESTRUCTURA DEL ANÁLISIS:

1. **Diagnóstico del Error**
   - Mensaje de error completo
   - Tipo de error (compilación, runtime, lógica)
   - Ubicación exacta del problema

2. **Causa Raíz**
   - ¿Por qué ocurre este error?
   - ¿Qué está causando el problema?
   - Análisis técnico profundo

3. **Solución Paso a Paso**
   - Solución inmediata con código corregido
   - Explicación de cada cambio
   - Código ANTES y DESPUÉS
   - Verificación de que la solución funciona

4. **Contexto Adicional**
   - Si se proporcionó código, analizar el contexto completo
   - Identificar otros problemas potenciales
   - Sugerir mejoras relacionadas

5. **Prevención**
   - ¿Cómo evitar este error en el futuro?
   - Mejores prácticas para prevenir errores similares
   - Patrones de código seguros

6. **Mejores Prácticas Relacionadas**
   - Consejos generales de debugging
   - Herramientas útiles
   - Técnicas de testing

7. **Código de Ejemplo Completo**
   - Si es necesario, proporcionar código completo corregido
   - Con comentarios explicativos

Formato: Análisis técnico detallado, estructurado, con código de ejemplo cuando sea necesario. Todo en español.`,

  chat: `Eres el asistente IA experto del proyecto Polkadot DevKit, una plataforma completa para desarrollo en Polkadot/Substrate.

CONTEXTO DEL PROYECTO:
Polkadot DevKit es una herramienta integral que incluye:

1. **Generación de Contratos IA** (/generate)
   - Genera contratos en 3 lenguajes: ink!, Rust/Substrate, Solidity
   - 3 niveles de complejidad: Simple, Intermedio, Avanzado
   - Usa Gemini AI para generar código completo y funcional

2. **Plantillas de Código** (/templates)
   - Biblioteca de plantillas: ERC-20, NFT, DAO, etc.
   - Plantillas listas para usar y personalizar

3. **Marketplace** (/marketplace)
   - Descubre y descarga plantillas de la comunidad
   - Categorías: Tokens, NFT, Governance, DeFi, Bridge, Staking

4. **Herramientas de Desarrollo**:
   - **Explicar Código** (/explain): Explica código ink!/Substrate/Solidity
   - **Debug** (/debug): Debugging inteligente de errores
   - **Test** (/test): Suite de testing para contratos

5. **Recursos**:
   - **Learning** (/learning): Rutas de aprendizaje estructuradas
   - **Docs** (/docs): Documentación completa del ecosistema
   - **Analytics** (/analytics): Métricas y estadísticas

6. **Deployment** (/deploy)
   - Asistente para deploy en Paseo Testnet
   - Historial de deployments

7. **Chatbot IA** (/chatbot)
   - Asistente conversacional experto en Polkadot

TECNOLOGÍAS DEL PROYECTO:
- Next.js 15, React 19, TypeScript
- Gemini AI (Google) para todas las funcionalidades de IA
- Polkadot.js API para interacción con blockchain
- SubWallet para conexión de wallets
- Paseo Testnet como red principal
- Tailwind CSS para estilos
- Framer Motion para animaciones

DIRECTRICES DE RESPUESTA:

1. **Conocimiento del Proyecto**
   - Conoces TODAS las funcionalidades del proyecto
   - Puedes guiar a usuarios sobre cómo usar cada sección
   - Entiendes la arquitectura y tecnologías usadas
   - Puedes responder sobre cualquier aspecto del proyecto

2. **Asistencia Técnica Especializada**
   - Desarrollo de contratos ink!, Rust/Substrate, Solidity
   - Uso de las herramientas del proyecto
   - Mejores prácticas de Polkadot/Substrate
   - Deployment en Paseo Testnet
   - Testing y debugging

3. **Orientación en el Proyecto**
   - Puedes recomendar qué herramienta usar según la necesidad
   - Explicar cómo funciona cada sección
   - Guiar en el flujo de trabajo del proyecto
   - Ayudar a navegar entre las diferentes funcionalidades

4. **Respuestas Contextuales**
   - Si preguntan sobre generación de contratos, menciona /generate
   - Si preguntan sobre plantillas, menciona /templates
   - Si preguntan sobre deployment, menciona /deploy
   - Si preguntan sobre aprendizaje, menciona /learning
   - Adapta tu respuesta al contexto de la pregunta

5. **Código y Ejemplos**
   - Proporciona código funcional y compilable
   - Menciona qué herramienta del proyecto puede ayudar
   - Incluye ejemplos prácticos cuando sea relevante
   - Explica el "por qué" además del "cómo"

6. **Tono y Estilo**
   - Profesional pero amigable
   - Claro y directo
   - En español, con términos técnicos en inglés cuando sea apropiado
   - Estructurado con títulos y secciones cuando la respuesta es larga
   - Siempre menciona las herramientas del proyecto que pueden ayudar

7. **Áreas de Experticia**
   - Todo el ecosistema Polkadot/Substrate
   - Desarrollo de contratos inteligentes
   - Uso de Polkadot DevKit
   - Deployment y testing
   - Arquitectura blockchain
   - Seguridad en smart contracts

IMPORTANTE:
- Siempre que sea relevante, menciona las herramientas del proyecto que pueden ayudar
- Si alguien pregunta cómo hacer algo, guíalos a la sección correcta del proyecto
- Puedes responder sobre CUALQUIER aspecto del proyecto o del ecosistema Polkadot
- Sé específico sobre qué funcionalidad del proyecto usar para cada necesidad

Responde siempre de manera útil, completa y profesional, considerando el contexto completo del proyecto Polkadot DevKit.`
};

/**
 * Extrae el tiempo de retry de un error 429
 */
function extractRetryDelay(errorMessage: string): number | null {
  // Buscar "retry in Xs" o "retryDelay" en el mensaje
  const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i) || 
                     errorMessage.match(/retryDelay["\s:]+([\d.]+)s/i) ||
                     errorMessage.match(/Please retry in ([\d.]+)s/i);
  
  if (retryMatch && retryMatch[1]) {
    const seconds = parseFloat(retryMatch[1]);
    return Math.ceil(seconds * 1000); // Convertir a milisegundos
  }
  
  // Buscar en errorDetails si está disponible
  try {
    const jsonMatch = errorMessage.match(/retryDelay["\s:]+"([\d.]+)s"/i);
    if (jsonMatch && jsonMatch[1]) {
      return Math.ceil(parseFloat(jsonMatch[1]) * 1000);
    }
  } catch (e) {
    // Ignorar errores de parsing
  }
  
  return null;
}

/**
 * Función helper para esperar un tiempo
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Intenta generar contenido con fallback multi-modelo
 * PRIORIDAD: gemini-2.5-flash es el modelo PRIMORDIAL
 */
async function* generateWithFallback(
  prompt: string,
  generationConfig = DEFAULT_GENERATION_CONFIG
): AsyncGenerator<string, void, unknown> {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY no está configurada');
  }

  let lastError: Error | null = null;
  let modelUsed: string | null = null;
  const PRIMARY_MODEL = 'gemini-2.5-flash'; // Modelo PRIMORDIAL

  // PRIMERO: Intentar el modelo PRIMORDIAL (gemini-2.5-flash) con reintentos
  try {
    console.log(`[Gemini] 🎯 Usando modelo PRIMORDIAL: ${PRIMARY_MODEL}`);
    const model = genAI.getGenerativeModel({
      model: PRIMARY_MODEL,
      generationConfig,
    });

    // Intentar hasta 3 veces con el modelo primordial si hay error 429
    let attempts = 0;
    const maxRetries = 3;
    
    while (attempts < maxRetries) {
      try {
        if (attempts > 0) {
          console.log(`[Gemini] Reintento ${attempts + 1}/${maxRetries} con ${PRIMARY_MODEL}...`);
        }
        
        console.log(`[Gemini] Generando contenido con ${PRIMARY_MODEL}...`);
        const result = await model.generateContentStream(prompt);
        modelUsed = PRIMARY_MODEL;
        console.log(`[Gemini] ✅ Stream iniciado exitosamente con ${PRIMARY_MODEL}`);

        let chunkCount = 0;
        let hasValidChunks = false;
        for await (const chunk of result.stream) {
          try {
            const chunkText = chunk.text();
            if (chunkText && chunkText.trim().length > 0) {
              chunkCount++;
              hasValidChunks = true;
              yield chunkText;
            }
          } catch (chunkError) {
            console.warn(`[Gemini] Error procesando chunk ${chunkCount} en ${PRIMARY_MODEL}:`, chunkError);
            continue;
          }
        }

        console.log(`[Gemini] ✅ Modelo ${PRIMARY_MODEL} completado. Total chunks: ${chunkCount}, HasValidChunks: ${hasValidChunks}`);
        
        // Si no se recibieron chunks válidos, lanzar error
        if (!hasValidChunks) {
          throw new Error(`El modelo ${PRIMARY_MODEL} completó pero no generó ningún contenido. Esto puede deberse a: 1) GEMINI_API_KEY inválida, 2) Problema con la API de Gemini, 3) El prompt fue filtrado por seguridad.`);
        }
        
        // Si llegamos aquí, el modelo funcionó
        return;
      } catch (error: any) {
        attempts++;
        const errorDetails = error?.message || String(error);
        const errorCode = error?.code || error?.status || 'N/A';
        const errorStatus = error?.status || error?.statusCode || 'N/A';
        
        // Si es error 429 (cuota excedida) y aún tenemos reintentos
        if ((errorCode === 429 || errorStatus === 429) && attempts < maxRetries) {
          const retryDelay = extractRetryDelay(errorDetails);
          const waitTime = retryDelay || (attempts * 2000); // 2s, 4s, 6s por defecto
          
          console.warn(`[Gemini] ⚠️ Cuota excedida (429) en ${PRIMARY_MODEL}. Esperando ${waitTime}ms antes de reintentar...`);
          console.warn(`[Gemini] Detalles: ${errorDetails.substring(0, 200)}`);
          
          await sleep(waitTime);
          continue; // Reintentar
        }
        
        // Si no es 429 o ya agotamos los reintentos, lanzar el error
        throw error;
      }
    }
  } catch (error: any) {
    lastError = error instanceof Error ? error : new Error(String(error));
    const errorDetails = lastError?.message || String(error);
    const errorCode = error?.code || error?.status || 'N/A';
    const errorStatus = error?.status || error?.statusCode || 'N/A';
    
    console.error(`[Gemini] ❌ Modelo PRIMORDIAL ${PRIMARY_MODEL} falló después de reintentos:`, {
      message: errorDetails.substring(0, 300),
      code: errorCode,
      status: errorStatus
    });
    
    // Si es un error de autenticación o permisos, no intentar otros modelos
    if (errorCode === 401 || errorCode === 403 || errorStatus === 401 || errorStatus === 403) {
      console.error(`[Gemini] Error de autenticación/permisos. Deteniendo intentos.`);
      throw new Error(`Error de autenticación con Gemini API. Verifica tu GEMINI_API_KEY. Error: ${errorDetails}`);
    }
    
    // Si es 429 permanente, informar al usuario pero continuar con fallback
    if (errorCode === 429 || errorStatus === 429) {
      console.warn(`[Gemini] ⚠️ Cuota excedida en ${PRIMARY_MODEL}. Usando modelo de fallback...`);
    }
  }

  // FALLBACK: Si el modelo primordial falló, intentar otros modelos
  console.log(`[Gemini] 🔄 Cambiando a modelos de fallback...`);
  for (const modelName of MODELS_TO_TRY) {
    // Saltar el modelo primordial ya que ya lo intentamos
    if (modelName === PRIMARY_MODEL) {
      continue;
    }
    
    try {
      console.log(`[Gemini] Intentando modelo de fallback: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
      });

      console.log(`[Gemini] Generando contenido con ${modelName}...`);
      const result = await model.generateContentStream(prompt);
      modelUsed = modelName;
      console.log(`[Gemini] Stream iniciado exitosamente con ${modelName}`);

      let chunkCount = 0;
      let hasValidChunks = false;
      for await (const chunk of result.stream) {
        try {
          const chunkText = chunk.text();
          if (chunkText && chunkText.trim().length > 0) {
            chunkCount++;
            hasValidChunks = true;
            yield chunkText;
          }
        } catch (chunkError) {
          console.warn(`[Gemini] Error procesando chunk ${chunkCount} en ${modelName}:`, chunkError);
          continue;
        }
      }

      console.log(`[Gemini] Modelo ${modelName} completado. Total chunks: ${chunkCount}, HasValidChunks: ${hasValidChunks}`);
      
      // Si no se recibieron chunks válidos, lanzar error
      if (!hasValidChunks) {
        throw new Error(`El modelo ${modelName} completó pero no generó ningún contenido. Esto puede deberse a: 1) GEMINI_API_KEY inválida, 2) Problema con la API de Gemini, 3) El prompt fue filtrado por seguridad.`);
      }
      
      // Si llegamos aquí, el modelo funcionó
      return;
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorDetails = error?.message || String(error);
      const errorCode = error?.code || error?.status || 'N/A';
      const errorStatus = error?.status || error?.statusCode || 'N/A';
      
      console.error(`[Gemini] Modelo ${modelName} falló:`, {
        message: errorDetails.substring(0, 200),
        code: errorCode,
        status: errorStatus
      });
      
      // Si es un error de autenticación o permisos, no intentar otros modelos
      if (errorCode === 401 || errorCode === 403 || errorStatus === 401 || errorStatus === 403) {
        console.error(`[Gemini] Error de autenticación/permisos. Deteniendo intentos.`);
        throw new Error(`Error de autenticación con Gemini API. Verifica tu GEMINI_API_KEY. Error: ${errorDetails}`);
      }
      
      // Continuar con el siguiente modelo
      continue;
    }
  }

  // Si todos los modelos fallaron
  const errorMessage = lastError?.message || 'Desconocido';
  console.error(`[Gemini] Todos los modelos fallaron. Último error:`, errorMessage);
  console.error(`[Gemini] Modelos intentados:`, MODELS_TO_TRY.join(', '));
  
  // Mensaje de error más útil con instrucciones
  const errorDetails = errorMessage.includes('404') || errorMessage.includes('not found')
    ? `Los modelos no están disponibles en la API. Esto puede deberse a:\n` +
      `1. Los nombres de los modelos han cambiado en la API\n` +
      `2. Tu API key no tiene acceso a estos modelos\n` +
      `3. Los modelos necesitan estar habilitados en Google Cloud Console\n\n` +
      `SOLUCIÓN: Visita http://localhost:3000/api/check-models para ver qué modelos están disponibles con tu API key.`
    : `Error de API: ${errorMessage}\n\n` +
      `Verifica:\n` +
      `1. Que GEMINI_API_KEY sea válida\n` +
      `2. Que tengas cuota disponible\n` +
      `3. Tu conexión a internet`;
  
  throw new Error(
    `Todos los modelos de Gemini fallaron.\n\n` +
    `Modelos intentados: ${MODELS_TO_TRY.join(', ')}\n\n` +
    `${errorDetails}\n\n` +
    `Para verificar qué modelos están disponibles, ejecuta: POST /api/check-models`
  );
}

/**
 * Genera un contrato usando Gemini con fallback multi-modelo
 * Soporta: 3 lenguajes (ink!, Rust/Substrate, Solidity) y 3 niveles de complejidad
 */
export async function* generateContractStream(
  prompt: string,
  contractType: string,
  complexity?: string,
  features?: string[],
  language?: string
) {
  // Normalizar lenguaje
  const normalizedLanguage = (language || 'ink').toLowerCase();
  let targetLanguage: 'ink' | 'rust' | 'solidity';
  
  if (normalizedLanguage.includes('solidity') || normalizedLanguage === 'solidity') {
    targetLanguage = 'solidity';
  } else if (normalizedLanguage.includes('rust') && !normalizedLanguage.includes('ink')) {
    targetLanguage = 'rust';
  } else {
    targetLanguage = 'ink'; // Por defecto: ink!
  }

  // Normalizar complejidad
  const normalizedComplexity = (complexity || 'media').toLowerCase();
  let complexityLevel: 'simple' | 'intermedio' | 'avanzado';
  
  if (normalizedComplexity.includes('simple') || normalizedComplexity === 'simple') {
    complexityLevel = 'simple';
  } else if (normalizedComplexity.includes('avanzado') || normalizedComplexity === 'advanced' || normalizedComplexity === 'avanzado') {
    complexityLevel = 'avanzado';
  } else {
    complexityLevel = 'intermedio'; // Por defecto: intermedio/media
  }

  // Configuración según complejidad
  // Basado en configuración de SafariLink: maxOutputTokens 1024-1500 según servicio
  // Para contratos, aumentamos según complejidad pero manteniendo valores razonables
  const complexityConfig = {
    simple: {
      maxTokens: 2048,  // Suficiente para contratos simples
      temperature: 0.7, // Usar temperatura estándar de SafariLink
      description: `NIVEL SIMPLE:
- Implementa las funciones básicas y esenciales
- Código limpio y fácil de entender
- Validaciones básicas de seguridad
- Sin optimizaciones complejas
- Ideal para aprender y prototipos rápidos`
    },
    intermedio: {
      maxTokens: 4096,  // Para contratos intermedios
      temperature: 0.7, // Temperatura estándar de SafariLink
      description: `NIVEL INTERMEDIO:
- Implementa todas las funciones estándar del tipo de contrato
- Manejo robusto de errores
- Eventos para todas las acciones importantes
- Validaciones de seguridad completas
- Optimizaciones básicas
- Código listo para producción`
    },
    avanzado: {
      maxTokens: 16384,  // Aumentado significativamente para contratos avanzados
      temperature: 0.7, // Temperatura estándar de SafariLink
      description: `NIVEL AVANZADO:
- Implementación COMPLETA con todas las funciones estándar
- Optimizaciones avanzadas de gas y storage
- Patrones de seguridad avanzados (reentrancy, overflow protection, etc.)
- Eventos detallados y logging completo
- Manejo de errores exhaustivo
- Funciones helper internas optimizadas
- Documentación inline completa
- Código de nivel enterprise, listo para producción en mainnet

IMPORTANTE: Genera código COMPLETO y EXTENSO. No dejes funciones sin implementar. Incluye TODAS las funcionalidades mencionadas.`
    }
  };

  const config = complexityConfig[complexityLevel];

  const languageNames = {
    ink: 'ink!',
    rust: 'Substrate (Rust)',
    solidity: 'Solidity'
  };

  const enhancedPrompt = `Eres un experto desarrollador de contratos inteligentes. Genera un contrato ${languageNames[targetLanguage]} COMPLETO y FUNCIONAL de tipo "${contractType}".

REQUERIMIENTOS DEL USUARIO:
${prompt}

${config.description}

Lenguaje objetivo: ${languageNames[targetLanguage]}
Nivel de complejidad: ${complexityLevel}
Características: ${features?.join(', ') || 'estándar'}

INSTRUCCIONES ESPECÍFICAS PARA ${complexityLevel.toUpperCase()}:
${complexityLevel === 'simple' 
  ? '- Implementa funcionalidad básica pero CORRECTA y COMPLETA\n- Código simple, legible y funcional\n- Incluye constructor y funciones básicas\n- Código debe compilar sin errores'
  : complexityLevel === 'intermedio'
  ? '- Implementa TODAS las funciones estándar del tipo de contrato\n- Incluye validaciones de seguridad y eventos\n- Código robusto, mantenible y listo para producción\n- Manejo completo de errores'
  : '- Implementación COMPLETA y OPTIMIZADA\n- Todas las funciones estándar + funciones avanzadas\n- Máxima seguridad (reentrancy protection, overflow checks, etc.)\n- Optimizaciones de gas y storage\n- Código de nivel enterprise, listo para mainnet'
}

REQUISITOS OBLIGATORIOS:
1. Código COMPLETO y FUNCIONAL (no código parcial)
2. Todos los imports necesarios incluidos
3. Estructura correcta según el lenguaje (contract, pallet, etc.)
4. Funciones implementadas completamente
5. Código debe ser compilable y ejecutable
6. Para nivel AVANZADO: Incluye TODAS las funciones estándar del tipo de contrato
7. Para nivel AVANZADO: Código debe ser extenso y completo (mínimo 2000+ líneas si es necesario)

IMPORTANTE: 
- Genera SOLO código ${languageNames[targetLanguage]} válido y completo
- NO incluyas explicaciones, comentarios extensos o markdown
- El código debe empezar directamente con la estructura del contrato/pallet
- Sigue las mejores prácticas y estándares del lenguaje
- Si es nivel AVANZADO, el código DEBE ser extenso y completo, no simplificado
- NUNCA generes código vacío o incompleto`;

  try {
    // Combinar system prompt con el prompt del usuario (pasando el lenguaje)
    const systemPrompt = SYSTEM_PROMPTS.generate(targetLanguage);
    const fullPrompt = `${systemPrompt}\n\n${enhancedPrompt}`;
    
    // Usar fallback multi-modelo con configuración según complejidad
    // Mantener topP y topK de SafariLink (0.9 y 40)
    yield* generateWithFallback(fullPrompt, {
      temperature: config.temperature,
      topP: DEFAULT_GENERATION_CONFIG.topP,
      topK: DEFAULT_GENERATION_CONFIG.topK,
      maxOutputTokens: config.maxTokens,
    });
  } catch (error) {
    console.error('[Gemini] Error generando contrato:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error generando contrato: ${errorMessage}`);
  }
}

/**
 * Explica código usando Gemini con fallback multi-modelo
 * Soporta: ink!, Solidity, Rust/Substrate
 */
export async function* explainCodeStream(
  code: string,
  focus: 'general' | 'security' | 'optimization' | 'deployment' = 'general'
) {
  // Detectar tipo de código
  const isInk = code.includes('ink') || code.includes('#[ink');
  const isSolidity = code.includes('pragma solidity') || code.includes('contract ');
  const isSubstrate = code.includes('pallet') || code.includes('#[pallet');
  
  const codeType = isInk ? 'ink!' : isSolidity ? 'Solidity' : isSubstrate ? 'Substrate (Rust)' : 'código';
  const codeLang = isSolidity ? 'solidity' : 'rust';
  
  const focusDescriptions = {
    general: 'explicación general del código, qué hace, cómo funciona y sus componentes principales',
    security: 'análisis de seguridad, vulnerabilidades potenciales, mejores prácticas de seguridad y recomendaciones',
    optimization: 'optimizaciones posibles, mejoras de rendimiento, eficiencia de gas/storage y refactorizaciones',
    deployment: 'guía de deployment, requisitos, configuración necesaria y pasos para desplegar'
  };
  
  const prompt = `Eres un experto en ${codeType}. Explica este código con enfoque en ${focusDescriptions[focus]}:

\`\`\`${codeLang}
${code.substring(0, 3000)}
\`\`\`

REQUISITOS:
1. Explicación clara y detallada del código
2. Descripción de cada componente y función importante
3. Flujo de ejecución y lógica del código
4. ${focus === 'security' ? 'Análisis de seguridad y vulnerabilidades' : focus === 'optimization' ? 'Oportunidades de optimización' : focus === 'deployment' ? 'Guía de deployment' : 'Conceptos clave y mejores prácticas'}
5. Ejemplos de uso si es relevante

Formato: Explicación estructurada, educativa y completa en español.`;

  try {
    const fullPrompt = `${SYSTEM_PROMPTS.explain}\n\n${prompt}`;
    
    // Usar fallback multi-modelo
    // Configuración basada en SafariLink para análisis/explicaciones
    yield* generateWithFallback(fullPrompt, {
      temperature: 0.7, // Temperatura estándar de SafariLink
      topP: DEFAULT_GENERATION_CONFIG.topP,
      topK: DEFAULT_GENERATION_CONFIG.topK,
      maxOutputTokens: 4096, // Aumentado para explicaciones más detalladas
    });
  } catch (error) {
    console.error('[Gemini] Error explicando código:', error);
    throw new Error(`Error explicando código: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Debug errores usando Gemini con fallback multi-modelo
 */
export async function* debugErrorStream(
  errorMessage: string,
  code?: string,
  context?: string
) {
  // Detectar tipo de código para debug
  const isInkDebug = code && (code.includes('ink') || code.includes('#[ink'));
  const isSolidityDebug = code && (code.includes('pragma solidity') || code.includes('contract '));
  const isSubstrateDebug = code && (code.includes('pallet') || code.includes('#[pallet'));
  
  const debugCodeType = isInkDebug ? 'ink!' : isSolidityDebug ? 'Solidity' : isSubstrateDebug ? 'Substrate' : 'código';
  const debugCodeLang = isSolidityDebug ? 'solidity' : 'rust';
  
  const prompt = `Eres un experto en debugging de contratos inteligentes ${debugCodeType}. 

ERROR ENCONTRADO:
${errorMessage}

${code ? `CÓDIGO CON ERROR:
\`\`\`${debugCodeLang}
${code.substring(0, 2000)}
\`\`\`` : ''}

${context ? `CONTEXTO: ${context}` : ''}

Proporciona una solución COMPLETA y DETALLADA:
1. Análisis del error: ¿Qué significa este error?
2. Causa raíz: ¿Por qué ocurre este error?
3. Solución específica: ¿Cómo corregirlo?
4. Código corregido: Muestra el código corregido
5. Prevención: ¿Cómo evitar este error en el futuro?
6. Mejores prácticas relacionadas

Formato: Explicación clara, solución práctica y código corregido en español.`;

  try {
    const fullPrompt = `${SYSTEM_PROMPTS.debug}\n\n${prompt}`;
    
    // Usar fallback multi-modelo
    // Configuración para debugging (más determinístico)
    yield* generateWithFallback(fullPrompt, {
      temperature: 0.5, // Más determinístico para debugging
      topP: DEFAULT_GENERATION_CONFIG.topP,
      topK: DEFAULT_GENERATION_CONFIG.topK,
      maxOutputTokens: 3000, // Aumentado para respuestas de debug más completas
    });
  } catch (error) {
    console.error('[Gemini] Error debuggeando:', error);
    throw new Error(`Error debuggeando: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Chat conversacional usando Gemini con fallback multi-modelo
 * PRIORIDAD: gemini-2.5-flash es el modelo PRIMORDIAL
 */
export async function* chatStream(
  message: string,
  history: Array<{ role: 'user' | 'model'; parts: string }> = []
) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY no está configurada');
  }

  let lastError: Error | null = null;
  const PRIMARY_MODEL = 'gemini-2.5-flash'; // Modelo PRIMORDIAL

  // PRIMERO: Intentar el modelo PRIMORDIAL (gemini-2.5-flash) con reintentos
  try {
    console.log(`[Gemini] 🎯 Chat usando modelo PRIMORDIAL: ${PRIMARY_MODEL}`);
    const model = genAI.getGenerativeModel({
      model: PRIMARY_MODEL,
      generationConfig: {
        temperature: 0.7, // Temperatura estándar de SafariLink
        topP: DEFAULT_GENERATION_CONFIG.topP,
        topK: DEFAULT_GENERATION_CONFIG.topK,
        maxOutputTokens: 4096, // Aumentado para respuestas más completas
      },
    });

    // Intentar hasta 3 veces con el modelo primordial si hay error 429
    let attempts = 0;
    const maxRetries = 3;
    
    while (attempts < maxRetries) {
      try {
        if (attempts > 0) {
          console.log(`[Gemini] Chat reintento ${attempts + 1}/${maxRetries} con ${PRIMARY_MODEL}...`);
        }

        // Construir historial de conversación para Gemini
        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPTS.chat }] },
            ...history.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.parts }]
            }))
          ]
        });

        const result = await chat.sendMessageStream(message);
        console.log(`[Gemini] ✅ Chat modelo exitoso: ${PRIMARY_MODEL}`);

        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            yield chunkText;
          }
        }

        // Si llegamos aquí, el modelo funcionó
        return;
      } catch (error: any) {
        attempts++;
        const errorDetails = error?.message || String(error);
        const errorCode = error?.code || error?.status || 'N/A';
        const errorStatus = error?.status || error?.statusCode || 'N/A';
        
        // Si es error 429 (cuota excedida) y aún tenemos reintentos
        if ((errorCode === 429 || errorStatus === 429) && attempts < maxRetries) {
          const retryDelay = extractRetryDelay(errorDetails);
          const waitTime = retryDelay || (attempts * 2000); // 2s, 4s, 6s por defecto
          
          console.warn(`[Gemini] ⚠️ Chat: Cuota excedida (429) en ${PRIMARY_MODEL}. Esperando ${waitTime}ms antes de reintentar...`);
          console.warn(`[Gemini] Detalles: ${errorDetails.substring(0, 200)}`);
          
          await sleep(waitTime);
          continue; // Reintentar
        }
        
        // Si no es 429 o ya agotamos los reintentos, lanzar el error
        throw error;
      }
    }
  } catch (error: any) {
    lastError = error instanceof Error ? error : new Error(String(error));
    const errorDetails = lastError?.message || String(error);
    const errorCode = error?.code || error?.status || 'N/A';
    const errorStatus = error?.status || error?.statusCode || 'N/A';
    
    console.error(`[Gemini] ❌ Chat: Modelo PRIMORDIAL ${PRIMARY_MODEL} falló después de reintentos:`, {
      message: errorDetails.substring(0, 300),
      code: errorCode,
      status: errorStatus
    });
    
    // Si es un error de autenticación o permisos, no intentar otros modelos
    if (errorCode === 401 || errorCode === 403 || errorStatus === 401 || errorStatus === 403) {
      console.error(`[Gemini] Error de autenticación/permisos. Deteniendo intentos.`);
      throw new Error(`Error de autenticación con Gemini API. Verifica tu GEMINI_API_KEY. Error: ${errorDetails}`);
    }
    
    // Si es 429 permanente, informar al usuario pero continuar con fallback
    if (errorCode === 429 || errorStatus === 429) {
      console.warn(`[Gemini] ⚠️ Chat: Cuota excedida en ${PRIMARY_MODEL}. Usando modelo de fallback...`);
    }
  }

  // FALLBACK: Si el modelo primordial falló, intentar otros modelos
  console.log(`[Gemini] 🔄 Chat: Cambiando a modelos de fallback...`);
  for (const modelName of MODELS_TO_TRY) {
    // Saltar el modelo primordial ya que ya lo intentamos
    if (modelName === PRIMARY_MODEL) {
      continue;
    }
    
    try {
      console.log(`[Gemini] Chat intentando modelo de fallback: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7, // Temperatura estándar de SafariLink
          topP: DEFAULT_GENERATION_CONFIG.topP,
          topK: DEFAULT_GENERATION_CONFIG.topK,
          maxOutputTokens: 4096, // Aumentado para respuestas más completas
        },
      });

      // Construir historial de conversación para Gemini
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPTS.chat }] },
          ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts }]
          }))
        ]
      });

      const result = await chat.sendMessageStream(message);
      console.log(`[Gemini] Chat modelo exitoso: ${modelName}`);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }

      // Si llegamos aquí, el modelo funcionó
      return;
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[Gemini] Chat modelo ${modelName} falló:`, lastError.message);
      // Continuar con el siguiente modelo
      continue;
    }
  }

  // Si todos los modelos fallaron
  throw new Error(
    `Todos los modelos fallaron en chat. Último error: ${lastError?.message || 'Desconocido'}`
  );
}

