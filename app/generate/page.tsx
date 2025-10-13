'use client';

import { useState } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Download, Play, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { CodeEditor } from '@/components/code/CodeEditor';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { WalletConnect } from '@/components/wallet/WalletConnect';

const CONTRACT_TYPES = [
  { value: 'token', label: 'Token (PSP-22)' },
  { value: 'nft', label: 'NFT (PSP-34)' },
  { value: 'governance', label: 'Governance' },
  { value: 'staking', label: 'Staking' },
  { value: 'defi', label: 'DeFi' },
  { value: 'custom', label: 'Personalizado' }
];

const EXAMPLE_PROMPTS = [
  'Crear un token ERC-20 con funcionalidad de staking y recompensas del 10% APY',
  'Implementar un contrato de NFT con royalties para artistas',
  'Desarrollar un sistema de gobernanza DAO con votación por tokens',
  'Crear un pool de liquidez para intercambio de tokens',
  'Implementar un contrato de vesting para tokens de equipo'
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [contractType, setContractType] = useState('token');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedCode('');
    setExplanation('');

    try {
      // Use OpenAI API for real contract generation
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          contractType,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to generate contract: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      let code = '';
      let explanationText = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          code += chunk;
          setGeneratedCode(code);
        }
      } catch (streamError) {
        console.error('Stream error:', streamError);
        // Fallback to mock code if streaming fails
        const mockCode = `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod ${contractType}_contract {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct ${contractType.charAt(0).toUpperCase() + contractType.slice(1)}Contract {
        // Add your storage fields here
    }

    #[ink(constructor)]
    pub fn new() -> Self {
        Self {
            // Initialize your contract
        }
    }

    #[ink(message)]
    pub fn example_function(&self) -> u32 {
        42
    }
}`;
        setGeneratedCode(mockCode);
        setExplanation(`Contrato ${contractType} generado. Nota: Hubo un problema con la API, mostrando código de ejemplo.`);
        return;
      }

      // Generate explanation
      try {
        const explainResponse = await fetch('/api/explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            language: 'rust',
          }),
        });

        if (explainResponse.ok) {
          const explainReader = explainResponse.body?.getReader();
          if (explainReader) {
            while (true) {
              const { done, value } = await explainReader.read();
              if (done) break;

              const chunk = new TextDecoder().decode(value);
              explanationText += chunk;
              setExplanation(explanationText);
            }
          }
        }
      } catch (explainError) {
        console.error('Explanation error:', explainError);
        setExplanation(`Explicación del contrato ${contractType}: Este es un contrato básico generado.`);
      }
    } catch (error) {
      console.error('Error generating contract:', error);
      alert(`Error generando el contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract.rs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeploy = () => {
    // TODO: Implement deployment logic
    console.log('Deploying contract...');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-4 sm:pt-8 pb-8 sm:pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mr-2 sm:mr-3" />
              <h1 className="text-2xl sm:text-4xl font-bold gradient-text">AI Contract Generator</h1>
            </div>
            <p className="text-base sm:text-xl text-gray-300">
              Describe tu contrato en lenguaje natural y nuestro AI lo generará
            </p>
          </motion.div>

          {/* Wallet Connection */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <WalletConnect />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="h-full">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  Describe tu contrato
                </h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <Select
                    label="Tipo de contrato"
                    options={CONTRACT_TYPES}
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                  />
                  
                  <Textarea
                    label="Descripción del contrato"
                    placeholder="Ej: Crear un token ERC-20 con funcionalidad de staking y recompensas del 10% APY"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                  />
                  
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2">Ejemplos de prompts:</p>
                    <div className="space-y-1 sm:space-y-2">
                      {EXAMPLE_PROMPTS.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(example)}
                          className="block w-full text-left p-2 text-xs sm:text-sm bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Generar Contrato
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Output Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <Card className="h-full">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Código generado</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeploy}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CodeEditor
                  code={generatedCode}
                  language="rust"
                  readOnly={true}
                  className="h-64 sm:h-96"
                />
              </Card>
            </motion.div>
          </div>

          {/* Explanation Panel */}
          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Card>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Explicación del código</h3>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm sm:text-base text-gray-300">
                    {explanation}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
