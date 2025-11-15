'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Bug, 
  Search, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Copy,
  Download,
  Code,
  Zap,
  FileText,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

interface DebugIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
  severity: 'low' | 'medium' | 'high';
}

export default function DebugPage() {
  const [isClient, setIsClient] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [debugResults, setDebugResults] = useState<DebugIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Debug</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleDebug = async () => {
    if (!codeInput.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setDebugResults([]);

    try {
      // Usar la API de Gemini
      const { debugError } = await import('@/lib/api-client');
      
      let debugText = '';
      for await (const chunk of debugError({
        errorMessage: 'Análisis de código solicitado',
        code: codeInput,
        context: 'Análisis completo del código para encontrar errores y mejoras'
      })) {
        debugText += chunk;
      }

      // Convertir la respuesta de texto a formato DebugIssue[]
      // Por ahora, crear un issue con toda la respuesta
      const issues: DebugIssue[] = [{
        id: '1',
        type: 'info',
        message: 'Análisis completado',
        suggestion: debugText,
        severity: 'low'
      }];
      
      setDebugResults(issues);
    } catch (error) {
      console.error('Error debuggeando:', error);
      setDebugResults([{
        id: 'error',
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido',
        severity: 'high'
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeInput);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([codeInput], { type: 'text/rust' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debug_code.rs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Lightbulb className="w-4 h-4 text-blue-400" />;
      default: return <Bug className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      case 'low': return 'Bajo';
      default: return severity;
    }
  };

  const exampleCodes = [
    {
      title: 'Código con Errores',
      description: 'Ejemplo de código con problemas comunes',
      code: `#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;
use std::collections::HashMap;

#[ink::contract]
pub mod my_contract {
    #[ink(storage)]
    pub struct MyContract {
        balances: HashMap<AccountId, Balance>,
    }

    impl MyContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                balances: HashMap::new(),
            }
        }

        #[ink(message)]
        pub fn get_balance(&self, account: AccountId) -> Balance {
            // Error: variable not defined
            return value;
        }

        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, amount: Balance) -> bool {
            // Potential panic
            let result = amount / 0;
            true
        }
    }
}`
    },
    {
      title: 'Código con Warnings',
      description: 'Código con advertencias de compilación',
      code: `#[ink::contract]
pub mod contract {
    use ink_storage::traits::SpreadAllocate;
    
    #[ink(storage)]
    pub struct Contract {
        value: i32,
    }
    
    impl Contract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self { value: 0 }
        }
        
        // Unused function
        fn unused_function() -> i32 {
            42
        }
        
        #[ink(message)]
        pub fn get_value(&self) -> i32 {
            self.value
        }
    }
}`
    },
    {
      title: 'Código Limpio',
      description: 'Ejemplo de código sin problemas',
      code: `#[ink::contract]
pub mod clean_contract {
    use ink_storage::traits::SpreadAllocate;
    
    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct CleanContract {
        value: i32,
    }
    
    impl CleanContract {
        #[ink(constructor)]
        pub fn new(initial_value: i32) -> Self {
            Self { value: initial_value }
        }
        
        #[ink(message)]
        pub fn get_value(&self) -> i32 {
            self.value
        }
        
        #[ink(message)]
        pub fn set_value(&mut self, new_value: i32) -> Result<(), String> {
            if new_value < 0 {
                return Err("Value cannot be negative".to_string());
            }
            self.value = new_value;
            Ok(())
        }
    }
}`
    }
  ];

  const errorCount = debugResults.filter(issue => issue.type === 'error').length;
  const warningCount = debugResults.filter(issue => issue.type === 'warning').length;
  const infoCount = debugResults.filter(issue => issue.type === 'info').length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-16 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center flex-wrap gap-2">
              <Bug className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
              Debug Assistant
            </h1>
            <p className="text-gray-400">Encuentra y corrige errores en tu código</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Code Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center flex-wrap gap-2">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Código a Analizar
                  </h2>
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
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pega tu código aquí
                    </label>
                    <Textarea
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="Pega aquí el código que quieres analizar..."
                      className="min-h-[250px] xs:min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] font-mono text-xs sm:text-sm"
                      disabled={isAnalyzing}
                    />
                  </div>

                  <Button
                    onClick={handleDebug}
                    disabled={!codeInput.trim() || isAnalyzing}
                    variant="primary"
                    className="w-full flex items-center justify-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analizar Código
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
                      disabled={isAnalyzing}
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

            {/* Debug Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center flex-wrap gap-2">
                    <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Resultados del Debug
                  </h2>
                  {debugResults.length > 0 && (
                    <div className="flex items-center space-x-4 text-sm">
                      {errorCount > 0 && <span className="text-red-400">{errorCount} errores</span>}
                      {warningCount > 0 && <span className="text-yellow-400">{warningCount} warnings</span>}
                      {infoCount > 0 && <span className="text-blue-400">{infoCount} info</span>}
                    </div>
                  )}
                </div>

                <div className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] min-h-[250px] overflow-auto">
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Analizando tu código...</p>
                        <p className="text-sm text-gray-500 mt-2">Buscando errores y problemas</p>
                      </div>
                    </div>
                  ) : debugResults.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Bug className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Los resultados aparecerán aquí</p>
                        <p className="text-sm text-gray-500 mt-2">Analiza tu código para ver los problemas</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {debugResults.map((issue) => (
                        <motion.div
                          key={issue.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-l-purple-500"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start">
                              {getIssueIcon(issue.type)}
                              <div className="ml-3">
                                <p className="text-white font-medium">{issue.message}</p>
                                {issue.line && (
                                  <p className="text-sm text-gray-400 mt-1">
                                    Línea {issue.line}, Columna {issue.column}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                              {getSeverityText(issue.severity)}
                            </span>
                          </div>
                          
                          {issue.suggestion && (
                            <div className="mt-3 p-3 bg-slate-800 rounded border border-slate-600">
                              <div className="flex items-center mb-2">
                                <Lightbulb className="w-4 h-4 text-yellow-400 mr-2" />
                                <span className="text-sm font-medium text-yellow-400">Sugerencia:</span>
                              </div>
                              <p className="text-sm text-gray-300">{issue.suggestion}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
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
