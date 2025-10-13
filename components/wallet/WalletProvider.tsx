'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subWalletService } from '@/lib/polkadot/subwallet';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  signTransaction: (transaction: any) => Promise<string>;
  getBalance: () => Promise<string>;
  sendTransaction: (to: string, amount: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    // Check if wallet is already connected
    try {
      const savedAccount = localStorage.getItem('polkadot-devkit-account');
      if (savedAccount) {
        setAccount(savedAccount);
        setIsConnected(true);
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    }
  }, []);

  const connect = async () => {
    setIsLoading(true);
    try {
      // Get SubWallet accounts
      const subWalletAccounts = await subWalletService.getSubWalletAccounts();
      
      if (subWalletAccounts.length === 0) {
        // Fallback to any available accounts
        const allAccounts = await subWalletService.getAccounts();
        
        if (allAccounts.length === 0) {
          throw new Error('No accounts found. Please create an account in SubWallet first.');
        }
        
        // Use first available account
        const selectedAccount = allAccounts[0];
        await subWalletService.connectAccount(selectedAccount.address);
        
        setAccount(selectedAccount.address);
        setIsConnected(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('polkadot-devkit-account', selectedAccount.address);
          localStorage.setItem('polkadot-devkit-wallet-source', selectedAccount.source);
          localStorage.setItem('polkadot-devkit-account-name', selectedAccount.name);
        }
        
        console.log('🔗 Connected to wallet:', selectedAccount.source);
        console.log('📍 Account address:', selectedAccount.address);
        console.log('👤 Account name:', selectedAccount.name);
      } else {
        // Use first SubWallet account
        const selectedAccount = subWalletAccounts[0];
        await subWalletService.connectAccount(selectedAccount.address);
        
        setAccount(selectedAccount.address);
        setIsConnected(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('polkadot-devkit-account', selectedAccount.address);
          localStorage.setItem('polkadot-devkit-wallet-source', selectedAccount.source);
          localStorage.setItem('polkadot-devkit-account-name', selectedAccount.name);
        }
        
        console.log('✅ SubWallet connected:', selectedAccount.name);
        console.log('📍 Account address:', selectedAccount.address);
        console.log('🔗 Wallet source:', selectedAccount.source);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          alert('Conexión cancelada por el usuario');
        } else if (error.message.includes('No accounts found')) {
          alert('No se encontraron cuentas. Por favor, crea una cuenta en SubWallet primero.');
        } else if (error.message.includes('No wallet extension found')) {
          alert('SubWallet no está instalada. Por favor, instala SubWallet desde https://subwallet.app/');
        } else {
          alert(`Error conectando wallet: ${error.message}`);
        }
      } else {
        alert('Error desconocido al conectar wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    await subWalletService.disconnect();
    setAccount(null);
    setIsConnected(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('polkadot-devkit-account');
      localStorage.removeItem('polkadot-devkit-wallet-source');
      localStorage.removeItem('polkadot-devkit-account-name');
    }
  };

  const signTransaction = async (transaction: any): Promise<string> => {
    if (!account) {
      throw new Error('No hay cuenta conectada');
    }
    return await subWalletService.signTransaction(account, transaction);
  };

  const getBalance = async (): Promise<string> => {
    if (!account) {
      throw new Error('No hay cuenta conectada');
    }
    return await subWalletService.getBalance(account);
  };

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    if (!account) {
      throw new Error('No hay cuenta conectada');
    }
    return await subWalletService.sendTransaction(account, to, amount);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        account,
        connect,
        disconnect,
        isLoading,
        signTransaction,
        getBalance,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
