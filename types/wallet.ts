export interface WalletAccount {
  address: string;
  name?: string;
  source: string;
  type?: string;
}

export interface WalletExtension {
  name: string;
  version: string;
  accounts: WalletAccount[];
}

export interface WalletState {
  isConnected: boolean;
  account: WalletAccount | null;
  extensions: WalletExtension[];
  isLoading: boolean;
  error: string | null;
}
