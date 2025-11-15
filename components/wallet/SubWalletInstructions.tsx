'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SubWalletInstructionsProps {
  isAvailable: boolean;
  isConnected: boolean;
}

export function SubWalletInstructions({ isAvailable, isConnected }: SubWalletInstructionsProps) {
  const steps = [
    {
      id: 1,
      title: 'Instalar SubWallet',
      description: 'Descarga e instala la extensión de SubWallet',
      status: isAvailable ? 'completed' : 'pending',
      action: 'install'
    },
    {
      id: 2,
      title: 'Crear cuenta',
      description: 'Crea una nueva cuenta o importa una existente',
      status: isConnected ? 'completed' : 'pending',
      action: 'create'
    },
    {
      id: 3,
      title: 'Obtener tokens de testnet',
      description: 'Consigue tokens de testnet desde el faucet oficial',
      status: 'pending',
      action: 'faucet'
    }
  ];

  const handleInstallSubWallet = () => {
    if (typeof window !== 'undefined' && window.open) {
      window.open('https://subwallet.app/', '_blank');
    }
  };

  const handleOpenFaucet = () => {
    if (typeof window !== 'undefined' && window.open) {
      window.open('https://faucet.polkadot.io/', '_blank');
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Configuración de SubWallet</h3>
        <p className="text-sm sm:text-base text-gray-400">
          Sigue estos pasos para configurar SubWallet y comenzar a desarrollar en Polkadot
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
              step.status === 'completed' 
                ? 'border-green-500/50 bg-green-500/10' 
                : step.status === 'pending'
                ? 'border-gray-500/30 bg-gray-500/5'
                : 'border-blue-500/50 bg-blue-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-gray-300'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-bold text-sm">{step.id}</span>
                  )}
                </div>
                {step.status === 'completed' && (
                  <div className="text-green-400 text-sm font-medium">
                    Completado
                  </div>
                )}
              </div>
              
              <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{step.description}</p>
              
              {step.action === 'install' && !isAvailable && (
                <Button
                  onClick={handleInstallSubWallet}
                  className="w-full"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar SubWallet
                </Button>
              )}
              
              {step.action === 'faucet' && (
                <Button
                  onClick={handleOpenFaucet}
                  variant="secondary"
                  className="w-full"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Faucet
                </Button>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-500/30 transform -translate-y-1/2" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Status Summary */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/5 rounded-xl border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold mb-2">Estado de SubWallet</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isAvailable ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span className="text-sm">
                  {isAvailable ? 'SubWallet detectada' : 'SubWallet no detectada'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-gray-400'
                }`} />
                <span className="text-sm">
                  {isConnected ? 'Conectada' : 'No conectada'}
                </span>
              </div>
            </div>
          </div>
          
          {isAvailable && !isConnected && (
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-2">
                SubWallet está instalada pero no conectada
              </p>
              <p className="text-xs text-blue-400">
                Haz clic en "Conectar SubWallet" arriba
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
