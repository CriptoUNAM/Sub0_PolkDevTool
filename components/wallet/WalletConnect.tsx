'use client';

import { Wallet, LogOut, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWallet } from './WalletProvider';
import { useState, useEffect } from 'react';
import { subWalletService } from '@/lib/polkadot/subwallet';

export function WalletConnect() {
  const { isConnected, account, connect, disconnect, isLoading } = useWallet();
  const [hasExtension, setHasExtension] = useState<boolean | null>(null);
  
  // Get wallet source from localStorage
  const walletSource = typeof window !== 'undefined' 
    ? localStorage.getItem('polkadot-devkit-wallet-source') 
    : null;
  
  const accountName = typeof window !== 'undefined'
    ? localStorage.getItem('polkadot-devkit-account-name')
    : null;
  
  const isSubWallet = walletSource?.toLowerCase().includes('subwallet');
  const isPolkadotJs = walletSource?.toLowerCase().includes('polkadot-js');

  // Verificar si hay extensiones disponibles
  useEffect(() => {
    const checkExtension = async () => {
      try {
        const available = await subWalletService.checkExtensionsAvailable();
        setHasExtension(available);
      } catch (error) {
        setHasExtension(false);
      }
    };
    
    if (!isConnected) {
      checkExtension();
    }
  }, [isConnected]);

  if (isLoading) {
    return (
      <Button variant="secondary" size="sm" disabled className="text-xs px-2 py-1">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        <span className="hidden sm:inline">Conectando...</span>
        <span className="sm:hidden">...</span>
      </Button>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isSubWallet ? 'bg-blue-400' : isPolkadotJs ? 'bg-orange-400' : 'bg-green-400'
          }`} />
          <div className="flex flex-col">
            {accountName && (
              <span className="text-[10px] text-gray-400 leading-none">
                {accountName}
              </span>
            )}
            <span className="text-xs font-mono leading-tight">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
          {(isSubWallet || isPolkadotJs) && (
            <span className={`text-[10px] font-medium ml-1 px-1.5 py-0.5 rounded ${
              isSubWallet 
                ? 'text-blue-400 bg-blue-400/10' 
                : 'text-orange-400 bg-orange-400/10'
            }`}>
              {isSubWallet ? 'SubWallet' : 'Polkadot.js'}
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={disconnect} 
          className="w-7 h-7 p-0 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          title="Desconectar wallet"
        >
          <LogOut className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  // Mostrar estado de extensión disponible
  if (hasExtension === false) {
    return (
      <div className="flex flex-col gap-1">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={connect} 
          className="text-xs px-2 py-1 opacity-75"
          title="Instala SubWallet o Polkadot.js extension"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Instalar Wallet</span>
          <span className="sm:hidden">Wallet</span>
        </Button>
        <span className="text-[10px] text-gray-500 text-center">
          Extensión no detectada
        </span>
      </div>
    );
  }

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      onClick={connect} 
      className="text-xs px-2 py-1 hover:bg-white/20 transition-colors"
      title="Conectar wallet (SubWallet o Polkadot.js)"
    >
      <Wallet className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline">Conectar Wallet</span>
      <span className="sm:hidden">Wallet</span>
    </Button>
  );
}
