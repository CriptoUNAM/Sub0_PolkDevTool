'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  HelpCircle, 
  Code, 
  Lightbulb, 
  ArrowLeft,
  RefreshCw,
  Copy,
  Download,
  Brain,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ExplainPage() {
  const [isClient, setIsClient] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [copiedExplanation, setCopiedExplanation] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Explain</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleExplain = async () => {
    if (!codeInput.trim() || isExplaining) return;

    setIsExplaining(true);
    setExplanation('');

    // Simulate AI explanation
    setTimeout(() => {
      const mockExplanation = `## Análisis del Código

### Estructura General
Este es un contrato inteligente escrito en **Ink!** (Rust para Polkadot) que implementa un token ERC-20 básico.

### Componentes Principales

#### 1. **Storage (Almacenamiento)**
\`\`\`rust
#[ink(storage)]
pub struct Erc20 {
    total_supply: Balance,
    balances: Mapping<AccountId, Balance>,
    allowances: Mapping<(AccountId, AccountId), Balance>,
    name: String,
    symbol: String,
    decimals: u8,
}
\`\`\`

- **total_supply**: Cantidad total de tokens en circulación
- **balances**: Mapeo de direcciones a sus balances
- **allowances**: Permisos de gasto entre cuentas
- **name/symbol/decimals**: Metadatos del token

#### 2. **Constructor**
\`\`\`rust
#[ink(constructor)]
pub fn new(initial_supply: Balance, name: String, symbol: String, decimals: u8) -> Self
\`\`\`

Inicializa el contrato con:
- Suministro inicial de tokens
- Metadatos del token
- Asigna todos los tokens al creador

#### 3. **Funciones Principales**

**balance_of**: Consulta el balance de una dirección
**transfer**: Transfiere tokens entre cuentas
**approve**: Autoriza a otra cuenta a gastar tokens
**transfer_from**: Transfiere tokens en nombre de otra cuenta

### Eventos
- **Transfer**: Se emite cuando hay transferencias
- **Approval**: Se emite cuando se aprueban gastos

### Seguridad
- Verificaciones de balance antes de transferir
- Control de permisos en transfer_from
- Emisión de eventos para transparencia

### Casos de Uso
1. **Crear un token personalizado**
2. **Implementar un sistema de pagos**
3. **Construir aplicaciones DeFi**
4. **Crear sistemas de recompensas**

### Mejoras Posibles
- Implementar pausa/despausa
- Agregar funciones de burn
- Implementar roles de administrador
- Añadir límites de transferencia

### Recursos Adicionales
- [Documentación de Ink!](https://use.ink/)
- [Guía de ERC-20](https://eips.ethereum.org/EIPS/eip-20)
- [Polkadot.js Apps](https://polkadot.js.org/apps/)`;

      setExplanation(mockExplanation);
      setIsExplaining(false);
    }, 3000);
  };

  const copyExplanation = () => {
    navigator.clipboard.writeText(explanation);
    setCopiedExplanation(true);
    setTimeout(() => setCopiedExplanation(false), 2000);
  };

  const downloadExplanation = () => {
    const blob = new Blob([explanation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code_explanation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exampleCodes = [
    {
      title: 'Token ERC-20',
      description: 'Implementación básica de un token',
      code: `#[ink::contract]
pub mod erc20 {
    #[ink(storage)]
    pub struct Erc20 {
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
    }
    
    impl Erc20 {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            // Implementation
        }
    }
}`
    },
    {
      title: 'NFT Collection',
      description: 'Contrato de colección de NFTs',
      code: `#[ink::contract]
pub mod nft {
    #[ink(storage)]
    pub struct Nft {
        next_token_id: u32,
        token_owner: Mapping<u32, AccountId>,
    }
    
    impl Nft {
        #[ink(message)]
        pub fn mint(&mut self, to: AccountId) -> u32 {
            // Implementation
        }
    }
}`
    },
    {
      title: 'DAO Governance',
      description: 'Sistema de gobernanza descentralizada',
      code: `#[ink::contract]
pub mod dao {
    #[ink(storage)]
    pub struct Dao {
        proposals: Mapping<u32, Proposal>,
        voting_power: Mapping<AccountId, u128>,
    }
    
    impl Dao {
        #[ink(message)]
        pub fn create_proposal(&mut self, description: String) -> u32 {
            // Implementation
        }
    }
}`
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-16 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <HelpCircle className="w-8 h-8 mr-3 text-purple-400" />
              Explicador de Código IA
            </h1>
            <p className="text-gray-400">Entiende cualquier código de contrato inteligente</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-purple-400" />
                  Código a Explicar
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pega tu código aquí
                    </label>
                    <Textarea
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="Pega aquí el código de tu contrato inteligente..."
                      className="min-h-[300px] font-mono text-sm"
                      disabled={isExplaining}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo de Contrato
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isExplaining}
                      >
                        <option value="token">Token (ERC-20)</option>
                        <option value="nft">NFT</option>
                        <option value="dao">DAO</option>
                        <option value="defi">DeFi</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nivel de Detalle
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isExplaining}
                      >
                        <option value="basic">Básico</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleExplain}
                    disabled={!codeInput.trim() || isExplaining}
                    variant="primary"
                    className="w-full flex items-center justify-center"
                  >
                    {isExplaining ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Explicar Código
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Example Codes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Ejemplos de Código</h3>
                <div className="space-y-3">
                  {exampleCodes.map((example, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => setCodeInput(example.code)}
                      disabled={isExplaining}
                    >
                      <div>
                        <div className="flex items-center mb-1">
                          <FileText className="w-4 h-4 mr-2 text-purple-400" />
                          <span className="font-medium">{example.title}</span>
                        </div>
                        <p className="text-sm text-gray-400">{example.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-purple-400" />
                    Explicación
                  </h2>
                  {explanation && (
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={copyExplanation}
                        className="flex items-center"
                      >
                        {copiedExplanation ? (
                          <>
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={downloadExplanation}
                        className="flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="h-[500px] overflow-auto">
                  {isExplaining ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Analizando tu código...</p>
                        <p className="text-sm text-gray-500 mt-2">Generando explicación detallada</p>
                      </div>
                    </div>
                  ) : explanation ? (
                    <div className="prose prose-invert max-w-none">
                      <div 
                        className="text-gray-300 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: explanation
                            .replace(/```rust\n([\s\S]*?)\n```/g, '<pre class="bg-slate-900 p-4 rounded-lg overflow-x-auto"><code class="text-sm">$1</code></pre>')
                            .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 p-4 rounded-lg overflow-x-auto"><code class="text-sm">$1</code></pre>')
                            .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-white mt-6 mb-3">$1</h3>')
                            .replace(/## (.*)/g, '<h2 class="text-xl font-semibold text-white mt-8 mb-4">$1</h2>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em class="text-purple-300">$1</em>')
                            .replace(/`(.*?)`/g, '<code class="bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>')
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">La explicación aparecerá aquí</p>
                        <p className="text-sm text-gray-500 mt-2">Pega tu código y haz clic en "Explicar"</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
