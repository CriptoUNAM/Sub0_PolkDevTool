'use client';

import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWallet } from './WalletProvider';

export function WalletConnect() {
  const { isConnected, account, connect, disconnect, isLoading } = useWallet();
  
  // Get wallet source from localStorage
  const walletSource = typeof window !== 'undefined' 
    ? localStorage.getItem('polkadot-devkit-wallet-source') 
    : null;
  
  const isSubWallet = walletSource?.toLowerCase().includes('subwallet');

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
        <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/20">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            isSubWallet ? 'bg-blue-400' : 'bg-green-400'
          }`} />
          <span className="text-xs font-mono">
            {account.slice(0, 4)}...{account.slice(-3)}
          </span>
          {isSubWallet && (
            <span className="text-xs text-blue-400 font-medium ml-1">
              SubWallet
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={disconnect} className="w-6 h-6 p-0">
          <LogOut className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="secondary" size="sm" onClick={connect} className="text-xs px-2 py-1">
      <Wallet className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline">Conectar SubWallet</span>
      <span className="sm:hidden">SubWallet</span>
    </Button>
  );
}
