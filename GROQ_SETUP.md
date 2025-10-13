# 🚀 Configuración de Groq (IA Gratuita)

## ✅ **Ventajas de Groq:**
- **100% Gratuito** para hackathons
- **Muy rápido** (hasta 10x más rápido que OpenAI)
- **Modelos Llama 3** (8B y 70B parámetros)
- **Sin límites estrictos** para desarrollo
- **API simple** y confiable

## 🔑 **Obtener API Key Gratuita:**

### **Paso 1: Registrarse**
1. Ve a [https://console.groq.com/](https://console.groq.com/)
2. Haz clic en "Sign Up" 
3. Registra con tu email o GitHub

### **Paso 2: Crear API Key**
1. Una vez logueado, ve a "API Keys"
2. Haz clic en "Create API Key"
3. Dale un nombre como "Polkadot DevKit"
4. Copia la key (empieza con `gsk_`)

### **Paso 3: Configurar en el Proyecto**
1. Abre el archivo `.env.local`
2. Reemplaza `gsk_your_free_groq_key_here` con tu API key real
3. Guarda el archivo

## 🎯 **Modelos Disponibles:**

### **Llama 3 8B (Recomendado para demos)**
- **Velocidad**: ⚡⚡⚡⚡⚡ (Muy rápido)
- **Calidad**: ⭐⭐⭐⭐ (Muy buena)
- **Uso**: Generación de contratos, explicaciones

### **Llama 3 70B (Para casos complejos)**
- **Velocidad**: ⚡⚡⚡ (Rápido)
- **Calidad**: ⭐⭐⭐⭐⭐ (Excelente)
- **Uso**: Análisis complejos, debugging avanzado

## 🚀 **Probar la Configuración:**

1. **Reinicia el servidor**:
   ```bash
   pnpm dev
   ```

2. **Ve a** `http://localhost:3000/generate`

3. **Escribe un prompt** como: "Crear un contrato de staking"

4. **¡Deberías ver la IA generando código en tiempo real!**

## 💡 **Tips para Hackathons:**

- **Groq es perfecto** para demos en vivo
- **Respuestas instantáneas** impresionan a los jueces
- **Sin costos** durante el desarrollo
- **Muy confiable** para presentaciones

## 🔧 **Si tienes problemas:**

1. **Verifica la API key** en `.env.local`
2. **Reinicia el servidor** después de cambios
3. **Revisa la consola** para errores
4. **Usa el modo fallback** si Groq falla

¡Con Groq tendrás IA gratuita y súper rápida para tu hackathon! 🏆
