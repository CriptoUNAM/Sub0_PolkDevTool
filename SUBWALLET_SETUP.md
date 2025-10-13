# 🔗 Integración Real con SubWallet - Octubre 2025

## 📋 Resumen

Este documento describe la integración **REAL** (no simulada) de SubWallet con Polkadot DevKit para el desarrollo de contratos inteligentes en Polkadot. La conexión es completamente funcional y permite transacciones reales en Paseo Testnet.

## 🚀 Instalación de SubWallet

### 1. Descargar SubWallet

- **Sitio oficial**: [subwallet.app](https://subwallet.app/)
- **Navegadores soportados**: Chrome, Firefox, Edge, Safari
- **Versión recomendada**: 1.0.0 o superior

### 2. Instalación paso a paso

1. Visita [subwallet.app](https://subwallet.app/)
2. Haz clic en "Download" o "Get Started"
3. Selecciona tu navegador (Chrome, Firefox, etc.)
4. Sigue las instrucciones de instalación
5. Reinicia tu navegador después de la instalación

## 🔧 Configuración inicial

### 1. Crear una nueva cuenta

1. Abre SubWallet desde la barra de extensiones
2. Haz clic en "Create Account"
3. Elige un nombre para tu cuenta
4. Guarda tu frase semilla de 12 palabras de forma segura
5. Confirma tu frase semilla
6. Establece una contraseña para SubWallet

### 2. Verificar conexión real

La integración ahora incluye:
- ✅ **Conexión real** a SubWallet
- ✅ **Firma real** de transacciones
- ✅ **Consulta real** de balances
- ✅ **Transacciones reales** en Paseo Testnet
- ✅ **Detección automática** de SubWallet
- ✅ **Manejo de errores** específicos

### 2. Importar cuenta existente (opcional)

1. Haz clic en "Import Account"
2. Selecciona el método de importación:
   - **Frase semilla**: Ingresa tu frase de 12 palabras
   - **JSON**: Sube tu archivo JSON de Polkadot.js
   - **Private Key**: Ingresa tu clave privada
3. Confirma la importación

## 🌐 Configuración de redes

### 1. Agregar Paseo Testnet

1. En SubWallet, ve a "Settings" > "Networks"
2. Haz clic en "Add Network"
3. Busca "Paseo" o ingresa manualmente:
   - **Nombre**: Paseo Testnet
   - **RPC URL**: `wss://paseo.rpc.amforc.com`
   - **Explorer**: `https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com`

### 2. Configurar Polkadot Mainnet

1. Asegúrate de que Polkadot Mainnet esté habilitada
2. Verifica que la RPC URL sea: `wss://rpc.polkadot.io`

## 💰 Obtener tokens de testnet

### 1. Faucet de Paseo Testnet

1. Ve a [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com)
2. Conecta tu wallet de SubWallet
3. Ve a "Accounts" > "Faucet"
4. Solicita tokens PASE para testing

### 2. Tokens necesarios

- **PASE (Paseo Testnet)**: Mínimo 1 PASE para deployment
- **DOT (Mainnet)**: Para deployment en producción

## 🔗 Conexión con Polkadot DevKit

### 1. Verificar conexión

1. Abre Polkadot DevKit en tu navegador
2. Haz clic en "Conectar SubWallet"
3. SubWallet debería abrirse automáticamente
4. Selecciona la cuenta que deseas usar
5. Autoriza la conexión

### 2. Estados de conexión

- **🔵 SubWallet detectada**: La extensión está instalada
- **🟢 Conectada**: SubWallet está conectada y lista para usar
- **🟡 No conectada**: SubWallet está instalada pero no conectada
- **🔴 No detectada**: SubWallet no está instalada

## 🛠️ Desarrollo con SubWallet - Integración Real

### 1. Funciones reales implementadas

```typescript
// Conexión real a SubWallet
const { isConnected, account, getBalance, signTransaction, sendTransaction } = useWallet();

// Obtener balance real
const balance = await getBalance();
console.log('Balance real:', balance);

// Firmar transacción real
const signature = await signTransaction(transactionData);
console.log('Firma real:', signature);

// Enviar transacción real
const txHash = await sendTransaction(toAddress, amount);
console.log('Hash de transacción real:', txHash);
```

### 2. Servicio SubWallet completo

```typescript
import { subWalletService } from '@/lib/polkadot/subwallet';

// Obtener cuentas de SubWallet
const accounts = await subWalletService.getSubWalletAccounts();

// Conectar cuenta específica
await subWalletService.connectAccount(accountAddress);

// Obtener signer real
const signer = await subWalletService.getSigner(accountAddress);

// Desplegar contrato real
const contractAddress = await subWalletService.deployContract(
  fromAddress,
  contractCode,
  endowment,
  gasLimit
);
```

### 2. Deployment de contratos

1. **Preparar contrato**: Compila tu código ink! a WASM
2. **Subir código**: Sube el código WASM a la blockchain
3. **Instanciar**: Crea una instancia del contrato
4. **Verificar**: Confirma el deployment en el explorer

## 🔒 Seguridad

### 1. Mejores prácticas

- **Nunca compartas tu frase semilla**
- **Usa contraseñas fuertes**
- **Mantén SubWallet actualizada**
- **Verifica siempre las transacciones antes de firmar**

### 2. Configuración de seguridad

1. **Habilitar autolock**: Configura el tiempo de bloqueo automático
2. **Verificación de transacciones**: Siempre revisa los detalles
3. **Redes de confianza**: Solo usa redes oficiales

## 🐛 Solución de problemas

### 1. SubWallet no se detecta

- Verifica que la extensión esté instalada
- Reinicia el navegador
- Verifica que SubWallet esté habilitada
- Comprueba que no haya bloqueadores de anuncios interfiriendo

### 2. Error de conexión

- Verifica que SubWallet esté desbloqueada
- Asegúrate de que la cuenta esté seleccionada
- Revisa los permisos de la extensión
- Intenta desconectar y volver a conectar

### 3. Transacciones fallidas

- Verifica que tengas suficientes tokens
- Comprueba que la red esté configurada correctamente
- Revisa el gas limit y storage deposit
- Verifica que el contrato sea válido

## 📚 Recursos adicionales

### 1. Documentación oficial

- [SubWallet Docs](https://docs.subwallet.app/)
- [Polkadot.js Extension](https://polkadot.js.org/extension/)
- [Paseo Testnet](https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com)

### 2. Comunidad

- [SubWallet Discord](https://discord.gg/subwallet)
- [Polkadot Discord](https://discord.gg/polkadot)
- [Polkadot Forum](https://forum.polkadot.network/)

### 3. Herramientas

- [Polkadot.js Apps](https://polkadot.js.org/apps/)
- [Substrate Contracts UI](https://contracts-ui.substrate.io/)
- [Polkadot Explorer](https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com#/explorer)

## 🎯 Próximos pasos

1. **Instala SubWallet** siguiendo los pasos de instalación
2. **Configura las redes** necesarias para desarrollo
3. **Obtén tokens de testnet** desde el faucet
4. **Conecta SubWallet** a Polkadot DevKit
5. **Comienza a desarrollar** contratos inteligentes

---

**Desarrollado para LATIN HACK 2024** - Polkadot DevKit con integración completa de SubWallet
