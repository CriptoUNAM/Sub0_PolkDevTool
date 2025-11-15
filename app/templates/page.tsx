'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FileText, 
  Code, 
  Download, 
  Copy,
  ArrowLeft,
  Play,
  Eye,
  Star,
  Zap,
  Shield,
  Globe,
  Brain,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  features: string[];
  code: string;
  preview: string;
  rating: number;
  downloads: number;
}

export default function TemplatesPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Templates</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const templates: Template[] = [
    {
      id: '1',
      name: 'ERC-20 Token',
      description: 'Implementación completa de un token ERC-20 para Polkadot',
      category: 'Token',
      language: 'Rust',
      complexity: 'Intermediate',
      features: ['Mint/Burn', 'Transfer', 'Approve', 'Events'],
      code: `#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
pub mod erc20 {
    use ink_storage::traits::SpreadAllocate;
    use ink_storage::Mapping;
    use ink_prelude::string::String;

    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct Erc20 {
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
        allowances: Mapping<(AccountId, AccountId), Balance>,
        name: String,
        symbol: String,
        decimals: u8,
    }

    #[ink(event)]
    pub struct Transfer {
        #[ink(topic)]
        from: Option<AccountId>,
        #[ink(topic)]
        to: Option<AccountId>,
        value: Balance,
    }

    #[ink(event)]
    pub struct Approval {
        #[ink(topic)]
        owner: AccountId,
        #[ink(topic)]
        spender: AccountId,
        value: Balance,
    }

    impl Erc20 {
        #[ink(constructor)]
        pub fn new(
            initial_supply: Balance,
            name: String,
            symbol: String,
            decimals: u8,
        ) -> Self {
            let mut instance = Self {
                total_supply: initial_supply,
                balances: Default::default(),
                allowances: Default::default(),
                name,
                symbol,
                decimals,
            };
            instance.balances.insert(Self::env().caller(), initial_supply);
            ink_lang::utils::initialize_contract(|instance| {
                Self::env().emit_event(Transfer {
                    from: None,
                    to: Some(Self::env().caller()),
                    value: initial_supply,
                });
            });
            instance
        }

        #[ink(message)]
        pub fn total_supply(&self) -> Balance {
            self.total_supply
        }

        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> Balance {
            self.balances.get(owner).unwrap_or(0)
        }

        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, value: Balance) -> bool {
            self.transfer_from_to(self.env().caller(), to, value)
        }

        #[ink(message)]
        pub fn approve(&mut self, spender: AccountId, value: Balance) -> bool {
            let owner = self.env().caller();
            self.allowances.insert((owner, spender), value);
            self.env().emit_event(Approval {
                owner,
                spender,
                value,
            });
            true
        }

        #[ink(message)]
        pub fn transfer_from(
            &mut self,
            from: AccountId,
            to: AccountId,
            value: Balance,
        ) -> bool {
            self.transfer_from_to(from, to, value)
        }

        fn transfer_from_to(
            &mut self,
            from: AccountId,
            to: AccountId,
            value: Balance,
        ) -> bool {
            let from_balance = self.balance_of(from);
            if from_balance < value {
                return false;
            }

            self.balances.insert(from, from_balance - value);
            let to_balance = self.balance_of(to);
            self.balances.insert(to, to_balance + value);

            self.env().emit_event(Transfer {
                from: Some(from),
                to: Some(to),
                value,
            });

            true
        }
    }
}`,
      preview: 'https://example.com/preview/erc20',
      rating: 4.8,
      downloads: 1234
    },
    {
      id: '2',
      name: 'NFT Collection',
      description: 'Colección de NFTs con funcionalidades de minting y trading',
      category: 'NFT',
      language: 'Rust',
      complexity: 'Advanced',
      features: ['Mint', 'Burn', 'Transfer', 'Metadata', 'Royalties'],
      code: `#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
pub mod nft_collection {
    use ink_storage::traits::SpreadAllocate;
    use ink_storage::Mapping;
    use ink_prelude::string::String;

    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct NftCollection {
        name: String,
        symbol: String,
        next_token_id: u32,
        token_owner: Mapping<u32, AccountId>,
        token_approvals: Mapping<u32, AccountId>,
        operator_approvals: Mapping<(AccountId, AccountId), bool>,
        token_metadata: Mapping<u32, String>,
    }

    #[ink(event)]
    pub struct Transfer {
        #[ink(topic)]
        from: Option<AccountId>,
        #[ink(topic)]
        to: Option<AccountId>,
        #[ink(topic)]
        id: u32,
    }

    impl NftCollection {
        #[ink(constructor)]
        pub fn new(name: String, symbol: String) -> Self {
            let mut instance = Self {
                name,
                symbol,
                next_token_id: 0,
                token_owner: Default::default(),
                token_approvals: Default::default(),
                operator_approvals: Default::default(),
                token_metadata: Default::default(),
            };
            ink_lang::utils::initialize_contract(|instance| {});
            instance
        }

        #[ink(message)]
        pub fn mint(&mut self, to: AccountId, metadata: String) -> u32 {
            let token_id = self.next_token_id;
            self.next_token_id += 1;
            self.token_owner.insert(token_id, to);
            self.token_metadata.insert(token_id, metadata);
            
            self.env().emit_event(Transfer {
                from: None,
                to: Some(to),
                id: token_id,
            });
            
            token_id
        }

        #[ink(message)]
        pub fn owner_of(&self, token_id: u32) -> Option<AccountId> {
            self.token_owner.get(token_id)
        }

        #[ink(message)]
        pub fn transfer(&mut self, from: AccountId, to: AccountId, token_id: u32) -> bool {
            if self.owner_of(token_id) != Some(from) {
                return false;
            }
            
            self.token_owner.insert(token_id, to);
            self.token_approvals.remove(token_id);
            
            self.env().emit_event(Transfer {
                from: Some(from),
                to: Some(to),
                id: token_id,
            });
            
            true
        }
    }
}`,
      preview: 'https://example.com/preview/nft',
      rating: 4.6,
      downloads: 856
    },
    {
      id: '3',
      name: 'DAO Governance',
      description: 'Sistema de gobernanza descentralizada para DAOs',
      category: 'Governance',
      language: 'Rust',
      complexity: 'Advanced',
      features: ['Proposals', 'Voting', 'Execution', 'Quorum'],
      code: `#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
pub mod dao_governance {
    use ink_storage::traits::SpreadAllocate;
    use ink_storage::Mapping;
    use ink_prelude::vec::Vec;

    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct DaoGovernance {
        proposals: Mapping<u32, Proposal>,
        next_proposal_id: u32,
        voting_power: Mapping<AccountId, u128>,
        quorum_threshold: u128,
        voting_period: u64,
    }

    #[derive(scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Proposal {
        proposer: AccountId,
        description: String,
        start_time: u64,
        end_time: u64,
        votes_for: u128,
        votes_against: u128,
        executed: bool,
    }

    #[ink(event)]
    pub struct ProposalCreated {
        #[ink(topic)]
        proposal_id: u32,
        #[ink(topic)]
        proposer: AccountId,
    }

    impl DaoGovernance {
        #[ink(constructor)]
        pub fn new(quorum_threshold: u128, voting_period: u64) -> Self {
            let mut instance = Self {
                proposals: Default::default(),
                next_proposal_id: 0,
                voting_power: Default::default(),
                quorum_threshold,
                voting_period,
            };
            ink_lang::utils::initialize_contract(|instance| {});
            instance
        }

        #[ink(message)]
        pub fn create_proposal(&mut self, description: String) -> u32 {
            let proposal_id = self.next_proposal_id;
            self.next_proposal_id += 1;
            
            let now = self.env().block_timestamp();
            let proposal = Proposal {
                proposer: self.env().caller(),
                description,
                start_time: now,
                end_time: now + self.voting_period,
                votes_for: 0,
                votes_against: 0,
                executed: false,
            };
            
            self.proposals.insert(proposal_id, proposal);
            
            self.env().emit_event(ProposalCreated {
                proposal_id,
                proposer: self.env().caller(),
            });
            
            proposal_id
        }

        #[ink(message)]
        pub fn vote(&mut self, proposal_id: u32, support: bool, voting_power: u128) -> bool {
            let mut proposal = self.proposals.get(proposal_id)?;
            let now = self.env().block_timestamp();
            
            if now < proposal.start_time || now > proposal.end_time {
                return false;
            }
            
            if support {
                proposal.votes_for += voting_power;
            } else {
                proposal.votes_against += voting_power;
            }
            
            self.proposals.insert(proposal_id, proposal);
            true
        }
    }
}`,
      preview: 'https://example.com/preview/dao',
      rating: 4.9,
      downloads: 432
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const copyCode = () => {
    if (selectedTemplate) {
      navigator.clipboard.writeText(selectedTemplate.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleExplainTemplate = async () => {
    if (!selectedTemplate || isExplaining) return;

    setIsExplaining(true);
    setExplanation('');

    try {
      const response = await fetch('/api/explain-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateCode: selectedTemplate.code,
          templateName: selectedTemplate.name
        })
      });

      if (!response.ok) throw new Error('Error al explicar plantilla');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No se pudo leer la respuesta');

      let fullExplanation = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.content) {
                fullExplanation += parsed.content;
                setExplanation(fullExplanation);
              }
            } catch (e) {
              // Ignorar errores de parsing menores
            }
          }
        }
      }
    } catch (error) {
      console.error('Error explicando plantilla:', error);
      setExplanation(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-16 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center flex-wrap gap-2">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
              Plantillas de Código
            </h1>
            <p className="text-gray-400">Plantillas listas para usar en tus proyectos</p>
          </motion.div>

          {/* Templates Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="p-6 bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center">
                          <Code className="w-4 h-4 mr-1" />
                          {template.language}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {template.rating}
                        </span>
                        <span className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {template.downloads}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                      {template.complexity}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Características:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.features.map(feature => (
                        <span key={feature} className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="primary" 
                      className="flex-1 flex items-center justify-center"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Código
                    </Button>
                    <Button variant="secondary" className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Code Modal */}
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-800 rounded-lg w-full max-w-[95vw] xs:max-w-[90vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] xs:max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                  <h3 className="text-xl font-semibold text-white">{selectedTemplate.name}</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      onClick={handleExplainTemplate}
                      className="flex items-center"
                      disabled={isExplaining}
                    >
                      {isExplaining ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Explicando...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Explicar con IA
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={copyCode}
                      className="flex items-center"
                    >
                      {copiedCode ? (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedTemplate(null);
                        setExplanation('');
                      }}
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
                <div className="p-3 xs:p-4 sm:p-5 md:p-6 overflow-auto max-h-[75vh] xs:max-h-[70vh] sm:max-h-[65vh] md:max-h-[60vh]">
                  {explanation ? (
                    <div className="space-y-4">
                      <div className="prose prose-invert max-w-none">
                        <div 
                          className="text-gray-300 whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: explanation
                              .replace(/```rust\n([\s\S]*?)\n```/g, '<pre class="bg-slate-900 p-4 rounded-lg overflow-x-auto"><code class="text-sm">$1</code></pre>')
                              .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 p-4 rounded-lg overflow-x-auto"><code class="text-sm">$1</code></pre>')
                              .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-white mt-6 mb-3">$1</h3>')
                              .replace(/## (.*)/g, '<h2 class="text-xl font-semibold text-white mt-8 mb-4">$1</h2>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em class="text-purple-300">$1</em>')
                              .replace(/`(.*?)`/g, '<code class="bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>')
                          }}
                        />
                      </div>
                      <div className="border-t border-slate-700 pt-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Código de la Plantilla</h4>
                        <pre className="text-sm text-gray-300 bg-slate-900 p-4 rounded-lg overflow-x-auto">
                          <code>{selectedTemplate.code}</code>
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <pre className="text-sm text-gray-300 bg-slate-900 p-4 rounded-lg overflow-x-auto">
                      <code>{selectedTemplate.code}</code>
                    </pre>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
