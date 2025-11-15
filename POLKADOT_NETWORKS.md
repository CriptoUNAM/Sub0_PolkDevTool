# 🌐 Redes de Polkadot - Información Actualizada (Noviembre 2025)

Este documento contiene información actualizada sobre las redes de Polkadot para despliegue y desarrollo.

## 📋 Índice

1. [Paseo Testnet](#paseo-testnet)
2. [Westend Testnet](#westend-testnet)
3. [Polkadot Mainnet](#polkadot-mainnet)

---

## 🚀 Paseo Testnet

### Descripción
Paseo es una testnet descentralizada y gestionada por la comunidad, diseñada para desarrolladores de parachains y aplicaciones descentralizadas (dApps) en el ecosistema de Polkadot. A diferencia de Westend, Paseo no está destinada para pruebas a nivel de protocolo.

### Información de Red

- **Nombre**: Paseo Testnet
- **Símbolo de la moneda**: PAS
- **Decimales de la moneda**: 10
- **Tipo**: Testnet (sin valor económico)
- **Propósito**: Desarrollo de parachains y dApps

### Endpoints RPC

**Endpoints WebSocket (WSS) recomendados:**

1. `wss://paseo.rpc.amforc.com` ✅ (Tu endpoint actual - correcto)
2. `wss://paseo-rpc.dwellir.com`
3. `wss://rpc.ibp.network/paseo`
4. `wss://paseo.dotters.network`
5. `wss://pas-rpc.stakeworld.io`

**Recomendación**: El endpoint `wss://paseo.rpc.amforc.com` que estás usando es válido y funcional.

### Exploradores de Bloques

- **Polkadot.js Apps**: https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com
- **Paseo Subscan**: https://paseo.subscan.io/

### Faucet

- **Faucet oficial**: https://faucet.polkadot.io/ (seleccionar "Polkadot testnet (Paseo)" en el selector de red)

### Recursos Adicionales

- **Sitio oficial**: https://www.paseo.site/
- **Documentación**: https://docs.polkadot.com/develop/networks

### Configuración para Polkadot.js Apps

Para conectar a Paseo utilizando Polkadot.js Apps:

1. Navega a [Polkadot.js Apps](https://polkadot.js.org/apps/)
2. Haz clic en el selector de red en la esquina superior izquierda
3. Selecciona "Desarrollo" → "Personalizado"
4. Ingresa la URL WebSocket: `wss://paseo.rpc.amforc.com`
5. Haz clic en "Cambiar" para conectar

---

## 🧪 Westend Testnet

### Descripción
Westend es la testnet principal que refleja la funcionalidad de Polkadot para el desarrollo de características a nivel de protocolo. El token nativo WND no tiene valor económico.

### Información de Red

- **Nombre**: Westend Testnet
- **Símbolo de la moneda**: WND
- **Decimales de la moneda**: 12
- **Tipo**: Testnet (sin valor económico)
- **Propósito**: Pruebas a nivel de protocolo y desarrollo de características

### Endpoints RPC

**Endpoints WebSocket (WSS) recomendados:**

1. `wss://westend-rpc.polkadot.io` ✅ (Oficial)
2. `wss://westend-rpc.dwellir.com`
3. `wss://rpc.ibp.network/westend`
4. `wss://westend.dotters.network`
5. `wss://westend.api.onfinality.io/public-ws`
6. `light://substrate-connect/westend` (Light client)

**Recomendación**: Usar `wss://westend-rpc.polkadot.io` como endpoint principal (oficial).

### Exploradores de Bloques

- **Polkadot.js Apps**: https://polkadot.js.org/apps/?rpc=wss://westend-rpc.polkadot.io
- **Westend Subscan**: https://westend.subscan.io/

### Faucet

- **Faucet oficial**: https://faucet.polkadot.io/ (seleccionar "Westend" en el selector de red)

### Configuración para Polkadot.js Apps

Para conectar a Westend utilizando Polkadot.js Apps:

1. Navega a [Polkadot.js Apps](https://polkadot.js.org/apps/)
2. Haz clic en el selector de red en la esquina superior izquierda
3. Selecciona "Westend" de la lista de redes disponibles

---

## ⚡ Polkadot Mainnet

### Descripción
Polkadot es la red blockchain de producción principal para aplicaciones de alto nivel y grado empresarial. Ha estado operativa desde mayo de 2020 y cuenta con implementaciones en varios lenguajes de programación.

### Información de Red

- **Nombre**: Polkadot Mainnet
- **Símbolo de la moneda**: DOT
- **Decimales de la moneda**: 10
- **Tipo**: Mainnet (producción)
- **Propósito**: Aplicaciones de producción y grado empresarial
- **Lanzamiento**: Mayo 2020

### Endpoints RPC

**Endpoints WebSocket (WSS) recomendados:**

1. `wss://rpc.polkadot.io` ✅ (Oficial - principal)
2. `wss://polkadot-rpc.dwellir.com`
3. `wss://rpc.ibp.network/polkadot`
4. `wss://polkadot.api.onfinality.io/public-ws`

**Endpoints HTTP (HTTPS) disponibles:**

1. `https://rpc.polkadot.io` ✅ (Oficial)

**Recomendación**: Usar `wss://rpc.polkadot.io` como endpoint principal (oficial).

### Exploradores de Bloques

- **Polkadot.js Apps**: https://polkadot.js.org/apps/?rpc=wss://rpc.polkadot.io
- **Polkadot Subscan**: https://polkadot.subscan.io/

### Configuración para Polkadot.js Apps

Para conectar a Polkadot Mainnet utilizando Polkadot.js Apps:

1. Navega a [Polkadot.js Apps](https://polkadot.js.org/apps/)
2. Haz clic en el selector de red en la esquina superior izquierda
3. Selecciona "Polkadot" de la lista de redes disponibles

---

## 📊 Comparación de Redes

| Característica | Paseo Testnet | Westend Testnet | Polkadot Mainnet |
|---------------|---------------|-----------------|------------------|
| **Tipo** | Testnet | Testnet | Mainnet |
| **Símbolo** | PAS | WND | DOT |
| **Decimales** | 10 | 12 | 10 |
| **Valor Económico** | ❌ No | ❌ No | ✅ Sí |
| **Propósito** | Parachains/dApps | Protocolo | Producción |
| **RPC Oficial** | `wss://paseo.rpc.amforc.com` | `wss://westend-rpc.polkadot.io` | `wss://rpc.polkadot.io` |
| **Explorador** | Paseo Subscan | Westend Subscan | Polkadot Subscan |
| **Faucet** | ✅ Disponible | ✅ Disponible | ❌ No aplica |

---

## 🔧 Configuración Recomendada para Desarrollo

### Variables de Entorno

```env
# Polkadot RPC Endpoints
NEXT_PUBLIC_PASEO_RPC=wss://paseo.rpc.amforc.com
NEXT_PUBLIC_WESTEND_RPC=wss://westend-rpc.polkadot.io
NEXT_PUBLIC_POLKADOT_RPC=wss://rpc.polkadot.io
```

### Orden de Desarrollo Recomendado

1. **Desarrollo inicial**: Usar **Paseo Testnet** para pruebas de parachains y dApps
2. **Pruebas de protocolo**: Usar **Westend Testnet** para características a nivel de protocolo
3. **Producción**: Desplegar en **Polkadot Mainnet** solo después de pruebas exhaustivas

---

## 🔗 Enlaces Útiles

### Documentación Oficial
- [Polkadot Developer Docs - Networks](https://docs.polkadot.com/develop/networks)
- [Polkadot.js Apps](https://polkadot.js.org/apps/)

### Exploradores
- [Polkadot Subscan](https://polkadot.subscan.io/)
- [Paseo Subscan](https://paseo.subscan.io/)
- [Westend Subscan](https://westend.subscan.io/)

### Faucet
- [Faucet Oficial de Polkadot](https://faucet.polkadot.io/) - Soporta Paseo y Westend (seleccionar la red en el dropdown)

### Redes
- [Paseo Network](https://www.paseo.site/)
- [Polkadot Network](https://polkadot.network/)

---

## ⚠️ Notas Importantes

1. **Endpoints RPC**: Los endpoints pueden actualizarse con el tiempo. Es recomendable consultar las fuentes oficiales para obtener la información más reciente.

2. **Seguridad**: Siempre utiliza endpoints RPC proporcionados por fuentes oficiales o reconocidas para garantizar la seguridad y estabilidad de tus desarrollos.

3. **Testnets**: Los tokens de testnet (PAS, WND) no tienen valor económico y son solo para pruebas.

4. **Mainnet**: Polkadot Mainnet utiliza tokens DOT reales con valor económico. Usa con precaución.

5. **Actualización**: Esta información está actualizada a noviembre de 2025. Consulta la documentación oficial para actualizaciones futuras.

---

## ✅ Verificación de tu Configuración Actual

Tu configuración actual para **Paseo Testnet** es **CORRECTA**:

- ✅ **RPC**: `wss://paseo.rpc.amforc.com` - Válido y funcional
- ✅ **Explorer**: `https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com` - Correcto

Puedes continuar usando esta configuración sin problemas.

---

**Última actualización**: Noviembre 2025
**Fuente**: Documentación oficial de Polkadot y búsquedas actualizadas

