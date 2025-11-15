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
    console.log('🔄 Iniciando conexión de wallet...');
    setIsLoading(true);
    
    try {
      // Verificar primero si hay extensiones disponibles
      console.log('🔍 Verificando extensiones disponibles...');
      const hasExtensions = await subWalletService.checkExtensionsAvailable();
      if (!hasExtensions) {
        const errorMsg = 'No se encontró ninguna extensión de wallet.\n\nPor favor, instala:\n- SubWallet: https://subwallet.app/\n- Polkadot.js: https://polkadot.js.org/extension/';
        alert(errorMsg);
        throw new Error(errorMsg);
      }
      console.log('✅ Extensiones detectadas');

      // Intentar obtener todas las cuentas disponibles directamente
      console.log('🔍 Obteniendo cuentas disponibles...');
      let selectedAccount;
      
      try {
        // Primero intentar obtener todas las cuentas
        const allAccounts = await subWalletService.getAccounts();
        console.log(`📋 ${allAccounts.length} cuenta(s) encontrada(s)`);
        
        if (allAccounts.length === 0) {
          throw new Error('No se encontraron cuentas en tu wallet. Por favor, crea una cuenta primero.');
        }
        
        // Preferir SubWallet si está disponible, sino usar la primera disponible
        const subWalletAccount = allAccounts.find(acc => 
          acc.source.toLowerCase().includes('subwallet')
        );
        
        selectedAccount = subWalletAccount || allAccounts[0];
        console.log('✅ Cuenta seleccionada:', selectedAccount.name, `(${selectedAccount.source})`);
        
      } catch (accountsError: any) {
        console.error('❌ Error obteniendo cuentas:', accountsError);
        throw accountsError;
      }

      // Conectar la cuenta seleccionada
      console.log('🔗 Conectando cuenta...');
      await subWalletService.connectAccount(selectedAccount.address);
      console.log('✅ Cuenta conectada');
      
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
      
      // Resetear estado en caso de error
      setAccount(null);
      setIsConnected(false);
      
      // Mensajes de error más específicos y útiles
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
          // No mostrar alert si el usuario canceló
          console.log('ℹ️ Usuario canceló la conexión');
          return;
        } else if (errorMessage.includes('No se encontró ninguna extensión')) {
          alert('❌ No se encontró ninguna extensión de wallet\n\nPor favor, instala:\n• SubWallet: https://subwallet.app/\n• Polkadot.js: https://polkadot.js.org/extension/');
        } else if (errorMessage.includes('No se encontraron cuentas')) {
          alert('❌ No se encontraron cuentas\n\nPor favor, crea una cuenta en tu wallet primero.');
        } else if (errorMessage.includes('No se pudo habilitar')) {
          alert('❌ No se pudo habilitar la extensión\n\nAsegúrate de que tu wallet esté desbloqueada y activa.');
        } else {
          // Mostrar el mensaje de error completo
          console.error('Error completo:', error);
          alert(`❌ Error conectando wallet:\n\n${errorMessage}\n\nRevisa la consola para más detalles.`);
        }
      } else {
        console.error('Error desconocido:', error);
        alert('❌ Error desconocido al conectar wallet. Por favor, intenta de nuevo.');
      }
    } finally {
      console.log('🏁 Finalizando proceso de conexión');
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
