'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  RefreshCw,
  Copy,
  Download,
  Code,
  Zap,
  AlertTriangle,
  Brain,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  output?: string;
}

export default function TestPage() {
  const [isClient, setIsClient] = useState(false);
  const [testCode, setTestCode] = useState('');
  const [contractCode, setContractCode] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Test</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleGenerateTests = async () => {
    if (!contractCode.trim() || isGenerating) return;

    setIsGenerating(true);
    setTestCode('');

    try {
      const response = await fetch('/api/generate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractCode,
          contractType: 'ink'
        })
      });

      if (!response.ok) throw new Error('Error generando tests');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No se pudo leer la respuesta');

      let fullTests = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.content) {
                fullTests += parsed.content;
                setTestCode(fullTests);
              }
            } catch (e) {
              // Ignorar errores de parsing menores
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generando tests:', error);
      setTestCode(`// Error: ${error instanceof Error ? error.message : 'Error desconocido'}\n// Por favor, verifica tu conexión e intenta nuevamente.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunTests = async () => {
    if (!testCode.trim() || isRunning) return;

    setIsRunning(true);
    setTestResults([]);

    // Simulate test execution
    const mockTests: TestResult[] = [
      {
        id: '1',
        name: 'constructor_works',
        status: 'running',
        duration: 0
      },
      {
        id: '2',
        name: 'get_value_returns_correct_value',
        status: 'pending',
        duration: 0
      },
      {
        id: '3',
        name: 'set_value_updates_value',
        status: 'pending',
        duration: 0
      },
      {
        id: '4',
        name: 'transfer_works_correctly',
        status: 'pending',
        duration: 0
      }
    ];

    setTestResults(mockTests);

    // Simulate test execution with delays
    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.id === '1' 
          ? { ...test, status: 'passed', duration: 150 }
          : test
      ));
    }, 1000);

    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.id === '2' 
          ? { ...test, status: 'running' }
          : test
      ));
    }, 1500);

    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.id === '2' 
          ? { ...test, status: 'passed', duration: 200 }
          : test
      ));
    }, 2500);

    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.id === '3' 
          ? { ...test, status: 'running' }
          : test
      ));
    }, 3000);

    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.id === '3' 
          ? { ...test, status: 'failed', duration: 300, error: 'Assertion failed: expected 100, got 50' }
          : test
      ));
    }, 4000);

    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.id === '4' 
          ? { ...test, status: 'running' }
          : test
      ));
    }, 4500);

    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.id === '4' 
          ? { ...test, status: 'passed', duration: 180 }
          : test
      ));
      setIsRunning(false);
    }, 5500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(testCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([testCode], { type: 'text/rust' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract_tests.rs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <div className="w-4 h-4 rounded-full bg-gray-400" />;
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />;
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-400 bg-gray-400/20';
      case 'running': return 'text-blue-400 bg-blue-400/20';
      case 'passed': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'running': return 'Ejecutando';
      case 'passed': return 'Exitoso';
      case 'failed': return 'Falló';
      default: return status;
    }
  };

  const exampleTests = [
    {
      title: 'Tests Básicos',
      description: 'Tests fundamentales para contratos',
      code: `#[cfg(test)]
mod tests {
    use super::*;
    use ink_env::test;

    #[ink::test]
    fn constructor_works() {
        let contract = MyContract::new(42);
        assert_eq!(contract.get_value(), 42);
    }

    #[ink::test]
    fn set_value_works() {
        let mut contract = MyContract::new(0);
        assert!(contract.set_value(100).is_ok());
        assert_eq!(contract.get_value(), 100);
    }
}`
    },
    {
      title: 'Tests de Transferencia',
      description: 'Tests para funciones de transferencia',
      code: `#[ink::test]
fn transfer_works() {
    let accounts = default_accounts();
    let mut contract = MyContract::new(1000);
    
    assert_eq!(contract.balance_of(accounts.alice), 1000);
    
    let result = contract.transfer(accounts.bob, 100);
    assert!(result.is_ok());
    
    assert_eq!(contract.balance_of(accounts.alice), 900);
    assert_eq!(contract.balance_of(accounts.bob), 100);
}`
    },
    {
      title: 'Tests de Eventos',
      description: 'Verificar emisión de eventos',
      code: `#[ink::test]
fn transfer_emits_event() {
    let accounts = default_accounts();
    let mut contract = MyContract::new(1000);
    
    let result = contract.transfer(accounts.bob, 100);
    assert!(result.is_ok());
    
    let events = ink_env::test::emitted_events();
    assert_eq!(events.len(), 1);
    assert_eq!(events[0].event, "Transfer");
}`
    }
  ];

  const passedTests = testResults.filter(test => test.status === 'passed').length;
  const failedTests = testResults.filter(test => test.status === 'failed').length;
  const totalTests = testResults.length;

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
              <TestTube className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
              Testing Suite
            </h1>
            <p className="text-gray-400">Ejecuta y valida tus tests de contratos</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contract & Test Code Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Contract Input */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center flex-wrap gap-2">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Código del Contrato
                  </h2>
                  <Button
                    variant="primary"
                    onClick={handleGenerateTests}
                    disabled={!contractCode.trim() || isGenerating}
                    className="flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generar Tests con IA
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pega el código de tu contrato para generar tests automáticamente
                    </label>
                    <Textarea
                      value={contractCode}
                      onChange={(e) => setContractCode(e.target.value)}
                      placeholder="Pega aquí el código de tu contrato Ink!..."
                      className="min-h-[150px] xs:min-h-[200px] sm:min-h-[250px] md:min-h-[300px] font-mono text-xs sm:text-sm"
                      disabled={isGenerating}
                    />
                  </div>
                </div>
              </Card>

              {/* Test Code Input */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center flex-wrap gap-2">
                    <TestTube className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Código de Tests
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
                      Tests de tu contrato
                    </label>
                    <Textarea
                      value={testCode}
                      onChange={(e) => setTestCode(e.target.value)}
                      placeholder="Pega aquí tus tests de Ink! o genera automáticamente desde arriba..."
                      className="min-h-[250px] xs:min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] font-mono text-xs sm:text-sm"
                      disabled={isRunning}
                    />
                  </div>

                  <Button
                    onClick={handleRunTests}
                    disabled={!testCode.trim() || isRunning}
                    variant="primary"
                    className="w-full flex items-center justify-center"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Ejecutando Tests...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Ejecutar Tests
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Example Tests */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Ejemplos de Tests</h3>
                <div className="space-y-3">
                  {exampleTests.map((example, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => setTestCode(example.code)}
                      disabled={isRunning}
                    >
                      <div>
                        <div className="flex items-center mb-1">
                          <TestTube className="w-4 h-4 mr-2 text-purple-400" />
                          <span className="font-medium">{example.title}</span>
                        </div>
                        <p className="text-sm text-gray-400">{example.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Test Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center flex-wrap gap-2">
                    <TestTube className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Resultados
                  </h2>
                  {totalTests > 0 && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-400">{passedTests} pasaron</span>
                      <span className="text-red-400">{failedTests} fallaron</span>
                      <span className="text-gray-400">{totalTests} total</span>
                    </div>
                  )}
                </div>

                <div className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] min-h-[250px] overflow-auto">
                  {testResults.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Los resultados aparecerán aquí</p>
                        <p className="text-sm text-gray-500 mt-2">Ejecuta tus tests para ver los resultados</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {testResults.map((test) => (
                        <motion.div
                          key={test.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-slate-700/50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {getStatusIcon(test.status)}
                              <span className="ml-2 font-medium text-white">{test.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                                {getStatusText(test.status)}
                              </span>
                              {test.duration && (
                                <span className="text-xs text-gray-400">{test.duration}ms</span>
                              )}
                            </div>
                          </div>
                          
                          {test.error && (
                            <div className="mt-2 p-2 bg-red-900/20 border border-red-500/20 rounded text-sm text-red-300">
                              <div className="flex items-center mb-1">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                <span className="font-medium">Error:</span>
                              </div>
                              <code className="text-xs">{test.error}</code>
                            </div>
                          )}
                          
                          {test.output && (
                            <div className="mt-2 p-2 bg-slate-800 rounded text-sm text-gray-300">
                              <pre className="text-xs whitespace-pre-wrap">{test.output}</pre>
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
