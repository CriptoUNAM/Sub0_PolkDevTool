'use client';

import { useState, useRef, useEffect } from 'react';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Code,
  Zap,
  Shield,
  Globe,
  Cpu,
  Database,
  Rocket,
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp,
  ChevronRight,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  sources?: string[];
}

const EXPERT_CATEGORIES = [
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Paseo Testnet",
    description: "Red de pruebas oficial de Polkadot",
    color: "from-blue-500 to-cyan-500",
    topics: ["Deployment", "Testing", "Faucet", "RPC"]
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "ink! Smart Contracts",
    description: "Desarrollo de contratos inteligentes",
    color: "from-purple-500 to-pink-500",
    topics: ["PSP Standards", "Rust", "Wasm", "Cross-chain"]
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Substrate Framework",
    description: "Framework modular de blockchain",
    color: "from-green-500 to-emerald-500",
    topics: ["Pallets", "Runtime", "Consensus", "Governance"]
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Cross-chain & XCM",
    description: "Comunicación entre parachains",
    color: "from-orange-500 to-red-500",
    topics: ["XCM", "Parachains", "Relay Chain", "Interoperability"]
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Security & Consensus",
    description: "Seguridad y algoritmos de consenso",
    color: "from-indigo-500 to-purple-500",
    topics: ["NPoS", "BABE", "GRANDPA", "Validators"]
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Polkadot.js API",
    description: "Integración y desarrollo",
    color: "from-pink-500 to-rose-500",
    topics: ["API", "Wallets", "TypeScript", "Integration"]
  }
];

const QUICK_QUESTIONS = [
  {
    question: "¿Cómo deployo un contrato en Paseo?",
    category: "Paseo Testnet",
    icon: <Rocket className="w-4 h-4" />
  },
  {
    question: "¿Qué son los estándares PSP?",
    category: "ink! Smart Contracts",
    icon: <Code className="w-4 h-4" />
  },
  {
    question: "¿Cómo funciona XCM?",
    category: "Cross-chain & XCM",
    icon: <Globe className="w-4 h-4" />
  },
  {
    question: "¿Qué es NPoS?",
    category: "Security & Consensus",
    icon: <Shield className="w-4 h-4" />
  },
  {
    question: "¿Cómo uso Polkadot.js?",
    category: "Polkadot.js API",
    icon: <Database className="w-4 h-4" />
  },
  {
    question: "¿Qué son los parachains?",
    category: "Cross-chain & XCM",
    icon: <Globe className="w-4 h-4" />
  }
];

const CODE_EXAMPLES = {
  "ink!": `#[ink::contract]
mod my_token {
    use ink::prelude::*;
    
    #[ink(storage)]
    pub struct MyToken {
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
    }
    
    impl MyToken {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            let mut instance = Self {
                total_supply: initial_supply,
                balances: Mapping::new(),
            };
            instance.balances.insert(Self::env().caller(), initial_supply);
            instance
        }
        
        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> Balance {
            self.balances.get(owner).unwrap_or(0)
        }
    }
}`,
  "polkadot.js": `import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

// Conectar a Paseo Testnet
const provider = new WsProvider('wss://paseo.rpc.amforc.com');
const api = await ApiPromise.create({ provider });

// Interactuar con contrato
const contract = new ContractPromise(api, abi, contractAddress);
const result = await contract.query.balanceOf(caller, {}, accountId);

console.log('Balance:', result.output.toHuman());`,
  "xcm": `// Transfer XCM entre parachains
let message = Xcm(vec![
    WithdrawAsset((Here, amount).into()),
    BuyExecution { 
        fees: (Here, amount).into(), 
        weight_limit: Limited(weight) 
    },
    DepositAsset { 
        assets: All.into(), 
        beneficiary: MultiLocation::new(
            1, 
            X1(AccountId32 { 
                id: dest, 
                network: None 
            })
        ) 
    }
]);`
};

export default function ChatBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateExpertResponse = (userMessage: string, category?: string): { content: string; sources: string[] } => {
    const message = userMessage.toLowerCase();
    const sources: string[] = [];
    
    // Respuestas sobre Paseo Testnet
    if (message.includes('paseo') || message.includes('testnet') || category === 'Paseo Testnet') {
      sources.push('Paseo Documentation', 'Polkadot.js Apps', 'Substrate Contracts');
      return {
        content: `🚀 **Paseo Testnet** - Red de pruebas oficial de Polkadot

**Configuración rápida:**
\`\`\`bash
# Instalar herramientas
cargo install cargo-contract
cargo install substrate-contracts-node

# Crear proyecto
cargo contract new my_contract
cd my_contract

# Compilar contrato
cargo contract build

# Desplegar en Paseo
cargo contract instantiate --constructor new --args 1000000
\`\`\`

**Características principales:**
• ✅ Red de pruebas gratuita con tokens PASE
• ✅ Soporte completo para smart contracts ink!
• ✅ Integración con parachains
• ✅ RPC: \`wss://paseo.rpc.amforc.com\`
• ✅ Explorer: [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com)

**Para obtener tokens PASE:**
1. Conecta tu wallet (Polkadot.js/SubWallet)
2. Ve al faucet oficial
3. Solicita tokens PASE
4. ¡Listo para desarrollar!

**Próximos pasos:**
• Despliega tu primer contrato
• Prueba funcionalidades cross-chain
• Integra con parachains
• Experimenta con XCM

¿Te gustaría que te guíe en algún paso específico?`,
        sources
      };
    }

    // Respuestas sobre ink! y smart contracts
    if (message.includes('ink') || message.includes('contrato') || message.includes('smart contract') || category === 'ink! Smart Contracts') {
      sources.push('ink! Documentation', 'PSP Standards', 'Substrate Contracts');
      return {
        content: `💎 **ink! Smart Contracts** - Desarrollo seguro y eficiente

**Ventajas de ink!:**
• 🦀 Basado en Rust (seguro y eficiente)
• ⚡ Compilación a WebAssembly
• 📋 Estándares PSP (PSP-22, PSP-34, PSP-37)
• 🌉 Interoperabilidad cross-chain

**Estructura básica de un token PSP-22:**
\`\`\`rust
#[ink::contract]
mod my_token {
    use ink::prelude::*;
    use ink::storage::Mapping;
    
    #[ink(storage)]
    pub struct MyToken {
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
        allowances: Mapping<(AccountId, AccountId), Balance>,
    }
    
    impl MyToken {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            let mut instance = Self {
                total_supply: initial_supply,
                balances: Mapping::new(),
                allowances: Mapping::new(),
            };
            instance.balances.insert(Self::env().caller(), initial_supply);
            instance
        }
        
        #[ink(message)]
        pub fn total_supply(&self) -> Balance {
            self.total_supply
        }
        
        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> Balance {
            self.balances.get(owner).unwrap_or(0)
        }
        
        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, value: Balance) -> Result<(), Error> {
            let from = self.env().caller();
            self._transfer(from, to, value)
        }
        
        fn _transfer(&mut self, from: AccountId, to: AccountId, value: Balance) -> Result<(), Error> {
            let from_balance = self.balance_of(from);
            if from_balance < value {
                return Err(Error::InsufficientBalance);
            }
            
            self.balances.insert(from, from_balance - value);
            let to_balance = self.balance_of(to);
            self.balances.insert(to, to_balance + value);
            
            Ok(())
        }
    }
}
\`\`\`

**Herramientas recomendadas:**
• \`cargo-contract\` - CLI para desarrollo
• \`substrate-contracts-node\` - Nodo local
• Polkadot.js Apps - Interfaz web
• \`cargo expand\` - Ver código expandido

**Mejores prácticas:**
• Usa \`#[ink::test]\` para testing
• Implementa eventos con \`#[ink::event]\`
• Maneja errores apropiadamente
• Optimiza gas usage

¿Necesitas ayuda con algún aspecto específico de ink!?`,
        sources
      };
    }

    // Respuestas sobre Substrate
    if (message.includes('substrate') || message.includes('framework') || category === 'Substrate Framework') {
      sources.push('Substrate Documentation', 'Parity Technologies', 'Substrate Recipes');
      return {
        content: `🏗️ **Substrate Framework** - Construye blockchains modulares

**Arquitectura de Substrate:**
\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Application   │    │   Application   │
│     Layer       │    │     Layer       │    │     Layer       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│   Runtime       │    │   Runtime       │    │   Runtime       │
│   (WebAssembly) │    │   (WebAssembly)  │    │   (WebAssembly) │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│   Client        │    │   Client        │    │   Client        │
│   (Rust)        │    │   (Rust)        │    │   (Rust)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

**Componentes principales:**

**Runtime (WebAssembly):**
• Lógica de negocio en Wasm
• Actualizaciones sin fork
• Ejecución determinística
• Optimización automática

**Client (Rust):**
• Nodo de red
• Consenso pluggable
• Networking P2P
• Storage backend

**Pallets populares:**
\`\`\`rust
// pallet-balances - Gestión de tokens
pub struct BalancesConfig<T: Config> {
    pub balances: StorageMap<AccountId<T>, BalanceOf<T>>,
}

// pallet-contracts - Smart contracts
pub struct ContractsConfig<T: Config> {
    pub code: StorageMap<CodeHash<T>, CodeOf<T>>,
}

// pallet-sudo - Administración
pub struct SudoConfig<T: Config> {
    pub key: StorageValue<Option<AccountId<T>>>,
}
\`\`\`

**Consenso pluggable:**
• **BABE** - Producción de bloques
• **GRANDPA** - Finalización de bloques
• **Aura** - Consenso por turnos
• **Tendermint** - Consenso BFT

**Para comenzar:**
\`\`\`bash
# Instalar Substrate
curl https://get.substrate.io -sSf | bash

# Crear nuevo proyecto
substrate-node-new my-blockchain

# Ejecutar nodo
cargo run --release -- --dev
\`\`\`

¿Te interesa aprender sobre algún pallet específico o la arquitectura?`,
        sources
      };
    }

    // Respuestas sobre XCM
    if (message.includes('xcm') || message.includes('cross-chain') || message.includes('parachain') || category === 'Cross-chain & XCM') {
      sources.push('XCM Documentation', 'Polkadot Parachains', 'Cross-chain Guide');
      return {
        content: `🌉 **XCM (Cross-Consensus Message Format)** - Comunicación entre parachains

**¿Qué es XCM?**
XCM es el protocolo de comunicación que permite a los parachains y relay chains intercambiar mensajes de forma segura y determinística.

**Arquitectura XCM:**
\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Parachain A │◄──►│ Relay Chain │◄──►│ Parachain B │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                   ┌─────────────┐
                   │   XCM Hub   │
                   └─────────────┘
\`\`\`

**Tipos de mensajes XCM:**

**Transfer de activos:**
\`\`\`rust
let message = Xcm(vec![
    WithdrawAsset((Here, amount).into()),
    BuyExecution { 
        fees: (Here, amount).into(), 
        weight_limit: Limited(weight) 
    },
    DepositAsset { 
        assets: All.into(), 
        beneficiary: MultiLocation::new(
            1, 
            X1(AccountId32 { 
                id: dest, 
                network: None 
            })
        ) 
    }
]);
\`\`\`

**Llamadas remotas:**
\`\`\`rust
let message = Xcm(vec![
    Transact {
        origin_type: OriginKind::SovereignAccount,
        require_weight_at_most: weight,
        call: call.into(),
    }
]);
\`\`\`

**Funcionalidades principales:**
• ✅ Transferencias cross-chain
• ✅ Llamadas remotas entre parachains
• ✅ Comunicación con relay chains
• ✅ Transfers de activos
• ✅ Ejecución de código remoto

**Ejemplo práctico - Transfer entre parachains:**
\`\`\`javascript
// Desde Polkadot.js
const xcm = api.tx.xcmPallet.send(
  { V1: { parents: 1, interior: { X1: { Parachain: 2000 } } } },
  {
    V1: {
      WithdrawAsset: [{ id: { Concrete: { parents: 0, interior: 'Here' } }, fun: { Fungible: 1000000000000 } }],
      BuyExecution: { fees: { id: { Concrete: { parents: 0, interior: 'Here' } }, fun: { Fungible: 1000000000000 } }, weight_limit: { Limited: 1000000000 } },
      DepositAsset: { assets: { Wild: 'All' }, max_assets: 1, beneficiary: { parents: 0, interior: { X1: { AccountId32: { id: '0x...', network: 'Any' } } } } }
    }
  }
);
\`\`\`

¿Quieres profundizar en algún aspecto específico de XCM?`,
        sources
      };
    }

    // Respuestas sobre consenso
    if (message.includes('consenso') || message.includes('npos') || message.includes('babe') || message.includes('grandpa') || category === 'Security & Consensus') {
      sources.push('Polkadot Consensus', 'NPoS Documentation', 'GRANDPA Paper');
      return {
        content: `🔐 **Consenso en Polkadot** - Sistema híbrido NPoS + BABE + GRANDPA

**Arquitectura del consenso:**
\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Polkadot Network                     │
├─────────────────────────────────────────────────────────┤
│  Relay Chain (Polkadot)                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │   BABE      │ │   GRANDPA   │ │    NPoS     │      │
│  │ (Block      │ │ (Block      │ │ (Validator  │      │
│  │ Production) │ │ Finality)   │ │ Selection)  │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
├─────────────────────────────────────────────────────────┤
│  Parachains (Acala, Moonbeam, Astar, etc.)             │
└─────────────────────────────────────────────────────────┘
\`\`\`

**NPoS (Nominated Proof of Stake):**
• Validadores elegidos por stake
• Nominadores pueden nominar validadores
• Recompensas compartidas
• Slashing por comportamiento malicioso

**BABE (Blind Assignment for Blockchain Extension):**
• Algoritmo de producción de bloques
• Asignación probabilística de slots
• Tolerancia a fallos bizantinos
• Liderazgo determinístico

**GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement):**
• Finalización de bloques
• Finalidad probabilística
• Tolerancia a 1/3 de validadores maliciosos
• Finalización en lotes

**Flujo del consenso:**
\`\`\`
1. NPoS selecciona validadores
   ↓
2. BABE produce bloques candidatos
   ↓
3. Validadores votan por bloques
   ↓
4. GRANDPA finaliza bloques válidos
   ↓
5. Parachains sincronizan con relay chain
\`\`\`

**Configuración de validadores:**
\`\`\`javascript
// Nominar validadores
const nominate = api.tx.staking.nominate(['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY']);

// Configurar comisión
const setCommission = api.tx.staking.setCommission(1000000); // 1%

// Configurar sesión keys
const setKeys = api.tx.session.setKeys(keys, proof);
\`\`\`

**Métricas de seguridad:**
• **Finalidad**: ~12-60 segundos
• **Tolerancia**: 1/3 de validadores maliciosos
• **Slashing**: Hasta 100% del stake
• **Rewards**: ~10% APY

¿Te interesa algún aspecto específico del consenso?`,
        sources
      };
    }

    // Respuestas sobre Polkadot.js
    if (message.includes('polkadot.js') || message.includes('api') || message.includes('javascript') || category === 'Polkadot.js API') {
      sources.push('Polkadot.js Documentation', 'API Reference', 'Examples Repository');
      return {
        content: `⚡ **Polkadot.js API** - Librería JavaScript para Polkadot

**Instalación y configuración:**
\`\`\`bash
npm install @polkadot/api @polkadot/api-contract @polkadot/extension-dapp
\`\`\`

**Conexión básica:**
\`\`\`javascript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

// Conectar a Paseo Testnet
const provider = new WsProvider('wss://paseo.rpc.amforc.com');
const api = await ApiPromise.create({ 
  provider,
  types: {
    // Tipos personalizados si es necesario
  }
});

console.log('Conectado a:', api.runtimeChain);
console.log('Versión:', api.runtimeVersion);
\`\`\`

**Interactuar con cuentas:**
\`\`\`javascript
// Obtener balance
const account = await api.query.system.account('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
console.log('Balance:', account.data.free.toHuman());

// Transferir tokens
const transfer = api.tx.balances.transfer('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', 1000000000000);
const hash = await transfer.signAndSend(keyring.alice);
console.log('Transfer hash:', hash.toHex());
\`\`\`

**Smart Contracts:**
\`\`\`javascript
// Cargar contrato
const contract = new ContractPromise(api, abi, contractAddress);

// Llamar método de lectura
const result = await contract.query.balanceOf(caller, {}, accountId);
console.log('Balance del contrato:', result.output.toHuman());

// Ejecutar método de escritura
const tx = contract.tx.transfer({ value: 1000000000000 }, recipient, amount);
const hash = await tx.signAndSend(keyring.alice);
console.log('Transaction hash:', hash.toHex());
\`\`\`

**Eventos y suscripciones:**
\`\`\`javascript
// Suscribirse a eventos
api.query.system.events((events) => {
  events.forEach((record) => {
    const { event } = record;
    console.log('Event:', event.toHuman());
  });
});

// Suscribirse a nuevos bloques
api.rpc.chain.subscribeNewHeads((header) => {
  console.log('Nuevo bloque:', header.number.toNumber());
});
\`\`\`

**Utilidades avanzadas:**
\`\`\`javascript
// Calcular fees
const fee = await api.tx.balances.transfer('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', 1000000000000).paymentInfo(keyring.alice);
console.log('Fee estimado:', fee.partialFee.toHuman());

// Obtener metadata
const metadata = await api.rpc.state.getMetadata();
console.log('Metadata version:', metadata.version);

// Decodificar eventos
const decoded = api.registry.createType('EventRecord', eventRecord);
console.log('Evento decodificado:', decoded.toHuman());
\`\`\`

**Mejores prácticas:**
• Usa TypeScript para mejor DX
• Maneja errores apropiadamente
• Optimiza queries con paginación
• Implementa retry logic
• Usa connection pooling

¿Necesitas ejemplos específicos de uso de Polkadot.js?`,
        sources
      };
    }

    // Respuesta genérica experta
    sources.push('Polkadot Documentation', 'Substrate Documentation', 'Community Resources');
    return {
      content: `🤖 **Polkadot Expert Assistant** - Tu guía completa en el ecosistema Polkadot

**Especialidades:**
• 🚀 **Paseo Testnet** - Desarrollo y testing
• 💎 **ink! Smart Contracts** - Contratos inteligentes
• 🏗️ **Substrate Framework** - Blockchain modular
• 🌉 **Cross-chain & XCM** - Interoperabilidad
• 🔐 **Security & Consensus** - NPoS, BABE, GRANDPA
• ⚡ **Polkadot.js API** - Integración y desarrollo

**Recursos útiles:**
• 📚 [Polkadot Documentation](https://docs.polkadot.network/)
• 🛠️ [Substrate Documentation](https://docs.substrate.io/)
• 💎 [ink! Documentation](https://use.ink/)
• 🌐 [Polkadot.js Apps](https://polkadot.js.org/apps/)
• 🚀 [Paseo Testnet](https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com)

**Preguntas frecuentes:**
• ¿Cómo deployo un contrato en Paseo?
• ¿Qué son los parachains?
• ¿Cómo funciona XCM?
• ¿Cuál es la diferencia entre Polkadot y Kusama?
• ¿Cómo me convierto en validador?

¿En qué puedo ayudarte específicamente?`,
      sources
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular delay de respuesta
    setTimeout(() => {
      const response = generateExpertResponse(inputValue, selectedCategory || undefined);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        sources: response.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Polkadot Expert Assistant</h1>
                <p className="text-gray-300">Superinteligencia en Polkadot, Paseo Testnet y Substrate</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">En línea</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Categorías
              </h3>
              <div className="space-y-2">
                {EXPERT_CATEGORIES.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategorySelect(category.title)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.title
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{category.title}</h4>
                        <p className="text-xs text-gray-400">{category.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Questions */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Preguntas Rápidas
              </h3>
              <div className="space-y-2">
                {QUICK_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question.question)}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        {question.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white group-hover:text-blue-300 transition-colors">
                          {question.question}
                        </p>
                        <p className="text-xs text-gray-400">{question.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-300 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Code Examples */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Ejemplos de Código
              </h3>
              <div className="space-y-3">
                {Object.entries(CODE_EXAMPLES).map(([type, code]) => (
                  <div key={type} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white">{type}</h4>
                      <button
                        onClick={() => copyCode(code, type)}
                        className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        {copiedCode === type ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      <code>{code.substring(0, 100)}...</code>
                    </pre>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] bg-white/5 backdrop-blur-xl border-white/10 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">¡Hola! Soy tu asistente Polkadot</h3>
                    <p className="text-gray-300 mb-6">Pregúntame sobre Polkadot, Paseo, ink!, Substrate y más</p>
                    
                    {selectedCategory && (
                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
                        <span className="text-sm text-purple-300">Filtrado por: {selectedCategory}</span>
                      </div>
                    )}
                  </div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-white/10 text-gray-200'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </div>
                          {message.sources && (
                            <div className="text-xs opacity-70">
                              {message.sources.length} fuentes
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white/10 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-white/10">
                <div className="flex space-x-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pregunta sobre Polkadot, Paseo, ink!..."
                    className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
