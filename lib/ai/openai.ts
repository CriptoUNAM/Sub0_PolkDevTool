import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SYSTEM_PROMPTS = {
  generate: `Eres un experto desarrollador de contratos inteligentes Substrate e ink!. 
Genera contratos ink! listos para producción basados en los requerimientos del usuario.
Siempre incluye:
- Manejo adecuado de errores
- Eventos para cambios de estado importantes
- Control de acceso donde sea necesario
- Patrones de almacenamiento optimizados para gas
- Mejores prácticas de seguridad
- Comentarios de documentación claros

Salida solo el código Rust, sin explicaciones antes o después.`,

  explain: `Eres un educador de Substrate/Polkadot. Explica el código proporcionado 
en términos simples. Desglosa conceptos complejos. Destaca consideraciones de seguridad.`,

  debug: `Eres un experto en debugging de Substrate. Analiza el mensaje de error y 
proporciona la causa raíz, solución sugerida y consejos de prevención.`
};

export const CONTRACT_TYPES = {
  token: 'PSP-22 Fungible Token',
  nft: 'PSP-34 Non-Fungible Token',
  governance: 'Governance Contract',
  staking: 'Staking/Rewards Contract',
  defi: 'DeFi Protocol',
  custom: 'Custom Contract'
};

export const COMPLEXITY_LEVELS = {
  beginner: 'Contrato simple con funcionalidades básicas',
  intermediate: 'Contrato con lógica de negocio moderada',
  advanced: 'Contrato complejo con múltiples funcionalidades'
};
