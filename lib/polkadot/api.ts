import { ApiPromise, WsProvider } from '@polkadot/api';

let api: ApiPromise | null = null;

export async function getPolkadotApi() {
  if (api) return api;
  
  const rpcUrl = process.env.NEXT_PUBLIC_PASEO_RPC || 'wss://paseo.rpc.amforc.com';
  const provider = new WsProvider(rpcUrl);
  
  try {
    api = await ApiPromise.create({ 
      provider,
      types: {
        // Add custom types if needed
      }
    });
    
    console.log('Connected to Polkadot API');
    return api;
  } catch (error) {
    console.error('Failed to connect to Polkadot API:', error);
    throw error;
  }
}

export async function disconnectApi() {
  if (api) {
    await api.disconnect();
    api = null;
  }
}

export async function getApiInfo() {
  const api = await getPolkadotApi();
  
  return {
    chain: await api.rpc.system.chain(),
    version: await api.rpc.system.version(),
    properties: await api.rpc.system.properties(),
  };
}
