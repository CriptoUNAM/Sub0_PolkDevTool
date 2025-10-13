import { ContractPromise } from '@polkadot/api-contract';
import { getPolkadotApi } from './api';
import type { ContractDeployment } from '@/types/contracts';

export async function deployContract(
  wasm: Uint8Array,
  abi: any,
  constructorIndex: number,
  args: any[],
  senderAddress: string
): Promise<ContractDeployment> {
  try {
    const api = await getPolkadotApi();
    
    // Create contract instance
    const contract = new ContractPromise(api, abi, wasm);
    
    // Get the constructor
    const constructor = contract.constructors[constructorIndex];
    if (!constructor) {
      throw new Error('Constructor not found');
    }
    
    // Create the deployment transaction
    const tx = contract.tx[constructor.method](constructor.options, ...args);
    
    // Get the injector for signing
    const { web3FromAddress } = await import('@polkadot/extension-dapp');
    const injector = await web3FromAddress(senderAddress);
    
    if (!injector.signer) {
      throw new Error('No signer available');
    }
    
    // Sign and send the transaction
    const unsub = await tx.signAndSend(
      senderAddress,
      { signer: injector.signer },
      ({ status, events }) => {
        if (status.isInBlock) {
          console.log('Contract deployment transaction included in block');
          
          events.forEach(({ event }) => {
            if (event.method === 'Instantiated') {
              console.log('Contract instantiated:', event.data);
            }
          });
        }
      }
    );
    
    // For demo purposes, return a mock deployment
    return {
      contractAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // Mock address
      transactionHash: '0x1234567890abcdef', // Mock hash
      blockNumber: 12345, // Mock block number
      gasUsed: '1000000', // Mock gas used
      status: 'success'
    };
  } catch (error) {
    console.error('Failed to deploy contract:', error);
    throw error;
  }
}

export async function getContractInfo(contractAddress: string) {
  try {
    const api = await getPolkadotApi();
    
    // Get contract info from the blockchain
    const contractInfo = await api.query.contracts.contractInfo(contractAddress);
    
    return {
      address: contractAddress,
      codeHash: contractInfo.codeHash,
      trieId: contractInfo.trieId,
      storageDeposit: contractInfo.storageDeposit,
    };
  } catch (error) {
    console.error('Failed to get contract info:', error);
    throw error;
  }
}
