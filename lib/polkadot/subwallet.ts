import { web3FromAddress, web3Accounts } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Signer } from '@polkadot/api/types';

export interface SubWalletAccount {
  address: string;
  name: string;
  source: string;
  type: string;
}

export interface SubWalletTransaction {
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
}

export class SubWalletService {
  private api: ApiPromise | null = null;
  private currentAccount: SubWalletAccount | null = null;

  constructor() {
    this.initializeApi();
  }

  private async initializeApi() {
    try {
      // Connect to Paseo Testnet
      const provider = new WsProvider('wss://paseo.rpc.amforc.com');
      this.api = await ApiPromise.create({ provider });
      console.log('🔗 Connected to Paseo Testnet');
    } catch (error) {
      console.error('Failed to connect to Paseo:', error);
    }
  }

  async getAccounts(): Promise<SubWalletAccount[]> {
    try {
      const accounts = await web3Accounts();
      return accounts.map(account => ({
        address: account.address,
        name: account.meta.name || 'Unnamed Account',
        source: account.meta.source,
        type: account.type || 'sr25519'
      }));
    } catch (error) {
      console.error('Failed to get accounts:', error);
      throw new Error('No se pudieron obtener las cuentas de SubWallet');
    }
  }

  async getSubWalletAccounts(): Promise<SubWalletAccount[]> {
    const accounts = await this.getAccounts();
    return accounts.filter(account => 
      account.source.toLowerCase().includes('subwallet')
    );
  }

  async connectAccount(address: string): Promise<SubWalletAccount> {
    try {
      const accounts = await this.getAccounts();
      const account = accounts.find(acc => acc.address === address);
      
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }

      this.currentAccount = account;
      console.log('🔗 Connected to account:', account.name);
      return account;
    } catch (error) {
      console.error('Failed to connect account:', error);
      throw error;
    }
  }

  async getSigner(address: string): Promise<Signer> {
    try {
      const injector = await web3FromAddress(address);
      
      if (!injector.signer) {
        throw new Error('No se pudo obtener el signer de SubWallet');
      }

      return injector.signer;
    } catch (error) {
      console.error('Failed to get signer:', error);
      throw new Error('No se pudo obtener el signer de SubWallet');
    }
  }

  async signTransaction(address: string, transaction: any): Promise<string> {
    try {
      const signer = await this.getSigner(address);
      
      if (!signer || !signer.signRaw) {
        throw new Error('Signer no disponible');
      }
      
      const signature = await signer.signRaw({
        address,
        data: transaction,
        type: 'bytes'
      });

      return signature.signature;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw new Error('No se pudo firmar la transacción');
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      if (!this.api) {
        throw new Error('API no inicializada');
      }

      const accountInfo = await this.api.query.system.account(address);
      const balance = (accountInfo as any).data?.free?.toString() || '0';
      
      return balance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw new Error('No se pudo obtener el balance');
    }
  }

  async sendTransaction(
    from: string,
    to: string,
    amount: string
  ): Promise<string> {
    try {
      if (!this.api) {
        throw new Error('API no inicializada');
      }

      const signer = await this.getSigner(from);
      
      // Create transfer transaction
      const transfer = this.api.tx.balances.transfer(to, amount);
      
      // Sign and send transaction
      const txHash = await transfer.signAndSend(from, { signer });
      
      console.log('📤 Transaction sent:', txHash);
      return txHash.toString();
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw new Error('No se pudo enviar la transacción');
    }
  }

  async deployContract(
    from: string,
    code: Uint8Array,
    endowment: string,
    gasLimit: string
  ): Promise<string> {
    try {
      if (!this.api) {
        throw new Error('API no inicializada');
      }

      const signer = await this.getSigner(from);
      
      // Create contract instantiation transaction
      const instantiate = this.api.tx.contracts.instantiate(
        endowment,
        gasLimit,
        code,
        '0x' // Empty data for now
      );
      
      // Sign and send transaction
      const txHash = await instantiate.signAndSend(from, { signer });
      
      console.log('📤 Contract deployment sent:', txHash);
      return txHash.toString();
    } catch (error) {
      console.error('Failed to deploy contract:', error);
      throw new Error('No se pudo desplegar el contrato');
    }
  }

  async disconnect(): Promise<void> {
    this.currentAccount = null;
    console.log('🔌 Disconnected from SubWallet');
  }

  getCurrentAccount(): SubWalletAccount | null {
    return this.currentAccount;
  }

  isConnected(): boolean {
    return this.currentAccount !== null;
  }
}

// Singleton instance
export const subWalletService = new SubWalletService();
