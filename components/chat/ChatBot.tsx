'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const EXPERT_KNOWLEDGE = {
  polkadot: {
    networks: ['Polkadot Mainnet', 'Kusama', 'Paseo Testnet', 'Rococo', 'Westend'],
    parachains: ['Acala', 'Moonbeam', 'Astar', 'Bifrost', 'Centrifuge'],
    technologies: ['Substrate', 'ink!', 'Polkadot.js', 'XCM', 'Parachains'],
    consensus: ['NPoS', 'BABE', 'GRANDPA', 'Aura', 'Tendermint']
  },
  paseo: {
    description: 'Paseo es la testnet oficial de Polkadot para pruebas y desarrollo',
    features: ['Smart Contracts', 'Parachains', 'Cross-chain', 'Governance'],
    rpc: 'wss://paseo.rpc.amforc.com',
    explorer: 'https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com',
    token: 'PASE'
  },
  substrate: {
    framework: 'Substrate es el framework de blockchain de Parity',
    languages: ['Rust', 'ink!', 'AssemblyScript'],
    pallets: ['System', 'Balances', 'Contracts', 'Sudo', 'Timestamp'],
    runtime: 'Wasm-based runtime para máxima flexibilidad'
  },
  ink: {
    description: 'ink! es el lenguaje de smart contracts para Substrate',
    features: ['Rust-based', 'Wasm compilation', 'PSP standards', 'Cross-chain'],
    standards: ['PSP-22 (Fungible)', 'PSP-34 (NFT)', 'PSP-37 (Multi Token)'],
    tools: ['cargo-contract', 'polkadot.js', 'substrate-contracts-node']
  }
};

const QUICK_QUESTIONS = [
  "¿Qué es Paseo Testnet?",
  "¿Cómo desarrollo contratos ink!?",
  "¿Qué es Substrate?",
  "¿Cómo funciona XCM?",
  "¿Qué son los parachains?",
  "¿Cómo uso Polkadot.js?",
  "¿Qué es NPoS?",
  "¿Cómo deployo en Paseo?"
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateExpertResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Respuestas sobre Paseo Testnet
    if (message.includes('paseo') || message.includes('testnet')) {
      return `🚀 **Paseo Testnet** es la red de pruebas oficial de Polkadot, perfecta para desarrollo y testing.

**Características principales:**
• Red de pruebas gratuita con tokens PASE
• Soporte completo para smart contracts ink!
• Integración con parachains
• RPC: \`wss://paseo.rpc.amforc.com\`
• Explorer: Polkadot.js Apps

**Para comenzar:**
1. Conecta tu wallet (Polkadot.js/SubWallet)
2. Obtén tokens PASE del faucet
3. Despliega tus contratos ink!
4. Prueba funcionalidades cross-chain

¿Te gustaría saber más sobre algún aspecto específico de Paseo?`;
    }

    // Respuestas sobre ink! y smart contracts
    if (message.includes('ink') || message.includes('contrato') || message.includes('smart contract')) {
      return `💎 **ink!** es el lenguaje de smart contracts para Substrate/Polkadot.

**Ventajas de ink!:**
• Basado en Rust (seguro y eficiente)
• Compilación a WebAssembly
• Estándares PSP (PSP-22, PSP-34, PSP-37)
• Interoperabilidad cross-chain

**Estructura básica:**
\`\`\`rust
#[ink::contract]
mod my_contract {
    #[ink(storage)]
    pub struct MyContract {
        value: i32,
    }
    
    impl MyContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self { value: 0 }
        }
        
        #[ink(message)]
        pub fn get(&self) -> i32 {
            self.value
        }
    }
}
\`\`\`

**Herramientas recomendadas:**
• \`cargo-contract\` - CLI para desarrollo
• \`substrate-contracts-node\` - Nodo local
• Polkadot.js Apps - Interfaz web

¿Necesitas ayuda con algún aspecto específico de ink!?`;
    }

    // Respuestas sobre Substrate
    if (message.includes('substrate') || message.includes('framework')) {
      return `🏗️ **Substrate** es el framework de blockchain modular de Parity.

**Características clave:**
• Framework modular y flexible
• Runtime en WebAssembly
• Consenso pluggable (BABE, GRANDPA, Aura)
• Pallets reutilizables
• Actualizaciones sin fork

**Arquitectura:**
• **Runtime**: Lógica de negocio en Wasm
• **Client**: Nodo en Rust
• **Pallets**: Módulos pre-construidos
• **Consensus**: Algoritmos de consenso

**Pallets populares:**
• \`pallet-balances\` - Gestión de tokens
• \`pallet-contracts\` - Smart contracts
• \`pallet-sudo\` - Administración
• \`pallet-timestamp\` - Timestamps

¿Te interesa aprender sobre algún pallet específico o la arquitectura de Substrate?`;
    }

    // Respuestas sobre XCM
    if (message.includes('xcm') || message.includes('cross-chain') || message.includes('parachain')) {
      return `🌉 **XCM (Cross-Consensus Message Format)** es el protocolo de comunicación entre parachains.

**Funcionalidades XCM:**
• Transferencias cross-chain
• Llamadas remotas entre parachains
• Comunicación con relay chains
• Transfers de activos

**Tipos de mensajes:**
• \`Transfer\` - Transferir activos
• \`Transact\` - Ejecutar llamadas remotas
• \`ReserveAssetDeposit\` - Depositar reservas
• \`TeleportAsset\` - Teleportar activos

**Ejemplo de transfer XCM:**
\`\`\`rust
let message = Xcm(vec![
    WithdrawAsset((Here, amount).into()),
    BuyExecution { fees: (Here, amount).into(), weight_limit: Limited(weight) },
    DepositAsset { assets: All.into(), beneficiary: MultiLocation::new(1, X1(AccountId32 { id: dest, network: None })) }
]);
\`\`\`

¿Quieres profundizar en algún aspecto específico de XCM?`;
    }

    // Respuestas sobre Polkadot.js
    if (message.includes('polkadot.js') || message.includes('api') || message.includes('javascript')) {
      return `⚡ **Polkadot.js** es la librería JavaScript para interactuar con redes Polkadot.

**Características principales:**
• API completa para Substrate
• Soporte para smart contracts
• Integración con wallets
• TypeScript support

**Instalación:**
\`\`\`bash
npm install @polkadot/api @polkadot/api-contract
\`\`\`

**Ejemplo básico:**
\`\`\`javascript
import { ApiPromise, WsProvider } from '@polkadot/api';

const provider = new WsProvider('wss://paseo.rpc.amforc.com');
const api = await ApiPromise.create({ provider });

// Obtener balance
const balance = await api.query.system.account(address);

// Llamar contrato
const contract = new ContractPromise(api, abi, contractAddress);
const result = await contract.query.methodName(caller, {}, value);
\`\`\`

¿Necesitas ejemplos específicos de uso de Polkadot.js?`;
    }

    // Respuestas sobre consenso
    if (message.includes('consenso') || message.includes('npos') || message.includes('babe') || message.includes('grandpa')) {
      return `🔐 **Consenso en Polkadot** utiliza un sistema híbrido NPoS + BABE + GRANDPA.

**Componentes del consenso:**

**NPoS (Nominated Proof of Stake):**
• Validadores elegidos por stake
• Nominadores pueden nominar validadores
• Recompensas compartidas

**BABE (Blind Assignment for Blockchain Extension):**
• Algoritmo de producción de bloques
• Asignación probabilística de slots
• Tolerancia a fallos bizantinos

**GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement):**
• Finalización de bloques
• Finalidad probabilística
• Tolerancia a 1/3 de validadores maliciosos

**Flujo del consenso:**
1. BABE produce bloques candidatos
2. Validadores votan por bloques
3. GRANDPA finaliza bloques válidos
4. NPoS selecciona validadores

¿Te interesa algún aspecto específico del consenso?`;
    }

    // Respuesta genérica experta
    return `🤖 **Asistente Polkadot Expert** - Estoy aquí para ayudarte con todo lo relacionado con Polkadot, Substrate, ink! y Paseo Testnet.

**Puedo ayudarte con:**
• 🚀 Desarrollo en Paseo Testnet
• 💎 Smart contracts con ink!
• 🏗️ Framework Substrate
• 🌉 Cross-chain con XCM
• ⚡ Integración Polkadot.js
• 🔐 Consenso y validación
• 📚 Mejores prácticas

**Preguntas frecuentes:**
• ¿Cómo deployo un contrato en Paseo?
• ¿Qué son los parachains?
• ¿Cómo funciona XCM?
• ¿Cuál es la diferencia entre Polkadot y Kusama?

¿En qué puedo ayudarte específicamente?`;
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
      const response = generateExpertResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-purple-500/25 transition-all duration-300"
        >
          <MessageCircle className="w-8 h-8" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl ${
              isMinimized ? 'w-72 sm:w-80 h-16' : 'w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-8rem)] sm:h-[600px] max-w-sm'
            } transition-all duration-300`}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Polkadot Expert</h3>
                  <p className="text-xs text-gray-300">Superinteligencia en Polkadot & Paseo</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isMinimized ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px]">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2">¡Hola! Soy tu asistente Polkadot</h4>
                      <p className="text-xs sm:text-sm text-gray-300 mb-4">Pregúntame sobre Polkadot, Paseo, ink!, Substrate y más</p>
                      
                      {/* Quick Questions */}
                      <div className="space-y-2">
                        {QUICK_QUESTIONS.slice(0, 4).map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickQuestion(question)}
                            className="block w-full text-left px-2 sm:px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-2xl px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-white/10 text-gray-200'
                        }`}>
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
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
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white/10 rounded-2xl px-4 py-2">
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
                <div className="p-3 sm:p-4 border-t border-white/10">
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Pregunta sobre Polkadot, Paseo, ink!..."
                      className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
