/**
 * Helpers especializados para diferentes funcionalidades del proyecto
 * Usa Gemini AI para tareas específicas de cada sección
 */

import { chatStream } from './gemini';

/**
 * Genera tests automáticamente para un contrato
 */
export async function* generateTestsStream(
  contractCode: string,
  contractType: string = 'ink'
): AsyncGenerator<string, void, unknown> {
  const languageContext = contractType === 'solidity' 
    ? 'Solidity y Hardhat/Foundry'
    : contractType === 'rust'
    ? 'Rust y Substrate testing'
    : 'ink! y ink_env::test';
  
  const prompt = `Eres un experto en testing de contratos inteligentes. Genera tests COMPLETOS y FUNCIONALES para el siguiente contrato.

Código del contrato:
\`\`\`${contractType === 'solidity' ? 'solidity' : 'rust'}
${contractCode.substring(0, 3000)}
\`\`\`

Lenguaje: ${languageContext}

REQUISITOS OBLIGATORIOS:
1. Tests para el constructor (si existe)
2. Tests para cada función pública del contrato
3. Tests de casos edge (valores límite, errores esperados)
4. Tests de eventos emitidos (si el contrato tiene eventos)
5. Tests de validaciones y seguridad
6. Tests de integración entre funciones
7. Tests de casos de éxito y casos de error
8. Setup y teardown si es necesario

IMPORTANTE: 
- Genera código de tests COMPLETO y FUNCIONAL (mínimo 500+ líneas si es necesario)
- Usa las mejores prácticas de testing para ${languageContext}
- Incluye imports necesarios
- Los tests deben ser ejecutables
- NUNCA generes código vacío o incompleto
- Incluye múltiples casos de prueba para cada función

Formato: SOLO código de tests válido, sin explicaciones adicionales.`;

  yield* chatStream(prompt, []);
}

/**
 * Explica una plantilla de código
 */
export async function* explainTemplateStream(
  templateCode: string,
  templateName: string
): AsyncGenerator<string, void, unknown> {
  const prompt = `Eres un experto en contratos inteligentes. Explica esta plantilla de código "${templateName}" de manera COMPLETA y DETALLADA:

\`\`\`rust
${templateCode.substring(0, 3000)}
\`\`\`

Proporciona una explicación EXTENSA que incluya:
1. **Resumen Ejecutivo**: ¿Qué hace esta plantilla? ¿Cuál es su propósito?
2. **Análisis de Estructura**: Componentes principales, storage, eventos, funciones
3. **Funcionalidades Detalladas**: Explicación de cada función, parámetros, retornos
4. **Casos de Uso**: ¿Cuándo usar esta plantilla? ¿Para qué proyectos?
5. **Personalización**: ¿Cómo adaptarla a necesidades específicas?
6. **Ejemplos Prácticos**: Ejemplos de código de uso real
7. **Mejores Prácticas**: Recomendaciones y consideraciones importantes
8. **Seguridad**: Análisis de seguridad y validaciones incluidas

IMPORTANTE:
- La explicación debe ser EXTENSA (mínimo 1000 palabras)
- Incluye detalles técnicos profundos
- Proporciona ejemplos de código cuando sea relevante
- Estructura la respuesta con títulos y secciones claras

Formato: Explicación detallada, extensa y bien estructurada en español.`;

  yield* chatStream(prompt, []);
}

/**
 * Genera una variación de una plantilla
 */
export async function* generateTemplateVariationStream(
  templateCode: string,
  variationRequest: string
): AsyncGenerator<string, void, unknown> {
  const prompt = `Basándote en esta plantilla, genera una variación con los siguientes cambios:

Plantilla original:
\`\`\`rust
${templateCode}
\`\`\`

Variación solicitada: ${variationRequest}

REQUISITOS:
- Mantén la estructura base de la plantilla
- Aplica los cambios solicitados
- Mantén el código funcional y compilable
- Incluye todas las funciones necesarias

Formato: SOLO código Rust válido, sin explicaciones.`;

  yield* chatStream(prompt, []);
}

/**
 * Búsqueda inteligente en marketplace
 */
export async function* intelligentSearchStream(
  searchQuery: string,
  availableTemplates: Array<{ title: string; description: string; category: string; tags: string[] }>
): AsyncGenerator<string, void, unknown> {
  const templatesList = availableTemplates.map(t => 
    `- ${t.title} (${t.category}): ${t.description}. Tags: ${t.tags.join(', ')}`
  ).join('\n');

  const prompt = `Eres un experto en búsqueda y recomendación de plantillas de código. 

El usuario busca: "${searchQuery}"

Plantillas disponibles:
${templatesList}

Proporciona un análisis COMPLETO y DETALLADO (mínimo 800 palabras):

1. **Análisis de la Búsqueda**:
   - Interpretación de la intención del usuario
   - Palabras clave identificadas
   - Contexto probable de uso

2. **Recomendaciones de Plantillas**:
   - ¿Qué plantillas son más relevantes y por qué? (explicación detallada de cada una)
   - Ranking de relevancia con justificación
   - Comparación entre opciones similares

3. **Categorías y Tags**:
   - ¿Qué categorías debería explorar?
   - ¿Qué tags son relevantes para su búsqueda?
   - Sugerencias de categorías relacionadas

4. **Sugerencias de Búsqueda**:
   - Términos de búsqueda alternativos
   - Búsquedas relacionadas que podrían ser útiles
   - Sinónimos y variaciones

5. **Recomendaciones Adicionales**:
   - Plantillas complementarias que podrían ser útiles
   - Combinaciones de plantillas sugeridas
   - Recursos adicionales relacionados

IMPORTANTE:
- La respuesta debe ser EXTENSA y DETALLADA (mínimo 800 palabras)
- Proporciona justificaciones para cada recomendación
- Incluye ejemplos de uso cuando sea relevante

Formato: Respuesta estructurada, extensa y detallada en español, clara y útil.`;

  yield* chatStream(prompt, []);
}

/**
 * Tutor IA para learning
 */
export async function* learningTutorStream(
  question: string,
  learningPath?: string,
  progress?: number
): AsyncGenerator<string, void, unknown> {
  const context = learningPath 
    ? `El usuario está en la ruta "${learningPath}" con ${progress}% de progreso.`
    : 'El usuario está explorando el centro de aprendizaje.';

  const prompt = `Eres un tutor experto en Polkadot/Substrate. ${context}

Pregunta del estudiante: ${question}

Proporciona:
1. Respuesta clara y educativa
2. Ejemplos prácticos si es relevante
3. Conceptos relacionados que debería conocer
4. Próximos pasos recomendados en su aprendizaje
5. Recursos adicionales si es necesario

Formato: Respuesta estructurada, educativa y motivadora en español.`;

  yield* chatStream(prompt, []);
}

/**
 * Búsqueda inteligente en documentación
 */
export async function* docsSearchStream(
  searchQuery: string,
  docSections?: Array<{ title: string; description: string }>
): AsyncGenerator<string, void, unknown> {
  const sectionsContext = docSections
    ? `Secciones disponibles:\n${docSections.map(s => `- ${s.title}: ${s.description}`).join('\n')}`
    : '';

  const prompt = `Eres un experto en documentación técnica de Polkadot/Substrate. 

El usuario busca en la documentación: "${searchQuery}"

${sectionsContext}

Proporciona una respuesta COMPLETA y DETALLADA (mínimo 1000 palabras):

1. **Análisis de la Búsqueda**:
   - Interpretación de lo que el usuario necesita
   - Conceptos clave relacionados
   - Contexto técnico relevante

2. **Secciones Relevantes**:
   - ¿Qué sección es más relevante? (con justificación detallada)
   - Otras secciones relacionadas que debería consultar
   - Orden sugerido de lectura

3. **Explicación de Conceptos**:
   - Explicación detallada de los conceptos buscados
   - Fundamentos técnicos
   - Cómo se relacionan con el ecosistema Polkadot

4. **Ejemplos de Código**:
   - Ejemplos prácticos y completos
   - Casos de uso reales
   - Código funcional y comentado

5. **Recursos Adicionales**:
   - Enlaces a documentación oficial relacionada
   - Tutoriales y guías relevantes
   - Herramientas y recursos útiles

6. **Conceptos Relacionados**:
   - Conceptos relacionados que debería conocer
   - Prerequisitos recomendados
   - Siguientes pasos en el aprendizaje

7. **Guía de Implementación**:
   - Pasos para implementar lo buscado
   - Consideraciones importantes
   - Mejores prácticas

IMPORTANTE:
- La respuesta debe ser EXTENSA y DETALLADA (mínimo 1000 palabras)
- Incluye ejemplos de código completos cuando sea relevante
- Proporciona referencias específicas y enlaces útiles

Formato: Respuesta estructurada, extensa y detallada en español, con referencias claras y ejemplos completos.`;

  yield* chatStream(prompt, []);
}

/**
 * Asistente de deployment
 */
export async function* deploymentAssistantStream(
  contractCode: string,
  question: string
): AsyncGenerator<string, void, unknown> {
  // Detectar tipo de contrato
  const isInk = contractCode.includes('ink') || contractCode.includes('#[ink');
  const isSolidity = contractCode.includes('pragma solidity') || contractCode.includes('contract ');
  const isSubstrate = contractCode.includes('pallet') || contractCode.includes('#[pallet');
  
  const contractType = isInk ? 'ink!' : isSolidity ? 'Solidity' : isSubstrate ? 'Substrate pallet' : 'contrato';
  
  // Detectar red objetivo de la pregunta
  let network = 'Polkadot/Paseo Testnet';
  let networkInfo = '';
  
  if (question.toLowerCase().includes('paseo')) {
    network = 'Paseo Testnet';
    networkInfo = `
INFORMACIÓN DE PASEO TESTNET:
- RPC Endpoint: wss://paseo.rpc.amforc.com
- Símbolo: PAS
- Decimales: 10
- Tipo: Testnet (sin valor económico)
- Faucet: https://faucet.polkadot.io/ (seleccionar Paseo)
- Explorador: https://paseo.subscan.io/
- Polkadot.js Apps: https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com`;
  } else if (question.toLowerCase().includes('westend')) {
    network = 'Westend Testnet';
    networkInfo = `
INFORMACIÓN DE WESTEND TESTNET:
- RPC Endpoint: wss://westend-rpc.polkadot.io
- Símbolo: WND
- Decimales: 12
- Tipo: Testnet (sin valor económico)
- Faucet: https://faucet.polkadot.io/ (seleccionar Westend)
- Explorador: https://westend.subscan.io/
- Polkadot.js Apps: https://polkadot.js.org/apps/?rpc=wss://westend-rpc.polkadot.io`;
  } else if (question.toLowerCase().includes('polkadot mainnet') || question.toLowerCase().includes('mainnet')) {
    network = 'Polkadot Mainnet';
    networkInfo = `
INFORMACIÓN DE POLKADOT MAINNET (PRODUCCIÓN):
- RPC Endpoint: wss://rpc.polkadot.io
- Símbolo: DOT
- Decimales: 10
- Tipo: Mainnet (producción - tokens con valor económico)
- Explorador: https://polkadot.subscan.io/
- Polkadot.js Apps: https://polkadot.js.org/apps/?rpc=wss://rpc.polkadot.io
- ⚠️ IMPORTANTE: Esta es la red de producción. Los tokens DOT tienen valor real.`;
  } else if (isSolidity) {
    network = 'una red EVM (Ethereum, Polygon, etc.)';
  }
  
  const prompt = `Eres un asistente experto en deployment de contratos inteligentes. 

Código del ${contractType}:
\`\`\`${isSolidity ? 'solidity' : 'rust'}
${contractCode.substring(0, 2000)}
\`\`\`

Pregunta/Consulta: ${question}
${networkInfo ? `\n${networkInfo}\n` : ''}
Red objetivo: ${network}

Proporciona una guía EXTREMADAMENTE COMPLETA y DETALLADA (mínimo 2000 palabras):

1. **Preparación Pre-Deployment**:
   - Verificaciones previas necesarias (compilación, tests, auditorías si es mainnet)
   - Checklist completo antes de desplegar
   - Requisitos del sistema y herramientas necesarias

2. **Configuración Requerida**:
   - RPC endpoints específicos con URLs completas
   - Configuración de wallets (SubWallet, Polkadot.js extension)
   - Variables de entorno necesarias
   - Instalación de herramientas (cargo-contract, etc.)

3. **Pasos de Deployment Paso a Paso**:
   - Paso 1: Compilación del contrato (comandos exactos)
   - Paso 2: Preparación del archivo .contract
   - Paso 3: Conexión a la red ${network}
   - Paso 4: Upload del código (instrucciones detalladas)
   - Paso 5: Instanciación del contrato (parámetros y configuración)
   - Paso 6: Verificación de la instancia

4. **Comandos Exactos**:
   - Todos los comandos necesarios con ejemplos completos
   - Explicación de cada parámetro
   - Alternativas si algún comando falla

5. **Configuración de Polkadot.js Apps**:
   - Cómo conectar a ${network}
   - Navegación en la interfaz
   - Pasos específicos en la sección de Contracts
   - Screenshots mentales de dónde hacer clic

6. **Solución de Problemas Comunes**:
   - Errores frecuentes y sus soluciones
   - Problemas de conexión RPC
   - Problemas de compilación
   - Problemas de instanciación

7. **Mejores Prácticas y Seguridad**:
   - Recomendaciones de seguridad${network.includes('Mainnet') ? ' (especialmente importantes para producción)' : ''}
   - Verificación de código antes de desplegar
   - Consideraciones de gas fees y costos
   ${network.includes('Mainnet') ? '- Checklist de seguridad antes de desplegar en producción\n- Consideraciones de costos y gas fees detalladas' : ''}

8. **Verificación Post-Deployment**:
   - Cómo verificar en exploradores
   - Cómo verificar transacciones
   - Cómo interactuar con el contrato desplegado
   - Enlaces a exploradores específicos

9. **Ejemplos Prácticos**:
   - Ejemplo completo de deployment desde cero
   - Ejemplo de interacción con el contrato desplegado
   - Casos de uso comunes

IMPORTANTE:
- La guía debe ser EXTREMADAMENTE DETALLADA (mínimo 2000 palabras)
- Incluye TODOS los pasos, sin omitir nada
- Proporciona comandos completos y ejecutables
- Explica el "por qué" de cada paso
- Incluye URLs específicas y enlaces útiles

Formato: Guía paso a paso extremadamente detallada, práctica y completa en español. Incluye comandos específicos, URLs de endpoints, explicaciones detalladas y ejemplos completos.`;

  yield* chatStream(prompt, []);
}

/**
 * Análisis inteligente de analytics
 */
export async function* analyticsInsightsStream(
  analyticsData: {
    contractsGenerated?: number;
    usersActive?: number;
    timeSaved?: string;
    deployments?: number;
  },
  question?: string
): AsyncGenerator<string, void, unknown> {
  const dataContext = `
Datos actuales de la plataforma:
- Contratos generados: ${analyticsData.contractsGenerated || 0}
- Usuarios activos: ${analyticsData.usersActive || 0}
- Tiempo ahorrado: ${analyticsData.timeSaved || 'N/A'}
- Deployments realizados: ${analyticsData.deployments || 0}
`;

  const prompt = `Eres un analista de datos experto especializado en plataformas de desarrollo blockchain. 

${dataContext}

${question ? `Consulta específica del usuario: ${question}` : 'Analiza estos datos y proporciona insights valiosos.'}

Proporciona un análisis EXTREMADAMENTE COMPLETO y PROFESIONAL (mínimo 1500 palabras):

1. **Insights Clave**:
   - Insights principales sobre el uso y adopción de la plataforma
   - Métricas destacadas y su significado
   - Indicadores de salud de la plataforma

2. **Análisis de Tendencias**:
   - Tendencias identificadas en los datos
   - Patrones de comportamiento de usuarios
   - Evolución temporal de las métricas

3. **Recomendaciones Específicas**:
   - Recomendaciones de mejora basadas en los datos
   - Acciones prioritarias a tomar
   - Oportunidades de optimización identificadas

4. **Métricas y KPIs**:
   - Métricas importantes a considerar para el crecimiento
   - KPIs recomendados para tracking
   - Benchmarks y objetivos sugeridos

5. **Análisis Comparativo**:
   - Comparación con estándares de la industria
   - Benchmarking con competidores
   - Posicionamiento de la plataforma

6. **Predicciones y Proyecciones**:
   - Predicciones basadas en las tendencias actuales
   - Proyecciones de crecimiento
   - Escenarios posibles

7. **Acciones Recomendadas**:
   - Plan de acción específico para optimizar el rendimiento
   - Priorización de iniciativas
   - Roadmap sugerido

8. **Análisis Profundo**:
   - Análisis de correlaciones entre métricas
   - Identificación de cuellos de botella
   - Oportunidades de mejora técnica

IMPORTANTE:
- El análisis debe ser EXTENSIVO (mínimo 1500 palabras)
- Incluye números, porcentajes y conclusiones específicas
- Proporciona insights accionables
- Estructura con títulos y secciones claras

Formato: Análisis estructurado, extremadamente detallado y profesional en español. Incluye números, porcentajes, gráficos mentales y conclusiones específicas.`;

  yield* chatStream(prompt, []);
}

