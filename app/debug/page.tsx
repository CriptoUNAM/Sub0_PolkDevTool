'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bug, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Copy,
  Check,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';

const EXAMPLE_ERRORS = [
  {
    name: 'Error de compilación - Importación faltante',
    error: `error[E0433]: failed to resolve: use of undeclared type or module \`ink\`
  --> src/lib.rs:1:1
   |
 1 | use ink::prelude::*;
   |     ^^^ use of undeclared type or module \`ink\`
   |
   = note: this error originates in the macro \`ink::contract\` (in Nightly builds, run with -Z macro-backtrace for more info)`
  },
  {
    name: 'Error de runtime - Balance insuficiente',
    error: `Error: Insufficient balance for transfer
    at Psp22Token::transfer (contract.rs:45:9)
    at caller::execute (runtime.rs:123:15)
    at runtime::execute (runtime.rs:456:20)`
  },
  {
    name: 'Error de deployment - Gas insuficiente',
    error: `Transaction failed: Gas limit exceeded
    Contract deployment requires 2,500,000 gas units
    Available gas: 2,000,000 gas units
    Please increase gas limit or optimize contract code`
  }
];

export default function DebugPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const [context, setContext] = useState('');
  const [debugResult, setDebugResult] = useState('');
  const [isDebugging, setIsDebugging] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDebug = async () => {
    if (!errorMessage.trim()) return;
    
    setIsDebugging(true);
    setDebugResult('');

    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorMessage,
          code: code || undefined,
          context: context || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to debug error');
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      let debugText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        debugText += chunk;
        setDebugResult(debugText);
      }
    } catch (error) {
      console.error('Error debugging:', error);
      alert('Error analizando el error. Por favor, intenta de nuevo.');
    } finally {
      setIsDebugging(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error:', err);
    }
  };

  const handleExampleSelect = (exampleError: string) => {
    setErrorMessage(exampleError);
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
              <Bug className="w-8 h-8 text-red-400 mr-3" />
              <h1 className="text-4xl font-bold gradient-text">Error Debugger</h1>
            </div>
            <p className="text-xl text-gray-300">
              Analiza errores de compilación y runtime con IA
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
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                    Error a analizar
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
                  <Textarea
                    label="Mensaje de error"
                    placeholder="Pega el mensaje de error completo aquí..."
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                  
                  <Textarea
                    label="Código relacionado (opcional)"
                    placeholder="Pega el código que causó el error..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  
                  <Textarea
                    label="Contexto adicional (opcional)"
                    placeholder="Describe qué estabas intentando hacer..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows={3}
                  />
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Ejemplos de errores:</p>
                    <div className="space-y-2">
                      {EXAMPLE_ERRORS.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => handleExampleSelect(example.error)}
                          className="block w-full text-left p-3 text-sm bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="font-medium">{example.name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {example.error.split('\n')[0]}...
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleDebug}
                    disabled={!errorMessage.trim() || isDebugging}
                    className="w-full"
                    size="lg"
                  >
                    {isDebugging ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Bug className="w-5 h-5 mr-2" />
                        Analizar Error
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
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Análisis del error
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([debugResult], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'debug-analysis.txt';
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
                  {debugResult ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {debugResult}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Bug className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">El análisis aparecerá aquí</p>
                        <p className="text-sm">Pega tu error y haz clic en "Analizar Error"</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Debugging Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
                Consejos para debugging efectivo
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-green-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Errores de compilación</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Verifica las importaciones</li>
                      <li>• Revisa la sintaxis de Rust</li>
                      <li>• Asegúrate de usar ink! 5.0</li>
                      <li>• Verifica los tipos de datos</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Zap className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Errores de runtime</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Verifica los balances</li>
                      <li>• Revisa los permisos</li>
                      <li>• Comprueba los parámetros</li>
                      <li>• Analiza la lógica de negocio</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ExternalLink className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Errores de deployment</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Verifica el gas disponible</li>
                      <li>• Comprueba la conexión</li>
                      <li>• Revisa los parámetros</li>
                      <li>• Optimiza el código</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
