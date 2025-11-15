'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Rocket, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Copy,
  RefreshCw,
  Globe,
  Zap,
  Brain,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

interface Deployment {
  id: string;
  name: string;
  status: 'pending' | 'deploying' | 'success' | 'error';
  contractAddress?: string;
  explorerUrl?: string;
  timestamp: Date;
  error?: string;
}

export default function DeployPage() {
  const [isClient, setIsClient] = useState(false);
  const [contractCode, setContractCode] = useState('');
  const [contractName, setContractName] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<'paseo' | 'westend' | 'polkadot'>('paseo');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);
  const [deploymentQuestion, setDeploymentQuestion] = useState('');
  const [deploymentAnswer, setDeploymentAnswer] = useState('');
  const [isAskingAssistant, setIsAskingAssistant] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load previous deployments from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('polkadot-deployments');
      if (saved) {
        setDeployments(JSON.parse(saved));
      }
    }
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Deploy</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleDeploy = async () => {
    if (!contractCode.trim() || !contractName.trim() || isDeploying) return;

    const deployment: Deployment = {
      id: Date.now().toString(),
      name: contractName,
      status: 'pending',
      timestamp: new Date()
    };

    setCurrentDeployment(deployment);
    setIsDeploying(true);

    // Simulate deployment process
    setTimeout(() => {
      deployment.status = 'deploying';
      setCurrentDeployment({ ...deployment });
    }, 1000);

    setTimeout(() => {
      deployment.status = 'success';
      deployment.contractAddress = '0x' + Math.random().toString(16).substr(2, 40);
      
      // Generar URL del explorador según la red seleccionada
      const rpcUrl = selectedNetwork === 'paseo' 
        ? 'wss://paseo.rpc.amforc.com'
        : selectedNetwork === 'westend'
        ? 'wss://westend-rpc.polkadot.io'
        : 'wss://rpc.polkadot.io';
      
      deployment.explorerUrl = `https://polkadot.js.org/apps/?rpc=${rpcUrl}#/explorer/query/${deployment.contractAddress}`;
      
      setDeployments(prev => [deployment, ...prev]);
      setCurrentDeployment(null);
      setIsDeploying(false);

      // Save to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('polkadot-deployments', JSON.stringify([deployment, ...deployments]));
      }
    }, 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />;
      case 'deploying': return <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'deploying': return 'Desplegando...';
      case 'success': return 'Exitoso';
      case 'error': return 'Error';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'deploying': return 'text-blue-400 bg-blue-400/20';
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleAskAssistant = async () => {
    if (!deploymentQuestion.trim() || isAskingAssistant) return;

    setIsAskingAssistant(true);
    setDeploymentAnswer('');

    try {
      const response = await fetch('/api/deployment-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractCode: contractCode || '',
          question: deploymentQuestion
        })
      });

      if (!response.ok) throw new Error('Error consultando asistente');

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
                setDeploymentAnswer(fullAnswer);
              }
            } catch (e) {
              // Ignorar errores de parsing menores
            }
          }
        }
      }
    } catch (error) {
      console.error('Error consultando asistente:', error);
      setDeploymentAnswer(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsAskingAssistant(false);
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center flex-wrap gap-2">
              <Rocket className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
              Deploy de Contratos
            </h1>
            <p className="text-gray-400">Despliega tus contratos en Paseo Testnet, Westend Testnet o Polkadot Mainnet</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Deploy Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center flex-wrap gap-2">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  Configuración de Deploy
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del Contrato
                    </label>
                    <Input
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                      placeholder="MiContrato"
                      disabled={isDeploying}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Código del Contrato
                    </label>
                    <Textarea
                      value={contractCode}
                      onChange={(e) => setContractCode(e.target.value)}
                      placeholder="Pega aquí el código de tu contrato Rust/Ink!"
                      className="min-h-[200px] xs:min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] font-mono text-xs sm:text-sm"
                      disabled={isDeploying}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Red de Deployment
                      </label>
                      <select 
                        value={selectedNetwork}
                        onChange={(e) => setSelectedNetwork(e.target.value as 'paseo' | 'westend' | 'polkadot')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isDeploying}
                      >
                        <option value="paseo">Paseo Testnet (Recomendado para desarrollo)</option>
                        <option value="westend">Westend Testnet (Pruebas de protocolo)</option>
                        <option value="polkadot">Polkadot Mainnet (Producción)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedNetwork === 'paseo' && 'Testnet para desarrollo de parachains y dApps'}
                        {selectedNetwork === 'westend' && 'Testnet para pruebas a nivel de protocolo'}
                        {selectedNetwork === 'polkadot' && '⚠️ Red de producción - tokens con valor real'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gas Limit
                      </label>
                      <Input
                        type="number"
                        placeholder="1000000"
                        disabled={isDeploying}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleDeploy}
                    disabled={!contractCode.trim() || !contractName.trim() || isDeploying}
                    variant="primary"
                    className="w-full flex items-center justify-center"
                  >
                    {isDeploying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Desplegando...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Desplegar Contrato
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Network Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6"
              >
                <Card className="p-4 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-400" />
                    Información de Red: {
                      selectedNetwork === 'paseo' ? 'Paseo Testnet' :
                      selectedNetwork === 'westend' ? 'Westend Testnet' :
                      'Polkadot Mainnet'
                    }
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Red:</span>
                      <span className="text-white font-medium">
                        {selectedNetwork === 'paseo' ? 'Paseo Testnet' :
                         selectedNetwork === 'westend' ? 'Westend Testnet' :
                         'Polkadot Mainnet'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Símbolo:</span>
                      <span className="text-white">
                        {selectedNetwork === 'paseo' ? 'PAS' :
                         selectedNetwork === 'westend' ? 'WND' :
                         'DOT'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo:</span>
                      <span className={`font-medium ${
                        selectedNetwork === 'polkadot' ? 'text-orange-400' : 'text-green-400'
                      }`}>
                        {selectedNetwork === 'polkadot' ? 'Mainnet (Producción)' : 'Testnet (Sin valor económico)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400">RPC Endpoint:</span>
                      <div className="text-right">
                        <code className="text-purple-400 text-xs break-all">
                          {selectedNetwork === 'paseo' ? 'wss://paseo.rpc.amforc.com' :
                           selectedNetwork === 'westend' ? 'wss://westend-rpc.polkadot.io' :
                           'wss://rpc.polkadot.io'}
                        </code>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Explorador:</span>
                      <a 
                        href={
                          selectedNetwork === 'paseo' 
                            ? 'https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com'
                            : selectedNetwork === 'westend'
                            ? 'https://polkadot.js.org/apps/?rpc=wss://westend-rpc.polkadot.io'
                            : 'https://polkadot.js.org/apps/?rpc=wss://rpc.polkadot.io'
                        }
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center"
                      >
                        Abrir <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                    {selectedNetwork !== 'polkadot' && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Faucet:</span>
                        <a 
                          href="https://faucet.polkadot.io/"
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 flex items-center"
                        >
                          Obtener tokens <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                    {selectedNetwork === 'polkadot' && (
                      <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <p className="text-xs text-orange-400 flex items-start">
                          <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Advertencia:</strong> Esta es la red de producción. Los tokens DOT tienen valor económico real. 
                            Asegúrate de haber probado exhaustivamente en testnets antes de desplegar aquí.
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Deployment Assistant */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6"
              >
                <Card className="p-4 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    Asistente de Deployment IA
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">Haz preguntas sobre deployment y obtén ayuda personalizada</p>
                  
                  <div className="space-y-3">
                    <Input
                      value={deploymentQuestion}
                      onChange={(e) => setDeploymentQuestion(e.target.value)}
                      placeholder="Ejemplo: ¿Cómo preparo mi contrato para deployment?"
                      className="w-full"
                      disabled={isAskingAssistant}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAskAssistant();
                        }
                      }}
                    />
                    <Button
                      onClick={handleAskAssistant}
                      disabled={!deploymentQuestion.trim() || isAskingAssistant}
                      variant="primary"
                      className="w-full flex items-center justify-center"
                    >
                      {isAskingAssistant ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Consultando...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Consultar Asistente
                        </>
                      )}
                    </Button>
                    
                    {deploymentAnswer && (
                      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="prose prose-invert max-w-none">
                          <div 
                            className="text-gray-300 whitespace-pre-wrap text-sm"
                            dangerouslySetInnerHTML={{ 
                              __html: deploymentAnswer
                                .replace(/```rust\n([\s\S]*?)\n```/g, '<pre class="bg-slate-800 p-3 rounded-lg overflow-x-auto"><code class="text-xs">$1</code></pre>')
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
            </motion.div>

            {/* Deployment Status & History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Current Deployment */}
              {currentDeployment && (
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-400" />
                    Deploy en Progreso
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Contrato:</span>
                      <span className="text-white">{currentDeployment.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Estado:</span>
                      <div className="flex items-center">
                        {getStatusIcon(currentDeployment.status)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentDeployment.status)}`}>
                          {getStatusText(currentDeployment.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tiempo:</span>
                      <span className="text-white">{currentDeployment.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Deployment History */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Historial de Deploys
                </h3>
                
                {deployments.length === 0 ? (
                  <div className="text-center py-8">
                    <Rocket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No hay deploys anteriores</p>
                    <p className="text-sm text-gray-500 mt-2">Los deploys aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[250px] xs:max-h-[300px] sm:max-h-[350px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                    {deployments.map((deployment) => (
                      <div key={deployment.id} className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{deployment.name}</h4>
                          <div className="flex items-center">
                            {getStatusIcon(deployment.status)}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                              {getStatusText(deployment.status)}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Tiempo:</span>
                            <span>{deployment.timestamp.toLocaleString()}</span>
                          </div>
                          {deployment.contractAddress && (
                            <div className="flex justify-between">
                              <span>Dirección:</span>
                              <div className="flex items-center">
                                <code className="text-purple-400 text-xs">
                                  {deployment.contractAddress.slice(0, 10)}...{deployment.contractAddress.slice(-8)}
                                </code>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => navigator.clipboard.writeText(deployment.contractAddress!)}
                                  className="ml-2 p-1"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                          {deployment.explorerUrl && (
                            <div className="flex justify-between">
                              <span>Explorer:</span>
                              <a 
                                href={deployment.explorerUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 flex items-center"
                              >
                                Ver <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
