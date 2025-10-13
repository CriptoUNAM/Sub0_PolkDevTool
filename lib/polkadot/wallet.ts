import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import type { WalletAccount } from '@/types/wallet';

export async function connectWallet(): Promise<WalletAccount[]> {
  try {
    const extensions = await web3Enable('Polkadot DevKit');
    
    if (extensions.length === 0) {
      throw new Error('No wallet extension found. Please install Polkadot.js or SubWallet.');
    }
    
    const accounts = await web3Accounts();
    
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please create an account in your wallet.');
    }
    
    return accounts.map(account => ({
      address: account.address,
      name: account.meta.name,
      source: account.meta.source,
      type: account.type,
    }));
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

export async function getInjector(address: string) {
  try {
    return await web3FromAddress(address);
  } catch (error) {
    console.error('Failed to get injector:', error);
    throw error;
  }
}

export async function signTransaction(
  address: string,
  transaction: any
): Promise<string> {
  try {
    const injector = await getInjector(address);
    
    if (!injector.signer) {
      throw new Error('No signer available');
    }
    
    // Sign the transaction
    const signature = await injector.signer.signRaw({
      address,
      data: transaction,
      type: 'bytes'
    });
    
    return signature.signature;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
}
