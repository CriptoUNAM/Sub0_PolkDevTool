# 📦 Smart Contracts para sub0 Hackathon

Este directorio contiene los 3 contratos inteligentes estratégicos para maximizar las oportunidades en el hackathon.

---

## 🎯 Contratos Incluidos

### 1. DevKit Showcase Contract (`devkit-showcase/`)
**Propósito**: Demostrar el valor de Polkadot DevKit

**Funcionalidades**:
- DAO Governance con propuestas y votación
- Staking de tokens con recompensas
- Sistema completo de gobernanza

**Track**: Polkadot Main Track ($16k)

---

### 2. Arkiv Data Storage Contract (`arkiv-storage/`)
**Propósito**: Integrar Arkiv SDK para almacenamiento off-chain

**Funcionalidades**:
- Registro de contratos con metadata
- Integración con Arkiv SDK (off-chain)
- TTL para datos temporales
- Subscriptions y queries

**Track**: Arkiv Main Track ($10k)

---

### 3. Hyperbridge Cross-Chain Oracle (`hyperbridge-oracle/`)
**Propósito**: Usar Hyperbridge SDK para cross-chain queries

**Funcionalidades**:
- Oracle de precios cross-chain
- Consultas de storage desde otras chains
- Verificación de datos cross-chain

**Track**: Hyperbridge Bounty ($5k)

---

## 🚀 Deployment

### Prerrequisitos

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Instalar cargo-contract
cargo install cargo-contract --force

# Instalar toolchain nightly
rustup toolchain install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

### Compilar Contratos

```bash
# Compilar DevKit Showcase
cd contracts/devkit-showcase
cargo +nightly contract build

# Compilar Arkiv Storage
cd ../arkiv-storage
cargo +nightly contract build

# Compilar Hyperbridge Oracle
cd ../hyperbridge-oracle
cargo +nightly contract build
```

### Deploy a Paseo Testnet

1. Obtener tokens de testnet:
   - Visitar https://faucet.polkadot.io/
   - Seleccionar "Polkadot testnet (Paseo)"
   - Solicitar tokens

2. Usar Polkadot.js Apps:
   - Navegar a https://polkadot.js.org/apps/
   - Conectar a Paseo: `wss://paseo.rpc.amforc.com`
   - Ir a "Contracts" → "Upload & deploy code"
   - Subir archivo `.contract`
   - Instanciar contrato

3. O usar CLI:
```bash
cargo contract instantiate \
  --constructor new \
  --args <args> \
  --suri //Alice \
  --url wss://paseo.rpc.amforc.com
```

---

## 📝 Estructura de Archivos

```
contracts/
├── README.md
├── devkit-showcase/
│   └── lib.rs
├── arkiv-storage/
│   └── lib.rs
└── hyperbridge-oracle/
    └── lib.rs
```

---

## 🔗 Enlaces Útiles

- [Paseo Testnet Explorer](https://paseo.subscan.io/)
- [Polkadot.js Apps](https://polkadot.js.org/apps/)
- [Faucet](https://faucet.polkadot.io/)
- [ink! Documentation](https://use.ink/)

---

**Generado con Polkadot DevKit para sub0 Hackathon 2025**

