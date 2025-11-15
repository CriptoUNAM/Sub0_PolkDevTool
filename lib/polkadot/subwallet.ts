import { web3FromAddress, web3Accounts, web3Enable } from '@polkadot/extension-dapp';
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

  /**
   * Verifica si hay extensiones de wallet disponibles sin habilitarlas
   */
  async checkExtensionsAvailable(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      // Verificar si existe el objeto window.injectedWeb3
      const injectedWeb3 = (window as any).injectedWeb3;
      if (!injectedWeb3) {
        return false;
      }

      // Verificar extensiones comunes
      const commonExtensions = ['subwallet-js', 'polkadot-js'];
      return commonExtensions.some(ext => injectedWeb3[ext] !== undefined);
    } catch (error) {
      console.error('Error checking extensions:', error);
      return false;
    }
  }

  async getAccounts(): Promise<SubWalletAccount[]> {
    try {
      console.log('[SubWallet] 🔍 Verificando extensiones...');
      // Verificar primero si hay extensiones disponibles
      const hasExtensions = await this.checkExtensionsAvailable();
      if (!hasExtensions) {
        throw new Error('No se encontró ninguna extensión de wallet. Por favor, instala SubWallet o Polkadot.js extension desde:\n- SubWallet: https://subwallet.app/\n- Polkadot.js: https://polkadot.js.org/extension/');
      }
      console.log('[SubWallet] ✅ Extensiones detectadas');

      // Primero habilitar la extensión (requerido antes de web3Accounts)
      // Esto puede mostrar un popup al usuario para aprobar permisos
      console.log('[SubWallet] 🔐 Habilitando extensión (puede requerir aprobación del usuario)...');
      
      // Agregar timeout para evitar que se quede colgado si el usuario no responde
      const enablePromise = web3Enable('Polkadot DevKit');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La extensión no respondió. Por favor, verifica que tu wallet esté desbloqueada y vuelve a intentar.')), 30000)
      );
      
      const extensions = await Promise.race([enablePromise, timeoutPromise]) as any;
      
      if (!extensions || extensions.length === 0) {
        throw new Error('No se pudo habilitar ninguna extensión de wallet. Por favor, verifica que SubWallet o Polkadot.js extension estén instaladas y activas.');
      }

      console.log('[SubWallet] ✅ Extensiones habilitadas:', extensions.map((ext: any) => ext.name));

      // Ahora obtener las cuentas
      console.log('[SubWallet] 📋 Obteniendo cuentas...');
      const accounts = await web3Accounts();
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No se encontraron cuentas en tu wallet. Por favor, crea una cuenta en SubWallet o Polkadot.js extension primero.');
      }

      console.log(`[SubWallet] ✅ ${accounts.length} cuenta(s) encontrada(s)`);

      const mappedAccounts = accounts.map(account => ({
        address: account.address,
        name: account.meta.name || 'Unnamed Account',
        source: account.meta.source,
        type: account.type || 'sr25519'
      }));

      console.log('[SubWallet] 📝 Cuentas mapeadas:', mappedAccounts.map(acc => `${acc.name} (${acc.source})`));
      return mappedAccounts;
    } catch (error) {
      console.error('[SubWallet] ❌ Error obteniendo cuentas:', error);
      
      if (error instanceof Error) {
        // Re-lanzar errores específicos con mensajes mejorados
        if (error.message.includes('No se encontró') || 
            error.message.includes('No se encontraron') ||
            error.message.includes('No se pudo habilitar')) {
          throw error;
        }
      }
      
      throw new Error('No se pudieron obtener las cuentas. Verifica que tu wallet esté instalada y desbloqueada.');
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

      return injector.signer as any;
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
      const txHash = await transfer.signAndSend(from, { signer: signer as any });
      
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
      const txHash = await instantiate.signAndSend(from, { signer: signer as any });
      
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
