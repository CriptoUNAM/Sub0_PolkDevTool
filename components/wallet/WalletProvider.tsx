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
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedAccount = localStorage.getItem('polkadot-devkit-account');
        if (savedAccount) {
          setAccount(savedAccount);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    }
  }, []);

  const connect = async () => {
    setIsLoading(true);
    try {
      // Verificar primero si hay extensiones disponibles
      const hasExtensions = await subWalletService.checkExtensionsAvailable();
      if (!hasExtensions) {
        const errorMsg = 'No se encontró ninguna extensión de wallet.\n\nPor favor, instala:\n- SubWallet: https://subwallet.app/\n- Polkadot.js: https://polkadot.js.org/extension/';
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      // Intentar obtener cuentas de SubWallet primero
      let selectedAccount;
      try {
        const subWalletAccounts = await subWalletService.getSubWalletAccounts();
        
        if (subWalletAccounts.length > 0) {
          // Preferir SubWallet si está disponible
          selectedAccount = subWalletAccounts[0];
          console.log('✅ Usando cuenta de SubWallet');
        } else {
          // Fallback a cualquier cuenta disponible (Polkadot.js, etc.)
          const allAccounts = await subWalletService.getAccounts();
          
          if (allAccounts.length === 0) {
            throw new Error('No se encontraron cuentas en tu wallet. Por favor, crea una cuenta primero.');
          }
          
          selectedAccount = allAccounts[0];
          console.log('✅ Usando cuenta disponible:', selectedAccount.source);
        }
      } catch (accountsError) {
        // Si falla obtener cuentas, intentar obtener todas las cuentas disponibles
        const allAccounts = await subWalletService.getAccounts();
        
        if (allAccounts.length === 0) {
          throw new Error('No se encontraron cuentas en tu wallet. Por favor, crea una cuenta en SubWallet o Polkadot.js extension primero.');
        }
        
        selectedAccount = allAccounts[0];
      }

      // Conectar la cuenta seleccionada
      await subWalletService.connectAccount(selectedAccount.address);
      
      // Actualizar estado
      setAccount(selectedAccount.address);
      setIsConnected(true);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('polkadot-devkit-account', selectedAccount.address);
        localStorage.setItem('polkadot-devkit-wallet-source', selectedAccount.source);
        localStorage.setItem('polkadot-devkit-account-name', selectedAccount.name);
      }
      
      console.log('✅ Wallet conectada exitosamente');
      console.log('📍 Cuenta:', selectedAccount.name);
      console.log('🔗 Dirección:', selectedAccount.address);
      console.log('💼 Fuente:', selectedAccount.source);
      
    } catch (error) {
      console.error('❌ Error conectando wallet:', error);
      
      // Mensajes de error más específicos y útiles
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
          // No mostrar alert si el usuario canceló
          console.log('Usuario canceló la conexión');
          return;
        } else if (errorMessage.includes('No se encontró ninguna extensión')) {
          alert('❌ No se encontró ninguna extensión de wallet\n\nPor favor, instala:\n• SubWallet: https://subwallet.app/\n• Polkadot.js: https://polkadot.js.org/extension/');
        } else if (errorMessage.includes('No se encontraron cuentas')) {
          alert('❌ No se encontraron cuentas\n\nPor favor, crea una cuenta en tu wallet primero.');
        } else if (errorMessage.includes('No se pudo habilitar')) {
          alert('❌ No se pudo habilitar la extensión\n\nAsegúrate de que tu wallet esté desbloqueada y activa.');
        } else {
          // Mostrar el mensaje de error completo
          alert(`❌ Error conectando wallet:\n\n${errorMessage}`);
        }
      } else {
        alert('❌ Error desconocido al conectar wallet. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    await subWalletService.disconnect();
    setAccount(null);
    setIsConnected(false);
    if (typeof window !== 'undefined' && window.localStorage) {
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
