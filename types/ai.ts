export interface AIGenerationRequest {
  prompt: string;
  contractType: 'token' | 'nft' | 'governance' | 'staking' | 'defi' | 'custom';
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  features?: string[];
}

export interface AIGenerationResponse {
  code: string;
  explanation: string;
  securityNotes: string[];
  deploymentInstructions: string[];
  estimatedGasCost: string;
  tokensUsed: number;
}

export interface AIExplanationRequest {
  code: string;
  language: 'rust' | 'ink';
  focus?: 'general' | 'security' | 'optimization' | 'deployment';
}

export interface AIExplanationResponse {
  explanation: string;
  lineByLine: Array<{
    line: number;
    explanation: string;
  }>;
  concepts: Array<{
    term: string;
    definition: string;
  }>;
  securityAudit: string[];
  optimizationTips: string[];
}

export interface AIDebugRequest {
  errorMessage: string;
  code?: string;
  context?: string;
}

export interface AIDebugResponse {
  explanation: string;
  rootCause: string;
  suggestedFix: string;
  codeExample?: string;
  relatedDocs: string[];
  preventionTips: string[];
}
