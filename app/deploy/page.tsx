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
  Zap
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
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);

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
      deployment.explorerUrl = `https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com#/explorer/query/${deployment.contractAddress}`;
      
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
              <Rocket className="w-8 h-8 mr-3 text-purple-400" />
              Deploy a Paseo
            </h1>
            <p className="text-gray-400">Despliega tus contratos en la testnet de Paseo</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Deploy Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-purple-400" />
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
                      className="min-h-[300px] font-mono text-sm"
                      disabled={isDeploying}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Red
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        disabled={isDeploying}
                      >
                        <option value="paseo">Paseo Testnet</option>
                        <option value="westend">Westend Testnet</option>
                        <option value="polkadot">Polkadot Mainnet</option>
                      </select>
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
                    Información de Red
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Red:</span>
                      <span className="text-white">Paseo Testnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">RPC:</span>
                      <span className="text-white">wss://paseo.rpc.amforc.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Explorer:</span>
                      <a 
                        href="https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center"
                      >
                        Abrir <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
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
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
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
