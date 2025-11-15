# 🎯 Estrategia de Smart Contracts para sub0 Hackathon

**Fecha**: Noviembre 2025  
**Objetivo**: Maximizar oportunidades de ganar múltiples tracks con contratos inteligentes deployables en testnet

---

## 📊 Resumen Ejecutivo

Para ganar el hackathon, necesitamos desplegar **3 contratos inteligentes estratégicos** en **Paseo Testnet** que demuestren:

1. **Valor del Producto** (Polkadot Main Track - $16k)
2. **Integración con Arkiv** (Arkiv Main Track - $10k)
3. **Cross-Chain con Hyperbridge** (Hyperbridge Bounty - $5k)

**Total Potencial**: $31k en premios

---

## 🎯 Contratos Necesarios

### 1. **DevKit Showcase Contract** (Prioridad ALTA)
**Propósito**: Demostrar el valor de Polkadot DevKit generando un contrato complejo con IA

**Características**:
- Contrato generado usando Polkadot DevKit
- Funcionalidad completa y útil
- Deployado en Paseo Testnet
- Documentación completa del proceso

**Tipo de Contrato**: **DAO Governance con Staking**

**Por qué este contrato**:
- Demuestra que DevKit puede generar contratos complejos
- Muestra valor real (gobernanza + staking)
- Es un caso de uso común en Polkadot
- Fácil de demostrar en el pitch

**Funcionalidades**:
- Creación de propuestas
- Sistema de votación con tokens
- Staking de tokens para votar
- Ejecución de propuestas aprobadas
- Recompensas por participación

**Deployment**:
- Red: **Paseo Testnet**
- RPC: `wss://paseo.rpc.amforc.com`
- Faucet: https://faucet.polkadot.io/ (seleccionar Paseo)
- Explorer: https://paseo.subscan.io/

---

### 2. **Arkiv Data Storage Contract** (Prioridad ALTA)
**Propósito**: Integrar Arkiv SDK para almacenamiento de datos off-chain

**Características**:
- Usa Arkiv SDK (TypeScript) para CRUD operations
- Almacena metadata de contratos en Arkiv
- TTL (Time To Live) para datos temporales
- Subscriptions para updates en tiempo real
- Queries para búsqueda de datos

**Tipo de Contrato**: **Contract Registry con Arkiv Integration**

**Por qué este contrato**:
- Cumple requisitos de Arkiv Main Track
- Demuestra integración real con Arkiv
- Usa múltiples features de Arkiv (CRUD + TTL + Subscriptions)
- Es útil para el marketplace de contratos

**Funcionalidades**:
- Registrar contratos con metadata
- Almacenar metadata en Arkiv (no en-chain)
- TTL para metadata temporal
- Subscriptions para updates
- Queries para búsqueda

**Integración Arkiv**:
```typescript
// Ejemplo de integración
import { Arkiv } from '@arkiv/sdk';

const arkiv = new Arkiv({
  apiKey: process.env.ARKIV_API_KEY,
});

// CRUD operations
await arkiv.create('contract-metadata', {
  contractAddress: '0x...',
  name: 'My Contract',
  description: '...',
  tags: ['defi', 'staking'],
});

// TTL para datos temporales
await arkiv.create('temp-data', {
  expiresAt: Date.now() + 86400000, // 24 horas
  data: {...}
});

// Subscriptions
arkiv.subscribe('contract-updates', (data) => {
  // Handle real-time updates
});
```

**Deployment**:
- Contrato ink! en Paseo Testnet
- Frontend con Arkiv SDK integrado
- Demo funcional con datos reales

---

### 3. **Hyperbridge Cross-Chain Oracle** (Prioridad MEDIA)
**Propósito**: Usar Hyperbridge SDK para cross-chain storage queries

**Características**:
- Usa Hyperbridge SDK para leer storage de otras chains
- Oracle que consulta precios cross-chain
- Verificación de datos desde múltiples chains
- Integración con Ethereum, Polygon, etc.

**Tipo de Contrato**: **Cross-Chain Price Oracle**

**Por qué este contrato**:
- Cumple requisitos de Hyperbridge Bounty
- Demuestra interoperabilidad real
- Caso de uso práctico (oracles cross-chain)
- Fácil de demostrar en el pitch

**Funcionalidades**:
- Consultar precios desde Uniswap (Ethereum)
- Consultar balances desde múltiples chains
- Verificar datos cross-chain
- Agregar datos de múltiples fuentes

**Integración Hyperbridge**:
```typescript
// Ejemplo de integración
import { HyperbridgeSDK } from '@hyperbridge/sdk';

const hyperbridge = new HyperbridgeSDK({
  rpcUrl: process.env.HYPERBRIDGE_RPC,
});

// Cross-chain storage query
const price = await hyperbridge.getStorage({
  chain: 'ethereum',
  contract: '0x...', // Uniswap contract
  slot: '0x...', // Price slot
  height: 'latest',
});

// Verificar datos cross-chain
const verified = await hyperbridge.verifyStorageProof({
  chain: 'ethereum',
  data: price,
  proof: proofData,
});
```

**Deployment**:
- Contrato ink! en Paseo Testnet
- Frontend con Hyperbridge SDK integrado
- Demo funcional con queries reales

---

## 🚀 Plan de Deployment

### Fase 1: Preparación (Día 1 - Viernes 14 Nov)
- [ ] Configurar entorno de desarrollo
- [ ] Obtener tokens de Paseo Testnet (faucet)
- [ ] Configurar Arkiv SDK
- [ ] Configurar Hyperbridge SDK
- [ ] Preparar templates de contratos

### Fase 2: Desarrollo (Día 1-2 - Viernes-Sábado)
- [ ] Generar contrato DAO con DevKit
- [ ] Implementar integración con Arkiv
- [ ] Implementar integración con Hyperbridge
- [ ] Testing local de contratos
- [ ] Preparar frontend para demos

### Fase 3: Deployment (Día 2 - Sábado)
- [ ] Compilar contratos con `cargo +nightly contract build`
- [ ] Deploy contrato 1 (DevKit Showcase) a Paseo
- [ ] Deploy contrato 2 (Arkiv Integration) a Paseo
- [ ] Deploy contrato 3 (Hyperbridge Oracle) a Paseo
- [ ] Verificar contratos en explorador
- [ ] Documentar direcciones de contratos

### Fase 4: Demo y Documentación (Día 3 - Domingo)
- [ ] Crear demos funcionales
- [ ] Grabar videos de demostración
- [ ] Documentar proceso completo
- [ ] Preparar pitch deck
- [ ] Preparar Milestone 2 Plan

---

## 📋 Especificaciones Técnicas

### Redes Disponibles (Noviembre 2025)

#### Paseo Testnet (Recomendado)
- **RPC**: `wss://paseo.rpc.amforc.com`
- **Símbolo**: PAS
- **Decimales**: 10
- **Faucet**: https://faucet.polkadot.io/ (seleccionar Paseo)
- **Explorer**: https://paseo.subscan.io/
- **Tipo**: Testnet (sin valor económico)
- **Propósito**: Desarrollo de parachains y dApps

#### Westend Testnet (Alternativa)
- **RPC**: `wss://westend-rpc.polkadot.io`
- **Símbolo**: WND
- **Decimales**: 12
- **Faucet**: https://faucet.polkadot.io/ (seleccionar Westend)
- **Explorer**: https://westend.subscan.io/
- **Tipo**: Testnet (sin valor económico)
- **Propósito**: Pruebas a nivel de protocolo

### Herramientas de Deployment

#### cargo-contract
```bash
# Instalar cargo-contract
cargo install cargo-contract --force

# Compilar contrato
cargo +nightly contract build

# Generar metadata
cargo +nightly contract generate-metadata

# Deploy (usando Polkadot.js Apps o CLI)
cargo contract instantiate \
  --constructor new \
  --args 1000000 \
  --suri //Alice \
  --url wss://paseo.rpc.amforc.com
```

#### Polkadot.js Apps
1. Navegar a https://polkadot.js.org/apps/
2. Conectar a Paseo: `wss://paseo.rpc.amforc.com`
3. Ir a "Contracts" → "Upload & deploy code"
4. Subir `.contract` file
5. Instanciar contrato

---

## 🎯 Estrategia de Tracks

### Polkadot Main Track ($16k)
**Submission Type**: SHIP-A-TON (working code)

**Requisitos Cumplidos**:
- ✅ Working code deployed to Paseo Testnet
- ✅ Functional prototype demonstrating core features
- ✅ Clear instructions for judges to test
- ✅ Demo URL

**Contratos a Desplegar**:
1. DevKit Showcase Contract (DAO + Staking)
2. Arkiv Data Storage Contract
3. Hyperbridge Cross-Chain Oracle

**Demo**:
- Video de 2-3 minutos mostrando:
  - Generación de contrato con DevKit
  - Deployment a Paseo Testnet
  - Interacción con contratos desplegados
  - Funcionalidades completas

---

### Arkiv Main Track ($10k)
**Requisitos Cumplidos**:
- ✅ Uso de Arkiv SDK (TypeScript)
- ✅ Al menos una feature core: CRUD, TTL, subscriptions, queries
- ✅ Arkiv central a la aplicación
- ✅ Uso de 2+ features de Arkiv

**Contrato**: Arkiv Data Storage Contract

**Features de Arkiv Usadas**:
1. **CRUD**: Create, Read, Update, Delete de metadata
2. **TTL**: Time To Live para datos temporales
3. **Subscriptions**: Updates en tiempo real
4. **Queries**: Búsqueda de contratos

**Demo**:
- Video mostrando:
  - Creación de metadata en Arkiv
  - TTL funcionando
  - Subscriptions en tiempo real
  - Queries de búsqueda

---

### Hyperbridge Bounty ($5k)
**Requisitos Cumplidos**:
- ✅ Uso del Hyperbridge SDK
- ✅ Storage queries cross-chain
- ✅ Funcionalidad testeable
- ✅ Demo video (2-5 min)

**Contrato**: Hyperbridge Cross-Chain Oracle

**Features de Hyperbridge Usadas**:
1. **Storage Queries**: Leer storage de otras chains
2. **Verification**: Verificar datos cross-chain
3. **Multiple Chains**: Ethereum, Polygon, etc.

**Demo**:
- Video mostrando:
  - Query de precio desde Uniswap (Ethereum)
  - Verificación de datos
  - Integración con contrato ink!

---

## 📝 Documentación Requerida

### Para Cada Contrato

1. **README.md** con:
   - Descripción del contrato
   - Funcionalidades
   - Instrucciones de deployment
   - Instrucciones de uso
   - Dirección del contrato en Paseo
   - Enlace al explorador

2. **ABI/Metadata**:
   - Archivo `.contract` compilado
   - Metadata JSON
   - ABI para frontend

3. **Tests**:
   - Unit tests con `drink!`
   - Integration tests
   - Test coverage report

4. **Security**:
   - Security considerations
   - Audit checklist
   - Known limitations

---

## 🎬 Plan de Ejecución

### Timeline del Hackathon

**Viernes 14 Nov (11AM - 11PM)**
- 11AM-12PM: Setup y preparación
- 12PM-2PM: Generar contrato 1 con DevKit
- 2PM-4PM: Implementar integración Arkiv
- 4PM-6PM: Implementar integración Hyperbridge
- 6PM-8PM: Testing y debugging
- 8PM-11PM: Deployment a Paseo Testnet

**Sábado 15 Nov (9AM - 11PM)**
- 9AM-12PM: Completar deployments
- 12PM-2PM: Crear demos funcionales
- 2PM-4PM: Grabar videos de demostración
- 4PM-6PM: Documentación completa
- 6PM-8PM: Preparar pitch deck
- 8PM-11PM: Milestone 2 Plan

**Domingo 16 Nov (9AM - 12PM)**
- 9AM-10AM: Revisión final
- 10AM-11AM: Submit final
- 11AM-12PM: Preparar para pitch

---

## ✅ Checklist Final

### Antes del Hackathon
- [ ] Configurar entorno de desarrollo
- [ ] Instalar herramientas (cargo-contract, etc.)
- [ ] Obtener API keys (Arkiv, Hyperbridge)
- [ ] Preparar templates de contratos
- [ ] Configurar repositorio GitHub

### Durante el Hackathon
- [ ] Generar contrato 1 con DevKit
- [ ] Implementar integración Arkiv
- [ ] Implementar integración Hyperbridge
- [ ] Deploy todos los contratos a Paseo
- [ ] Crear demos funcionales
- [ ] Grabar videos de demostración
- [ ] Documentar todo el proceso

### Antes del Submit
- [ ] Verificar que todos los contratos están deployados
- [ ] Verificar que todos los demos funcionan
- [ ] Verificar que toda la documentación está completa
- [ ] Verificar que el pitch deck está listo
- [ ] Verificar que el Milestone 2 Plan está completo
- [ ] Submit antes de 12PM del domingo

---

## 🎯 Métricas de Éxito

### Para Polkadot Main Track
- ✅ 3 contratos deployados en Paseo Testnet
- ✅ Demo funcional con todas las features
- ✅ Documentación completa
- ✅ Milestone 2 Plan detallado

### Para Arkiv Main Track
- ✅ Arkiv SDK integrado
- ✅ 2+ features de Arkiv usadas
- ✅ Demo funcional con datos reales
- ✅ Documentación de integración

### Para Hyperbridge Bounty
- ✅ Hyperbridge SDK integrado
- ✅ Storage queries cross-chain funcionando
- ✅ Demo funcional con queries reales
- ✅ Documentación de integración

---

## 📚 Recursos Adicionales

### Documentación
- [Polkadot Developer Docs](https://docs.polkadot.com/)
- [ink! Documentation](https://use.ink/)
- [Arkiv SDK Docs](http://sl.sub0.gg/lBr7n)
- [Hyperbridge SDK Docs](http://sl.sub0.gg/xdKkU)

### Herramientas
- [Polkadot.js Apps](https://polkadot.js.org/apps/)
- [Paseo Subscan](https://paseo.subscan.io/)
- [Faucet Polkadot](https://faucet.polkadot.io/)

### Comunidad
- [Polkadot Discord](https://discord.gg/polkadot)
- [sub0 Discord](https://discord.gg/sub0)
- [Arkiv Discord](https://discord.gg/arkiv)
- [Hyperbridge Discord](https://discord.gg/hyperbridge)

---

**Última actualización**: Noviembre 2025  
**Estado**: Listo para implementación

