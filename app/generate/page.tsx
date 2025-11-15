'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Sparkles, 
  Code, 
  Download, 
  Copy,
  ArrowLeft,
  Play,
  RefreshCw,
  Zap,
  Brain,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function GeneratePage() {
  const [isClient, setIsClient] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Generate</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedCode('');

    // Simulate AI generation
    setTimeout(() => {
      const mockCode = `#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
pub mod generated_contract {
    use ink_storage::traits::SpreadAllocate;
    use ink_storage::Mapping;

    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct GeneratedContract {
        owner: AccountId,
        value: u32,
        balances: Mapping<AccountId, u32>,
    }

    #[ink(event)]
    pub struct ValueChanged {
        #[ink(topic)]
        new_value: u32,
    }

    impl GeneratedContract {
        #[ink(constructor)]
        pub fn new(initial_value: u32) -> Self {
            let mut instance = Self {
                owner: Self::env().caller(),
                value: initial_value,
                balances: Default::default(),
            };
            ink_lang::utils::initialize_contract(|instance| {
                Self::env().emit_event(ValueChanged {
                    new_value: initial_value,
                });
            });
            instance
        }

        #[ink(message)]
        pub fn get_value(&self) -> u32 {
            self.value
        }

        #[ink(message)]
        pub fn set_value(&mut self, new_value: u32) -> bool {
            if self.env().caller() != self.owner {
                return false;
            }
            self.value = new_value;
            self.env().emit_event(ValueChanged { new_value });
            true
        }

        #[ink(message)]
        pub fn get_balance(&self, account: AccountId) -> u32 {
            self.balances.get(account).unwrap_or(0)
        }

        #[ink(message)]
        pub fn set_balance(&mut self, account: AccountId, balance: u32) -> bool {
            if self.env().caller() != self.owner {
                return false;
            }
            self.balances.insert(account, balance);
            true
        }
    }
}`;
      setGeneratedCode(mockCode);
      setIsGenerating(false);
    }, 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/rust' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_contract.rs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              <Sparkles className="w-8 h-8 mr-3 text-purple-400" />
              Generador de Contratos IA
            </h1>
            <p className="text-gray-400">Genera contratos inteligentes con inteligencia artificial</p>
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
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  Describe tu contrato
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prompt de generación
                    </label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ejemplo: Crea un contrato de token ERC-20 con funciones de mint, burn y transfer..."
                      className="min-h-[200px]"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Lenguaje
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isGenerating}
                      >
                        <option value="rust">Rust (Substrate)</option>
                        <option value="solidity">Solidity</option>
                        <option value="ink">Ink!</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Complejidad
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isGenerating}
                      >
                        <option value="simple">Simple</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    variant="primary"
                    className="w-full flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generar Contrato
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Quick Prompts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Prompts rápidos</h3>
                <div className="space-y-2">
                  {[
                    "Token ERC-20 con funciones de mint y burn",
                    "NFT collection con metadata",
                    "DAO governance con votación",
                    "DeFi lending protocol",
                    "Cross-chain bridge contract"
                  ].map((quickPrompt, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setPrompt(quickPrompt)}
                      disabled={isGenerating}
                    >
                      <FileText className="w-4 h-4 mr-2 text-purple-400" />
                      {quickPrompt}
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
                    <Code className="w-5 h-5 mr-2 text-purple-400" />
                    Código Generado
                  </h2>
                  {generatedCode && (
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={copyCode}
                        className="flex items-center"
                      >
                        {copiedCode ? (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
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
                        onClick={downloadCode}
                        className="flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="h-[500px] overflow-auto">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Generando tu contrato...</p>
                        <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos momentos</p>
                      </div>
                    </div>
                  ) : generatedCode ? (
                    <pre className="text-sm text-gray-300 bg-slate-900 p-4 rounded-lg overflow-x-auto">
                      <code>{generatedCode}</code>
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">El código generado aparecerá aquí</p>
                        <p className="text-sm text-gray-500 mt-2">Describe tu contrato y haz clic en "Generar"</p>
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
