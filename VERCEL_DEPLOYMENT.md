# 🚀 Despliegue en Vercel - Polkadot DevKit

## Configuración de Variables de Entorno

Para desplegar correctamente en Vercel, configura las siguientes variables de entorno en el dashboard de Vercel:

### Variables Requeridas (Opcionales)
```
OPENAI_API_KEY=tu_clave_openai_aqui
GROQ_API_KEY=tu_clave_groq_aqui  
CONTEXT7_API_KEY=tu_clave_context7_aqui
```

### Variables Públicas (Configuradas Automáticamente)
```
NEXT_PUBLIC_PASEO_RPC=wss://paseo.rpc.amforc.com
NEXT_PUBLIC_ROCCO_RPC=wss://rococo-rpc.polkadot.io
NEXT_PUBLIC_WESTEND_RPC=wss://westend-rpc.polkadot.io
```

## Pasos para Desplegar

1. **Conectar Repositorio:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa el repositorio `Vaios0x/PolkadotDevKit`
   - Selecciona el framework: **Next.js**

2. **Configurar Variables de Entorno:**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega las variables opcionales si tienes las claves API
   - Las variables públicas se configuran automáticamente

3. **Desplegar:**
   - Vercel detectará automáticamente la configuración
   - El proyecto se desplegará en unos minutos
   - URL de producción estará disponible

## Características del Proyecto

- ✅ **PWA Ready** - Instalable como app móvil
- ✅ **SubWallet Integration** - Conexión real a Polkadot
- ✅ **AI Contract Generation** - Generación con IA
- ✅ **Learning Hub** - Centro de aprendizaje
- ✅ **LatinHack 2025** - Proyecto especializado

## Funcionalidades sin Variables de Entorno

El proyecto funciona completamente sin variables de entorno:
- Modo demo para generación de contratos
- Conexión a SubWallet
- Centro de aprendizaje
- Navegación completa

## Soporte

Para problemas de despliegue, revisa:
- Logs de build en Vercel
- Variables de entorno configuradas
- Configuración de Next.js

---
**Proyecto desarrollado para LatinHack 2025** 🎉
