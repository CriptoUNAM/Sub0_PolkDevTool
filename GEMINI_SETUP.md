# 🚀 Configuración de Google Gemini AI

## ✅ **Integración Completa**

El proyecto ahora usa **Google Gemini** como motor de IA principal para todas las funcionalidades:

- ✅ **Generación de Contratos** (`/generate`)
- ✅ **Explicación de Código** (`/explain`)
- ✅ **Debug de Errores** (`/debug`)
- ✅ **Chatbot Asistente** (`/chatbot`)

## 🔑 **API Key Configurada**

La API key de Gemini ya está configurada:
```
GEMINI_API_KEY=AIzaSyDzPXgWvCgFvAqRAOmaYAglmdYUk2An0cA
```

## 📁 **Estructura de Archivos**

```
lib/
  ├── ai/
  │   └── gemini.ts          # Helper con funciones de streaming
  └── api-client.ts          # Cliente para llamadas desde el frontend

app/
  └── api/
      ├── generate/route.ts  # API para generar contratos
      ├── explain/route.ts   # API para explicar código
      ├── debug/route.ts     # API para debug
      └── chat/route.ts      # API para chatbot
```

## 🎯 **Modelos Utilizados (Actualizado Nov 2025)**

- **gemini-2.5-flash**: Para generación rápida de código y debug (más rápido y eficiente)
- **gemini-2.5-pro**: Para explicaciones detalladas y chat (más inteligente y preciso)
- **gemini-2.5-flash-lite**: Versión ligera y económica
- **Fallback**: gemini-1.5-flash, gemini-1.5-pro, gemini-pro (modelos legacy)

## 🔧 **Cómo Funciona**

### Arquitectura Next.js como Backend

1. **Cliente (Frontend)**: Los componentes llaman a `lib/api-client.ts`
2. **Rutas API (Backend)**: Las rutas en `app/api/` procesan las solicitudes
3. **Helper Gemini**: `lib/ai/gemini.ts` se comunica con la API de Google
4. **Streaming**: Las respuestas se envían en tiempo real usando Server-Sent Events

### Ejemplo de Flujo

```
Usuario → Componente React → api-client.ts → /api/generate → gemini.ts → Google Gemini API
                                                                    ↓
Usuario ← Componente React ← api-client.ts ← /api/generate ← gemini.ts ← Respuesta Streaming
```

## ✅ **Ventajas de esta Arquitectura**

- ✅ **Seguridad**: API key solo en el servidor (no expuesta al cliente)
- ✅ **Streaming**: Respuestas en tiempo real
- ✅ **Escalable**: Next.js maneja automáticamente
- ✅ **Sin Backend Separado**: Todo en Next.js
- ✅ **Validación**: Input validation en cada endpoint
- ✅ **Manejo de Errores**: Robusto en todos los niveles

## 🚀 **Uso**

### Generar Contrato

```typescript
import { generateContract } from '@/lib/api-client';

for await (const chunk of generateContract({
  prompt: 'Crear un contrato de staking',
  contractType: 'Staking',
  complexity: 'media',
  features: ['rewards', 'withdrawal']
})) {
  console.log(chunk); // Chunks de código en tiempo real
}
```

### Explicar Código

```typescript
import { explainCode } from '@/lib/api-client';

for await (const chunk of explainCode({
  code: '...código rust...',
  focus: 'security'
})) {
  console.log(chunk); // Explicación en tiempo real
}
```

### Debug

```typescript
import { debugError } from '@/lib/api-client';

for await (const chunk of debugError({
  errorMessage: 'Error de compilación',
  code: '...código...',
  context: 'Contexto adicional'
})) {
  console.log(chunk); // Solución en tiempo real
}
```

### Chat

```typescript
import { chat } from '@/lib/api-client';

for await (const chunk of chat({
  message: '¿Cómo funciona ink!?',
  history: [] // Historial de conversación
})) {
  console.log(chunk); // Respuesta en tiempo real
}
```

## 🔒 **Seguridad**

- ✅ API key almacenada en `.env.local` (no en git)
- ✅ Variables de entorno sin `NEXT_PUBLIC_` (no expuestas al cliente)
- ✅ Validación de entrada en todos los endpoints
- ✅ Timeouts configurados (60 segundos máximo)
- ✅ Manejo de errores robusto

## 📝 **Notas**

- Las rutas API corren en el servidor (Node.js runtime)
- El streaming usa Server-Sent Events (SSE)
- Los componentes del cliente usan async generators para recibir chunks
- La API key está configurada y lista para usar

## 🎉 **¡Listo para Usar!**

La integración está completa y funcionando. Solo necesitas:

1. ✅ API key configurada (ya está)
2. ✅ SDK instalado (`@google/generative-ai`)
3. ✅ Rutas API creadas
4. ✅ Componentes actualizados

¡Disfruta de la IA de Gemini en tu proyecto! 🚀

