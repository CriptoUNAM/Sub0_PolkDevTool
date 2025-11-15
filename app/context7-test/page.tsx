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
  FileText,
  Brain,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface Context7Test {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: string;
  error?: string;
  duration?: number;
}

export default function Context7TestPage() {
  const [isClient, setIsClient] = useState(false);
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState<Context7Test[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Context7 Test</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleRunTests = async () => {
    if (!testQuery.trim() || isRunning) return;

    setIsRunning(true);
    setTestResults([]);

    // Simulate Context7 API tests
    const mockTests: Context7Test[] = [
      {
        id: '1',
        name: 'API Connection Test',
        description: 'Verificar conexión con Context7 API',
        status: 'running',
        duration: 0
      },
      {
        id: '2',
        name: 'Query Processing Test',
        description: 'Procesar consulta de desarrollo',
        status: 'pending',
        duration: 0
      },
      {
        id: '3',
        name: 'Response Validation Test',
        description: 'Validar respuesta de la API',
        status: 'pending',
        duration: 0
      },
      {
        id: '4',
        name: 'Code Generation Test',
        description: 'Generar código basado en consulta',
        status: 'pending',
        duration: 0
      }
    ];

    setTestResults(mockTests);

    // Simulate test execution with delays
    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.id === '1' 
          ? { ...test, status: 'passed', duration: 250, result: 'API connection successful' }
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
          ? { ...test, status: 'passed', duration: 300, result: 'Query processed successfully' }
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
          ? { ...test, status: 'passed', duration: 200, result: 'Response validated' }
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
          ? { ...test, status: 'passed', duration: 500, result: 'Code generated successfully' }
          : test
      ));
      setIsRunning(false);
    }, 6000);
  };

  const copyQuery = () => {
    navigator.clipboard.writeText(testQuery);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const downloadQuery = () => {
    const blob = new Blob([testQuery], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'context7_test_query.txt';
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

  const exampleQueries = [
    {
      title: 'Desarrollo de Contrato',
      description: 'Consulta para generar un contrato ERC-20',
      query: 'Crea un contrato ERC-20 completo con funciones de mint, burn y transfer para Polkadot usando Ink!'
    },
    {
      title: 'Análisis de Código',
      description: 'Consulta para analizar código existente',
      query: 'Analiza este código de contrato inteligente y sugiere mejoras de seguridad y optimización'
    },
    {
      title: 'Debugging',
      description: 'Consulta para debugging de contratos',
      query: 'Ayúdame a debuggear este contrato que tiene errores de compilación en Rust/Ink!'
    },
    {
      title: 'Testing',
      description: 'Consulta para generar tests',
      query: 'Genera tests unitarios completos para este contrato de NFT en Ink!'
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
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-purple-400" />
              Context7 Test Suite
            </h1>
            <p className="text-gray-400">Prueba la integración con Context7 API</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Query Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Code className="w-5 h-5 mr-2 text-purple-400" />
                    Consulta de Prueba
                  </h2>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      onClick={copyQuery}
                      className="flex items-center"
                    >
                      {copiedQuery ? (
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
                      onClick={downloadQuery}
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
                      Consulta para Context7
                    </label>
                    <Textarea
                      value={testQuery}
                      onChange={(e) => setTestQuery(e.target.value)}
                      placeholder="Escribe aquí tu consulta para probar la API de Context7..."
                      className="min-h-[200px]"
                      disabled={isRunning}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo de Consulta
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isRunning}
                      >
                        <option value="development">Desarrollo</option>
                        <option value="analysis">Análisis</option>
                        <option value="debug">Debug</option>
                        <option value="test">Testing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Complejidad
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isRunning}
                      >
                        <option value="simple">Simple</option>
                        <option value="medium">Medio</option>
                        <option value="complex">Complejo</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleRunTests}
                    disabled={!testQuery.trim() || isRunning}
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

              {/* Example Queries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Consultas de Ejemplo</h3>
                <div className="space-y-3">
                  {exampleQueries.map((example, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => setTestQuery(example.query)}
                      disabled={isRunning}
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

              {/* Context7 Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6"
              >
                <Card className="p-4 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2 text-blue-400" />
                    Información de Context7
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">API:</span>
                      <span className="text-white">Context7 API</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estado:</span>
                      <span className="text-green-400">Conectado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Documentación:</span>
                      <a 
                        href="https://context7.io" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center"
                      >
                        Ver <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </Card>
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
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <TestTube className="w-5 h-5 mr-2 text-purple-400" />
                    Resultados de Tests
                  </h2>
                  {totalTests > 0 && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-400">{passedTests} pasaron</span>
                      <span className="text-red-400">{failedTests} fallaron</span>
                      <span className="text-gray-400">{totalTests} total</span>
                    </div>
                  )}
                </div>

                <div className="h-[500px] overflow-auto">
                  {isRunning ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Ejecutando tests de Context7...</p>
                        <p className="text-sm text-gray-500 mt-2">Verificando integración con la API</p>
                      </div>
                    </div>
                  ) : testResults.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Los resultados aparecerán aquí</p>
                        <p className="text-sm text-gray-500 mt-2">Ejecuta los tests para ver los resultados</p>
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
                              <div className="ml-3">
                                <h4 className="font-medium text-white">{test.name}</h4>
                                <p className="text-sm text-gray-400">{test.description}</p>
                              </div>
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
                          
                          {test.result && (
                            <div className="mt-2 p-2 bg-green-900/20 border border-green-500/20 rounded text-sm text-green-300">
                              <div className="flex items-center mb-1">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="font-medium">Resultado:</span>
                              </div>
                              <p>{test.result}</p>
                            </div>
                          )}
                          
                          {test.error && (
                            <div className="mt-2 p-2 bg-red-900/20 border border-red-500/20 rounded text-sm text-red-300">
                              <div className="flex items-center mb-1">
                                <XCircle className="w-4 h-4 mr-1" />
                                <span className="font-medium">Error:</span>
                              </div>
                              <p>{test.error}</p>
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
