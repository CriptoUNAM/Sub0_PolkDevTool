import { CONTRACT_TYPES, COMPLEXITY_LEVELS } from './openai';

export function buildGenerationPrompt(
  userPrompt: string,
  contractType: string,
  complexity?: string,
  features?: string[]
): string {
  const basePrompt = `
Genera un contrato ink! ${CONTRACT_TYPES[contractType as keyof typeof CONTRACT_TYPES]} basado en la siguiente descripción:

"${userPrompt}"

Requisitos:
- Usar ink! 5.0 syntax
- Incluir todas las importaciones necesarias
- Implementar manejo de errores robusto
- Agregar eventos para transparencia
- Optimizar para gas
- Seguir mejores prácticas de seguridad
`;

  if (complexity) {
    const complexityDesc = COMPLEXITY_LEVELS[complexity as keyof typeof COMPLEXITY_LEVELS];
    return `${basePrompt}\n\nNivel de complejidad: ${complexityDesc}`;
  }

  if (features && features.length > 0) {
    return `${basePrompt}\n\nCaracterísticas específicas requeridas: ${features.join(', ')}`;
  }

  return basePrompt;
}

export function buildExplanationPrompt(
  code: string,
  focus: 'general' | 'security' | 'optimization' | 'deployment' = 'general'
): string {
  const focusPrompts = {
    general: 'Explica el código de manera general, cubriendo la funcionalidad principal',
    security: 'Enfócate en aspectos de seguridad, vulnerabilidades potenciales y mejores prácticas',
    optimization: 'Analiza optimizaciones de gas, eficiencia de almacenamiento y rendimiento',
    deployment: 'Explica el proceso de deployment, configuración y consideraciones de red'
  };

  return `
${focusPrompts[focus]}

Código a analizar:
\`\`\`rust
${code}
\`\`\`

Proporciona:
1. Explicación general del contrato
2. Desglose línea por línea de las funciones principales
3. Definición de conceptos clave
4. Consideraciones de seguridad
5. Consejos de optimización
`;
}

export function buildDebugPrompt(
  errorMessage: string,
  code?: string,
  context?: string
): string {
  let prompt = `
Analiza el siguiente error de compilación de Substrate/ink!:

Error: ${errorMessage}
`;

  if (code) {
    prompt += `\n\nCódigo relacionado:\n\`\`\`rust\n${code}\n\`\`\``;
  }

  if (context) {
    prompt += `\n\nContexto adicional: ${context}`;
  }

  prompt += `

Proporciona:
1. Explicación del error en términos simples
2. Causa raíz del problema
3. Solución sugerida con código de ejemplo
4. Enlaces a documentación relevante
5. Consejos para prevenir errores similares
`;

  return prompt;
}
