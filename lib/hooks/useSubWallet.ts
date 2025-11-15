'use client';

import { useState, useEffect } from 'react';

interface SubWalletInfo {
  isAvailable: boolean;
  isConnected: boolean;
  account: string | null;
  source: string | null;
}

export function useSubWallet(): SubWalletInfo {
  const [subWalletInfo, setSubWalletInfo] = useState<SubWalletInfo>({
    isAvailable: false,
    isConnected: false,
    account: null,
    source: null,
  });

  useEffect(() => {
    const checkSubWallet = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') return;

        // Check localStorage for existing connection
        if (typeof window !== 'undefined' && window.localStorage) {
          const savedAccount = localStorage.getItem('polkadot-devkit-account');
          const savedSource = localStorage.getItem('polkadot-devkit-wallet-source');
        
          if (savedAccount && savedSource) {
            const isSubWallet = savedSource.toLowerCase().includes('subwallet');
            setSubWalletInfo({
              isAvailable: true,
              isConnected: isSubWallet,
              account: isSubWallet ? savedAccount : null,
              source: isSubWallet ? savedSource : null,
            });
            return;
          }
        }

        // Check if SubWallet extension is available
        const { web3Enable } = await import('@polkadot/extension-dapp');
        const extensions = await web3Enable('Polkadot DevKit');
        
        const subwalletExtension = extensions.find(ext => 
          ext.name.toLowerCase().includes('subwallet')
        );

        if (subwalletExtension) {
          console.log('🔍 SubWallet extension found:', {
            name: subwalletExtension.name,
            version: subwalletExtension.version,
            accounts: Array.isArray(subwalletExtension.accounts) ? subwalletExtension.accounts.length : 0
          });
        }

        setSubWalletInfo(prev => ({
          ...prev,
          isAvailable: !!subwalletExtension,
        }));

      } catch (error) {
        console.error('Error checking SubWallet:', error);
        setSubWalletInfo(prev => ({
          ...prev,
          isAvailable: false,
        }));
      }
    };

    checkSubWallet();
    
    // Check periodically for SubWallet availability
    const interval = setInterval(checkSubWallet, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return subWalletInfo;
}
