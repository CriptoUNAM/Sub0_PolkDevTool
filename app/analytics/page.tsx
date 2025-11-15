'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowLeft,
  Download,
  RefreshCw,
  Brain,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [insightQuestion, setInsightQuestion] = useState('');
  const [insightAnswer, setInsightAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Analytics</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Contratos Generados', value: '1,234', change: '+12%', icon: BarChart3 },
    { label: 'Usuarios Activos', value: '456', change: '+8%', icon: Users },
    { label: 'Tiempo Ahorrado', value: '2,340h', change: '+15%', icon: TrendingUp },
    { label: 'Deployments', value: '89', change: '+23%', icon: Activity }
  ];

  const handleAskInsights = async () => {
    if (isAsking) return;

    setIsAsking(true);
    setInsightAnswer('');

    try {
      const analyticsData = {
        contractsGenerated: 1234,
        usersActive: 456,
        timeSaved: '2,340h',
        deployments: 89
      };

      const response = await fetch('/api/analytics-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analyticsData,
          question: insightQuestion || undefined
        })
      });

      if (!response.ok) throw new Error('Error obteniendo insights');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No se pudo leer la respuesta');

      let fullAnswer = '';
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
                fullAnswer += parsed.content;
                setInsightAnswer(fullAnswer);
              }
            } catch (e) {
              // Ignorar errores de parsing menores
            }
          }
        }
      }
    } catch (error) {
      console.error('Error obteniendo insights:', error);
      setInsightAnswer(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsAsking(false);
    }
  };

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-gray-400">Métricas y estadísticas del Polkadot DevKit</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-purple-400" />
                  <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </Card>
            ))}
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Contratos por Mes</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Gráfico de contratos generados</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Usuarios Activos</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                  <p>Gráfico de usuarios activos</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-400" />
                Insights IA
              </h3>
              <p className="text-gray-400 mb-4">Obtén análisis inteligente de tus métricas o haz preguntas específicas</p>
              
              <div className="space-y-4">
                <Input
                  value={insightQuestion}
                  onChange={(e) => setInsightQuestion(e.target.value)}
                  placeholder="Ejemplo: ¿Qué tendencias veo en el uso de la plataforma?"
                  className="w-full"
                  disabled={isAsking}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAskInsights();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAskInsights}
                    disabled={isAsking}
                    variant="primary"
                    className="flex items-center"
                  >
                    {isAsking ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Obtener Insights
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setInsightQuestion('');
                      handleAskInsights();
                    }}
                    disabled={isAsking}
                    variant="secondary"
                    className="flex items-center"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Análisis General
                  </Button>
                </div>
                
                {insightAnswer && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <div className="prose prose-invert max-w-none">
                      <div 
                        className="text-gray-300 whitespace-pre-wrap text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: insightAnswer
                            .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-800 p-3 rounded-lg overflow-x-auto"><code class="text-xs">$1</code></pre>')
                            .replace(/### (.*)/g, '<h3 class="text-base font-semibold text-white mt-4 mb-2">$1</h3>')
                            .replace(/## (.*)/g, '<h2 class="text-lg font-semibold text-white mt-6 mb-3">$1</h2>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em class="text-purple-300">$1</em>')
                            .replace(/`(.*?)`/g, '<code class="bg-slate-700 px-1 py-0.5 rounded text-xs">$1</code>')
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="primary" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Exportar Datos
            </Button>
            <Button variant="secondary" className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
