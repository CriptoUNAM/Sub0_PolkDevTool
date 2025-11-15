'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  RefreshCw,
  Brain,
  Zap,
  Clock,
  Activity
} from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  error?: string;
  data?: any;
  modelUsed?: string;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  totalDuration: number;
}

export default function TestAIPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setSummary(null);
    setError(null);

    try {
      // Crear un AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutos (mismo que maxDuration)

      const response = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }).catch((fetchError) => {
        clearTimeout(timeoutId);
        
        // Verificar si fue un abort (timeout)
        if (fetchError.name === 'AbortError') {
          throw new Error(
            'La solicitud tardó demasiado tiempo (timeout de 5 minutos). ' +
            'Los tests pueden estar tomando más tiempo del esperado. Intenta nuevamente.'
          );
        }
        
        // Capturar errores de red
        throw new Error(
          `Error de conexión: ${fetchError.message}. ` +
          `Verifica que el servidor esté corriendo y que la ruta /api/test-ai esté disponible. ` +
          `Si el servidor está corriendo, puede ser un problema de red o CORS.`
        );
      });

      clearTimeout(timeoutId);

      // Verificar si la respuesta es válida antes de parsear
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      // Verificar el tipo de contenido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(
          `Respuesta inesperada del servidor: ${text.substring(0, 200)}`
        );
      }

      const data = await response.json().catch((parseError) => {
        throw new Error(
          `Error parseando respuesta JSON: ${parseError.message}`
        );
      });

      if (!response.ok) {
        throw new Error(data.error || `Error del servidor: ${response.status} ${response.statusText}`);
      }

      setTestResults(data.results || []);
      setSummary(data.summary || null);
      
      if (!data.success) {
        setError('Algunos tests fallaron');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido';
      setError(errorMessage);
      console.error('Error ejecutando tests:', err);
      console.error('Stack trace:', err.stack);
      
      // Agregar resultados vacíos para mostrar el error en la UI
      setTestResults([{
        testName: 'Error de Conexión',
        success: false,
        duration: 0,
        error: errorMessage
      }]);
      
      // Intentar establecer un resumen básico incluso con error
      setSummary({
        total: 1,
        passed: 0,
        failed: 1,
        totalDuration: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  const getStatusColor = (success: boolean) => {
    return success
      ? 'text-green-400 bg-green-400/20 border-green-400/30'
      : 'text-red-400 bg-red-400/20 border-red-400/30';
  };

  const passedCount = testResults.filter(r => r.success).length;
  const failedCount = testResults.filter(r => !r.success).length;

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
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
              Test Suite de IA - Gemini
            </h1>
            <p className="text-gray-400">Prueba todas las funcionalidades de IA del proyecto</p>
          </motion.div>

          {/* Summary Card */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{summary.total}</div>
                    <div className="text-sm text-gray-400">Tests Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">{summary.passed}</div>
                    <div className="text-sm text-gray-400">Exitosos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-1">{summary.failed}</div>
                    <div className="text-sm text-gray-400">Fallidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1 flex items-center justify-center">
                      <Clock className="w-5 h-5 mr-1" />
                      {(summary.totalDuration / 1000).toFixed(2)}s
                    </div>
                    <div className="text-sm text-gray-400">Duración Total</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2 flex items-center">
                    <TestTube className="w-5 h-5 mr-2 text-purple-400" />
                    Panel de Control
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Ejecuta tests completos de todas las funcionalidades de IA
                  </p>
                </div>
                <Button
                  onClick={runAllTests}
                  disabled={isRunning}
                  variant="primary"
                  className="flex items-center"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Ejecutar Todos los Tests
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <Card className="p-4 bg-red-900/20 border-red-500/30">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-300">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Test Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-400" />
                  Resultados de Tests
                </h2>
                {testResults.length > 0 && (
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-400">{passedCount} exitosos</span>
                    <span className="text-red-400">{failedCount} fallidos</span>
                  </div>
                )}
              </div>

              {isRunning && testResults.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Ejecutando tests de IA...</p>
                    <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos momentos</p>
                  </div>
                </div>
              ) : testResults.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No hay resultados aún</p>
                    <p className="text-sm text-gray-500 mt-2">Ejecuta los tests para ver los resultados</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getStatusColor(result.success)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1">
                          <div className="mt-0.5 mr-3">
                            {getStatusIcon(result.success)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{result.testName}</h3>
                            {result.data && (
                              <div className="text-sm text-gray-300 mt-2 space-y-1">
                                {Object.entries(result.data).map(([key, value]) => (
                                  <div key={key} className="flex">
                                    <span className="text-gray-400 mr-2">{key}:</span>
                                    <span className="text-white">
                                      {typeof value === 'string' && value.length > 100
                                        ? `${value.substring(0, 100)}...`
                                        : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {result.error && (
                              <div className="mt-2 p-2 bg-red-900/20 border border-red-500/20 rounded text-sm text-red-300">
                                <div className="flex items-center mb-1">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  <span className="font-medium">Error:</span>
                                </div>
                                <p className="text-xs">{result.error}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {result.duration}ms
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Tests Incluidos
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-white font-semibold mb-2">Generación de Contratos (9 tests)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-gray-300">
                    <div>✓ ink! - Simple, Intermedio, Avanzado</div>
                    <div>✓ Solidity - Simple, Intermedio, Avanzado</div>
                    <div>✓ Rust Substrate - Simple, Intermedio, Avanzado</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Explicación de Código (4 tests)</h4>
                  <div className="text-gray-300">✓ ink! (General, Seguridad), Solidity, Rust Substrate</div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Debug de Errores (4 tests)</h4>
                  <div className="text-gray-300">✓ Compilación ink!, Tipo Solidity, Runtime Rust, Lógica</div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Chat Conversacional (4 tests)</h4>
                  <div className="text-gray-300">✓ ink!, Substrate, Polkadot, Con historial</div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Otras Funcionalidades</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                    <div>✓ Generación de Tests (ink!, Solidity, Rust)</div>
                    <div>✓ Explicación de Plantillas (Storage, Token, NFT)</div>
                    <div>✓ Tutor de Aprendizaje (3 niveles)</div>
                    <div>✓ Asistente de Deployment (ink!, Solidity, Rust)</div>
                    <div>✓ Insights de Analytics</div>
                    <div>✓ Búsqueda Inteligente (Marketplace, Docs)</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <div className="text-purple-400 font-semibold">Total: ~40+ tests completos</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

