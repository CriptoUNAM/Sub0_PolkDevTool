# 🔍 Diagnóstico: Error "No se recibió código de la API"

## ✅ Mejoras Implementadas

### 1. **Logging Mejorado en `/api/generate`**
- ✅ Logs detallados al inicio del stream
- ✅ Información sobre API key (sin exponer el valor)
- ✅ Contador de chunks recibidos
- ✅ Duración del proceso
- ✅ Captura de errores específicos de Gemini API

### 2. **Manejo de Errores Específicos**
- ✅ **401/403**: Error de autenticación → Mensaje claro al usuario
- ✅ **429**: Cuota excedida → Mensaje informativo
- ✅ **400**: Solicitud inválida → Mensaje de validación
- ✅ **Otros errores**: Mensaje genérico con detalles en logs

### 3. **Mensajes de Error Mejorados**
- ✅ Información sobre chunks recibidos
- ✅ Instrucciones claras para el usuario
- ✅ Referencias a logs del servidor

---

## 🔍 Cómo Diagnosticar en Producción

### Paso 1: Verificar Variables de Entorno

```bash
# Verificar que GEMINI_API_KEY esté configurada
vercel env ls

# Deberías ver:
# GEMINI_API_KEY    Encrypted    Production
```

### Paso 2: Revisar Logs de Vercel

**Opción A: Dashboard de Vercel**
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `polkadot-dev-kit`
3. Ve a la pestaña **"Logs"**
4. Busca logs con el prefijo `[API Generate]`

**Opción B: CLI de Vercel**
```bash
# Ver logs del último despliegue
vercel logs <deployment-url>

# Ejemplo:
vercel logs polkadot-dev-73wuxk3j3-vai0sxs-projects.vercel.app
```

### Paso 3: Buscar Errores Específicos

En los logs, busca:

#### ✅ **Si ves esto (éxito):**
```
[API Generate] Iniciando stream de Gemini...
[API Generate] Chunk 1 recibido (50 chars): ...
[API Generate] Stream completado. Total chunks: 10, HasData: true
```
→ **El problema está en el cliente, no en el servidor**

#### ❌ **Si ves esto (error de API key):**
```
[API Generate] Error en el stream de Gemini: { code: 401, message: "API key not valid" }
```
→ **Solución:** Verifica que `GEMINI_API_KEY` sea válida

#### ❌ **Si ves esto (cuota excedida):**
```
[API Generate] Error en el stream de Gemini: { code: 429, message: "Quota exceeded" }
```
→ **Solución:** Espera unos minutos o verifica tu cuota en Google Cloud Console

#### ❌ **Si ves esto (sin datos):**
```
[API Generate] ⚠️ No se recibió ningún chunk de Gemini
```
→ **Posibles causas:**
1. El modelo no generó contenido (prompt muy corto o inválido)
2. Problema de conexión con Gemini API
3. API key inválida o sin permisos

---

## 🛠️ Soluciones Comunes

### Problema 1: API Key No Configurada

**Síntoma:** Error 401 o mensaje "GEMINI_API_KEY no configurada"

**Solución:**
```bash
# Agregar API key en Vercel
echo "tu-api-key-aqui" | vercel env add GEMINI_API_KEY production
```

### Problema 2: API Key Inválida

**Síntoma:** Error 401 o 403 en logs

**Solución:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Verifica que la API key tenga acceso a Gemini API
3. Verifica que la API key no esté restringida
4. Regenera la API key si es necesario

### Problema 3: Cuota Excedida

**Síntoma:** Error 429 en logs

**Solución:**
1. Espera unos minutos
2. Verifica tu cuota en Google Cloud Console
3. Considera actualizar tu plan si es necesario

### Problema 4: Stream Completa Sin Datos

**Síntoma:** `HasData: false` en logs, pero sin errores

**Posibles causas:**
1. **Prompt muy corto o inválido**
   - Solución: Asegúrate de que el prompt tenga al menos 10 caracteres
   
2. **Modelo no disponible**
   - Solución: Verifica que `gemini-2.5-flash` esté disponible con tu API key
   - Puedes usar `/api/check-models` para verificar

3. **Problema de red**
   - Solución: Verifica la conectividad del servidor de Vercel

---

## 📊 Información de Diagnóstico en Logs

Los logs ahora incluyen:

```javascript
{
  promptLength: 123,           // Longitud del prompt
  contractType: "General",     // Tipo de contrato
  complexity: "media",         // Complejidad
  language: "ink",            // Lenguaje
  hasApiKey: true,            // Si hay API key
  apiKeyLength: 41,           // Longitud de la API key (sin exponer valor)
  chunkCount: 10,             // Chunks recibidos
  hasData: true,              // Si se recibió data
  duration: 5000              // Duración en ms
}
```

---

## 🧪 Prueba Rápida

Para probar si la API funciona:

1. **Verificar modelos disponibles:**
   ```bash
   curl -X POST https://tu-dominio.vercel.app/api/check-models
   ```

2. **Probar generación simple:**
   - Ve a `/generate` en tu app
   - Ingresa un prompt simple: "Token ERC-20 básico"
   - Revisa los logs en Vercel

---

## 📝 Checklist de Verificación

- [ ] `GEMINI_API_KEY` configurada en Vercel (Production)
- [ ] API key válida y con permisos en Google Cloud Console
- [ ] Cuota de API no excedida
- [ ] Logs muestran que el stream se inicia correctamente
- [ ] No hay errores 401, 403, o 429 en los logs
- [ ] El prompt tiene al menos 10 caracteres
- [ ] El modelo `gemini-2.5-flash` está disponible

---

## 🔗 Enlaces Útiles

- [Dashboard de Vercel](https://vercel.com/dashboard)
- [Google Cloud Console - API Keys](https://console.cloud.google.com/apis/credentials)
- [Documentación de Gemini API](https://ai.google.dev/docs)
- [Logs de Vercel](https://vercel.com/docs/monitoring/logs)

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0

