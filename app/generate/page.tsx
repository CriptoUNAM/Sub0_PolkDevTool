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
  const [language, setLanguage] = useState('rust');
  const [complexity, setComplexity] = useState('simple');

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

    try {
      console.log('[Generate] Iniciando generación...', { prompt, language, complexity });
      
      // Usar la API de Gemini
      const { generateContract } = await import('@/lib/api-client');
      
      let fullCode = '';
      let chunkCount = 0;
      
      for await (const chunk of generateContract({
        prompt,
        contractType: 'General',
        complexity: complexity,
        features: [],
        language: language
      })) {
        chunkCount++;
        fullCode += chunk;
        setGeneratedCode(fullCode);
        console.log(`[Generate] Chunk ${chunkCount} recibido, longitud total: ${fullCode.length}`);
      }
      
      console.log(`[Generate] Generación completada. Total chunks: ${chunkCount}, Longitud final: ${fullCode.length}`);
      
      if (!fullCode || fullCode.trim().length === 0) {
        console.error('[Generate] No se recibió código generado', { chunkCount, fullCodeLength: fullCode.length });
        setGeneratedCode(`// Error: No se recibió código de la API\n// Chunks recibidos: ${chunkCount}\n// Longitud del código: ${fullCode.length}\n//\n// Posibles causas:\n// 1. GEMINI_API_KEY no configurada o inválida en el servidor\n// 2. Problema de conexión con Gemini API\n// 3. El modelo no generó contenido (revisa los logs del servidor)\n//\n// Por favor:\n// 1. Verifica que GEMINI_API_KEY esté configurada en Vercel\n// 2. Revisa los logs del servidor en el dashboard de Vercel\n// 3. Intenta nuevamente\n// 4. Si el problema persiste, contacta al administrador`);
      }
    } catch (error) {
      console.error('[Generate] Error generando contrato:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setGeneratedCode(`// Error al generar contrato\n// ${errorMessage}\n\n// Por favor, verifica:\n// 1. Que GEMINI_API_KEY esté configurada en el servidor\n// 2. Tu conexión a internet\n// 3. Intenta nuevamente\n\n// Detalles del error:\nconsole.error('${errorMessage}');`);
    } finally {
      setIsGenerating(false);
    }
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center flex-wrap gap-2">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
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
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center flex-wrap gap-2">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
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
                      className="min-h-[120px] xs:min-h-[150px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[250px]"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Lenguaje
                      </label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
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
                        value={complexity}
                        onChange={(e) => setComplexity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isGenerating}
                      >
                        <option value="simple">Simple</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
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
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center flex-wrap gap-2">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
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

                <div className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] min-h-[250px] overflow-auto">
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
