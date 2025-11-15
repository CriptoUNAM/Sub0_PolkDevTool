'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Brain,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CheckModelsPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkModels = async () => {
    setIsChecking(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch('/api/check-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error verificando modelos');
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      console.error('Error verificando modelos:', err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-16 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
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
              Verificar Modelos de Gemini Disponibles
            </h1>
            <p className="text-gray-400">Verifica qué modelos de Gemini están disponibles con tu API key</p>
          </motion.div>

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
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Verificación de Modelos
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Este proceso probará todos los modelos conocidos de Gemini para ver cuáles están disponibles con tu API key.
                  </p>
                </div>
                <Button
                  onClick={checkModels}
                  disabled={isChecking}
                  variant="primary"
                  className="flex items-center"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Verificar Modelos
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
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-300">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Summary */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Resumen</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{results.totalTested}</div>
                    <div className="text-sm text-gray-400">Modelos Probados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">{results.availableModels.length}</div>
                    <div className="text-sm text-gray-400">Disponibles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-1">{results.unavailableModels.length}</div>
                    <div className="text-sm text-gray-400">No Disponibles</div>
                  </div>
                </div>
              </Card>

              {/* Recommendation */}
              {results.recommendation && (
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h2 className="text-xl font-semibold text-white mb-4">Recomendación</h2>
                  {results.availableModels.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Modelo Principal:</span>
                        <code className="ml-2 px-2 py-1 bg-slate-700 rounded text-sm">{results.recommendation.primary}</code>
                      </div>
                      {results.recommendation.fallback && results.recommendation.fallback.length > 0 && (
                        <div className="text-gray-300 text-sm ml-7">
                          Fallbacks: {results.recommendation.fallback.join(', ')}
                        </div>
                      )}
                      <p className="text-gray-400 text-sm mt-2">{results.recommendation.message}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-red-400">
                        <XCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Ningún modelo disponible</span>
                      </div>
                      <p className="text-gray-300 text-sm">{results.recommendation.message}</p>
                      <p className="text-gray-400 text-sm">{results.recommendation.suggestion}</p>
                    </div>
                  )}
                </Card>
              )}

              {/* Available Models */}
              {results.availableModels.length > 0 && (
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Modelos Disponibles ({results.availableModels.length})
                  </h2>
                  <div className="space-y-2">
                    {results.availableModels.map((model: string, index: number) => (
                      <div key={index} className="p-3 bg-green-900/20 border border-green-500/30 rounded flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <code className="text-green-300 font-mono">{model}</code>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Unavailable Models */}
              {results.unavailableModels.length > 0 && (
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <XCircle className="w-5 h-5 mr-2 text-red-400" />
                    Modelos No Disponibles ({results.unavailableModels.length})
                  </h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {results.unavailableModels.map((item: any, index: number) => (
                      <div key={index} className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                        <div className="flex items-center mb-1">
                          <XCircle className="w-4 h-4 text-red-400 mr-2" />
                          <code className="text-red-300 font-mono text-sm">{item.model}</code>
                        </div>
                        <p className="text-red-400 text-xs ml-6">{item.error}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {/* Instructions */}
          {!results && !isChecking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Instrucciones</h2>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>1. Haz clic en "Verificar Modelos" para probar todos los modelos conocidos de Gemini.</p>
                  <p>2. El sistema probará cada modelo y te mostrará cuáles están disponibles con tu API key.</p>
                  <p>3. Usa los modelos disponibles en la configuración de tu proyecto.</p>
                  <p className="text-yellow-400 mt-4">
                    <strong>Nota:</strong> Si ningún modelo está disponible, verifica que tu API key tenga acceso a Gemini API en Google Cloud Console.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

