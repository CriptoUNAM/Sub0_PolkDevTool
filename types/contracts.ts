export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'token' | 'nft' | 'governance' | 'defi' | 'staking' | 'dao' | 'xcm' | 'vesting' | 'wallet' | 'oracle' | 'marketplace' | 'insurance';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  code: string;
  features: string[];
  deploymentSteps: string[];
  securityConsiderations: string[];
}

export interface GeneratedContract {
  code: string;
  explanation: string;
  securityNotes: string[];
  deploymentInstructions: string[];
  estimatedGasCost: string;
}

export interface ContractDeployment {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'pending' | 'success' | 'failed';
}
