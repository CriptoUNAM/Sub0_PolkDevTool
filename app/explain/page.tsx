'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Brain, 
  Shield, 
  Zap, 
  BookOpen,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';

const FOCUS_OPTIONS = [
  { value: 'general', label: 'Explicación general' },
  { value: 'security', label: 'Análisis de seguridad' },
  { value: 'optimization', label: 'Optimización' },
  { value: 'deployment', label: 'Deployment' }
];

const EXAMPLE_CODES = [
  {
    name: 'PSP-22 Token básico',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod psp22_token {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct Psp22Token {
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
    }

    #[ink(constructor)]
    pub fn new(total_supply: Balance) -> Self {
        let mut balances = Mapping::default();
        let caller = Self::env().caller();
        balances.insert(caller, &total_supply);

        Self {
            total_supply,
            balances,
        }
    }

    #[ink(message)]
    pub fn total_supply(&self) -> Balance {
        self.total_supply
    }
}`
  },
  {
    name: 'Contrato de staking',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod staking {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct Staking {
        staked_amounts: Mapping<AccountId, Balance>,
        total_staked: Balance,
        reward_rate: u64,
    }

    #[ink(constructor)]
    pub fn new(reward_rate: u64) -> Self {
        Self {
            staked_amounts: Mapping::default(),
            total_staked: 0,
            reward_rate,
        }
    }

    #[ink(message)]
    pub fn stake(&mut self, amount: Balance) -> Result<(), StakingError> {
        let caller = self.env().caller();
        let current_stake = self.staked_amounts.get(&caller).unwrap_or(0);
        self.staked_amounts.insert(&caller, &(current_stake + amount));
        self.total_staked += amount;
        Ok(())
    }
}`
  }
];

export default function ExplainPage() {
  const [code, setCode] = useState('');
  const [focus, setFocus] = useState('general');
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) return;
    
    setIsExplaining(true);
    setExplanation('');

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: 'rust',
          focus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to explain code');
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      let explanationText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        explanationText += chunk;
        setExplanation(explanationText);
      }
    } catch (error) {
      console.error('Error explaining code:', error);
      alert('Error explicando el código. Por favor, intenta de nuevo.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleExampleSelect = (exampleCode: string) => {
    setCode(exampleCode);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-green-400 mr-3" />
              <h1 className="text-4xl font-bold gradient-text">Code Explainer</h1>
            </div>
            <p className="text-xl text-gray-300">
              Pega tu código ink! y obtén una explicación detallada
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-green-400" />
                    Código a explicar
                  </h2>
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
                </div>
                
                <div className="space-y-4">
                  <Select
                    label="Enfoque de la explicación"
                    options={FOCUS_OPTIONS}
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                  />
                  
                  <Textarea
                    label="Código ink!/Rust"
                    placeholder="Pega tu código aquí..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Ejemplos de código:</p>
                    <div className="space-y-2">
                      {EXAMPLE_CODES.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => handleExampleSelect(example.code)}
                          className="block w-full text-left p-3 text-sm bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="font-medium">{example.name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {example.code.split('\n').slice(0, 3).join(' ')}...
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleExplain}
                    disabled={!code.trim() || isExplaining}
                    className="w-full"
                    size="lg"
                  >
                    {isExplaining ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Explicando...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        Explicar código
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
            >
              <Card className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                    Explicación
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([explanation], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'explanation.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-96 overflow-y-auto">
                  {explanation ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {explanation}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">La explicación aparecerá aquí</p>
                        <p className="text-sm">Pega tu código y haz clic en "Explicar código"</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Additional Analysis */}
          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-green-400 mr-2" />
                    <h3 className="font-semibold">Seguridad</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Revisa las consideraciones de seguridad mencionadas en la explicación
                  </p>
                </Card>
                
                <Card>
                  <div className="flex items-center mb-3">
                    <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                    <h3 className="font-semibold">Optimización</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Busca consejos de optimización de gas y rendimiento
                  </p>
                </Card>
                
                <Card>
                  <div className="flex items-center mb-3">
                    <Play className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="font-semibold">Deployment</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Sigue los pasos de deployment mencionados en la explicación
                  </p>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
